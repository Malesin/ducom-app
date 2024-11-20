import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CommunityExplore from '../../components/Community/CommunityExplore';
import CommunityCard from '../../components/Community/CommunityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements';

const serverUrl = config.SERVER_URL;

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [cardData, setCardData] = useState([]);
  const [exploreData, setExploreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDataCommunities = async () => {
    const token = await AsyncStorage.getItem('token');
    setLoading(true);

    try {
      const exploreResponse = await axios.post(`${serverUrl}/communities`, {
        token: token,
      });
      const response = exploreResponse.data.data;
      const respData = response.map(data => ({
        communityId: data._id,
        exploreName: data.communityName,
        memberCount: `${data.members.length} Members`,
        description: data.description || 'No description available.',
        profilePicture: data.picture.profile.profilePicture,
        backgroundPicture: data.picture.background.backgroundPicture,
      }));
      setExploreData(respData);

      const postsResponse = await axios.post(`${serverUrl}/communityPosts`, {
        token: token,
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
      setCardData(formattedData);
    } catch (error) {
      console.error('Error fetching community data:', error);
      // Alert.alert('Error', 'Failed to fetch community data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDataCommunities();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const autoRefresh = async () => {
        try {
          await fetchDataCommunities();
        } catch (error) {
          console.error('Error auto refreshing data:', error);
        }
      };

      autoRefresh();
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDataCommunities();
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh community data');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderSkeleton = isHorizontal => (
    <ScrollView
      horizontal={isHorizontal}
      showsHorizontalScrollIndicator={false}>
      {[...Array(5)].map((_, index) => (
        <View
          key={index}
          style={
            isHorizontal
              ? styles.skeletonContainerHorizontal
              : { ...styles.skeletonContainer, paddingHorizontal: 8 }
          }>
          {!isHorizontal && (
            <Skeleton
              animation="pulse"
              height={17}
              width={170}
              style={[styles.skeleton, { borderRadius: 2, marginBottom: 10 }]}
            />
          )}
          <Skeleton
            animation="pulse"
            height={isHorizontal ? 320 : 100}
            width={isHorizontal ? 240 : '100%'}
            style={[styles.skeleton, { borderRadius: 5 }]}
          />
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.exploreContainer}>
          <Text style={styles.exploreText}>Explore</Text>
          {loading ? (
            renderSkeleton(true)
          ) : (
            <FlatList
              data={exploreData}
              renderItem={({ item }) => (
                <CommunityExplore communityExploreData={item} />
              )}
              keyExtractor={item => item.communityId}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            />
          )}
        </View>
        <View style={styles.communityCardContainer}>
          {loading
            ? renderSkeleton(false)
            : cardData.map((community, index) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ViewPostCommunity', { post: community, isUserProfile: false });
                }}>
                <CommunityCard
                  key={`${community.communityCardName}-${index}`}
                  navigation={navigation}
                  communityCardData={community}
                />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exploreContainer: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  exploreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  communityCardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  skeletonContainer: {
    padding: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  skeleton: {
    marginBottom: 10,
  },
  skeletonContainerHorizontal: {
    padding: 5,
    alignItems: 'flex-start',
  },
});

export default CommunityScreen;