import React, { useState, useEffect, useCallback } from 'react';
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
import { Skeleton } from 'react-native-elements'; // Import Skeleton
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = config.SERVER_URL;

const Usermedia = ({ userIdPost, profilePicture }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTweets = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token Berhasil Diambil');

      const userResponse = await axios.post(`${serverUrl}/userId-posts/`, {
        token: token,
        userId: userIdPost,
      });
      console.log('Data Berhasil Diambil');

      const dataTweet = userResponse.data.data;
      console.log('Fetched tweets:', dataTweet); // Tambahkan log untuk memeriksa data

      const formattedTweets = dataTweet.map(post => ({
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
        isLiked: post.likes.some(like => like._id === userIdPost),
        isBookmarked: post.bookmarks.some(
          bookmark => bookmark.user === userIdPost,
        ),
        userIdPost: post.user._id,
        profilePicture: profilePicture,
        commentsEnabled: post.commentsEnabled,
        isAdmin: post.user.isAdmin
      }));

      setTweets(formattedTweets);
    } catch (error) {
      if (error.response && error.response.data === 'youBlockedBy') {
        console.log("lo diblokir")
        setTweets("You are blocked by this user");
      } else if (error.response && error.response.data === 'youBlockedThis') {
        console.log("lo ngeblokir")
        setTweets("You have blocked this user");
      } else {
        console.error("Error fetching tweets:", error);
      }
    } finally {
      setLoading(false); // Pastikan setLoading(false) dipanggil di sini
    }
  }, [userIdPost]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

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

  console.log(tweets)

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        renderSkeleton()
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {Array.isArray(tweets) && tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <View key={index} style={styles.tweetContainer}>
                <TweetCard tweet={tweet} />
              </View>
            ))
          ) : (
            <Text style={styles.noTweetsText}>
              {tweets === "You are blocked by this user" ? "You are blocked by this user" : (<>
                {tweets === "You have blocked this user" ? "You have blocked this user" : "No Tweets Available"}
              </>)}
            </Text>
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
    color: '#000',
    marginTop: 25,
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

export default Usermedia;
