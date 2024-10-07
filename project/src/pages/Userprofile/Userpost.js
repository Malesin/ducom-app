import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import TweetCard from '../../components/TweetCard';
import PinTweetCard from '../../components/PinTweetCard';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const serverUrl = config.SERVER_URL;

const Userpost = ({ userIdPost, profilePicture, idUser, amIAdmin, isUserProfile }) => {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false); // State to track if data has been fetched
  const [pintweets, setPinTweets] = useState([]);
  const [pinnedTweetId, setPinnedTweetId] = useState(null);

  const fetchPinTweet = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const pinPost = await axios.post(`${serverUrl}/showPinPost-byId`, {
        token: token,
        userId: userIdPost,
      });

      const postPin = pinPost.data.data;
      console.log(postPin)
      if (!postPin) {
        return null; // Kembalikan null jika pinPost tidak ada
      }
      const totalComments = postPin.comments.length + postPin.comments.reduce((acc, comment) => acc + comment.replies.length, 0);

      const pinTweet = {
        id: postPin._id,
        userAvatar: postPin.user.profilePicture,
        userName: postPin.user.name,
        userHandle: postPin.user.username,
        postDate: postPin.created_at,
        content: postPin.description,
        media: Array.isArray(postPin.media)
          ? postPin.media.map(mediaItem => ({
            type: mediaItem.type,
            uri: mediaItem.uri,
          }))
          : [],
        likesCount: postPin.likes.length,
        commentsCount: totalComments,
        bookMarksCount: postPin.bookmarks.length,
        isLiked: postPin.likes.some(like => like._id === idUser),
        isBookmarked: postPin.bookmarks.some(bookmark => bookmark.user === idUser),
        userIdPost: postPin.user._id,
        idUser: idUser,
        userEmailPost: postPin.user.email,
        profilePicture: profilePicture,
        isAdmin: postPin.user.isAdmin,
        amIAdmin: amIAdmin
      };

      return pinTweet;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null
    } finally {
      setLoading(false);
    }
  }, [userIdPost, profilePicture]);

  const fetchTweets = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(`${serverUrl}/userId-posts`, {
        token: token,
        userId: userIdPost,
      });

      const dataTweet = response.data.data;
      // console.log(dataTweet[0].user)

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
        isLiked: post.likes.some(like => like._id === idUser),
        isBookmarked: post.bookmarks.some(
          bookmark => bookmark.user === userIdPost,
        ),
        userIdPost: post.user._id,
        profilePicture: profilePicture,
        allowedEmail: post.allowedEmail,
        userEmailPost: post.user.email,
        isAdmin: post.user.isAdmin,
        amIAdmin: amIAdmin
      }));

      return formattedTweets;
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [userIdPost, profilePicture]);

  useFocusEffect(
    useCallback(() => {
      if (!isFetched) {
        (async () => {
          setLoading(true);
          const newTweets = await fetchTweets(page);
          const initialPinTweets = await fetchPinTweet(); // Panggil fetchPinTweet saat inisialisasi
          if (initialPinTweets) {
            setPinTweets([initialPinTweets]); // Set pintweets sebagai array dengan satu elemen
            setPinnedTweetId(initialPinTweets.id); // Simpan ID tweet yang dipin
          } else {
            setPinTweets([]); // Kosongkan pintweets jika tidak ada pin tweet
            setPinnedTweetId(null); // Reset ID tweet yang dipin
          }
          const filteredTweets = newTweets.filter(tweet => tweet.id !== initialPinTweets?.id); // Filter tweet yang dipin
          setTweets(filteredTweets.slice(0, 5)); // Load only 4 tweets initially
          setIsFetched(true);
          setLoading(false);
        })();
      }
    }, [fetchTweets, page, isFetched]),
  )

  const handlePostPress = (tweet) => {
    console.log("Clicked Post Press")
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {pintweets.map((tweet, index) => (
            <View key={index} style={styles.tweetContainer}>
              <TouchableOpacity onPress={() => handlePostPress(tweet)}>
                <PinTweetCard tweet={tweet} isUserProfile={isUserProfile} />
              </TouchableOpacity>
            </View>
          ))}
          {Array.isArray(tweets) && tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <View key={index} style={styles.tweetContainer}>
                <TweetCard tweet={tweet} isUserProfile={isUserProfile} />
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
