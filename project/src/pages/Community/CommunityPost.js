import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
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

  const fetchDataPost = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.post(`${serverUrl}/communityPosts-byId`, {
        token,
        communityId,
      });
      const data = response.data.data;
      const communityName = response.data.communityName;
      const formattedData = data.map(item => ({
        communityCardName: communityName || 'Nama Komunitas',
        communityDescription: item.description || 'Deskripsi komunitas ini.',
        likesCount: item.likes.length || 0,
        commentsCount: item.comments.length || 0,
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

export default CommunityPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
