import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
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
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const HomeScreen = ({navigation}) => {
  const [tweets, setTweets] = useState([
    {
      id: '1',
      userAvatar:
        'https://i.pinimg.com/736x/75/5b/f4/755bf4ca4d44e85b43c7c569a8949cfb.jpg',
      userName: 'peduliamatgua',
      userHandle: 'frontendkedua',
      content: 'This is an example tweet. React Native is awesome!',
      likesCount: 15,
      commentsCount: 3,
      bookMarksCount: 5,
    },
    {
      id: '2',
      userAvatar:
        'https://i.pinimg.com/474x/21/dc/e9/21dce97c3191b81ed92b56a9492ceac7.jpg',
      userName: 'frontendgariskeras',
      userHandle: 'frontend',
      content: 'nyoride',
      image:
        'https://i.pinimg.com/474x/97/02/f6/9702f6e58679186bd95c4eb454899032.jpg', // Example image URL
      likesCount: 30,
      commentsCount: 10,
      bookMarksCount: 8,
    },
    {
      id: '3',
      userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      userName: 'Mike Johnson',
      userHandle: 'mikejohnson',
      content:
        'Check out my latest blog post on web development trends in 2024!',
      video:
        'file:///C:/Users/ACER/Videos/Ready%20Or%20Not/Ready%20Or%20Not%202024.07.05%20-%2019.29.21.01.mp4', // Example video URL
      likesCount: 50,
      commentsCount: 20,
      bookMarksCount: 10,
    },
  ]);

  const isExpanded = useSharedValue(false);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(`${serverUrl}/userdata`, {token});
      const {data, status} = response.data;
      console.log('Data received:', data); // Add this log to check the data
      if (status === 'error') {
        Alert.alert('Error', 'Anda Telah Keluar dari Akun', [
          {text: 'OK', onPress: () => navigation.navigate('Auths')},
        ]);
        return;
      }
      // Fetch Data Tweet
      setTweets([...data, ...tweets]); // Combine fetched tweets with example tweets
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

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
      getData();
    }, []),
  );

  const handleOpenCamera = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo');
        // Reset isExpanded value to ensure FAB does not disappear
        isExpanded.value = false;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        setCapturedImageUri(uri);
        console.log('Captured image URI:', uri);
        // Navigate to CreatePost and pass the image URI
        navigation.navigate('CreatePost', {imageUri: uri});
      }
    });
  };

  const FloatingActionButton = ({isExpanded, index, iconName, onPress}) => {
    const animatedStyles = useAnimatedStyle(() => {
      const moveValue = isExpanded.value ? OFFSET * index : 0;
      const translateValue = withSpring(-moveValue, SPRING_CONFIG);
      const delay = index * 100;
      const scaleValue = isExpanded.value ? 1 : 0;

      return {
        transform: [
          {translateY: translateValue},
          {scale: withDelay(delay, withTiming(scaleValue))},
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
        {translateX: translateValue},
        {rotate: withTiming(rotateValue)},
      ],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {Array.isArray(tweets) && tweets.length > 0 ? (
          tweets.map((tweet, index) => (
            <View key={index} style={styles.tweetContainer}>
              <TweetCard tweet={tweet} />
            </View>
          ))
        ) : (
          <Text style={styles.noTweetsText}>No tweets available</Text>
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
    color: '#f8f9ff',
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
    paddingBottom: 20,
  },
  tweetContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    shadowOffset: {width: -0.5, height: 3.5},
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
  capturedImage: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default HomeScreen;
