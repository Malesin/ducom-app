import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { Skeleton } from 'react-native-elements';

const serverUrl = config.SERVER_URL;

export default function Profilescreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [banner, setBanner] = useState(false);
  const [profilePicture, setProfilePicture] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);
  const [userData, setUserData] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const getData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token Retrieved Successfully');

      const userResponse = await axios.post(`${serverUrl}/userdata`, {
        token: token,
      });
      console.log('Data Retrieved Successfully');

      const user = userResponse.data.data;
      console.log('User Data:', user); // Tambahkan log ini untuk memastikan data user diambil dengan benar
      setUserData(user);

      if (user.bannerPicture) {
        const banner = { uri: user.bannerPicture };
        setBanner(banner, "banner");
        console.log('Image Banner Retrieved Successfully');
      }

      if (user.profilePicture) {
        const profile = { uri: user.profilePicture };
        setProfilePicture(profile);
        console.log('Image Profile Retrieved Successfully');
      }

      setLoading(false);
      setRefreshing(false); // Stop the refreshing indicator
    } catch (error) {
      console.error('Error occurred:', error);
      setLoading(false);
      setRefreshing(false); // Stop the refreshing indicator if there's an error
    }
  }, []);

  useFocusEffect(getData);

  const onRefresh = () => {
    setRefreshing(true); // Start the refreshing indicator
    getData(); // Fetch the data again
  };

  const openModal = () => {
    setModalImageSource(profilePicture);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalImageSource(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.bannerContainer}>
          {loading ? (
            <Skeleton animation="pulse" height={150} width={'100%'} style={styles.skeletonBanner} />
          ) : (
            <Image
              source={banner || require('../../assets/banner.png')}
              style={styles.banner}
            />
          )}
          <TouchableOpacity style={styles.settingsButton} onPress={() => { }}>
            <MaterialCommunityIcons name="dots-vertical" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={openModal}>
            {loading ? (
              <Skeleton animation="pulse" circle height={82} width={83} style={styles.skeletonProfile} />
            ) : (
              <Image
                source={profilePicture || require('../../assets/profilepic.png')}
                style={styles.profile}
              />
            )}
          </TouchableOpacity>
          <View style={styles.profileText}>
            {loading ? (
              <>
                <Skeleton
                  animation="pulse"
                  height={20}
                  width={150}
                  style={[styles.skeleton, styles.skeletonText]}
                />
                <Skeleton
                  animation="pulse"
                  height={14}
                  width={100}
                  style={[styles.skeleton, styles.skeletonText]}
                />
                <Skeleton
                  animation="pulse"
                  height={13}
                  width={200}
                  style={[styles.skeleton, styles.skeletonText]}
                />
                <Skeleton
                  animation="pulse"
                  height={30}
                  width={120}
                  style={[styles.skeleton, styles.skeletonText]}
                />
              </>
            ) : (
              <>
                <Text style={styles.name}>{userData?.name}</Text>
                <Text style={styles.username}>@{userData?.username}</Text>
                <Text style={styles.description}>
                  {userData?.bio || 'No Description'}
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('EditProfile')}>
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        onRequestClose={closeModal}
        animationType="fade">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {modalImageSource && (
                <Image source={modalImageSource} style={styles.previewImage} />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  bannerContainer: {
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: 150,
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 30,
    padding: 3,
    backgroundColor: 'rgba(217, 217, 217, 0.2)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  profile: {
    width: 83,
    height: 82,
    borderRadius: 40,
    marginRight: 20,
    marginBottom: 30,
  },
  profileText: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  username: {
    fontSize: 14,
    color: '#00c5ff',
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    color: '#000',
  },
  editButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1E8ED',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '90%',
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  skeleton: {
    marginBottom: 10,
  },
  skeletonBanner: {
    marginBottom: 20,
  },
  skeletonProfile: {
    marginBottom: 30,
    marginTop: 10,
  },
  skeletonText: {
    marginLeft: 10,
  },
});