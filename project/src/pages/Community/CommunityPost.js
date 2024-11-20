import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView, // Tambahkan ScrollView
  RefreshControl, // Tambahkan RefreshControl
  Alert, // Tambahkan Alert
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import CommunityCard from '../../components/Community/CommunityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements';

import { useRoute } from '@react-navigation/native';

const serverUrl = config.SERVER_URL;

const CommunityPost = ({ navigation }) => {
  const route = useRoute();
  const { communityId } = route.params;
  const [communityDataList, setCommunityDataList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Tambahkan state loading

  const fetchDataPost = async () => {
    setLoading(true); // Set loading ke true saat mulai fetch data
    const token = await AsyncStorage.getItem('token');

    try {
      const postsResponse = await axios.post(`${serverUrl}/communityPosts-byId`, {
        token,
        communityId,
      });
      const data = postsResponse.data.data;
      const myData = postsResponse.data.myUser
      const formattedData = data.map(post => ({
        id: post?._id,
        userIdPost: post?.user?._id,
        communityId: post?.communityId?._id,
        communityCardName: post?.communityId?.communityName || 'Community Name',
        communityProfile: post?.communityId?.picture?.profile?.profilePicture,
        communityDescription:
          post?.description || 'This is Description Community.',
        media: Array.isArray(post?.media)
          ? post?.media?.map(mediaItem => ({
            type: mediaItem?.type,
            uri: mediaItem?.uri,
          }))
          : [],
        isLiked: post?.likes?.some(like => like?._id === myData?.myId),
        likesCount: post.likes.length || 0,
        commentsCount: post.comments.length || 0,
        postDate: post?.created_at,
        commentsEnabled: post?.commentsEnabled,
        idUser: myData?.myId,
        amIAdmin: myData?.amIAdmin,
        profilePicture: myData?.profilePicture
      }));
      setCommunityDataList(formattedData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch community posts');
    } finally {
      setLoading(false); // Set loading ke false setelah fetch selesai
    }
  };

  useEffect(() => {
    fetchDataPost();
  }, []);

  // Fungsi untuk handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDataPost();
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh community posts');
    } finally {
      setRefreshing(false);
    }
  }, [communityId]);

  // Fungsi untuk render skeleton
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
        renderSkeleton() // Tampilkan skeleton saat loading
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#001374']}
            />
          }>
          {communityDataList.map((communityCardData, index) => (
            <CommunityCard
              key={index}
              navigation={navigation}
              communityCardData={communityCardData}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default CommunityPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  skeletonContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeleton: {
    backgroundColor: '#ddd',
    marginBottom: 5,
  },
});
