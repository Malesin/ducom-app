import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { Skeleton } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
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
  const [isSaving, setIsSaving] = useState('');
  const [newProfileImage, setNewProfileImage] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState(null);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token Retrieved Successfully');

      // Ambil data pengguna
      const userResponse = await axios.post(`${serverUrl}/userdata`, {
        token: token,
      });
      console.log('Data Retrieved Successfully');

      const user = userResponse.data.data;
      setUserData(user);
      setUsername(user.username);

      if (user.bannerPicture) {
        const bannerResponse = await axios.post(
          `${serverUrl}/get-image-banner/${user.bannerPicture}`,
        );
        console.log('Image Banner Retrieved Successfully');
        setBanner({
          uri: `data:image/jpeg;base64,${bannerResponse.data.data.imageBase64}`,
        });
      }

      if (user.profilePicture) {
        const profileResponse = await axios.post(
          `${serverUrl}/get-image-profile/${user.profilePicture}`,
        );
        console.log('Image Profile Retrieved Successfully');
        setProfilePicture({
          uri: `data:image/jpeg;base64,${profileResponse.data.data.imageBase64}`,
        });
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  // UNTUK REFRESH DATA

  const validateUsername = username => {
    const usernameRegex = /^[a-z0-9]{4,15}$/;
    return usernameRegex.test(username) && !username.includes(' ');
  };
  useEffect(() => {
    const beforeRemoveListener = navigation.addListener('beforeRemove', e => {
      if (isSaving) {
        return;
      }

      e.preventDefault();
      Alert.alert('Konfirmasi', 'Apakah anda ingin membatalkan perubahan?', [
        {
          text: 'Tidak',
          style: 'cancel',
          onPress: () => { },
        },
        {
          text: 'Ya',
          onPress: () => {
            setUsername(userData.username);
            setName(userData.name);
            setBio(userData.bio);
            navigation.dispatch(e.data.action);
          },
        },
      ]);
    });

    return beforeRemoveListener;
  }, [navigation, userData, isSaving]);

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    ),
  });

  const handleSave = async () => {
    setIsSaving(true);

    Alert.alert('Confirmation', 'Do you want to save the changes?', [
      { text: 'No', style: 'cancel', onPress: () => setIsSaving(false) },
      {
        text: 'Ya',
        style: 'default',
        onPress: async () => {
          try {
            if (!username) {
              Toast.show({
                type: 'error',
                text1: 'Invalid username',
                text2: 'Username cannot be empty!',
              });
              return;
            } else if (!validateUsername(username)) {
              Toast.show({
                type: 'error',
                text1: 'Username tidak valid',
                text2:
                  '4-15 karakter, hanya huruf kecil dan angka tanpa spasi.',
              });
              return;
            }

            const token = await AsyncStorage.getItem('token');
            const updatedUserData = { token: token };

            if (name && name !== userData.name) {
              updatedUserData.name = name;
            }

            if (username && username !== userData.username) {
              const checkUsernameResponse = await axios.post(
                `${serverUrl}/check-username`,
                { username },
              );
              if (checkUsernameResponse.data.status === 'error') {
                setIsSaving(false);
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Username sudah ada!',
                });
                return;
              }
              updatedUserData.username = username;
            }

            if (bio && bio !== userData.bio) {
              updatedUserData.bio = bio;
            }

            // Upload the new profile image if exists
            if (newProfileImage) {
              const profileFormData = new FormData();
              profileFormData.append('image', {
                uri: newProfileImage.uri,
                name: newProfileImage.fileName,
                type: newProfileImage.type,
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
                uri: newBannerImage.uri,
                name: newBannerImage.fileName,
                type: newBannerImage.type,
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
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Updated Successfully!',
                onHide: () => {
                  setTimeout(() => {
                    navigation.goBack();
                  }, 1000);
                },
              });
            } else {
              setIsSaving(false);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Terjadi kesalahan. Silakan coba lagi nanti.',
              });
            }
          } catch (error) {
            setIsSaving(false);
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
          }
        },
      },
    ]);
  };

  const selectImageProfile = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setNewProfileImage(response.assets[0]); // Store the image temporarily
        setProfilePicture({ uri: response.assets[0].uri });
      }
    });
  };

  const selectImageBanner = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setNewBannerImage(response.assets[0]); // Store the image temporarily
        setBanner({ uri: response.assets[0].uri });
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bannerContainer}>
          {banner || userData ? (
            <TouchableOpacity onPress={() => selectImageBanner()}>
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
          ) : (
            <Skeleton containerStyle={styles.banner} animation="wave" />
          )}
        </View>
        <View style={styles.contentContainer}>
          {profilePicture || userData ? (
            <TouchableOpacity onPress={() => selectImageProfile()}>
              <ImageBackground
                source={
                  profilePicture || require('../../assets/profilepic.png')
                }
                style={styles.profilePicture}
                imageStyle={styles.profilePictureImage}>
                <View style={styles.overlay}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={30}
                    color="#fff"
                  />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ) : (
            <Skeleton containerStyle={styles.profilePicture} animation="wave" />
          )}
          <View style={styles.usernameContainer}>
            <View style={styles.usernameInputContainer}>
              <Text style={styles.usernameStatic}>@</Text>
              {isEditing ? (
                <TextInput
                  style={styles.usernameInput}
                  value={username}
                  onChangeText={text => setUsername(text)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              ) : userData ? (
                <Text style={styles.username}>{username}</Text>
              ) : (
                <Skeleton height={20} width={100} animation="wave" />
              )}
            </View>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <MaterialCommunityIcons name="pencil" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          {userData ? (
            <>
              <TextInput
                style={styles.input}
                placeholder={userData.name}
                value={name}
                onChangeText={text => setName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder={userData.bio || 'Bio'}
                value={bio}
                onChangeText={text => setBio(text)}
                multiline
                maxLength={150}
              />
              <TextInput
                style={styles.input}
                placeholder={userData.email}
                editable={false}
              />
            </>
          ) : (
            <>
              <Skeleton
                height={40}
                width="100%"
                animation="wave"
                containerStyle={styles.input}
              />
              <Skeleton
                height={40}
                width="100%"
                animation="wave"
                containerStyle={styles.input}
              />
              <Skeleton
                height={40}
                width="100%"
                animation="wave"
                containerStyle={styles.input}
              />
            </>
          )}
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    overflow: 'hidden',
  },
  profilePictureImage: {
    borderRadius: 50,
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
  },
  usernameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
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
