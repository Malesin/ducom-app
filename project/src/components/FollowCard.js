import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import ProfileImage from '../assets/iya.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FollowCard = ({ followText, followingText }) => {
    const [isFollowing, setIsFollowing] = useState(true);

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
    };

    return (
        <View style={styles.container}>
            <Image
                source={ProfileImage}
                style={styles.profileImage}
            />
            <Text style={styles.username}>mikadotjees</Text>
            <TouchableOpacity
                style={[styles.messageButton, isFollowing && styles.followingButton]}
                onPress={handleFollowToggle}
            >
                <Text style={[styles.messageButtonText, isFollowing && styles.followingButtonText]}>
                    {isFollowing ? followingText : followText}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="more-horiz" size={24} color="#000" />
            </TouchableOpacity>
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
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    username: {
        flex: 1,
        fontSize: 16,
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
        fontSize: 14,
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
