import { StyleSheet, SafeAreaView, ScrollView, View, Image, Text, TouchableOpacity, Alert, ToastAndroid, Share, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import Video from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';

const serverUrl = config.SERVER_URL;

const ViewPost = ({ route }) => {
    const { tweet } = route.params;
    const [liked, setLiked] = useState(tweet.isLiked);
    const [likesCount, setLikesCount] = useState(tweet.likesCount);
    const [bookmarked, setBookmarked] = useState(tweet.isBookmarked);
    const [bookmarksCount, setBookmarksCount] = useState(tweet.bookMarksCount);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [thumbnails, setThumbnails] = useState({});

    useEffect(() => {
        const generateThumbnails = async () => {
            const newThumbnails = {};
            for (const media of tweet.media || []) {
                if (media.type === 'video' && media.uri) {
                    try {
                        const { path } = await createThumbnail({ url: media.uri });
                        newThumbnails[media.uri] = path;
                    } catch (error) {
                        console.log('Error generating thumbnail:', error);
                    }
                }
            }
            setThumbnails(newThumbnails);
        };

        generateThumbnails();
    }, [tweet.media]);

    const handleLike = async () => {
        const token = await AsyncStorage.getItem('token');

        if (liked) {
            await handleUnlike();
        } else {
            try {
                const response = await axios.post(`${serverUrl}/like-post`, {
                    token: token,
                    postId: tweet.id,
                });

                if (response.data.status === 'ok') {
                    setLiked(true);
                    setLikesCount(prevLikesCount => prevLikesCount + 1);
                } else {
                    console.log('Error in like response data:', response.data.data);
                    Alert.alert('Error', 'Failed to like post. Please try again.');
                }
            } catch (error) {
                console.error('Error liking post:', error.message);
                Alert.alert('Error', 'Failed to like post. Please try again.');
            }
        }
    };

    const handleUnlike = async () => {
        const token = await AsyncStorage.getItem('token');

        try {
            const response = await axios.post(`${serverUrl}/unlike-post`, {
                token: token,
                postId: tweet.id,
            });

            if (response.data.status === 'ok') {
                setLiked(false);
                setLikesCount(prevLikesCount => prevLikesCount - 1);
            } else {
                console.log('Error in unlike response data:', response.data.data);
                Alert.alert('Error', 'Failed to unlike post. Please try again.');
            }
        } catch (error) {
            console.error('Error unliking post:', error.message);
            Alert.alert('Error', 'Failed to unlike post. Please try again.');
        }
    };

    const handleBookmark = async () => {
        const token = await AsyncStorage.getItem('token');

        if (bookmarked) {
            await handleUnbookmark();
        } else {
            try {
                const response = await axios.post(`${serverUrl}/bookmark-post`, {
                    token: token,
                    postId: tweet.id,
                });

                if (response.data.status === 'ok') {
                    setBookmarked(true);
                    setBookmarksCount(prevBookmarksCount => prevBookmarksCount + 1);
                    ToastAndroid.show('Post added to bookmarks!', ToastAndroid.SHORT);
                } else {
                    console.log('Error in bookmark response data:', response.data.data);
                }
            } catch (error) {
                console.error('Error bookmarking post:', error.message);
            }
        }
    };

    const handleUnbookmark = async () => {
        const token = await AsyncStorage.getItem('token');

        try {
            const response = await axios.post(`${serverUrl}/unbookmark-post`, {
                token: token,
                postId: tweet.id,
            });

            if (response.data.status === 'ok') {
                setBookmarked(false);
                setBookmarksCount(prevBookmarksCount => prevBookmarksCount - 1);
                ToastAndroid.show('Post removed from bookmarks!', ToastAndroid.SHORT);
            } else {
                console.log('Error in unbookmark response data:', response.data.data);
            }
        } catch (error) {
            console.error('Error unbookmarking post:', error.message);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: tweet.content,
                url: tweet.media && tweet.media.length > 0 ? tweet.media[0].uri : '',
                title: tweet.userName,
            });
        } catch (error) {
            console.error('Error sharing:', error.message);
            Alert.alert('Error', 'Failed to share post. Please try again.');
        }
    };

    const formatDate = dateString => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day} ${month} ${year}`;
    };

    const InteractionButton = ({ icon, color, onPress }) => (
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <MaterialCommunityIcons name={icon} size={20} color={color} />
        </TouchableOpacity>
    );

    const handleMediaPress = (mediaItem) => {
        setSelectedMedia(mediaItem);
        setModalVisible(true);
    };

    const closeMediaPreview = () => {
        setModalVisible(false);
        setSelectedMedia(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.postContainer}>
                    <View style={styles.headerContainer}>
                        <Image
                            source={tweet.userAvatar ? { uri: tweet.userAvatar } : require('../../assets/profilepic.png')}
                            style={styles.avatar}
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{tweet.userName}</Text>
                            <Text style={styles.userHandle}>@{tweet.userHandle}</Text>
                        </View>
                        <TouchableOpacity style={styles.optionsButton}>
                            <MaterialCommunityIcons
                                name="dots-vertical"
                                size={24}
                                color="#657786"
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.postContent}>{tweet.content}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {tweet.media.map((mediaItem, index) => (
                                <TouchableOpacity key={index} onPress={() => handleMediaPress(mediaItem.uri)}>
                                    {mediaItem.type === 'image' ? (
                                        <Image
                                            source={{ uri: mediaItem.uri }}
                                            style={tweet.media.length === 1 ? styles.singleMediaImage : styles.tweetImage}
                                            onError={() => console.log('Failed to load image')}
                                        />
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => handleMediaPress(mediaItem.uri)}
                                            style={styles.videoContainer}>
                                            <Image source={{ uri: thumbnails[mediaItem.uri] }} style={tweet.media.length === 1 ? styles.singleMediaVideo : styles.tweetVideo} />
                                            <MaterialCommunityIcons
                                                name="play-circle-outline"
                                                size={40}
                                                color="#fff"
                                                style={styles.playIcon}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Text style={styles.postDate}>{formatDate(tweet.postDate)}</Text>
                    </View>
                    <View style={styles.interactionsContainer}>
                        <Text style={styles.interactionText}><Text style={styles.interactionNumber}>{tweet.commentsCount}</Text> Comments </Text>
                        <Text style={styles.interactionText}><Text style={styles.interactionNumber}>{bookmarksCount}</Text> Bookmarks </Text>
                        <Text style={styles.interactionText}><Text style={styles.interactionNumber}>{likesCount}</Text> Likes </Text>
                    </View>
                    <View style={styles.actions}>
                        <InteractionButton
                            icon={liked ? 'heart' : 'heart-outline'}
                            color={liked ? '#E0245E' : '#040608'}
                            onPress={handleLike}
                        />
                        <InteractionButton
                            icon="message-reply-outline"
                            color="#040608"
                        />
                        <InteractionButton
                            icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
                            color={bookmarked ? '#00c5ff' : '#040608'}
                            onPress={handleBookmark}
                        />
                        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                            <MaterialCommunityIcons
                                name="export-variant"
                                size={20}
                                color="#657786"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.newContainer}>
                    {/* Konten baru di sini */}
                    <Text>Konten baru di bawah post</Text>
                </View>
            </ScrollView>
            {selectedMedia && (
                <Modal
                    visible={modalVisible}
                    transparent
                    onRequestClose={closeMediaPreview}
                    animationType="fade"
                >
                    <TouchableWithoutFeedback onPress={closeMediaPreview}>
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                {selectedMedia.endsWith('.jpg') || selectedMedia.endsWith('.png') ? (
                                    <Image
                                        source={{ uri: selectedMedia }}
                                        style={styles.modalImage}
                                        onError={() => console.log('Failed to load image')}
                                    />
                                ) : (
                                    <Video
                                        source={{ uri: selectedMedia }}
                                        style={styles.modalImage}
                                        controls
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </SafeAreaView>
    )
}

export default ViewPost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#fff'
    },
    scrollContainer: {
        flexGrow: 1,
    },
    postContainer: {
        marginBottom: 20, 
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userInfo: {
        flexDirection: 'column',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    userHandle: {
        color: 'gray',
        fontSize: 13,
    },
    optionsButton: {
        marginLeft: 'auto',
    },
    postContent: {
        fontSize: 18,
        marginVertical: 10,
        color: 'black',
    },
    media: {
        width: 300,
        height: 200,
        marginRight: 10,
    },
    postDate: {
        color: 'gray',
        fontSize: 14,
        marginTop: 10,
    },
    interactionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: 'black',
        borderBottomColor: 'black',
        width: '100%',
        padding: 5
    },
    interactionText: {
        color: 'gray',
    },
    interactionNumber: {
        color: 'black',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: '100%',
    },
    actionButton: {
        padding: 10,
    },
    modalContainer: {
        width: '90%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    fullScreenMedia: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    tweetImage: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginRight: 8,
    },
    singleMediaImage: {
        width: 390,
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    singleMediaVideo: {
        width: 390,
        height: 200,
        borderRadius: 8,
    },
    tweetVideo: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginRight: 8,
    },
    videoContainer: {
        width: 390,
        height: 200,
        borderRadius: 8,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    playIcon: {
        position: 'absolute',
    },
    newContainer: {
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
});