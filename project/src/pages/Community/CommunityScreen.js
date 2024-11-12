import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CommunityExplore from '../../components/Community/CommunityExplore';
import CommunityCard from '../../components/Community/CommunityCard';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [cardData, setCardData] = useState([])
  const [exploreData, setExploreData] = useState([])

  const handlePress = () => {
    navigation.navigate('CreateCommunity');
  };

  const fetchDataCommunities = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      await axios
        .post(`${serverUrl}/communities`, { token: token })
        .then(res => {
          const response = res.data.data;
          const respData = response.map(data => ({
            communityId: data._id,
            exploreName: data.communityName,
            memberCount: `${data.members.length} Members`,
            description: data.description || 'No description available.',
            profilePicture: data.picture.profile.profilePicture,
            backgroundPicture: data.picture.background.backgroundPicture,
          }));
          setExploreData(respData);
        })
    } catch (error) {
      console.error(error)
    }
  }

  // setCardData([
  //   {
  //     id: '1',
  //     communityCardName: 'Komunitas A',
  //     communityDescription: 'Deskripsi lengkap komunitas A.',
  //   }
  // ])

  useEffect(() => {
    fetchDataCommunities()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.exploreContainer}>
          <Text style={styles.exploreText}>Explore</Text>
          <FlatList
            data={exploreData}
            renderItem={({ item }) => (
              <CommunityExplore communityExploreData={item} />
            )}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          />
        </View>
        <View style={styles.communityCardContainer}>
          {cardData.map(community => (
            <CommunityCard
              key={community.id}
              navigation={navigation}
              communityCardData={community}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.fabContainer}>
        <TouchableOpacity onPress={handlePress} style={styles.mainButton}>
          <Text style={styles.mainButtonText}>+</Text>
        </TouchableOpacity>
      </View>
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
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 2,
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#001374',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mainButtonText: {
    fontSize: 30,
    color: 'white',
  },
});

export default CommunityScreen;
