import React, {useState} from 'react';
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

const serverUrl = config.SERVER_URL;

export default function Profilescreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);
  const [userData, setUserData] = useState(null); // Initialize as null to handle loading state
  const navigation = useNavigation();

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    axios
      .post(`${serverUrl}/userdata`, {token: token})
      .then(res => {
        setUserData(res.data.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

  const profileImageSource = require('../../assets/profile.png');

  const openModal = () => {
    setModalImageSource(profileImageSource);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalImageSource(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../assets/banner.png')}
          style={styles.banner}
        />
        <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
          <MaterialCommunityIcons name="dots-vertical" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={openModal}>
          <Image source={profileImageSource} style={styles.profile} />
        </TouchableOpacity>
        <View style={styles.profileText}>
          {/* Show skeleton while userData is null */}
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
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
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
});
