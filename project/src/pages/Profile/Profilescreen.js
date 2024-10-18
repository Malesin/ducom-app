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
const verifiedIcon = <Icon name="verified" size={20} color="#699BF7" />;

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
      console.log('Token Retrieved Successfully');

      const userResponse = await axios.post(`${serverUrl}/userdata`, {
        token: token,
      });
      console.log('Data Retrieved Successfully');

      const user = userResponse.data.data;
      setUserData(user);

      if (user.bannerPicture) {
        const banner = { uri: user.bannerPicture };
        setBanner(banner);
        console.log('Image Banner Retrieved Successfully');
      }

      if (user.profilePicture) {
        const profile = { uri: user.profilePicture };
        setProfilePicture(profile);
        console.log('Image Profile Retrieved Successfully');
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

  const handleDropdownItemPress = item => {
    if (item === 'Need Help') {
      navigation.navigate('FAQ');
    } else {
      if (item === 'Settings and Support') {
        navigation.navigate('Settings');
      }
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
          <MaterialCommunityIcons name="dots-vertical" size={30} color="#000" />
        </TouchableOpacity>
        {dropdownVisible && (
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View style={styles.dropdownOverlay}>
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDropdownItemPress('Need Help')}>
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
                  onPress={() => handleDropdownItemPress('Settings and Support')}>
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

                  <Text style={styles.name}>
                    {userData?.name}
                  </Text>
                  {userData?.isAdmin ? (<Text style={styles.verifiedIcon}>{verifiedIcon}</Text>) : null}
                </View>

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
  editButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1E8ED',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20,
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
