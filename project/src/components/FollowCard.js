import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FollowSheet from './FollowSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';
const serverUrl = config.SERVER_URL;

const FollowCard = ({ followText, followingText, removeButtonText, message, data, myId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    useEffect(() => {
        const isFollow = data.followers.some(follow => follow === myId)
        setIsFollowing(isFollow)
    }, [])

    const handleFollowToggle = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (isFollowing) {
                await axios
                    .post(`${serverUrl}/unfollow`, {
                        token: token,
                        unfollowUserId: data._id
                    })
                    .then(res => {
                        console.log(res.data);
                    })
            } else {
                await axios.post(`${serverUrl}/follow`, {
                    token: token,
                    followUserId: data._id
                })
                    .then(res => {
                        console.log(res.data);
                    })
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            setIsFollowing(isFollowing);
            console.error(error);
            ToastAndroid.show("Something Error, Try Again Later", ToastAndroid.SHORT); // Menambahkan toast error
        }
    };

    const handleMorePress = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Image
                source={
                    data?.profilePicture
                        ? { uri: data?.profilePicture }
                        : require('../assets/profilepic.png')}
                style={styles.profileImage}
            />
            <Text style={styles.username}>{data?.username}</Text>
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
    iconButton: {
        padding: 5,
    },
});
