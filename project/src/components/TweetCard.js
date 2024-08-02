import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import gambar default dari folder assets
import DefaultAvatar from '../assets/avatar.jpg'; // Ubah sesuai lokasi avatar Anda

const TweetCard = ({ tweet }) => {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState(tweet.likesCount);
    const [bookMarksCount, setBookMarksCount] = useState(tweet.bookMarksCount);
    const [commentsCount, setCommentsCount] = useState(tweet.commentsCount);

    const handleLike = () => {
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    };

    const handleBookmark = () => {
        setBookmarked(!bookmarked);
        setBookMarksCount(bookmarked ? bookMarksCount - 1 : bookMarksCount + 1);
    };

    const handleComment = () => {
        setCommentsCount(commentsCount + 1);
    };

    return (
        <View style={styles.card}>
            {/* User Info */}
            <View style={styles.userInfo}>
                <Image
                    source={tweet.userAvatar ? { uri: tweet.userAvatar } : DefaultAvatar}
                    style={styles.avatar}
                />
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>{tweet.userName}</Text>
                    <Text style={styles.userHandle}>@{tweet.userHandle}</Text>
                </View>
            </View>

            {/* Tweet Content */}
            <Text style={styles.tweetText}>{tweet.content}</Text>

            {/* Tweet Image */}
            {tweet.image ? (
                <Image source={{ uri: tweet.image }} style={styles.tweetImage} /> // Menampilkan gambar
            ) : null}

            {/* Interactions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <MaterialCommunityIcons
                        name={liked ? "heart" : "heart-outline"}
                        size={20}
                        color={liked ? "#E0245E" : "#040608"}
                    />
                    <Text style={styles.actionText}>{likesCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
                    <MaterialCommunityIcons
                        name={bookmarked ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={bookmarked ? "#00c5ff" : "#040608"}
                    />
                    <Text style={styles.actionText}>{bookMarksCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
                    <MaterialCommunityIcons
                        name="message-reply-outline"
                        size={20}
                        color="#040608"
                    />
                    <Text style={styles.actionText}>{commentsCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons
                        name="export-variant"
                        size={20}
                        color="#657786"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 7,
        marginVertical: 10, // Increased margin to make space between cards
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: '100%', // Ensure the card spans the full width of the screen
        borderColor: '#E1E8ED',
        borderWidth: 1,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
        color: '#040608'
    },
    userHandle: {
        color: '#00c5ff',
    },
    tweetText: {
        fontSize: 15,
        marginVertical: 8,
        color: '#040608'
    },
    tweetImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginVertical: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 4,
        color: '#040608'
    },
});

export default TweetCard;
