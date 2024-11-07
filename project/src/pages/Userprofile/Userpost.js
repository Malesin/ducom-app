import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import TweetCard from '../../components/TweetCard';
import PinTweetCard from '../../components/PinTweetCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Skeleton } from 'react-native-elements';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = config.SERVER_URL;

const Userpost = ({ userIdPost, profilePicture, idUser, amIAdmin, isUserProfile }) => {
  const navigation = useNavigation();
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false);
  const [pintweets, setPinTweets] = useState([]);
  const [pinnedTweetId, setPinnedTweetId] = useState(null);

  const fetchPinTweet = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const respMyData = await axios.post(`${serverUrl}/userdata`, { token: token });

      const { data } = respMyData.data;
      const idUser = data._id;
      const profilePicture = data.profilePicture;
      const amIAdmin = data.isAdmin
      const isMuteds = data.mutedUsers
      const isBlockeds = data.blockedUsers

      const pinPost = await axios.post(`${serverUrl}/showPinPost-byId`, {
        token: token,
        userId: userIdPost,
      });

      const postPin = pinPost.data.data;
      if (!postPin) {
        return null;
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
        repostsCount: postPin.reposts.length,
        isLiked: postPin.likes.some(like => like._id === idUser),
        isBookmarked: postPin.bookmarks.some(bookmark => bookmark.user === idUser),
        isReposted: postPin.reposts.some(repost => repost.user === idUser),
        isMuted: isMuteds.some(isMuted => isMuted === postPin.user._id),
        isBlocked: isBlockeds.some(isBlocked => isBlocked === postPin.user._id),
        userIdPost: postPin.user._id,
        idUser: idUser,
        profilePicture: profilePicture,
        commentsEnabled: postPin.commentsEnabled,
        isAdmin: postPin.user.isAdmin,
        amIAdmin: amIAdmin
      };

      return pinTweet;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log("lo diblokir")
        setLoading(false)
        return "You are blocked by this user";
      }
      setLoading(false)
      console.error('Error fetching data:', error);
      return null;
    }
  }, [userIdPost, profilePicture]);

  const fetchTweets = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const respMyData = await axios.post(`${serverUrl}/userdata`, { token: token });

      const { data } = respMyData.data;
      const idUser = data._id;
      const profilePicture = data.profilePicture;
      const amIAdmin = data.isAdmin
      const isMuteds = data.mutedUsers
      const isBlockeds = data.blockedUsers

      const respTweet = await axios.post(`${serverUrl}/userId-posts`, {
        token: token,
        userId: userIdPost,
      });

      const dataTweet = respTweet.data.data;
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
      if (error.response && error.response.data === 'youBlockedBy') {
        console.log("lo diblokir")
        setLoading(false)
        return "You are blocked by this user";
      } else if (error.response && error.response.data === 'youBlockedThis') {
        console.log("lo ngeblokir")
        setLoading(false)
        return "You have blocked this user";
      } else {
        console.error("Error fetching tweets:", error);
      }
      setLoading(false)
      console.error('Error fetching data:', error);
      return null;
    }
  }, [userIdPost, profilePicture]);

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

  const onRefreshPage = () => {
    setLoading(true);
    setIsFetched(false);
    setPage(1);
    setTweets([]);
    setPinTweets([]);
    (async () => {
      const newTweets = await fetchTweets(1);
      const initialPinTweets = await fetchPinTweet();

      if (newTweets === "You are blocked by this user" || initialPinTweets === "You are blocked by this user") {
        setTweets("You are blocked by this user");
        setLoading(false);
        return;
      } else if (newTweets === "You have blocked this user" || initialPinTweets === "You have blocked this user") {
        setTweets("You have blocked this user");
        setLoading(false);
        return;
      }

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
      setLoading(true);
      setIsFetched(false);
      setPage(1);
      setTweets([]);
      setPinTweets([]);
      (async () => {
        const newTweets = await fetchTweets(1);
        const initialPinTweets = await fetchPinTweet();

        if (newTweets === "You are blocked by this user" || initialPinTweets === "You are blocked by this user") {
          setTweets("You are blocked by this user");
          setLoading(false);
          return;
        } else if (newTweets === "You have blocked this user" || initialPinTweets === "You have blocked this user") {
          setTweets("You have blocked this user");
          setLoading(false);
          return;
        }

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
    }, [userIdPost])
  );

  const handlePostPress = (tweet) => {
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
          {pintweets.map((tweet, index) => (
            <View key={index} style={styles.tweetContainer}>
              <TouchableOpacity onPress={() => handlePostPress(tweet)}>
                <PinTweetCard tweet={tweet} onRefreshPage={onRefreshPage} isUserProfile={isUserProfile} />
              </TouchableOpacity>
            </View>
          ))}
          {Array.isArray(tweets) && tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <View key={index} style={styles.tweetContainer}>
                <TouchableOpacity onPress={() => handlePostPress(tweet)}>
                  <TweetCard tweet={tweet} onRefreshPage={onRefreshPage} isUserProfile={isUserProfile} />
                </TouchableOpacity>
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

export default Userpost;
