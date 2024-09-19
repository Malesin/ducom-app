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
import {Skeleton} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

export default function EditProfilePage() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [banner, setBanner] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(true);
  const [nameError, setNameError] = useState('');
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token Retrieved Successfully');

      const userResponse = await axios.post(`${serverUrl}/userdata`, {token});
      console.log('Data Retrieved Successfully');

      const user = userResponse.data.data;
      setUserData(user);
      setUsername(user.username);

      if (user.bannerPicture) {
        const banner = {uri: user.bannerPicture};
        setBanner(banner);
        console.log('Image Banner Retrieved Successfully');
      }

      if (user.profilePicture) {
        const profile = {uri: user.profilePicture};
        setProfilePicture(profile);
        console.log('Image Profile Retrieved Successfully');
      }
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
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
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}> Save </Text>
      </TouchableOpacity>
    ),
  });

  const handleSave = async () => {
    setIsSaving(true);
    let hasError = false; // Tambahkan variabel untuk melacak error

    if (!username) {
        console.log('Error: Username tidak boleh kosong');
        hasError = true; // Tandai ada error
    } else if (!validateUsername(username)) {
        console.log('Invalid username. Must be 4-15 characters long, lowercase letters and numbers only, with no spaces.');
        hasError = true; // Tandai ada error
    }

    // Validasi nama
    if (name && name !== userData?.name && !validateName(name)) {
        setNameError('Name can only contain letters and spaces, and must be up to 40 characters long.');
        hasError = true; // Tandai ada error
    } else {
        setNameError(''); // Hapus error jika valid
    }

    // Validasi bio
    if (bio && bio.length > 150) {
        console.log('Error: Bio tidak boleh lebih dari 150 karakter');
        hasError = true; // Tandai ada error
    }

    if (hasError) {
        setIsSaving(false);
        return; // Hentikan eksekusi jika ada error
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const updatedUserData = {token: token};

      if (name && name !== userData?.name) {
        updatedUserData.name = name;
      }

      if (username && username !== userData?.username) {
        // Cek apakah username sudah digunakan
        const checkUsernameResponse = await axios.post(
          `${serverUrl}/check-username`,
          {username},
        );
        if (checkUsernameResponse.data.status === 'error') {
          console.log('Error: Username sudah diambil');
          setIsSaving(false);
          return;
        }
        updatedUserData.username = username;
      }

      if (bio && bio !== userData?.bio) {
        updatedUserData.bio = bio;
      }

      // Upload the new profile image if exists
      if (newProfileImage) {
        const profileFormData = new FormData();
        profileFormData.append('image', {
          uri: newProfileImage.path,
          name: newProfileImage.filename || 'profile.jpg',
          type: newProfileImage.mime,
        });
        profileFormData.append('token', token);

        await axios.post(
          `${serverUrl}/upload-image-profile`,
          profileFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }

      // Upload the new banner image if exists
      if (newBannerImage) {
        const bannerFormData = new FormData();
        bannerFormData.append('image', {
          uri: newBannerImage.path,
          name: newBannerImage.filename || 'banner.jpg',
          type: newBannerImage.mime,
        });
        bannerFormData.append('token', token);

        await axios.post(
          `${serverUrl}/upload-image-banner`,
          bannerFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }

      const response = await axios.post(
        `${serverUrl}/update-profile`,
        updatedUserData,
      );

      if (response.data.status === 'update') {
        console.log('Data berhasil diubah');
        navigation.goBack();
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
      console.error('Error updating profile:', error);
      console.log('Error: Failed to update profile');
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
          {isBannerLoading ? (
            <Skeleton
              containerStyle={[styles.banner, {height: 500}]}
              animation="wave"
            />
          ) : (
            <TouchableOpacity onPress={selectImageBanner}>
              <ImageBackground
                source={banner || require('../../assets/banner.png')}
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
              containerStyle={[styles.profilePicture, {height: 150}]}
              animation="wave"
            />
          ) : (
            <TouchableOpacity onPress={selectImageProfile}>
              <ImageBackground
                source={
                  profilePicture || require('../../assets/profilepic.png')
                }
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
                <Skeleton height={30} width={100} animation="wave" />
              ) : isEditing ? (
                <TextInput
                  style={styles.usernameInput}
                  value={username}
                  onChangeText={text => setUsername(text)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  maxLength={15}
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
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.textInput}
              placeholder={userData?.name}
              placeholderTextColor={
                colorScheme === 'dark' ? '#cccccc' : '#888888'
              }
              autoCapitalize="none"
              maxLength={40}
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={styles.textInput}
              placeholder={userData?.bio || 'Bio'}
              placeholderTextColor={
                colorScheme === 'dark' ? '#cccccc' : '#888888'
              }
              autoCapitalize="none"
              multiline
              maxLength={150}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={userData?.email}
              placeholderTextColor={
                colorScheme === 'dark' ? '#cccccc' : '#888888'
              }
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
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
      backgroundColor: '#00137F',
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
