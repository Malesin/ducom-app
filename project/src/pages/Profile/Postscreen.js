import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  SafeAreaView,
  Text,
} from 'react-native';
import TweetCard from '../../components/TweetCard'; // Import TweetCard
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements'; // Import Skeleton

const serverUrl = config.SERVER_URL;

function Postscreen({ navigation }) {
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

      const idUser = data._id;
      const emailUser = data.email;
      const profilePicture = data.profilePicture

      const responseTweet = await axios.post(`${serverUrl}/my-posts`, {
        token: token,
        page: pageNum,
      });
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
        isLiked: post.likes.some(like => like._id === idUser),
        isBookmarked: post.bookmarks.some(bookmark => bookmark.user === idUser),
        userIdPost: post.user._id,
        idUser: idUser,
        allowedEmail: post.allowedEmail,
        userEmailPost: post.user.email,
        emailUser: emailUser,
        profilePicture: profilePicture

      }));

      return formattedTweets;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    } finally {
      setLoadingMore(false);
    }
  },
    [navigation],
  );

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
    }, [fetchTweets, page, isFetched]),
  );

  const handleLoadMore = async () => {
    if (!loadingMore) {
      setLoadingMore(true);
      const newPage = page + 1;
      setPage(newPage);
      const newTweets = await fetchTweets(newPage);
      setTweets(prevTweets => {
        const uniqueTweets = newTweets.filter(
          newTweet => !prevTweets.some(tweet => tweet.id === newTweet.id),
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
            <Skeleton
              animation="pulse"
              circle
              height={40}
              width={40}
              style={styles.skeletonAvatar}
            />
            <View style={styles.skeletonTextContainer}>
              <Skeleton
                animation="pulse"
                height={20}
                width={100}
                style={styles.skeleton}
              />
              <Skeleton
                animation="pulse"
                height={14}
                width={60}
                style={styles.skeleton}
              />
            </View>
          </View>
          <Skeleton
            animation="pulse"
            height={20}
            width={200}
            style={styles.skeleton}
          />
          <Skeleton
            animation="pulse"
            height={150}
            width={'100%'}
            style={styles.skeleton}
          />
        </View>
      ))}
    </>
  );

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
                <TweetCard tweet={tweet} />
              </View>
            ))
          ) : (
            <Text style={styles.noTweetsText}>No tweets available</Text>
          )}
          {loadingMore && renderSkeleton()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default Postscreen;

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
