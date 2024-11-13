import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import config from '../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = config.SERVER_URL;

const ViewCommunity = () => {
  const route = useRoute();
  const { communityId } = route.params;
  const [communityData, setCommunityData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true); // true buat admin, false buat member 😛
  const navigation = useNavigation();

  const handleSettingsPress = () => {
    navigation.navigate('CommunitySettings', { communityData: communityData });
  };

  const handleJoinPress = () => {
    console.log('Joined community');
    // Implement join functionality if needed
  };

  const handleCreate = () => {
    console.log('Creating post in community');
    navigation.navigate('CreatePostCommunity', { communityId: communityId });
  };

  useEffect(() => {
    async function fetchCommunityData() {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.post(`${serverUrl}/community-byId`, {
          token: token,
          communityId: communityId,
        });
        setCommunityData(response.data.data);
      } catch (error) {
        console.error('Error fetching community data:', error);
      }
    }
    fetchCommunityData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.bannerContainer}>
          <Image
            source={
              communityData?.picture.banner.bannerPicture
                ? { uri: communityData.picture.banner.bannerPicture }
                : require('../../assets/banner.png')
            }
            style={styles.banner}
          />
        </View>
        <View style={styles.infoActionContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {communityData?.communityName || 'Community Name'}
              </Text>
              <Text style={styles.bio}>
                {communityData?.communityDescription || 'Community bio'}
              </Text>
            </View>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreate}>
              <MaterialIcons
                name="add"
                size={20}
                color="#000"
                style={styles.addIcon}
              />
              <Text style={styles.create}>Create</Text>
            </TouchableOpacity>
            {isAdmin ? (
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={handleSettingsPress}>
                <Text style={styles.settings}>Settings</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={handleJoinPress}>
                <Text style={styles.join}>Join</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
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
  infoActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  nameContainer: {
    padding: 10,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1E8ED',
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 100,
    marginRight: 10,
  },
  joinButton: {
    backgroundColor: '#E1E8ED',
    paddingVertical: 6,
    paddingHorizontal: 25,
    borderRadius: 100,
    borderColor: '#000',
    borderWidth: 1,
  },
  join: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#E1E8ED',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 100,
    borderColor: '#000',
    borderWidth: 1,
  },
  settings: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  create: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ViewCommunity;
