import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import TweetCard from '../../components/TweetCard'; // Tetap menggunakan TweetCard
import PinTweetCard from '../../components/PinTweetCard'; // Tetap menggunakan PinTweetCard
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Skeleton } from 'react-native-elements';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = config.SERVER_URL;

const Userrepost = ({ userIdRepost, profilePicture, idUser, amIAdmin, isUserProfile }) => {
  const navigation = useNavigation();
  const [reposts, setReposts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false);
  const [pinreposts, setPinReposts] = useState([]);
  const [pinnedRepostId, setPinnedRepostId] = useState(null);

  const fetchPinRepost = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const respMyData = await axios.post(`${serverUrl}/userdata`, { token: token });
      const { data } = respMyData.data;
      const isMuteds = data.mutedUsers;
      const isBlockeds = data.blockedUsers;
      const pinPost = await axios.post(`${serverUrl}/showPinRepost-byId`, {
        token: token,
        userId: userIdRepost,
      });

      const postPin = pinPost.data.data;
      if (!postPin) {
        return null;
      }
      const totalComments = postPin.comments.length + postPin.comments.reduce((acc, comment) => acc + comment.replies.length, 0);

      const pinRepost = {
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
        isMuted: isMuteds.some(isMuted => isMuted === postPin.user._id),
        isBlocked: isBlockeds.some(isBlocked => isBlocked === postPin.user._id),
        userIdRepost: postPin.user._id,
        idUser: idUser,
        profilePicture: profilePicture,
        commentsEnabled: postPin.commentsEnabled,
        isAdmin: postPin.user.isAdmin,
        amIAdmin: amIAdmin
      };

      return pinRepost;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log("lo diblokir");
        setLoading(false);
        return "You are blocked by this user";
      }
      setLoading(false);
      console.error('Error fetching data:', error);
      return null;
    }
  }, [userIdRepost, profilePicture]);

  const fetchReposts = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const respMyData = await axios.post(`${serverUrl}/userdata`, { token: token });
      const { data } = respMyData.data;
      const isMuteds = data.mutedUsers;
      const isBlockeds = data.blockedUsers;
      const respRepost = await axios.post(`${serverUrl}/userId-reposts`, {
        token: token,
        userId: userIdRepost,
      });

      const dataRepost = respRepost.data.data;

      const formattedReposts = dataRepost
        .filter(post => post.user !== null)
        .map(post => ({
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
            bookmark => bookmark.user === userIdRepost,
          ),
          isMuted: isMuteds.some(isMuted => isMuted === post.user._id),
          isBlocked: isBlockeds.some(isBlocked => isBlocked === post.user._id),
          userIdRepost: post.user._id,
          profilePicture: profilePicture,
          commentsEnabled: post.commentsEnabled,
          isAdmin: post.user.isAdmin,
          amIAdmin: amIAdmin
        }));

      return formattedReposts;
    } catch (error) {
      if (error.response && error.response.data === 'youBlockedBy') {
        console.log("lo diblokir");
        setLoading(false);
        return "You are blocked by this user";
      } else if (error.response && error.response.data === 'youBlockedThis') {
        console.log("lo ngeblokir");
        setLoading(false);
        return "You have blocked this user";
      } else {
        console.error("Error fetching reposts:", error);
      }
      setLoading(false);
      console.error('Error fetching data:', error);
      return null;
    }
  }, [userIdRepost, profilePicture]);

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
    setReposts([]);
    setPinReposts([]);
    (async () => {
      const newReposts = await fetchReposts(1);
      const initialPinReposts = await fetchPinRepost();

      if (newReposts === "You are blocked by this user" || initialPinReposts === "You are blocked by this user") {
        setReposts("You are blocked by this user");
        setLoading(false);
        return;
      } else if (newReposts === "You have blocked this user" || initialPinReposts === "You have blocked this user") {
        setReposts("You have blocked this user");
        setLoading(false);
        return;
      }

      if (initialPinReposts) {
        setPinReposts([initialPinReposts]);
        setPinnedRepostId(initialPinReposts.id);
      } else {
        setPinReposts([]);
        setPinnedRepostId(null);
      }

      const filteredReposts = newReposts.filter(repost => repost.id !== initialPinReposts?.id);
      setReposts(filteredReposts.slice(0, 5));
      setIsFetched(true);
      setLoading(false);
    })();
  };

  useFocusEffect(
    useCallback(() => {
      if (!isFetched) {
        (async () => {
          setLoading(true);
          const newReposts = await fetchReposts(page);
          const initialPinReposts = await fetchPinRepost();

          if (newReposts === "You are blocked by this user" || initialPinReposts === "You are blocked by this user") {
            setReposts("You are blocked by this user");
            setLoading(false);
            return;
          } else if (newReposts === "You have blocked this user" || initialPinReposts === "You have blocked this user") {
            setReposts("You have blocked this user");
            setLoading(false);
            return;
          }

          if (initialPinReposts) {
            setPinReposts([initialPinReposts]);
            setPinnedRepostId(initialPinReposts.id);
          } else {
            setPinReposts([]);
            setPinnedRepostId(null);
          }

          const filteredReposts = newReposts.filter(repost => repost.id !== initialPinReposts?.id);
          setReposts(filteredReposts.slice(0, 5));
          setIsFetched(true);
          setLoading(false);
        })();
      }
    }, [fetchReposts, page, isFetched]),
  );

  const handleRepostPress = (repost) => {
    navigation.navigate('ViewRepost', { repost });
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
          {pinreposts.map((repost, index) => (
            <View key={index} style={styles.repostContainer}>
              <TouchableOpacity onPress={() => handleRepostPress(repost)}>
                <PinTweetCard tweet={repost} onRefreshPage={onRefreshPage} isUserProfile={isUserProfile} />
              </TouchableOpacity>
            </View>
          ))}
          {Array.isArray(reposts) && reposts.length > 0 ? (
            reposts.map((repost, index) => (
              <View key={index} style={styles.repostContainer}>
                <TouchableOpacity onPress={() => handleRepostPress(repost)}>
                  <TweetCard tweet={repost} onRefreshPage={onRefreshPage} isUserProfile={isUserProfile} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noRepostsText}>
              {reposts === "You are blocked by this user" ? "You are blocked by this user" : (<>
                {reposts === "You have blocked this user" ? "You have blocked this user" : "No Reposts Available"}
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
  repostContainer: {
    width: '100%',
  },
  noRepostsText: {
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

export default Userrepost;
