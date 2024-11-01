import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Alert,
    SafeAreaView,
    Text,
    TouchableOpacity,
} from 'react-native';
import TweetCard from '../../components/TweetCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements';

const serverUrl = config.SERVER_URL;

function Repostscreen() {
    const navigation = useNavigation();
    const [tweets, setTweets] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isFetched, setIsFetched] = useState(false);

    const fetchTweets = useCallback(async (pageNum) => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.post(`${serverUrl}/userdata`, { token });

            const { data } = response.data;
            const idUser = data._id;
            const profilePicture = data.profilePicture;
            const amIAdmin = data.isAdmin
            const isMuteds = data.mutedUsers
            const isBlockeds = data.blockedUsers

            const responseTweet = await axios.post(`${serverUrl}/reposts`, { token });
            const dataTweet = responseTweet.data.data;

            const formattedTweets = dataTweet
                .filter(post => post.user !== null) 
                .map(post => {
                    const totalComments = post.comments.length + post.comments.reduce((acc, comment) => acc + comment.replies.length, 0);
                    return {
                      id: post._id,
                      userAvatar: post.user.profilePicture,
                      userName: post.user.name,
                      userHandle: post.user.username,
                      postDate: post.created_at,
                      content: post.description,
                      media: Array.isArray(post.media)
                        ? post.media.map(mediaItem => ({
                          type: mediaItem.type,
                          uri: mediaItem.uri,
                        }))
                        : [],
                      likesCount: post.likes.length,
                      commentsCount: totalComments,
                      bookMarksCount: post.bookmarks.length,
                      repostsCount: post.reposts.length,
                      isLiked: post.likes.some(like => like._id === idUser),
                      isBookmarked: post.bookmarks.some(bookmark => bookmark.user === idUser),
                      isReposted: post.reposts.some(repost => repost.user === idUser),
                      isMuted: isMuteds.some(isMuted => isMuted === post.user._id),
                      isBlocked: isBlockeds.some(isBlocked => isBlocked === post.user._id),
                      userIdPost: post.user._id,
                      idUser: idUser,
                      profilePicture: profilePicture,
                      commentsEnabled: post.commentsEnabled,
                      isAdmin: post.user.isAdmin,
                      amIAdmin: amIAdmin
                    };
                  });

            return formattedTweets;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        } finally {
            setLoadingMore(false);
        }
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            if (!isFetched) {
                (async () => {
                    setLoading(true);
                    const newTweets = await fetchTweets(page);
                    setTweets(newTweets);
                    setIsFetched(true);
                    setLoading(false);
                })();
            }
        }, [fetchTweets, page, isFetched])
    );

    const handleLoadMore = async () => {
        if (!loadingMore) {
            setLoadingMore(true);
            const newPage = page + 1;
            setPage(newPage);
            const newTweets = await fetchTweets(newPage);
            setTweets(prevTweets => {
                const uniqueTweets = newTweets.filter(
                    newTweet => !prevTweets.some(tweet => tweet.id === newTweet.id)
                );
                return [...prevTweets, ...uniqueTweets];
            });
        }
    };

    const renderSkeleton = () => (
        <>
            {[...Array(5)].map((_, index) => (
                <View key={index} style={styles.skeletonContainer}>
                    <View style={styles.skeletonHeader}>
                        <Skeleton animation="pulse" circle height={40} width={40} style={styles.skeletonAvatar} />
                        <View style={styles.skeletonTextContainer}>
                            <Skeleton animation="pulse" height={20} width={100} style={styles.skeleton} />
                            <Skeleton animation="pulse" height={14} width={60} style={styles.skeleton} />
                        </View>
                    </View>
                    <Skeleton animation="pulse" height={20} width={200} style={styles.skeleton} />
                    <Skeleton animation="pulse" height={150} width={'100%'} style={styles.skeleton} />
                </View>
            ))}
        </>
    );

    const handleProfilePress = (tweet) => {
        navigation.navigate('ViewPost', { tweet });
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                renderSkeleton()
            ) : (
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    onScroll={({ nativeEvent }) => {
                        const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                        const contentHeight = contentSize.height;
                        const viewportHeight = layoutMeasurement.height;
                        const scrollPosition = contentOffset.y + viewportHeight;

                        if (scrollPosition >= contentHeight - 100) {
                            handleLoadMore();
                        }
                    }}>
                    {Array.isArray(tweets) && tweets.length > 0 ? (
                        tweets.map((tweet, index) => (
                            <View key={index} style={styles.tweetContainer}>
                                <TouchableOpacity onPress={() => handleProfilePress(tweet)}>
                                    <TweetCard tweet={tweet} />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noTweetsText}>No Reposts</Text>
                    )}
                    {loadingMore && renderSkeleton()}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

export default Repostscreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 10,
    },
    tweetContainer: {
        width: '100%',
    },
    noTweetsText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
    loadingMore: {
        marginVertical: 20,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skeletonContainer: {
        padding: 20,
    },
    skeletonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    skeletonAvatar: {
        marginRight: 10,
    },
    skeletonTextContainer: {
        flex: 1,
    },
    skeleton: {
        marginBottom: 10,
    },
});