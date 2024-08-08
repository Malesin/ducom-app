import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Modal,
  TextInput,
  Text,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import config from '../../config';
import TweetCard from '../../components/TweetCard'; // Import TweetCard
import Animated, {
  withDelay,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons
import moment from 'moment';

const serverUrl = config.SERVER_URL;

const HomeScreen = ({navigation}) => {
  const [tweets, setTweets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [inputHeight, setInputHeight] = useState(40); // Initialize with default height
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
      setTweets(data); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure want to exit', [
      {
        text: 'Cancel',
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

  useEffect(() => {
    getData();
  }, []);

  const handleCreatePost = async () => {
    console.log('Creating post with content:', newPostContent); // Log the content of the post

    try {
      await axios.post(`${serverUrl}/createPost`, {content: newPostContent});
      setNewPostContent('');
      setModalVisible(false);
      getData(); // Refresh the tweet list after creating a new post
      console.log('Post created successfully'); // Log success
    } catch (error) {
      console.error('Error creating post:', error); // Log error
    }
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

  const joinDate = moment(userData.join_date).format("D MMMM YYYY");

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
        <Text style={styles.contentText}>Tanggal Join : {joinDate}</Text>
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
        />
        <FloatingActionButton
          isExpanded={isExpanded}
          index={2}
          iconName={'feather'}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Modal for creating a new post */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Image
                source={require('../../assets/avatar.jpg')}
                style={styles.profileImage}
              />
              <TextInput
                style={[styles.textInput, {height: inputHeight}]}
                placeholder="What's on your mind?"
                multiline
                numberOfLines={4}
                value={newPostContent}
                onChangeText={setNewPostContent}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  setInputHeight(contentHeight);
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.buttonPost}
              onPress={handleCreatePost}>
              <Text style={styles.buttonTextPost}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginTop: 25,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 16,
    padding: 10,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonCancel: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonPost: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#001374',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextCancel: {
    color: '#000',
  },
  buttonTextPost: {
    color: '#fff',
  },
  noTweetsText: {
    textAlign: 'left',
    color: '#888',
    marginTop: 20,
  },
});

export default HomeScreen;
