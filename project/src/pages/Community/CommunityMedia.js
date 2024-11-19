import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import CommunityCard from '../../components/Community/CommunityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { useRoute } from '@react-navigation/native';

const serverUrl = config.SERVER_URL;

const CommunityMedia = ({ navigation }) => {
  const route = useRoute();
  const { communityId } = route.params;
  const [communityDataList, setCommunityDataList] = useState([]);

  const fetchDataPost = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const postsResponse = await axios.post(`${serverUrl}/communityPosts-byId`, {
        token,
        communityId,
      });
      const data = postsResponse.data.data;
      const myData = postsResponse.data.myUser
      const formattedData = data
        .filter(post => Array.isArray(post.media) && post.media.length > 0)
        .filter(post => post.user !== null)
        .map(post => ({
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
    }
  };

  useEffect(() => {
    fetchDataPost();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {communityDataList.map((communityCardData, index) => (
          <CommunityCard
            key={index}
            navigation={navigation}
            communityCardData={communityCardData}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default CommunityMedia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
