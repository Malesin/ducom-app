import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';
const serverUrl = config.SERVER_URL;

const SearchedCard = ({ search, myData, onClose }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowPress = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (isFollowing) {
                await axios
                    .post(`${serverUrl}/unfollow`, {
                        token: token,
                        unfollowUserId: search._id
                    })
                    .then(res => {
                        console.log(res.data);
                    })
            } else {
                await axios
                    .post(`${serverUrl}/follow`, {
                        token: token,
                        followUserId: search._id
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

    useEffect(() => {
        const follow = search.followers.some(follow => follow === myData._id)
        setIsFollowing(follow)
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.overlay} />
            <View style={styles.card}>
                <Image
                    source={
                        search?.profilePicture
                            ? { uri: search?.profilePicture }
                            : require('../assets/profilepic.png')}
                    style={styles.profilePicture} />
                <View style={styles.textContainer}>
                    <Text style={styles.username}>{search?.name}</Text>
                    <Text style={styles.handle}>@{search?.username}</Text>
                    <Text style={styles.description}>
                        {search?.bio}
                    </Text>
                    {!(search._id === myData._id) &&
                        <TouchableOpacity
                            style={[styles.followButton, isFollowing && styles.followingButton]}
                            onPress={handleFollowPress}
                        >
                            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SearchedCard;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#D3D3D3',
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#000',
        zIndex: -1,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    handle: {
        fontSize: 14,
        color: '#000',
    },
    description: {
        fontSize: 14,
        color: '#333',
        marginTop: 2,
        marginBottom: 10,
    },
    followButton: {
        backgroundColor: '#002366',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 25,
        paddingVertical: 10,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    followButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    followingButton: {
        backgroundColor: '#E1E8ED',
    },
    followingButtonText: {
        color: '#000',
    },
});
