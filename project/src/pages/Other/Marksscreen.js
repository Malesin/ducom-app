import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  SafeAreaView,
  Text,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import TweetCard from '../../components/TweetCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements';

const serverUrl = config.SERVER_URL;

const Marksscreen = ({navigation}) => {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchTweets = useCallback(
    async pageNum => {
      if (!isConnected) {
        setLoading(false);
        return [];
      }

      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      try {
        const response = await axios.post(`${serverUrl}/userdata`, { token });
        const { data, status } = response.data;

        if (status === 'error') {
          Alert.alert('Error', 'Anda Telah Keluar dari Akun', [
            {text: 'OK', onPress: () => navigation.navigate('Auths')},
          ]);
          return [];
        }

        const idUser = data._id; 
        const profilePicture = data.profilePicture;

        const responseTweet = await axios.post(`${serverUrl}/user-bookmarks`, {
          token: token
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
          profilePicture: profilePicture,
          commentsEnabled: post.commentsEnabled
        }));

        return formattedTweets;
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [navigation, isConnected],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setShowSkeleton(true);
    setPage(1);
    setHasMore(true);
    const newTweets = await fetchTweets(1);
    setTweets(newTweets.slice(0, 4));
    setRefreshing(false);
    setShowSkeleton(false);
  }, [fetchTweets]);

  const handleLoadMore = async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const moreTweets = await fetchTweets(page + 1);
      const newTweets = moreTweets.filter(
        tweet => !tweets.some(existingTweet => existingTweet.id === tweet.id),
      );
      if (newTweets.length > 0) {
        setTweets(prevTweets => [...prevTweets, ...newTweets.slice(0, 5)]);
        setPage(prevPage => prevPage + 1);
      }
      setLoadingMore(false);
      if (newTweets.length < 4) {
        setHasMore(false);
      }
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
                width="25%"
                style={styles.skeleton}
              />
              <Skeleton
                animation="pulse"
                height={14}
                width="15%"
                style={styles.skeleton}
              />
            </View>
          </View>
          <Skeleton
            animation="pulse"
            height={20}
            width="75%"
            style={[styles.skeleton, { borderRadius: 3 }]}
          />
          <Skeleton
            animation="pulse"
            height={200}
            width="100%"
            style={[styles.skeleton, { borderRadius: 7 }]}
          />
        </View>
      ))}
    </>
  );

  useEffect(() => {
    const loadInitialTweets = async () => {
      const initialTweets = await fetchTweets(1);
      setTweets(initialTweets.slice(0, 5));
      setLoading(false);
      setShowSkeleton(false);
    };
    loadInitialTweets();
  }, [fetchTweets]);

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && (
        <View style={styles.noConnectionContainer}>
          <Text style={styles.noConnectionText}>Tidak ada jaringan</Text>
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({nativeEvent}) => {
          const {contentOffset, layoutMeasurement, contentSize} = nativeEvent;
          const contentHeight = contentSize.height;
          const viewportHeight = layoutMeasurement.height;
          const scrollPosition = contentOffset.y + viewportHeight;
          if (scrollPosition >= contentHeight - 100) {
            handleLoadMore();
          }
        }}>
        {showSkeleton ? (
          renderSkeleton()
        ) : (
          tweets.length === 0 ? (
            <View style={styles.noTweetsContainer}>
              <Text style={styles.noTweetsText}>Belum ada Bookmark untuk saat ini</Text>
            </View>
          ) : (
            tweets.map((tweet, index) => (
              <View key={index} style={styles.tweetContainer}>
                <TweetCard tweet={tweet} />
              </View>
            ))
          )
        )}
        {loadingMore && (
          <ActivityIndicator
            size="large"
            color="#001374"
            style={styles.loadingMore}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Marksscreen;

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
  skeletonScreen: {   
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonContainer: {
    padding: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
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
  loadingMore: {
    marginVertical: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTweetsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  noTweetsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noConnectionContainer: {
    padding: 10,
    backgroundColor: '#d3d3d3',
    alignItems: 'center',
  },
  noConnectionText: {
    color: '#000000',
    fontSize: 16,
  },
});