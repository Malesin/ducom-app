import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  Alert,
  useColorScheme,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import config from '../../config';
import Toast from 'react-native-toast-message';
import {Skeleton} from 'react-native-elements';

const serverUrl = config.SERVER_URL;
const defaultBanner = require('../../assets/banner.png');
const defaultProfilePicture = require('../../assets/profilepic.png');

export default function EditProfilePage() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [banner, setBanner] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [newProfileImage, setNewProfileImage] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(true);
  const [nameError, setNameError] = useState('');
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [isDataChanged, setIsDataChanged] = useState(false);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userResponse = await axios.post(`${serverUrl}/userdata`, {token});
      const user = userResponse.data.data;
      setUserData(user);
      setUsername(user.username);

      if (user.bannerPicture) {
        const banner = {uri: user.bannerPicture};
        setBanner(banner);
      }

      if (user.profilePicture) {
        const profile = {uri: user.profilePicture};
        setProfilePicture(profile);
      } else {
        setProfilePicture(defaultProfilePicture);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to retrieve data',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (banner) {
      setIsBannerLoading(false);
    }
  }, [banner]);

  useEffect(() => {
    if (profilePicture) {
      setIsProfilePictureLoading(false);
    }
  }, [profilePicture]);

  useEffect(() => {
    const checkDataChanged = () => {
      const dataChanged = 
        (name && name !== userData?.name) ||
        (username && username !== userData?.username) ||
        (bio && bio !== userData?.bio) ||
        newProfileImage ||
        newBannerImage;
      setIsDataChanged(dataChanged);
    };

    checkDataChanged();
  }, [name, username, bio, newProfileImage, newBannerImage, userData]);

  const validateUsername = username => {
    const usernameRegex = /^[a-z0-9]{4,15}$/;
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]|\\:;"'<>,.?/~`]/;
    if (specialCharRegex.test(username)) {
      return false;
    }
    return usernameRegex.test(username) && !username.includes(' ');
  };
  const validateName = name => {
    const nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
    return nameRegex.test(name) && name.length <= 40;
  };


  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: isDataChanged ? '#001374' : '#ccc' },
        ]}
        onPress={isDataChanged ? handleSave : null}
        disabled={!isDataChanged}
      >
        <Text style={[styles.saveButtonText, { color: '#fff' }]}> Save </Text>
      </TouchableOpacity>
    ),
  });


  const handleSave = async () => {
    let hasError = false;

     if (!validateUsername(username)) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2:
        'Must be 4-15 characters long, lowercase letters and numbers only.',
    });
    hasError = true;
    } 

    if (name && name !== userData?.name && !validateName(name)) {
      setNameError('Name can only contain letters and spaces, and must be up to 40 characters long.');
      hasError = true;
    } else {
      setNameError('');
    }

    if (bio && bio.length > 150) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const isDataChanged = 
      (name && name !== userData?.name) ||
      (username && username !== userData?.username) ||
      (bio && bio !== userData?.bio) ||
      newProfileImage ||
      newBannerImage;

    if (!isDataChanged) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const updatedUserData = {token: token};

      if (name && name !== userData?.name) {
        updatedUserData.name = name;
      }

      if (username && username !== userData?.username) {
        const checkUsernameResponse = await axios.post(`${serverUrl}/check-username`, {username});
        if (checkUsernameResponse.data.status === 'error') {
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: 'User name is already taken',
          });
          return;
        }
        updatedUserData.username = username;
      }

      if (bio && bio !== userData?.bio) {
        updatedUserData.bio = bio;
      }

      if (newProfileImage) {
        const profileFormData = new FormData();
        profileFormData.append('image', {
          uri: newProfileImage.path,
          name: newProfileImage.filename || 'profile.jpg',
          type: newProfileImage.mime,
        });
        profileFormData.append('token', token);

        await axios.post(`${serverUrl}/upload-image-profile`, profileFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (newBannerImage) {
        const bannerFormData = new FormData();
        bannerFormData.append('image', {
          uri: newBannerImage.path,
          name: newBannerImage.filename || 'banner.jpg',
          type: newBannerImage.mime,
        });
        bannerFormData.append('token', token);

        await axios.post(`${serverUrl}/upload-image-banner`, bannerFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      const response = await axios.post(`${serverUrl}/update-profile`, updatedUserData);

      if (response.data.status === 'update') {
        console.log('Updating new data');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Updating new data',
        });
        setTimeout(() => {
          navigation.goBack();
        }, 2500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update profile',
      });
    }
  };

  const MAX_IMAGE_SIZE_MB = 5;

  const selectImageProfile = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: true,
    })
      .then(image => {
        if (image.size / 1024 / 1024 > MAX_IMAGE_SIZE_MB) {
          Alert.alert('Error', 'Image size exceeds 5 MB.');
          return;
        }
        console.log('New profile image selected:', image);
        setNewProfileImage(image);
        setProfilePicture({uri: image.path});
      })
      .catch(error => {
        console.error('Error selecting image:', error);
      });
  };


  const selectImageBanner = () => {
    ImagePicker.openPicker({
      width: 1600,
      height: 900,
      cropping: true,
      mediaType: 'photo',
      avoidEmptySpaceAroundImage: true,
    })
      .then(image => {
        if (image.size / 1024 / 1024 > MAX_IMAGE_SIZE_MB) {
          Alert.alert('Error', 'Image size exceeds 5 MB.');
          return;
        }
        console.log('New banner image selected:', image);
        setNewBannerImage(image);
        setBanner({uri: image.path});
      })
      .catch(error => {
        console.error('Error selecting image:', error);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bannerContainer}>
          {isLoading ? (
            <Skeleton
              animation="pulse"
              height={200}
              width="100%"
            />
          ) : (
            <TouchableOpacity onPress={selectImageBanner}>
              <ImageBackground
                source={banner.uri ? banner : defaultBanner}
                style={styles.banner}
                resizeMode="cover">
                <View style={styles.overlay}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={50}
                    color="#fff"
                  />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentContainer}>
          {isProfilePictureLoading ? (
            <Skeleton
              animation="pulse"
              height={120}
              width={120}
              style={{borderRadius: 60, marginBottom: 20}}
            />
          ) : (
            <TouchableOpacity onPress={selectImageProfile}>
              <ImageBackground
                source={profilePicture.uri ? profilePicture : defaultProfilePicture}
                style={styles.profilePicture}
                imageStyle={styles.profileImage}
                resizeMode="cover">
                <View style={styles.profileOverlay}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={30}
                    color="#fff"
                  />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}

          <View style={styles.usernameContainer}>
            <View style={styles.usernameInputContainer}>
              <Text style={styles.usernameStatic}> @</Text>
              {isLoading ? (
                <Skeleton
                  animation="pulse"
                  height={30}
                  width={100}
                  style={{borderRadius: 5}}
                />
              ) : isEditing ? (
                <TextInput
                  style={[styles.usernameInput, {borderRadius: 5, color: colorScheme === 'dark' ? '#000000' : '#000000'}]}
                  value={username}
                  onChangeText={text => setUsername(text)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  maxLength={15}
                  placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'}
                />
              ) : (
                <Text style={styles.username}> {username} </Text>
              )}
            </View>
            {!isLoading && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <MaterialCommunityIcons name="pencil" size={17} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            {isLoading ? (
              <Skeleton
                animation="pulse"
                height={40}
                width="100%"
                style={{borderRadius: 10}}
              />
            ) : (
              <TextInput
                value={name}
                style={[styles.textInput, {color: colorScheme === 'dark' ? '#000000' : '#000000'}]}
                onChangeText={setName}
                placeholder={userData?.name}
                placeholderTextColor={
                  colorScheme === 'dark' ? '#cccccc' : '#888888'
                }
                autoCapitalize="none"
                maxLength={40}
              />
            )}
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            {isLoading ? (
              <Skeleton
                animation="pulse"
                height={40}
                width="100%"
                style={{borderRadius: 10}}
              />
            ) : (
              <TextInput
              value={bio}
              onChangeText={setBio}
              style={[styles.textInput, {color: colorScheme === 'dark' ? '#000000' : '#000000'}]}
              placeholder={userData?.bio || 'Bio'}
              placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'}
              autoCapitalize="none"
              multiline
              maxLength={150}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            {isLoading ? (
              <Skeleton
                animation="pulse"
                height={40}
                width="100%"
                style={{borderRadius: 10}}
              />
            ) : (
              <TextInput
                style={[styles.textInput, {color: colorScheme === 'dark' ? '#000000' : '#000000'}]}
                placeholder={userData?.email}
                placeholderTextColor={
                  colorScheme === 'dark' ? '#cccccc' : '#888888'
                }
                editable={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}


const getStyles = colorScheme => {
  const currentTextColor = colorScheme === 'dark' ? '#888888' : '#888888';
  return StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingBottom: 20,
    },
    bannerContainer: {
      width: '100%',
      height: 200,
      marginBottom: 20,
    },
    banner: {
      width: '100%',
      height: '100%',
    },
    profilePicture: {
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: 'hidden',
      marginBottom: 20,
    },
    profileImage: {
      borderRadius: 60,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    profileOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 60,
      zIndex: 1,
    },
    contentContainer: {
      width: '100%',
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    usernameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 25,
    },
    usernameInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    usernameStatic: {
      fontSize: 18,
      fontWeight: 'bold',
      color: currentTextColor,
    },
    usernameInput: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 5,
      borderBottomWidth: 1,
      borderColor: '#ccc',
      color: currentTextColor,
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 5,
      color: currentTextColor,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      width: '100%',
    },
    errorText: {
      color: 'red',
      marginTop: 5,
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
  });
};