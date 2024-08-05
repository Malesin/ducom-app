import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import DefaultAvatar from '../assets/avatar.jpg'; // Update path if needed

const TweetCard = ({ tweet }) => {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState(tweet.likesCount);
    const [bookMarksCount, setBookMarksCount] = useState(tweet.bookMarksCount);
    const [commentsCount, setCommentsCount] = useState(tweet.commentsCount);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMediaUri, setModalMediaUri] = useState('');

    const handleLike = () => {
        setLiked(prev => !prev);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);
    };

    const handleBookmark = () => {
        setBookmarked(prev => !prev);
        setBookMarksCount(prev => bookmarked ? prev - 1 : prev + 1);
    };

    const handleComment = () => setCommentsCount(prev => prev + 1);

    const openMediaPreview = uri => {
        setModalMediaUri(uri);
        setIsModalVisible(true);
    };

    const closeMediaPreview = () => {
        setIsModalVisible(false);
        setModalMediaUri('');
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

            {/* Tweet Media */}
            {tweet.image || tweet.video ? (
                <TouchableOpacity onPress={() => openMediaPreview(tweet.image || tweet.video)}>
                    {tweet.image ? (
                        <Image source={{ uri: tweet.image }} style={styles.tweetImage} />
                    ) : (
                        <Video source={{ uri: tweet.video }} style={styles.tweetImage} controls resizeMode="contain" />
                    )}
                </TouchableOpacity>
            ) : null}

            {/* Interactions */}
            <View style={styles.actions}>
                <InteractionButton
                    icon={liked ? "heart" : "heart-outline"}
                    color={liked ? "#E0245E" : "#040608"}
                    count={likesCount}
                    onPress={handleLike}
                />
                <InteractionButton
                    icon={bookmarked ? "bookmark" : "bookmark-outline"}
                    color={bookmarked ? "#00c5ff" : "#040608"}
                    count={bookMarksCount}
                    onPress={handleBookmark}
                />
                <InteractionButton
                    icon="message-reply-outline"
                    color="#040608"
                    count={commentsCount}
                    onPress={handleComment}
                />
                <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons name="export-variant" size={20} color="#657786" />
                </TouchableOpacity>
            </View>

            {/* Modal for Media Preview */}
            <Modal
                visible={isModalVisible}
                transparent
                onRequestClose={closeMediaPreview}
                animationType="fade"
            >
                <TouchableWithoutFeedback onPress={closeMediaPreview}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            {modalMediaUri.endsWith('.mp4') ? (
                                <Video source={{ uri: modalMediaUri }} style={styles.modalImage} controls resizeMode="contain" />
                            ) : (
                                <Image source={{ uri: modalMediaUri }} style={styles.modalImage} />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const InteractionButton = ({ icon, color, count, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
        <Text style={styles.actionText}>{count}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 7,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
        width: '100%',
        maxWidth: 800,
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        width: '90%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default TweetCard;