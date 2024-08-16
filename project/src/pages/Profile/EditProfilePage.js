import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
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
  const [isSaving, setIsSaving] = useState('');

  // UNTUK REFRESH DATA
  async function getData() {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    axios
      .post(`${serverUrl}/userdata`, { token: token })
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
        setUsername(res.data.data.username);
      });
  }

  useEffect(() => {
    getData();
  }, []);
  // UNTUK REFRESH DATA
  const validateUsername = (username) => {
    const usernameRegex = /^[a-z0-9]{4,15}$/;
    return usernameRegex.test(username) && !username.includes(' ');
  };
  useEffect(() => {
    const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
      if (isSaving) {
        return; // Jika sedang menyimpan, jangan tampilkan alert
      }

      e.preventDefault();
      Alert.alert(
        'Konfirmasi',
        'Apakah anda ingin membatalkan perubahan?',
        [
          {
            text: 'Tidak', style: 'cancel', onPress: () => {
            }
          },
          {
            text: 'Ya', onPress: () => {
              setUsername(userData.username);
              setName(userData.name);
              setBio(userData.bio);
              navigation.dispatch(e.data.action);
            }
          },
        ]
      );
    });

    return beforeRemoveListener;
  }, [navigation, userData, isSaving]);


  const handleSave = () => {
    setIsSaving(true); // Set isSaving to true while saving
    Alert.alert('Confirmation', 'Do you want to save the changes?', [
      { text: 'No', style: 'cancel', onPress: () => setIsSaving(false) }, // Reset isSaving if canceled
      {
        text: 'Yes',
        style: 'default',
        onPress: async () => {
          try {
            if (!username) {
              Toast.show({
                type: 'error',
                text1: 'Invalid username',
                text2: 'Username cannot be empty!.',
              });
              return;
            } else if (!validateUsername(username)) {
              Toast.show({
                type: 'error',
                text1: 'Invalid username',
                text2: '4-15 char, lowercase letters & numbers only with no spaces.',
              });
              return;
            }

            const token = await AsyncStorage.getItem("token");
            const updatedUserData = {
              token: token,
            };

            if (name && name !== userData.name) {
              updatedUserData.name = name;
            }
            if (username && username !== userData.username) {
              // Check if the username already exists
              const checkUsernameResponse = await axios.post(`${serverUrl}/check-username`, { username });
              if (checkUsernameResponse.data.status === 'error') {
                setIsSaving(true);
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Username already exists!',
                });
                return; // Stop further execution if username is already taken
              }
              updatedUserData.username = username;
            }
            if (bio && bio !== userData.bio) {
              updatedUserData.bio = bio;
            }

            const response = await axios.post(`${serverUrl}/update-profile`, updatedUserData);

            if (response.data.status === 'ok') {
              setIsSaving(true);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Updated Successfully!!',
                onHide: () => {
                  setTimeout(() => {
                    navigation.goBack();
                  }, 1000);
                },
              });
            } else {
              setIsSaving(true);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An error occurred. Please try again later.',
              });
            }
          } catch (error) {
            setIsSaving(true);
            console.log('Error updating profile: ', error);
            Alert.alert('Error', 'Failed to update profile');
          }
        },
      },
    ]);
  };

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    ),
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bannerContainer}>
          <TouchableOpacity onPress={() => selectImage(setBanner, 'banner')}>
            <ImageBackground
              source={banner || require('../../assets/bannerhitam.png')}
              style={styles.banner}
              resizeMode="cover"
            >
              <View style={styles.overlay}>
                <MaterialCommunityIcons name="camera" size={50} color="#fff" />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={() => selectImage(setProfilePicture, 'profile')}>
            <ImageBackground
              source={profilePicture || require('../../assets/avatar.png')}
              style={styles.profilePicture}
              imageStyle={styles.profilePictureImage}
            >
              <View style={styles.overlay}>
                <MaterialCommunityIcons name="camera" size={30} color="#fff" />
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.usernameContainer}>
            <View style={styles.usernameInputContainer}>
              <Text style={styles.usernameStatic}>@</Text>
              {isEditing ? (
                <TextInput
                  style={styles.usernameInput}
                  value={username} // Username tanpa '@'
                  onChangeText={(text) => setUsername(text)} // Set langsung tanpa replace
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              ) : (
                <Text style={styles.username}>{username}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <MaterialCommunityIcons name="pencil" size={20} color="#000" />
            </TouchableOpacity>
          </View>


          <TextInput
            style={styles.input}
            placeholder={userData?.name}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder={userData?.bio || "Bio"}
            value={bio}
            onChangeText={setBio}
            multiline
          />
          <TextInput style={styles.input} placeholder={userData?.email} />
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    marginLeft: 5, // Memberikan jarak antara @ dan input
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