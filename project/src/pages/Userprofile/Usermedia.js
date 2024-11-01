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
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const serverUrl = config.SERVER_URL;

const Usermedia = ({ userIdPost, profilePicture }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchTweets = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token Berhasil Diambil');
      const response = await axios.post(`${serverUrl}/userdata`, { token: token });

      const { data } = response.data;
      const idUser = data._id;
      const profilePicture = data.profilePicture;
      const amIAdmin = data.isAdmin
      const isMuteds = data.mutedUsers
      const isBlockeds = data.blockedUsers

      const userResponse = await axios.post(`${serverUrl}/userId-posts/`, {
        token: token,
        userId: userIdPost,
      });
      console.log('Data Berhasil Diambil');

      const dataTweet = userResponse.data.data;

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
      setLoading(false);
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

  const handleProfilePress = (tweet) => {
    navigation.navigate('ViewPost', { tweet });
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        renderSkeleton()
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {Array.isArray(tweets) && tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <View key={index} style={styles.tweetContainer}>
                <TouchableOpacity onPress={() => handleProfilePress(tweet)}>
                  <TweetCard tweet={tweet} />
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

export default Usermedia;
