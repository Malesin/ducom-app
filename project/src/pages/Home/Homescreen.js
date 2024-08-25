import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Text,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TweetCard from '../../components/TweetCard'; // Import TweetCard
import Animated, {
  withDelay,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const HomeScreen = ({ navigation }) => {
  const [tweets, setTweets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const isExpanded = useSharedValue(false);

  const fetchTweets = async pageNum => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(`${serverUrl}/userdata`, { token });
      const { data, status } = response.data;
      if (status === 'error') {
        Alert.alert('Error', 'Anda Telah Keluar dari Akun', [
          { text: 'OK', onPress: () => navigation.navigate('Auths') },
        ]);
        return;
      }

      const idUserLike = data._id; // Extract user ID

      const responseTweet = await axios.post(`${serverUrl}/posts`, {
        page: pageNum,
      });
      const dataTweet = responseTweet.data;

      const formattedTweets = dataTweet.data.map(post => ({
        id: post._id,
        userAvatar: post.user.profilePicture,
        userName: post.user.name,
        userHandle: post.user.username,
        postDate: post.created_at,
        content: post.description,
        media: Array.isArray(post.media)
          ? post.media.map(mediaItem => ({
            type: mediaItem.type,
            uri: mediaItem.uri,
          }))
          : [],
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
        bookMarksCount: post.bookmarks.length,
        isLiked: post.likes.includes(idUserLike),
      }));

      setTweets(prevTweets => {
        // Filter to avoid duplicate tweets
        const newTweets = formattedTweets.filter(
          newTweet => !prevTweets.some(tweet => tweet.id === newTweet.id),
        );

        return pageNum === 1 ? newTweets : [...prevTweets, ...newTweets];
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingMore(false);
    }
  };


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await fetchTweets(1);
    setRefreshing(false);
  }, []);

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure want to exit', [
      {
        text: 'cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      isExpanded.value = false; // Reset FAB state when screen comes into focus
    }, []),
  );

  useEffect(() => {
    fetchTweets(page);
  }, [page]);

  const handleOpenCamera = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo');
        isExpanded.value = false;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        console.log('Captured image URI:', uri);
        // Navigate to CreatePost and pass the image URI
        navigation.navigate('CreatePost', { mediaUri: uri, mediaType: 'photo' });
      }
    });
  };

  const FloatingActionButton = ({ isExpanded, index, iconName, onPress }) => {
    const animatedStyles = useAnimatedStyle(() => {
      const moveValue = isExpanded.value ? OFFSET * index : 0;
      const translateValue = withSpring(-moveValue, SPRING_CONFIG);
      const delay = index * 100;
      const scaleValue = isExpanded.value ? 1 : 0;

      return {
        transform: [
          { translateY: translateValue },
          { scale: withDelay(delay, withTiming(scaleValue)) },
        ],
        backgroundColor: isExpanded.value ? '#F3F3F3' : '#F3F3F3',
      };
    });

    const iconStyle = useAnimatedStyle(() => {
      return {
        color: isExpanded.value ? '#000' : '#000',
      };
    });

    return (
      <AnimatedPressable
        style={[animatedStyles, styles.shadow, styles.button]}
        onPress={onPress}>
        <Icon name={iconName} size={20} style={[styles.icon, iconStyle]} />
      </AnimatedPressable>
    );
  };

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? '45deg' : '0deg';

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });

  const handleLoadMore = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
          const contentHeight = contentSize.height;
          const viewportHeight = layoutMeasurement.height;
          const scrollPosition = contentOffset.y + viewportHeight;

          if (scrollPosition >= contentHeight - 100) {
            handleLoadMore();
          }
        }}>
        {Array.isArray(tweets) && tweets.length > 0 ? (
          tweets.map((tweet, index) => (
            <View key={index} style={styles.tweetContainer}>
              <TweetCard tweet={tweet} />
            </View>
          ))
        ) : (
          <Text style={styles.noTweetsText}>No tweets available</Text>
        )}
        {loadingMore && (
          <ActivityIndicator
            size="large"
            color="#001374"
            style={styles.loadingMore}
          />
        )}
      </ScrollView>

      <View style={styles.fabContainer}>
        <AnimatedPressable
          onPress={handlePress}
          style={[styles.shadow, mainButtonStyles.button]}>
          <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
            +
          </Animated.Text>
        </AnimatedPressable>
        <FloatingActionButton
          isExpanded={isExpanded}
          index={1}
          iconName={'camera-outline'}
          onPress={handleOpenCamera} // Added onPress handler to open camera
        />
        <FloatingActionButton
          isExpanded={isExpanded}
          index={2}
          iconName={'feather'}
          onPress={() => navigation.navigate('CreatePost')} // Navigate to CreatePost screen
        />
      </View>
    </SafeAreaView>
  );
};

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 66,
    width: 66,
    borderRadius: 100,
    backgroundColor: '#001374',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 48,
    color: 'white',
    lineHeight: 55,
    marginBottom: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  tweetContainer: {
    width: '100%',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 2,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    flexDirection: 'row',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    color: '#000',
  },
  noTweetsText: {
    textAlign: 'left',
    color: '#888',
    marginTop: 20,
  },
  loadingMore: {
    marginVertical: 20,
  },
});

export default HomeScreen;