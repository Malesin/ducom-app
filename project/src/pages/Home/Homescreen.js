import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
  Text,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo'; // Tambahkan import NetInfo
import { useFocusEffect } from '@react-navigation/native';
import TweetCard from '../../components/TweetCard';
import PinTweetCard from '../../components/PinTweetCard';
import Animated, {
  withDelay,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements';

const serverUrl = config.SERVER_URL;

const HomeScreen = ({ navigation, tweet }) => {
  const [tweets, setTweets] = useState([]);
  const [pintweets, setPinTweets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isConnected, setIsConnected] = useState(true); // Tambahkan state untuk koneksi
  const [pinnedTweetId, setPinnedTweetId] = useState(null); // Tambahkan state untuk ID tweet yang dipin
  const isExpanded = useSharedValue(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  const fetchTweets = async pageNum => {
    if (!isConnected) {
      setLoading(false);
      return [];
    }
  
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${serverUrl}/userdata`, { token: token });
      const { data, status } = response.data;
      if (status === 'error') {
        Alert.alert('Error', 'Anda Telah Keluar dari Akun', [
          { text: 'OK', onPress: () => navigation.navigate('Auths') },
        ]);
        return;
      }
      emailUser = data.email;
      idUser = data._id;
      profilePicture = data.profilePicture;
  
      const responseTweet = await axios.post(`${serverUrl}/posts`, {
        // token:token,
        page: pageNum,
      });
      const dataTweet = responseTweet.data.data;
  
      const formattedTweets = dataTweet.map(post => {
        const totalComments = post.comments.length + post.comments.reduce((acc, comment) => acc + comment.replies.length, 0);
        return {
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
          commentsCount: totalComments, 
          bookMarksCount: post.bookmarks.length,
          isLiked: post.likes.some(like => like._id === idUser),
          isBookmarked: post.bookmarks.some(bookmark => bookmark.user === idUser),
          userIdPost: post.user._id,
          idUser: idUser,
          allowedEmail: post.allowedEmail,
          userEmailPost: post.user.email,
          emailUser: emailUser,
          profilePicture: profilePicture
        };
      });
      return formattedTweets;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Tweet Pinned
  const fetchPinTweet = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${serverUrl}/userdata`, { token: token });
      const { data, status } = response.data;
      if (status === 'error') {
        Alert.alert('Error', 'Anda Telah Keluar dari Akun', [
          { text: 'OK', onPress: () => navigation.navigate('Auths') },
        ]);
        return;
      }
      const emailUser = data.email;
      const idUser = data._id;
      const profilePicture = data.profilePicture;
      
      const pinPost = await axios.post(`${serverUrl}/posts/pinned`, {
        token: token
      });

      const pinnedBy = pinPost.data.data.pinnedBy
      const postPin = pinPost.data.data.post;

      if (!postPin) {
        return null; // Kembalikan null jika pinPost tidak ada
      }
      const totalComments = postPin.comments.length + postPin.comments.reduce((acc, comment) => acc + comment.replies.length, 0);

      const pinTweet = {
        id: postPin._id,
        userAvatar: postPin.user.profilePicture,
        userName: postPin.user.name,
        userHandle: postPin.user.username,
        postDate: postPin.created_at,
        content: postPin.description,
        media: Array.isArray(postPin.media)
          ? postPin.media.map(mediaItem => ({
            type: mediaItem.type,
            uri: mediaItem.uri,
          }))
          : [],
        likesCount: postPin.likes.length,
        commentsCount: totalComments,
        bookMarksCount: postPin.bookmarks.length,
        isLiked: postPin.likes.some(like => like._id === idUser),
        isBookmarked: postPin.bookmarks.some(bookmark => bookmark.user === idUser),
        userIdPost: postPin.user._id,
        idUser: idUser,
        allowedEmail: postPin.allowedEmail,
        userEmailPost: postPin.user.email,
        emailUser: emailUser,
        profilePicture: profilePicture,
        pinnedBy:pinnedBy
      };

      return pinTweet;
    } catch (error) {
      console.error('Error fetching pinned tweets:', error); // Perbaiki pesan error
      return null; // Kembalikan null jika terjadi error
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`${serverUrl}/comments`, {
        params: { postId },
      });
      if (response.data.status === 'ok') {
        return response.data.comments;
      } else {
        console.log('Error fetching comments:', response.data.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      return [];
    }
  };

  const handlePostPress = async (tweet) => {
    if (!tweet || !tweet.id) {
      console.error('Tweet data is incomplete:', tweet);
      return;
    }
    const comments = await fetchComments(tweet.id);
    const postId = tweet.id;
    navigation.navigate('ViewPost', { tweet, comments, postId });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setShowSkeleton(true); // Tampilkan.
    setHasMore(true); // Reset hasMore to true
    const newTweets = await fetchTweets(1);
    const newPinTweet = await fetchPinTweet();
    if (newPinTweet) {
      setPinTweets([newPinTweet]); // Set pintweets sebagai array dengan satu elemen
      setPinnedTweetId(newPinTweet.id); // Simpan ID tweet yang dipin
    } else {
      setPinTweets([]); // Kosongkan pintweets jika tidak ada pin tweet
      setPinnedTweetId(null); // Reset ID tweet yang dipin
    }
    const filteredTweets = newTweets.filter(tweet => tweet.id !== newPinTweet?.id); // Filter tweet yang dipin
    setTweets(filteredTweets.slice(0, 4)); // Only display 4 tweets
    setRefreshing(false);
    setShowSkeleton(false); // Sembunyikan skeleton setelah refresh selesai
  }, [isConnected]);

  const LoadingIndicator = () => {
    return (
      <View style={styles.loadingIndicator}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  };

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
      isExpanded.value = false;
    }, []),
  );

  useEffect(() => {
    const loadInitialTweets = async () => {
      const initialTweets = await fetchTweets(1);
      const initialPinTweets = await fetchPinTweet(); // Panggil fetchPinTweet saat inisialisasi
      if (initialPinTweets) {
        setPinTweets([initialPinTweets]); // Set pintweets sebagai array dengan satu elemen
        setPinnedTweetId(initialPinTweets.id); // Simpan ID tweet yang dipin
      } else {
        setPinTweets([]); // Kosongkan pintweets jika tidak ada pin tweet
        setPinnedTweetId(null); // Reset ID tweet yang dipin
      }
      const filteredTweets = initialTweets.filter(tweet => tweet.id !== initialPinTweets?.id); // Filter tweet yang dipin
      setTweets(filteredTweets.slice(0, 5)); // Load only 4 tweets initially
      setLoading(false);
      setShowSkeleton(false); // Sembunyikan skeleton setelah data awal di-load
    };
    loadInitialTweets();
  }, [isConnected]);

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Auths'); // Redirect to Auths if not logged in
        }
      };
      checkLoginStatus();
    }, [])
  );

  const onPostSuccess = () => {
    console.log('Post created successfully, refreshing HomeScreen...');
    setRefreshing(true);
    onRefresh();
  };

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

    useEffect(() => {
      return () => {
        cancelAnimation(animatedStyles);
        cancelAnimation(iconStyle);
      };
    }, [animatedStyles, iconStyle]);

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

  const handleLoadMore = async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const moreTweets = await fetchTweets(page + 1); // Load next page of tweets
      const newTweets = moreTweets.filter(
        tweet => !tweets.some(existingTweet => existingTweet.id === tweet.id) && tweet.id !== pinnedTweetId, // Filter tweet yang dipin
      );
      if (newTweets.length > 0) {
        setTweets(prevTweets => [...prevTweets, ...newTweets.slice(0, 5)]); // Add only 4 new tweets
        setPage(prevPage => prevPage + 1); // Increment page number
      }
      setLoadingMore(false);
      if (newTweets.length < 4) { // Check if less than 4 tweets are returned
        setHasMore(false);
      }
    }
  };

  const renderSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.skeletonContainer}>
          <View style={styles.skeletonHeader}>
            <Skeleton
              animation="pulse"
              circle
              height={40}
              width={40}
              style={styles.skeletonAvatar}
            />
            <View style={styles.skeletonTextContainer}>
              <Skeleton
                animation="pulse"
                height={20}
                width="25%" // 25% of the screen width
                style={styles.skeleton}
              />
              <Skeleton
                animation="pulse"
                height={14}
                width="15%" // 15% of the screen width
                style={styles.skeleton}
              />
            </View>
          </View>
          <Skeleton
            animation="pulse"
            height={20}
            width="75%" // 75% of the screen width
            style={[styles.skeleton, { borderRadius: 3 }]}
          />
          <Skeleton
            animation="pulse"
            height={200}
            width="100%" // 100% of the screen width
            style={[styles.skeleton, { borderRadius: 7 }]}
          />
        </View>
      ))}
    </>
  );

  const onRefreshPage = () => {
    setRefreshing(true);
    onRefresh();
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && (
        <View style={styles.noConnectionContainer}>
          <Text style={styles.noConnectionText}>No Internet Connection.</Text>
        </View>
      )}
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
        {showSkeleton ? (
          renderSkeleton()
        ) : (
          <>

            {pintweets.map((tweet, index) => (
              <View key={index} style={styles.tweetContainer}>
                <TouchableOpacity onPress={() => handlePostPress(tweet)}>
                <PinTweetCard tweet={tweet} onRefreshPage={onRefreshPage} />
                </TouchableOpacity>
              </View>
            ))}
            {tweets.map((tweet, index) => (
              <View key={index} style={styles.tweetContainer}>
                <TouchableOpacity onPress={() => handlePostPress(tweet)}>
                <TweetCard tweet={tweet} onRefreshPage={onRefreshPage} />
              </TouchableOpacity>
              </View>
            ))}
          </>
        )}
        {loadingMore && <LoadingIndicator />}
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
          onPress={handleOpenCamera}
        />
        <FloatingActionButton
          isExpanded={isExpanded}
          index={2}
          iconName={'feather'}
          onPress={() => navigation.navigate('CreatePost', { onPostSuccess })}
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
    fontSize: 45,
    color: 'white',
    lineHeight: 60,
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
  skeletonScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonContainer: {
    padding: 20,
    alignItems: 'flex-start', // Align items to the left
    width: '100%', // Ensure the container takes full width
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%', // Ensure the header takes full width
  },
  skeletonAvatar: {
    marginRight: 10,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeleton: {
    marginBottom: 10,
  },
  loadingIndicator: {
    alignItems: 'center',
    marginVertical: 20,
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
  noConnectionContainer: {
    padding: 10,
    backgroundColor: '#d3d3d3',
    alignItems: 'center',
  },
  noConnectionText: {
    color: '#000000',
    fontSize: 16,
  },
});


export default HomeScreen;