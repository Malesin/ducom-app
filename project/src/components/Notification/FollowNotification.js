import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ProfilePicture from '../../assets/iya.png';

const FollowNotification = () => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowPress = () => {
        setIsFollowing(!isFollowing);  // Toggle the follow state
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={ProfilePicture} style={styles.profilePicture} />
            <View style={styles.textContainer}>
                <Text style={styles.username}>mikadotjees</Text>
                <Text style={styles.message}>started following you. <Text style={styles.time}>1d</Text></Text>
            </View>
            <TouchableOpacity
                style={[
                    styles.followButton,
                    isFollowing ? styles.followingButton : styles.followButtonUnpressed
                ]}
                onPress={handleFollowPress}
            >
                <Text
                    style={[
                        styles.followButtonText,
                        isFollowing ? styles.followingButtonText : styles.followButtonUnpressedText
                    ]}
                >
                    {isFollowing ? 'Following' : 'Follow Back'}
                </Text>
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
        padding: 10,
        backgroundColor: '#fff',
    },
    profilePicture: {
        width: 35,
        height: 35,
        borderRadius: 20,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    username: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#000',
    },
    message: {
        color: '#000',
        fontSize: 14,
    },
    time: {
        color: 'gray',
        fontSize: 12,
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
    },
});
