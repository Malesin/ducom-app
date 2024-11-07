import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const NewUserProfile = ({ route, navigation }) => {
  const { userIdPost } = route.params;
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(`${serverUrl}/findUserId/`, {
          token: token,
          userId: userIdPost,
        });
        const user = response.data.data;
        setUserData(user);
        setIsFollowing(user.followers.some(follow => follow._id === userIdPost));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userIdPost]);

  const handleFollowToggle = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const action = isFollowing ? 'unfollow' : 'follow';
      await axios.post(`${serverUrl}/${action}`, {
        token: token,
        [`${action}UserId`]: userIdPost,
      });
      setIsFollowing(!isFollowing);
      ToastAndroid.show(`User ${isFollowing ? 'unfollowed' : 'followed'} successfully`, ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error toggling follow status:', error);
      ToastAndroid.show('Something went wrong, please try again later', ToastAndroid.SHORT);
    }
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={userData.profilePicture ? { uri: userData.profilePicture } : require('../../assets/profilepic.png')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>@{userData.username}</Text>
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.bio}>{userData.bio || 'No bio available'}</Text>
        <TouchableOpacity style={styles.followButton} onPress={handleFollowToggle}>
          <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    color: '#666',
  },
  bio: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  followButton: {
    backgroundColor: '#001374',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NewUserProfile; 