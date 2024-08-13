import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Profilescreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);

  // Define the source for the profile image
  const profileImageSource = require('../../assets/profile.png');

  const openModal = () => {
    setModalImageSource(profileImageSource); // Set the image source to the profile image
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalImageSource(null); // Clear the image source when closing the modal
  };

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../assets/banner.jpeg')}
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
          <Text style={styles.name}>SMKN 2 Jakarta</Text>
          <Text style={styles.username}>@dugamofficial_</Text>
          <Text style={styles.description}>
            Sekolah Menengah Kejuruan (SMK) adalah salah satu bentuk satuan
            pendidikan formal yang menyelenggarakan pendidikan kejuruan
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={() => {}}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for image preview */}
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
    </View>
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
    marginBottom: 20,
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
    paddingHorizontal: 20,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    marginBottom: 20,
  },
  profileText: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  username: {
    fontSize: 10,
    color: '#00c5ff',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
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
    fontSize: 11,
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
    borderRadius: 10,
  },
});
