import React, {useState, useEffect, useCallback} from 'react';
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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import {Skeleton} from 'react-native-elements';
import TweetCard from '../../components/TweetCard';
import UserTopTabNavigator from '../../navigation/UserTopTabNavigator';

const serverUrl = config.SERVER_URL;

const Userprofile = ({userIdPost}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [banner, setBanner] = useState(false);
  const [profilePicture, setProfilePicture] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);
  const [userData, setUserData] = useState('');

  async function getData() {
    try {
      console.log('Token Berhasil Diambil');

      // Ambil data pengguna lain
      const userResponse = await axios.post(`${serverUrl}/findUserId/`, {
        userId: userIdPost,
      });
      console.log('Data Berhasil Diambil');

      const user = userResponse.data.data;
      setUserData(user);

      if (user.bannerPicture) {
        const banner = {uri: user.bannerPicture};
        setBanner(banner);
        console.log('Banner Berhasil Diambil');
      }

      if (user.profilePicture) {
        const profile = {uri: user.profilePicture};
        setProfilePicture(profile);
        console.log('Foto Profil Berhasil Diambil');
      }
    } catch (error) {
      console.error('Terjadi Kesalahan:', error);
    }
  }
  // Ambil data pengguna saat komponen pertama kali dimuat
  useEffect(() => {
    getData();
  }, []);

  // Ambil data pengguna setiap kali layar menjadi fokus
  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  // Fungsi untuk membuka modal untuk melihat foto profil
  const openModal = () => {
    setModalImageSource(profilePicture);
    setModalVisible(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setModalVisible(false);
    setModalImageSource(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={banner || require('../../assets/banner.png')}
          style={styles.banner}
        />
        <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
          <MaterialCommunityIcons name="dots-vertical" size={30} color="#ddd" />
        </TouchableOpacity>
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
                <Text style={styles.name}>{userData?.name}</Text>
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
    minHeight: 150, // Set minimum height to avoid layout shift
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
});

export default Userprofile;
