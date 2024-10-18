import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { Skeleton } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

const verifiedIcon = <Icon name="verified" size={18} color="#699BF7" />;
const serverUrl = config.SERVER_URL;

export default function Profilescreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [banner, setBanner] = useState(false);
  const [profilePicture, setProfilePicture] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);
  const [userData, setUserData] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userResponse = await axios.post(`${serverUrl}/userdata`, { token });
      const user = userResponse.data.data;
      setUserData(user);

      if (user.bannerPicture) {
        setBanner({ uri: user.bannerPicture });
      }
      if (user.profilePicture) {
        setProfilePicture({ uri: user.profilePicture });
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
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
    if (dropdownVisible) {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleDropdownItemPress = (item) => {
    if (item === 'Need Help') {
      navigation.navigate('FAQ');
    } else if (item === 'Settings and Support') {
      navigation.navigate('Settings');
    }
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
          onPress={toggleDropdown}
        >
          <MaterialCommunityIcons name="dots-vertical" size={30} color="#000" />
        </TouchableOpacity>
        {dropdownVisible && (
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View style={styles.dropdownOverlay}>
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDropdownItemPress('Need Help')}
                >
                  <MaterialCommunityIcons
                    name="information"
                    size={20}
                    color="#000"
                    style={styles.dropdownIcon}
                  />
                  <Text style={styles.dropdownItemText}>Need Help?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDropdownItemPress('Settings and Support')}
                >
                  <MaterialCommunityIcons
                    name="cog"
                    size={20}
                    color="#000"
                    style={styles.dropdownIcon}
                  />
                  <Text style={styles.dropdownItemText}>Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        <View style={styles.profileContainer}>
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity onPress={openModal}>
              <Image
                source={profilePicture || require('../../assets/profilepic.png')}
                style={styles.profile}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{userData?.name}</Text>
              {userData?.isAdmin && (
                <Text style={styles.verifiedIcon}>{verifiedIcon}</Text>
              )}
            </View>
            <Text style={styles.username}>@{userData?.username}</Text>
            <Text style={styles.description}>
              {userData?.bio || 'No Description'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        {/*  */}
        <Modal
          visible={modalVisible}
          transparent
          onRequestClose={closeModal}
          animationType="fade"
        >
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
      </View>
    </SafeAreaView>
  );
}

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
    backgroundColor: 'rgba(217, 217, 217, 0.2)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
  },
  profile: {
    width: 83,
    height: 82,
    borderRadius: 40,
  },
  profileInfoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userInfoContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    marginRight: 5,
  },
  verifiedIcon: {
    marginLeft: 5,
    marginTop: 5,
    marginRight: 5,
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
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 100,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 10,
  },
  editButtonText: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  skeleton: {
    marginBottom: 10,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: '100%',
    height: '100%',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 180,
    elevation: 10,
    padding: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#000',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  profilePictureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
