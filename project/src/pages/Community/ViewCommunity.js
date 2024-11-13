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
  const navigation = useNavigation();

  const handleSettingsPress = () => {
    navigation.navigate('CommunitySettings', { communityData: communityData });
  };

  const handleCreate = () => {
    console.log('create');
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
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleSettingsPress}>
              <Text style={styles.settings}>Settings</Text>
            </TouchableOpacity>
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
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1E8ED',
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 100,
    marginLeft: 5,
  },
  create: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  settings: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
});

export default ViewCommunity;
