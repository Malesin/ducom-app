import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import config from '../../config';
import { useNavigation } from '@react-navigation/native';

const serverUrl = config.SERVER_URL;

const ViewCommunity = () => {
  const [communityData, setCommunityData] = useState(null);
  const navigation = useNavigation();

const handleSettingsPress= () => {
  navigation.navigate('CommunitySettings');
}

  useEffect(() => {
    async function fetchCommunityData() {
      try {
        const response = await axios.get(`${serverUrl}/communitydata`);
        setCommunityData(response.data);
      } catch (error) {
        console.error('Error fetching community data:', error);
      }
    }

    fetchCommunityData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={communityData?.banner ? { uri: communityData.banner } : require('../../assets/banner.png')}
          style={styles.banner}
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{communityData?.name || 'Community Name'}</Text>
          <TouchableOpacity style={styles.joinButton} onPress={handleSettingsPress}>
            <Text style={styles.settings}>Settings</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bio}>{communityData?.bio || 'Community bio'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    width: '100%',
    height: 185,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#666',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  joinButton: {
    backgroundColor: '#E1E8ED',
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 47,
    borderRadius: 100,
    marginLeft: 10,
  },
  settings: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ViewCommunity;