import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import {useNavigation} from '@react-navigation/native';
const serverUrl = config.SERVER_URL;

const FollowNotification = ({followNotif}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigation = useNavigation();
  console.log();
  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 1) {
      return 'now';
    }

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w ago`;
    }

    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleFollowPress = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (isFollowing) {
        await axios
          .post(`${serverUrl}/unfollow`, {
            token: token,
            unfollowUserId: followNotif?.fromUser._id,
          })
          .then(res => {
            console.log(res.data);
          });
      } else {
        await axios
          .post(`${serverUrl}/follow`, {
            token: token,
            followUserId: followNotif?.fromUser._id,
          })
          .then(res => {
            console.log(res.data);
          });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      setIsFollowing(isFollowing);
      console.error(error);
      ToastAndroid.show('Something Error, Try Again Later', ToastAndroid.SHORT);
    }
  };

  const handleProfilePress = () => {
    navigation.navigate('Userprofile', {
      userIdPost: followNotif?.fromUser._id,
      idUser: followNotif?.user,
    });
  };

  useEffect(() => {
    const follow = followNotif?.fromUser.followers.some(
      follow => follow === followNotif?.user,
    );
    setIsFollowing(follow);
    console.log('followNotif:', followNotif);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={handleProfilePress}>
        <MaterialCommunityIcons name="account-plus" size={15} color={'#000'} />
        <Image
          source={
            followNotif?.fromUser.profilePicture
              ? {uri: followNotif?.fromUser.profilePicture}
              : require('../../assets/profilepic.png')
          }
          style={styles.profilePicture}
        />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{followNotif?.fromUser.username}</Text>
          <Text style={styles.message}>
            started following you.{' '}
            <Text style={styles.time}>
              {formatDate(followNotif?.created_at)}
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.followButton,
            isFollowing ? styles.followingButton : styles.followButtonUnpressed,
          ]}
          onPress={handleFollowPress}>
          <Text
            style={[
              styles.followButtonText,
              isFollowing
                ? styles.followingButtonText
                : styles.followButtonUnpressedText,
            ]}>
            {isFollowing ? 'Following' : 'Follow Back'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FollowNotification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  profilePicture: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
  },
  message: {
    color: '#000',
    fontSize: 12,
  },
  time: {
    color: 'gray',
    fontSize: 10,
  },
  followButton: {
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  followButtonUnpressed: {
    backgroundColor: '#001374',
    borderColor: '#001374',
    borderWidth: 1,
  },
  followButtonUnpressedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  followingButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
  },
  followingButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 11,
  },
  followButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 11,
  },
});
