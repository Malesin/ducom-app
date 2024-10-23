import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import ProfileImage from '../assets/iya.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FollowSheet from './FollowSheet';

const FollowCard = ({ followText, followingText, removeButtonText, message, username }) => {
    const [isFollowing, setIsFollowing] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
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
            <TouchableOpacity style={styles.iconButton} onPress={handleMorePress}>
                <MaterialIcons name="more-horiz" size={20} color="#000" />
            </TouchableOpacity>
            <FollowSheet
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onRemove={() => {
                    handleCloseModal();
                }}
                username={username}
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
