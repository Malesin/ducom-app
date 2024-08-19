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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native';
import {Skeleton} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';

const serverUrl = config.SERVER_URL;

export default function EditProfilePage() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [banner, setBanner] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false); // Track if there are any changes

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${serverUrl}/userdata`, {
        token: token,
      });
      setUserData(response.data.data);
      setUsername(response.data.data.username);
      setName(response.data.data.name);
      setBio(response.data.data.bio);
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const beforeRemoveListener = navigation.addListener('beforeRemove', e => {
      if (isSaving || !hasChanges) {
        return;
      }

      e.preventDefault();
      Alert.alert('Konfirmasi', 'Apakah anda ingin membatalkan perubahan?', [
        {
          text: 'Tidak',
          style: 'cancel',
          onPress: () => {},
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
  }, [navigation, userData, isSaving, hasChanges]);

  const handleSave = () => {
    setIsSaving(true);
    Alert.alert('Konfirmasi', 'Apakah Anda ingin menyimpan perubahan?', [
      {text: 'Tidak', style: 'cancel', onPress: () => setIsSaving(false)},
      {
        text: 'Ya',
        style: 'default',
        onPress: async () => {
          try {
            if (!username) {
              Toast.show({
                type: 'error',
                text1: 'Username tidak valid',
                text2: 'Username tidak boleh kosong!',
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
            const updatedUserData = {token};
            if (name && name !== userData.name) {
              updatedUserData.name = name;
            }
            if (username && username !== userData.username) {
              const checkUsernameResponse = await axios.post(
                `${serverUrl}/check-username`,
                {username},
              );
              if (checkUsernameResponse.data.status === 'error') {
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

            const response = await axios.post(
              `${serverUrl}/update-profile`,
              updatedUserData,
            );

            if (response.data.status === 'ok') {
              Toast.show({
                type: 'success',
                text1: 'Berhasil',
                text2: 'Perubahan berhasil disimpan!',
                onHide: () => {
                  setTimeout(() => {
                    navigation.goBack();
                  }, 1000);
                },
              });
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Terjadi kesalahan. Silakan coba lagi nanti.',
              });
            }
          } catch (error) {
            console.log('Error updating profile: ', error);
            Alert.alert('Error', 'Gagal memperbarui profil');
          } finally {
            setIsSaving(false);
          }
        },
      },
    ]);
  };

  const validateUsername = username => {
    const usernameRegex = /^[a-z0-9]{4,15}$/;
    return usernameRegex.test(username) && !username.includes(' ');
  };

  const handleInputChange = (setter, value) => {
    setter(value);
    setHasChanges(true); // Mark as edited when user changes input
  };

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    ),
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bannerContainer}>
          {banner || userData ? (
            <TouchableOpacity onPress={() => selectImage(setBanner, 'banner')}>
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
            <TouchableOpacity
              onPress={() => selectImage(setProfilePicture, 'profile')}>
              <ImageBackground
                source={profilePicture || require('../../assets/profile.png')}
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
                  onChangeText={text => handleInputChange(setUsername, text)}
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
                onChangeText={text => handleInputChange(setName, text)}
              />
              <TextInput
                style={styles.input}
                placeholder={userData.bio || 'Bio'}
                value={bio}
                onChangeText={text => handleInputChange(setBio, text)}
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
