import React, {useState, useEffect, useCallback, useRef} from 'react';
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
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import {Skeleton} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
      const userResponse = await axios.post(`${serverUrl}/userdata`, {token});
      const user = userResponse.data.data;

      // delay 3 detik sebelum mengatur data
      setTimeout(() => {
        setUserData(user);

        if (user.bannerPicture) {
          setBanner({uri: user.bannerPicture});
        }
        if (user.profilePicture) {
          setProfilePicture({uri: user.profilePicture});
        }
      }, 1000);
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
    } else if (item === 'Settings and Support') {
      navigation.navigate('Settings');
    }
    toggleDropdown();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        onPress={dropdownVisible ? toggleDropdown : null}>
        <View style={styles.container}>
          <ScrollView>
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
                  color="#000"
                />
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
                        onPress={() =>
                          handleDropdownItemPress('Settings and Support')
                        }>
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
                      source={
                        profilePicture || require('../../assets/profilepic.png')
                      }
                      style={styles.profile}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    {!userData ? (
                      <>
                        <Skeleton
                          animation="pulse"
                          height={18}
                          width={30}
                          style={[styles.skeleton, {borderRadius: 3}]}
                        />
                        <Skeleton
                          animation="pulse"
                          height={14}
                          width={60}
                          style={[styles.skeleton, {borderRadius: 3}]}
                        />
                      </>
                    ) : (
                      <>
                        <Text style={styles.statNumber}>
                          {userData?.postCount || 0}
                        </Text>
                        <Text style={styles.statLabel}>Posts</Text>
                      </>
                    )}
                  </View>
                  <View style={styles.statItem}>
                    {!userData ? (
                      <>
                        <Skeleton
                          animation="pulse"
                          height={18}
                          width={30}
                          style={[styles.skeleton, {borderRadius: 3}]}
                        />
                        <Skeleton
                          animation="pulse"
                          height={14}
                          width={60}
                          style={[styles.skeleton, {borderRadius: 3}]}
                        />
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Follow', {
                              username: userData?.username,
                            })
                          }>
                          <Text style={styles.statNumber}>
                            {userData ? userData?.followers.length : 0}
                          </Text>
                          <Text style={styles.statLabel}>Followers</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                  <View style={styles.statItem}>
                    {!userData ? (
                      <>
                        <Skeleton
                          animation="pulse"
                          height={18}
                          width={30}
                          style={[styles.skeleton, {borderRadius: 3}]}
                        />
                        <Skeleton
                          animation="pulse"
                          height={14}
                          width={60}
                          style={[styles.skeleton, {borderRadius: 3}]}
                        />
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Follow', {
                              username: userData?.username,
                            })
                          }>
                          <Text style={styles.statNumber}>
                            {userData ? userData?.following.length : 0}
                          </Text>
                          <Text style={styles.statLabel}>Following</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.userInfoWrapper}>
                <View style={styles.userInfoContainer}>
                  <View style={styles.nameContainer}>
                    {!userData ? (
                      <Skeleton
                        animation="pulse"
                        height={20}
                        width={150}
                        style={[styles.skeleton, {borderRadius: 3}]}
                      />
                    ) : (
                      <Text style={styles.name}>{userData?.name}</Text>
                    )}
                  </View>
                  {!userData ? (
                    <Skeleton
                      animation="pulse"
                      height={14}
                      width={100}
                      style={[styles.skeleton, {borderRadius: 3}]}
                    />
                  ) : (
                    <View style={styles.usernameContainer}>
                      <Text style={styles.username}>@{userData?.username}</Text>
                      {userData?.isAdmin && (
                        <Icon name="verified" size={18} color="#699BF7" />
                      )}
                    </View>
                  )}
                  {!userData ? (
                    <Skeleton
                      animation="pulse"
                      height={13}
                      width={200}
                      style={[styles.skeleton, {borderRadius: 3}]}
                    />
                  ) : (
                    <Text style={styles.description}>
                      {userData?.bio || 'No Description'}
                    </Text>
                  )}
                </View>
                {!userData ? (
                  <Skeleton
                    animation="pulse"
                    height={28}
                    width={120}
                    borderRadius={14}
                    style={[
                      styles.skeleton,
                      {marginRight: 14, borderRadius: 3},
                    ]}
                  />
                ) : (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => navigation.navigate('EditProfile')}>
                      <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
                        <Image
                          source={modalImageSource}
                          style={styles.previewImage}
                        />
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
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
    padding: 5,
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  profileInfoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  userInfoContainer: {
    flex: 1,
    paddingVertical: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  verifiedIcon: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  username: {
    fontSize: 14,
    color: '#00c5ff',
  },
  description: {
    fontSize: 13,
    color: '#000',
  },
  buttonContainer: {
    width: 120,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: '#E1E8ED',
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
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
    top: 50,
    right: 10,
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
});
