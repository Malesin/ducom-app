import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import CommunityCard from '../../components/Community/CommunityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import {useRoute} from '@react-navigation/native';
import {Skeleton} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const serverUrl = config.SERVER_URL;

const CommunityMedia = ({navigation}) => {
  const route = useRoute();
  const {communityId} = route.params;
  const [communityDataList, setCommunityDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  const nav = navigation || useNavigation();

  const fetchDataPost = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    try {
      const postsResponse = await axios.post(
        `${serverUrl}/communityPosts-byId`,
        {
          token,
          communityId,
        },
      );
      const data = postsResponse.data.data;
      const myData = postsResponse.data.myUser;
      const formattedData = data
        .filter(post => Array.isArray(post.media) && post.media.length > 0)
        .filter(post => post.user !== null)
        .map(post => ({
          id: post?._id,
          userIdPost: post?.user?._id,
          communityId: post?.communityId?._id,
          communityCardName:
            post?.communityId?.communityName || 'Community Name',
          communityProfile: post?.communityId?.picture?.profile?.profilePicture,
          communityDescription: post?.description || null,
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
          profilePicture: myData?.profilePicture,
        }));
      setCommunityDataList(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataPost();
  }, []);

  const renderSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.skeletonContainer}>
          <View style={styles.skeletonHeader}>
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
        <View>
          {communityDataList.length === 0 ? (
            <Text style={styles.noPostsText}>No media available</Text>
          ) : (
            communityDataList.map((communityCardData, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => nav.navigate('ViewPostCommunity', {
                  post: communityCardData,
                  focusCommentInput: false,
                })}
              >
                <CommunityCard
                  navigation={nav}
                  communityCardData={communityCardData}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default CommunityMedia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  skeletonTextContainer: {
    flexDirection: 'column',
  },
  skeleton: {
    marginBottom: 10,
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
