import React, { useState, useEffect, useCallback } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import CommentCard from '../../components/CommentCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { useFocusEffect } from '@react-navigation/native';

const serverUrl = config.SERVER_URL;

function Replyscreen({ navigation }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [isFetched, setIsFetched] = useState(false);

    const fetchComments = useCallback(async (pageNum) => {
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

            const idUser = data._id;
            const emailUser = data.email;
            const profilePicture = data.profilePicture;

            const responseComment = await axios.post(`${serverUrl}/my-comments`, {
                token: token,
                page: pageNum,
            });
            const dataComment = responseComment.data;

            const formattedComments = dataComment.data.map(comment => ({
                id: comment._id,
                text: comment.text,
                username: comment.user.username,
                profilePicture: comment.user.profilePicture,
                hasReplies: comment.replies.length > 0,
                replies: comment.replies,
                commentId: comment._id,
                postId: comment.postId,
                userIdPost: comment.user._id,
                idUser: idUser,
                allowedEmail: comment.allowedEmail,
                emailUser: emailUser,
                onDeleteSuccess: () => fetchComments(pageNum),
            }));

            return formattedComments;
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
                    const newComments = await fetchComments(page);
                    setComments(newComments);
                    setIsFetched(true);
                    setLoading(false);
                })();
            }
        }, [fetchComments, page, isFetched]),
    );

    const handleLoadMore = async () => {
        if (!loadingMore) {
            setLoadingMore(true);
            const newPage = page + 1;
            setPage(newPage);
            const newComments = await fetchComments(newPage);
            setComments(prevComments => {
                const uniqueComments = newComments.filter(
                    newComment => !prevComments.some(comment => comment.id === newComment.id),
                );
                return [...prevComments, ...uniqueComments];
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
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
                    {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <View key={index} style={styles.commentContainer}>
                                <CommentCard {...comment} />
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noCommentsText}>No comments available</Text>
                    )}
                    {loadingMore && <Text>Loading more...</Text>}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
export default Replyscreen;

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
    commentContainer: {
        width: '100%',
    },
    noCommentsText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
});