import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const CommunitySettings = () => {
  const route = useRoute();
  const { communityId } = route.params;
  const [communityData, setCommunityData] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommunityData = async () => {
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
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCommunityData().then(() => setRefreshing(false));
  }, [communityId]);

  useEffect(() => {
    fetchCommunityData();
  }, [communityId]);

  const navigation = useNavigation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [communityName, setCommunityName] = useState(communityData?.communityName);
  const [communityBio, setCommunityBio] = useState(communityData?.communityDescription);
  const [banner, setBanner] = useState('');
  const [newBanner, setNewBanner] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState('');
  const [profileBackground, setProfileBackground] = useState(null);
  const [newProfileBackground, setNewProfileBackground] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);

  useEffect(() => {
    if (communityData) {
      setCommunityName(communityData.communityName || '');
      setCommunityBio(communityData.communityDescription || '');

      setBanner({ uri: communityData.picture?.banner.bannerPicture });
      setProfilePicture({ uri: communityData.picture?.profile.profilePicture });
      setProfileBackground({ uri: communityData.picture?.background.backgroundPicture });
    }
  }, [communityData]);

  const toggleEditing = field => {
    if (field === 'name') {
      setIsEditingName(!isEditingName);
      if (isEditingBio) setIsEditingBio(false);
    } else if (field === 'bio') {
      setIsEditingBio(!isEditingBio);
      if (isEditingName) setIsEditingName(false);
    }
  };

  useEffect(() => {
    if (communityData) {
      const banner = { uri: communityData?.picture.banner.bannerPicture };
      setBanner(banner);

      const profilePicture = { uri: communityData?.picture.profile.profilePicture };
      setProfilePicture(profilePicture);
    }

    const checkDataChanged = () => {
      const dataChanged =
        (communityName && communityName !== communityData?.communityName) ||
        (communityBio && communityBio !== communityData?.communityDescription) ||
        newProfilePicture ||
        newProfileBackground ||
        newBanner;
      setIsDataChanged(dataChanged);
    }
    checkDataChanged()

  }, [newProfilePicture, newProfileBackground, newBanner])


  const selectImageBanner = () => {
    ImagePicker.openPicker({
      width: 1600,
      height: 900,
      cropping: true,
      mediaType: 'photo',
    })
      .then(async image => {
        console.log('Image selected:', image);
        setNewBanner(image)
        setBanner({ uri: image.path });
      })
      .catch(error => {
        console.error('Error selecting image:', error);
      });
  };

  const selectImageProfile = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(async image => {
        console.log('Image selected:', image);
        setNewProfilePicture(image)
        setProfilePicture({ uri: image.path });
      })
      .catch(error => {
        console.error('Error selecting image:', error);
      });
  };

  const selectImageBackground = () => {
    ImagePicker.openPicker({
      width: 900,
      height: 1600,
      cropping: true,
      mediaType: 'photo',
    })
      .then(async image => {
        console.log('Image selected:', image);
        setNewProfileBackground(image)
        setProfileBackground({ uri: image.path });
      })
      .catch(error => {
        console.error('Error selecting image:', error);
      });
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

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: isDataChanged ? '#001374' : '#ccc' },
            ]}
            onPress={isDataChanged ? handleSave : null}
            disabled={!isDataChanged}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        ),
      });
    }, [navigation, isDataChanged]),
  );

  const handleSave = async () => {
    // Logic to save changes
    const communityId = communityData?._id
    const token = await AsyncStorage.getItem('token');

    try {

      if (newBanner) {
        const bannerFormData = new FormData();
        bannerFormData.append('image', {
          uri: newBanner.path,
          name: newBanner.filename || 'banner.jpg',
          type: newBanner.mime,
        });
        bannerFormData.append('token', token);
        bannerFormData.append('communityId', communityId);

        await axios.post(`${serverUrl}/upload-community-banner`, bannerFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (newProfilePicture) {
        try {
          const profileFormData = new FormData();
          profileFormData.append('image', {
            uri: newProfilePicture.path,
            name: newProfilePicture.filename || 'profile.jpg',
            type: newProfilePicture.mime,
          });
          profileFormData.append('token', token);
          profileFormData.append('communityId', communityId);

          await axios.post(`${serverUrl}/upload-community-profile`, profileFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }

      if (newProfileBackground) {
        try {
          const backgroundFormData = new FormData();
          backgroundFormData.append('image', {
            uri: newProfileBackground.path,
            name: newProfileBackground.filename || 'background.jpg',
            type: newProfileBackground.mime,
          });
          backgroundFormData.append('token', token);
          backgroundFormData.append('communityId', communityId);

          await axios.post(`${serverUrl}/upload-community-background`, backgroundFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }


      const response = await axios.post(`${serverUrl}/edit-community`, {
        token,
        communityId,
        communityName: communityName,
        communityDescription: communityBio,
        description: ''
      })

      if (response.data.status === 'ok') {
        console.log('Updating new data');
        navigation.goBack();
      }

      console.log('Saving changes...');
      setIsDataChanged(false);
    } catch (error) {
      console.error('Error Update Data:', error);
    }


  };

  const openModal = imageSource => {
    setModalImageSource(imageSource);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalImageSource(null);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCommunityData();
    }, [communityId])
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.bannerContainer}>
        <TouchableOpacity onPress={() => openModal(banner)}>
          <ImageBackground
            source={banner.uri ? banner : require('../../assets/banner.png')}
            style={styles.banner}
            resizeMode="cover"
            imageStyle={styles.bannerImage}>
            <TouchableOpacity
              style={styles.editIcon}
              onPress={selectImageBanner}>
              <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={() => openModal(profilePicture)}>
                <Image
                  source={profilePicture.uri ? profilePicture : require('../../assets/profilepic.png')}
                  style={styles.avatar} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatarEditIcon}
                onPress={selectImageProfile}>
                <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Account</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            {isEditingName ? (
              <TextInput
                style={styles.infoText}
                value={communityName}
                onChangeText={setCommunityName}
                autoFocus={true}
              />
            ) : (
              <Text style={styles.infoText}>{communityName}</Text>
            )}
            {isEditingName ? (
              <TouchableOpacity
                style={styles.saveButtonInline}
                onPress={() => toggleEditing('name')}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => toggleEditing('name')}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={25}
                  color="#000"
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.label}>Community Name</Text>
        </View>
        <View style={styles.bioContainer}>
          <View style={styles.infoRow}>
            {isEditingBio ? (
              <TextInput
                style={styles.bioText}
                value={communityBio}
                onChangeText={setCommunityBio}
                autoFocus={true}
                multiline={true}
              />
            ) : (
              <Text style={styles.bioText}>{communityBio}</Text>
            )}
            {isEditingBio ? (
              <TouchableOpacity
                style={styles.saveButtonInline}
                onPress={() => toggleEditing('bio')}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => toggleEditing('bio')}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={25}
                  color="#000"
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.label}>Description</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Background</Text>
        <View style={styles.profileBackground}>
          {profileBackground && (
            <ImageBackground
              source={profileBackground}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={selectImageBackground}>
          <MaterialCommunityIcons name="image-outline" size={24} color="#000" />
          <Text style={styles.galleryButtonText}>Select from Gallery</Text>
        </TouchableOpacity>
        <View style={styles.lineSeparator} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Community Rules</Text>
          <TouchableOpacity onPress={toggleDropdown}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={30}
              color="#000"
            />
          </TouchableOpacity>
        </View>
        {dropdownVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                navigation.navigate('CommunityEditRules', { communityData });
                setDropdownVisible(false);
              }}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#000" style={styles.dropdownIcon} />
              <Text style={styles.dropdownItemText}>Edit Rules</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                // Tambahkan logika untuk menghapus aturan di sini
                setDropdownVisible(false);
              }}
            >
              <MaterialCommunityIcons name="delete" size={20} color="red" style={styles.dropdownIcon} />
              <Text style={styles.dropdownItemText}>Delete Rules</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.rulesContainer}>
          {communityData?.rules.map((rule, index) => (
            <View key={rule._id} style={styles.ruleWrapper}>
              <View style={styles.ruleIcon}>
                <Text style={styles.ruleNumber}>{index + 1}</Text>
              </View>
              <View style={styles.ruleTextContainer}>
                <Text style={styles.ruleTitle}>{rule.title}</Text>
                <Text style={styles.ruleDescription}>{rule.description}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.lineSeparator} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Account</Text>
        <TouchableOpacity
          style={styles.userAccountContainer}
          onPress={() => navigation.navigate('CommunityList')}>
          <MaterialCommunityIcons
            name="shield-account"
            size={26}
            color="#000"
          />
          <Text style={styles.userAccountText}>User List</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
              color="#000"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Community</Text>
        </TouchableOpacity>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 17,
  },
  bannerContainer: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  bannerImage: {
    borderRadius: 20,
  },
  editIcon: {
    padding: 10,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -3,
    left: '54%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
  },
  avatar: {
    bottom: -15,
    left: '54%',
    transform: [{ translateX: -50 }],
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    padding: 2,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#001374',
    marginBottom: 2,
  },
  infoContainer: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#686868',
    marginTop: 1,
  },
  bioContainer: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#D9D9D9',
  },
  bioText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  saveButtonInline: {
    backgroundColor: '#001374',
    paddingHorizontal: 15,
    borderRadius: 30,
    paddingVertical: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileBackground: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  galleryButtonText: {
    color: '#000000',
    marginLeft: 8,
  },
  lineSeparator: {
    borderBottomWidth: 4,
    borderBottomColor: '#D9D9D9',
    marginVertical: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 180,
    padding: 10,
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1,
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
  rulesContainer: {
    paddingLeft: 10,
    marginBottom: 10,
  },
  ruleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  ruleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ruleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  ruleTextContainer: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#686868',
  },
  userAccountContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  userAccountText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#B62A2A',
    fontWeight: 'bold',
    fontSize: 17,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 50,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
});

export default CommunitySettings;
