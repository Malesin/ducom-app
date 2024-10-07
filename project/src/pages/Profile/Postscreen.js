import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import PinTweetCard from '../../components/PinTweetCard';
import TweetCard from '../../components/TweetCard'; // Import TweetCard
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements'; // Import Skeleton

const serverUrl = config.SERVER_URL;

function Postscreen({ }) {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [pintweets, setPinTweets] = useState([]);
  const [pinnedTweetId, setPinnedTweetId] = useState(null);
  const navigation = useNavigation();

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
        profilePicture: profilePicture,
        isAdmin: post.user.isAdmin
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

  const fetchPinTweet = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${serverUrl}/userdata`, { token: token });
      const { data, status } = response.data;
      if (status === 'error') {
        Alert.alert('Error', 'Anda Telah Keluar dari Akun', [
          { text: 'OK', onPress: () => navigation.navigate('Auths') },
        ]);
        return;
      }
      const emailUser = data.email;
      const idUser = data._id;
      const profilePicture = data.profilePicture;
      const amIAdmin = data.isAdmin

      const pinPost = await axios.post(`${serverUrl}/showPinPost-User`, {
        token: token
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
        emailUser: emailUser,
        profilePicture: profilePicture,
        isAdmin: postPin.user.isAdmin,
        amIAdmin: amIAdmin
      };

      return pinTweet;
    } catch (error) {
      console.error('Error fetching pinned tweets:', error); // Perbaiki pesan error
      return null; // Kembalikan null jika terjadi error
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`${serverUrl}/comments`, {
        // token: token,
        params: { postId },
      });
      if (response.data.status === 'ok') {
        return response.data.comments;
      } else {
        console.log('Error fetching comments:', response.data.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      return [];
    }
  };

  const handlePostPress = async (tweet) => {
    if (!tweet || !tweet.id) {
      console.error('Tweet data is incomplete:', tweet);
      return;
    }
    const comments = await fetchComments(tweet.id);
    const postId = tweet.id;
    const idUser = tweet.idUser;
    const emailUser = tweet.emailUser;
    const userEmailPost = tweet.userEmailPost;
    const focusCommentInput = true;
    navigation.navigate('ViewPost', { tweet, comments, postId, idUser, userEmailPost, emailUser, focusCommentInput });
  };

  const onRefreshPage = () => {
    setLoading(true);
    setIsFetched(false);
    setPage(1);
    setTweets([]);
    setPinTweets([]);
    (async () => {
      const newTweets = await fetchTweets(1);
      const initialPinTweets = await fetchPinTweet();
      if (initialPinTweets) {
        setPinTweets([initialPinTweets]);
        setPinnedTweetId(initialPinTweets.id);
      } else {
        setPinTweets([]);
        setPinnedTweetId(null);
      }
      const filteredTweets = newTweets.filter(tweet => tweet.id !== initialPinTweets?.id);
      setTweets(filteredTweets.slice(0, 5));
      setIsFetched(true);
      setLoading(false);
    })();
  };

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
  );

  const handleLoadMore = async () => {
    if (!loadingMore) {
      setLoadingMore(true);
      const newPage = page + 1;
      setPage(newPage);
      const newTweets = await fetchTweets(newPage);
      const newPinTweet = await fetchPinTweet();
      if (newPinTweet) {
        setPinTweets([newPinTweet]); // Set pintweets sebagai array dengan satu elemen
        setPinnedTweetId(newPinTweet.id); // Simpan ID tweet yang dipin
      } else {
        setPinTweets([]); // Kosongkan pintweets jika tidak ada pin tweet
        setPinnedTweetId(null); // Reset ID tweet yang dipin
      }
      const filteredTweets = newTweets.filter(tweet => tweet.id !== newPinTweet?.id); // Filter tweet yang dipin
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
          {pintweets.map((tweet, index) => (
            <View key={index} style={styles.tweetContainer}>
              <TouchableOpacity onPress={() => handlePostPress(tweet)}>
                <PinTweetCard tweet={tweet} onRefreshPage={onRefreshPage} isUserProfile={true}/>
              </TouchableOpacity>
            </View>
          ))}
          {Array.isArray(tweets) && tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <View key={index} style={styles.tweetContainer}>
                <TouchableOpacity onPress={() => handlePostPress(tweet)}>
                  <TweetCard tweet={tweet} onRefreshPage={onRefreshPage} isUserProfile={true}/>
                </TouchableOpacity>
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