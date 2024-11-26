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
  ToastAndroid,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Skeleton } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const Userprofile = ({ userIdPost, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [banner, setBanner] = useState(false);
  const [profilePicture, setProfilePicture] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);
  const [userData, setUserData] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMuted, setIsMuted] = useState();
  const [isBlocked, setIsBlocked] = useState();

  const resetUserData = () => {
    setUserData('');
    setBanner(false);
    setProfilePicture(false);
    setIsFollowing(false);
    setIsMuted(false);
    setIsBlocked(false);

  };

  useFocusEffect(
    useCallback(() => {
      resetUserData();
      getData();
    }, [userIdPost]),
  );

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token Berhasil Diambil');
      const userResponse = await axios.post(`${serverUrl}/findUserId/`, {
        token: token,
        userId: userIdPost,
      });
      const user = userResponse.data.data;
      const idUser = userResponse.data.myId;
      const status = userResponse.data.statusUser;
      const isFollow = user?.followers.some(follow => follow._id === idUser);

      setIsFollowing(isFollow);
      setUserData(user);
      setIsMuted(status.statusMute);
      setIsBlocked(status.statusBlockThis);

      if (user?.username) {
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
  };

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
  const handleDropdownItemPress = async item => {
    try {
      if (item === 'Mute') {
        await muteUser();
      } else if (item === 'Block' || item === 'Unblock') {
        await blockUser();
      } else if (item === 'Report') {
        navigation.navigate('Report', { reportUserId: userIdPost });
      }
    } catch (error) {
      console.error('Error:', error);
    }
    toggleDropdown();
  };

  const handleFollowPress = async () => {
    const updatedFollowersCount = isFollowing
      ? userData.followers.length - 1
      : userData.followers.length + 1;

    setUserData({
      ...userData,
      followers: new Array(updatedFollowersCount).fill(null),
    });

    try {
      setIsFollowing(!isFollowing);

      const token = await AsyncStorage.getItem('token');
      if (isFollowing) {
        const unfollow = await axios.post(`${serverUrl}/unfollow`, {
          token: token,
          unfollowUserId: userIdPost,
        });
        console.log(unfollow.data);
      } else {
        const follow = await axios.post(`${serverUrl}/follow`, {
          token: token,
          followUserId: userIdPost,
        });
        console.log(follow.data);
      }
    } catch (error) {
      setIsFollowing(isFollowing);
      console.error(error);
      ToastAndroid.show('Something Error, Try Again Later', ToastAndroid.SHORT);
    }
  };

  const muteUser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      if (!isMuted) {
        const mute = await axios.post(`${serverUrl}/mute-user`, {
          token: token,
          muteUserId: userIdPost,
        });
        setIsMuted(true);
        ToastAndroid.show('User was successfully muted', ToastAndroid.SHORT);
      } else {
        const unmute = await axios.post(`${serverUrl}/unmute-user`, {
          token: token,
          unmuteUserId: userIdPost,
        });
        setIsMuted(false);
        ToastAndroid.show('User was successfully unmuted', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error:', error);
      ToastAndroid.show('Something Error, Try Again Later.', ToastAndroid.SHORT);
    }
  };

  const blockUser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      if (!isBlocked) {
        // Block user
        const block = await axios.post(`${serverUrl}/block-user`, {
          token: token,
          blockUserId: userIdPost,
        });
        if (block.data.status === 'okBlock') {
          setIsBlocked(true);
          ToastAndroid.show('User was successfully blocked', ToastAndroid.SHORT);
          navigation.goBack();
        }
      } else {
        // Unblock user
        const unblock = await axios.post(`${serverUrl}/unblock-user`, {
          token: token,
          unblockUserId: userIdPost,
        });
        if (unblock.data.status === 'okUnBlock') {
          setIsBlocked(false);
          ToastAndroid.show(
            'User was successfully unblocked',
            ToastAndroid.SHORT,
          );
        }
      }
    } catch (error) {
      console.error('Error:', error);
      ToastAndroid.show('Something Error, Try Again Later.', ToastAndroid.SHORT);
    }
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
                  {isMuted ? (
                    <MaterialIcons name="volume-up" size={20} color="#000" />
                  ) : (
                    <MaterialIcons name="volume-off" size={20} color="#000" />
                  )}
                  <Text style={styles.dropdownItemText}>
                    {isMuted ? 'Unmute' : 'Mute'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() =>
                    handleDropdownItemPress(isBlocked ? 'Unblock' : 'Block')
                  }>
                  <MaterialCommunityIcons
                    name={isBlocked ? "lock-open-variant-outline" : "block-helper"}
                    size={20}
                    color="#000"
                    style={styles.dropdownIcon}
                  />
                  <Text style={styles.dropdownItemText}>
                    {isBlocked ? 'Unblock' : 'Block'}
                  </Text>
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
                    style={[styles.skeleton, { borderRadius: 3 }]}
                  />
                  <Skeleton
                    animation="pulse"
                    height={14}
                    width={60}
                    style={[styles.skeleton, { borderRadius: 3 }]}
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
                    style={[styles.skeleton, { borderRadius: 3 }]}
                  />
                  <Skeleton
                    animation="pulse"
                    height={14}
                    width={60}
                    style={[styles.skeleton, { borderRadius: 3 }]}
                  />
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UserFollow', {
                        username: userData?.username,
                        userId: userIdPost,
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
                    style={[styles.skeleton, { borderRadius: 3 }]}
                  />
                  <Skeleton
                    animation="pulse"
                    height={14}
                    width={60}
                    style={[styles.skeleton, { borderRadius: 3 }]}
                  />
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UserFollow', {
                        username: userData?.username,
                        userId: userIdPost,
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
              <Text style={styles.name}>{userData?.name}</Text>
            </View>
            {!userData ? (
              <Skeleton
                animation="pulse"
                height={14}
                width={100}
                style={[styles.skeleton, { borderRadius: 3 }]}
              />
            ) : (
              <View style={styles.usernameContainer}>
                <Text
                  style={styles.username}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  @{userData?.username}
                </Text>
                {userData?.isAdmin && (
                  <MaterialIcons
                    name="verified"
                    size={18}
                    color="#699BF7"
                    style={styles.verifiedIcon}
                  />
                )}
              </View>
            )}
            {!userData ? (
              <Skeleton
                animation="pulse"
                height={13}
                width={200}
                style={[styles.skeleton, { borderRadius: 3 }]}
              />
            ) : (
              <Text
                style={styles.description}
                numberOfLines={2}
                ellipsizeMode="tail">
                {userData?.bio || 'No Description'}
              </Text>
            )}
          </View>
          {!userData ? (
            <Skeleton
              animation="pulse"
              height={28}
              width={120}
              style={[styles.skeleton, { borderRadius: 20, marginRight: 7 }]}
            />
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  isFollowing && styles.followingButton,
                ]}
                onPress={handleFollowPress}>
                <Text
                  style={[
                    styles.editButtonText,
                    isFollowing && styles.followingButtonText,
                  ]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    paddingHorizontal: 10,
  },
  profile: {
    width: 83,
    height: 82,
    borderRadius: 40,
    marginTop: 10,
    marginLeft: 10,
  },
  profilePictureContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 30,
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
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    flexShrink: 1,
  },
  buttonContainer: {
    width: 120,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: '#001374',
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
  },
  followingButton: {
    backgroundColor: '#E1E8ED',
  },
  followingButtonText: {
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
  skeletonContainer: {
    flex: 1,
    marginRight: 10,
  },
});

export default Userprofile;