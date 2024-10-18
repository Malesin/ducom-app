import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
const verifiedIcon = <Icon name="verified" size={18} color="#699BF7" />;
const serverUrl = config.SERVER_URL;
import AsyncStorage from '@react-native-async-storage/async-storage';

const Userprofile = ({ userIdPost, navigation, tweet }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [banner, setBanner] = useState(false);
  const [profilePicture, setProfilePicture] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);
  const [userData, setUserData] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: '' });
  }, [navigation]);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token Berhasil Diambil');
      const userResponse = await axios.post(`${serverUrl}/findUserId/`, {
        token: token,
        userId: userIdPost,
      });
      const user = userResponse.data.data;
      setUserData(user);

      if (user.username) {
        navigation.setOptions({ title: `@${user.username}` }); 
      }

      if (user.bannerPicture) {
        const banner = { uri: user.bannerPicture };
        setBanner(banner);
        console.log('Banner Berhasil Diambil');
      }

      if (user.profilePicture) {
        const profile = { uri: user.profilePicture };
        setProfilePicture(profile);
        console.log('Foto Profil Berhasil Diambil');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  const openModal = () => {
    setModalImageSource(profilePicture);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalImageSource(null);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDropdownItemPress = item => {
    if (item === 'Report') {
      navigation.navigate('Report');
    }
    console.log(item);
    toggleDropdown();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={banner || require('../../assets/banner.png')}
          style={styles.banner}
        />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={toggleDropdown}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={30}
            color="#000000"
          />
        </TouchableOpacity>
        {dropdownVisible && (
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View style={styles.dropdownOverlay}>
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDropdownItemPress('Mute')}>
                  <MaterialCommunityIcons
                    name="volume-mute"
                    size={20}
                    color="#000"
                    style={styles.dropdownIcon}
                  />
                  <Text style={styles.dropdownItemText}>Mute</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDropdownItemPress('Block')}>
                  <MaterialCommunityIcons
                    name="block-helper"
                    size={20}
                    color="#000"
                    style={styles.dropdownIcon}
                  />
                  <Text style={styles.dropdownItemText}>Block</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDropdownItemPress('Report')}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={20}
                    color="#000"
                    style={styles.dropdownIcon}
                  />
                  <Text style={styles.dropdownItemText}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={openModal}>
            <Image
              source={profilePicture || require('../../assets/profilepic.png')}
              style={styles.profile}
            />
          </TouchableOpacity>
          <View style={styles.profileText}>
            {!userData ? (
              <>
                <Skeleton
                  animation="pulse"
                  height={20}
                  width={150}
                  style={styles.skeleton}
                />
                <Skeleton
                  animation="pulse"
                  height={14}
                  width={100}
                  style={styles.skeleton}
                />
                <Skeleton
                  animation="pulse"
                  height={13}
                  width={200}
                  style={styles.skeleton}
                />
                <Skeleton
                  animation="pulse"
                  height={30}
                  width={120}
                  style={styles.skeleton}
                />
              </>
            ) : (
              <>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{userData?.name}</Text>
                  {userData?.isAdmin ? (<Text style={styles.verifiedIcon}>{verifiedIcon}</Text>) : null}
                </View>
                <Text style={styles.username}>@{userData?.username}</Text>
                <Text style={styles.description}>
                  {userData?.bio || 'No Description'}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: 'rgba(217, 217, 217, 0.4)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 10,
  },
  profile: {
    width: 83,
    height: 82,
    borderRadius: 40,
    marginRight: 20,
    marginBottom: 15,
  },
  profileText: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 150,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  verifiedIcon: {
    marginLeft: 5,
    marginTop: 3
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
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1000,
    padding: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  dropdownItemText: {
    color: '#000',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  dropdownIcon: {
    marginRight: 10,
  },
});

export default Userprofile;
