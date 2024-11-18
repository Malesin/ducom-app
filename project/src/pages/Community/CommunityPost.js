import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView, // Tambahkan ScrollView
  RefreshControl, // Tambahkan RefreshControl
  Alert, // Tambahkan Alert
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import CommunityCard from '../../components/Community/CommunityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import {useRoute} from '@react-navigation/native';

const serverUrl = config.SERVER_URL;

const CommunityPost = ({navigation}) => {
  const route = useRoute();
  const {communityId} = route.params;
  const [communityDataList, setCommunityDataList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDataPost = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.post(`${serverUrl}/communityPosts-byId`, {
        token,
        communityId,
      });
      const data = response.data.data;
      const communityName = response.data.communityName;
      const formattedData = data
        .filter(post => post.user !== null)
        .map(post => ({
          id: post._id,
          communityCardName: communityName || 'Nama Komunitas',
          communityDescription: post.description || 'Deskripsi komunitas ini.',
          media: Array.isArray(post?.media)
            ? post?.media.map(mediaItem => ({
                type: mediaItem.type,
                uri: mediaItem.uri,
              }))
            : [],
          likesCount: post.likes.length || 0,
          commentsCount: post.comments.length || 0,
        }));
      setCommunityDataList(formattedData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch community posts');
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

  return (
    <SafeAreaView style={styles.container}>
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
});
