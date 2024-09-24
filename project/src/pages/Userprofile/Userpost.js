import React, { useState, useEffect, useCallback, useFocusEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from 'react-native';
import TweetCard from '../../components/TweetCard';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const Userpost = ({ userIdPost, profilePicture, idUser }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false); // State to track if data has been fetched

  const fetchTweets = useCallback(async () => {
    try {
      const response = await axios.post(`${serverUrl}/userId-posts`, {
        userId: userIdPost,
      });

      const dataTweet = response.data;
      console.log(dataTweet.data[0].likes, "ppp")

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
        isBookmarked: post.bookmarks.some(
          bookmark => bookmark.user === userIdPost,
        ),
        userIdPost: post.user._id,
        profilePicture: profilePicture,
        allowedEmail: post.allowedEmail,
        userEmailPost: post.user.email,
      }));

      return formattedTweets;
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [userIdPost, profilePicture]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isFetched) {
        const newTweets = await fetchTweets();
        setTweets(newTweets);
        setIsFetched(true);
      }
    };
  
    fetchData();
  }, [fetchTweets, isFetched]);
  


  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <View key={index} style={styles.tweetContainer}>
                <TweetCard tweet={tweet} />
              </View>
            ))
          ) : (
            <Text style={styles.noTweetsText}>No tweets available</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};


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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Userpost;
