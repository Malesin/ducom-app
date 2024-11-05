import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';
import { useNavigation } from '@react-navigation/native';

const serverUrl = config.SERVER_URL;

const FollowCard = ({ followText, followingText, removeButtonText, message, data, myId }) => {
    const navigation = useNavigation();

    const [isFollowing, setIsFollowing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const isMyId = myId === data._id

  useEffect(() => {
    const isFollow = data.followers.some(follow => follow === myId);
    setIsFollowing(isFollow);
  }, []);

  const handleFollowToggle = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const follow = isFollowing ? 'unfollowUserId' : 'followUserId'
      const dataSent = {
        token: token,
        [follow]: data?._id
      }
      setIsFollowing(!isFollowing);
      
      await axios
        .post(`${serverUrl}/${isFollowing ? 'unfollow' : 'follow'}`, dataSent
        )
        .then(res => {
          console.log(res.data);
        });

    } catch (error) {
      setIsFollowing(isFollowing);
      console.error(error);
      ToastAndroid.show('Something Error, Try Again Later', ToastAndroid.SHORT); // Menambahkan toast error
    }
  };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleNavigateToUserProfile = () => {
        navigation.navigate('Userprofile', { userIdPost: data._id, idUser: myId });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateToUserProfile}>
                <Image  
                    source={
                        data?.profilePicture
                            ? { uri: data?.profilePicture }
                            : require('../assets/profilepic.png')}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
            <Text style={styles.username} onPress={handleNavigateToUserProfile}>
                {data?.username}
            </Text>
            <TouchableOpacity
                style={[styles.messageButton, isFollowing && styles.followingButton]}
                onPress={handleFollowToggle}
            >
                <Text style={[styles.messageButtonText, isFollowing && styles.followingButtonText]}>
                    {isFollowing ? followingText : followText}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleMorePress}>
                <MaterialIcons name="more-horiz" size={20} color="#000" />
            </TouchableOpacity>
            <FollowSheet
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onRemove={() => {
                    handleCloseModal();
                }}
                username={data?.username}
                removeButtonText={removeButtonText}
                message={message}
            />
        </View>
    );
};

export default FollowCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  username: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#000',
  },
  messageButton: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#001374',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 35,
    marginRight: 10,
  },
  messageButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  followingButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
  },
  followingButtonText: {
    color: '#000',
  },
});
