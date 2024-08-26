import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Alert,
    SafeAreaView,
    Text,
    ActivityIndicator,
} from 'react-native';
import TweetCard from '../../components/TweetCard'; // Import TweetCard
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

function Likescreen({ navigation }) {
    const [tweets, setTweets] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isFetched, setIsFetched] = useState(false); // State to track if data is already fetched

    const fetchTweets = useCallback(async (pageNum) => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.post(`${serverUrl}/userdata`, { token });
            const { data, status } = response.data;
            if (status === 'error') {
                Alert.alert('Error', 'Anda Telah Keluar dari Akun', [
                    { text: 'OK', onPress: () => navigation.navigate('Auths') },
                ]);
                return [];
            }

            const idUserLike = data._id; // Extract user ID

            const responseTweet = await axios.post(`${serverUrl}/liked-posts`, { token });
            const dataTweet = responseTweet.data;

            const formattedTweets = dataTweet.data.map(post => ({
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
                commentsCount: post.comments.length,
                bookMarksCount: post.bookmarks.length,
                isLiked: post.likes.some(like => like._id === idUserLike),
            }));

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
            if (!isFetched) { // Only fetch if data has not been fetched yet
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
                // Filter to avoid duplicate tweets
                const uniqueTweets = newTweets.filter(
                    newTweet => !prevTweets.some(tweet => tweet.id === newTweet.id)
                );
                return [...prevTweets, ...uniqueTweets];
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#001374" style={styles.loadingIndicator} />
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
                                <TweetCard tweet={tweet} />
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noTweetsText}>No Likes</Text>
                    )}
                    {loadingMore && (
                        <ActivityIndicator
                            size="large"
                            color="#001374"
                            style={styles.loadingMore}
                        />
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

export default Likescreen;

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
});