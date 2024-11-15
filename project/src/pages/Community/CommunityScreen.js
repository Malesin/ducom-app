import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native'; // Tambahkan useFocusEffect
import CommunityExplore from '../../components/Community/CommunityExplore';
import CommunityCard from '../../components/Community/CommunityCard';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [cardData, setCardData] = useState([]);
  const [exploreData, setExploreData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDataCommunities = async () => {
    const token = await AsyncStorage.getItem('token');

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
      const formattedData = data.map(item => ({
        communityCardName: item.communityId.communityName || 'Community Name',
        communityDescription:
          item.description || 'This is Description Community.',
        media: Array.isArray(item?.media)
          ? item?.media.map(mediaItem => ({
              type: mediaItem.type,
              uri: mediaItem.uri,
            }))
          : [],
        likesCount: item.likes.length || 0,
        commentsCount: item.comments.length || 0,
      }));
      setCardData(formattedData);
    } catch (error) {
      console.error('Error fetching community data:', error);
      Alert.alert('Error', 'Failed to fetch community data');
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#001374']}
            tintColor="#001374"
          />
        }>
        <View style={styles.exploreContainer}>
          <Text style={styles.exploreText}>Explore</Text>
          <FlatList
            data={exploreData}
            renderItem={({item}) => (
              <CommunityExplore communityExploreData={item} />
            )}
            keyExtractor={item => item.communityId}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 0}}
          />
        </View>
        <View style={styles.communityCardContainer}>
          {cardData.map((community, index) => (
            <CommunityCard
              key={index}
              navigation={navigation}
              communityCardData={community}
            />
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
    borderBottomWidth: 1,
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
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default CommunityScreen;
