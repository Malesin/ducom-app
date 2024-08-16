import React, {useState, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
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
  const [hasChanges, setHasChanges] = useState(false); // Track if there are changes

  const initialData = {
    username: '',
    name: '',
    bio: '',
  };

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios.post(`${serverUrl}/userdata`, {token: token}).then(res => {
      console.log(res.data);
      setUserData(res.data.data);
      setUsername(`@${res.data.data.username}`);
      setName(res.data.data.name);
      setBio(res.data.data.bio);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const beforeRemoveListener = navigation.addListener('beforeRemove', e => {
      if (!hasChanges) {
        return; // No need to show alert if no changes
      }
      e.preventDefault();
      Alert.alert('Konfirmasi', 'Apakah anda ingin membatalkan perubahan?', [
        {text: 'Tidak', style: 'cancel', onPress: () => {}},
        {
          text: 'Ya',
          style: 'destructive',
          onPress: () => {
            setUsername(`@${userData.username}`);
            setName(userData.name);
            setBio(userData.bio);
            navigation.dispatch(e.data.action);
          },
        },
      ]);
    });

    return beforeRemoveListener;
  }, [navigation, userData, hasChanges]);

  const validateUsername = username => {
    const usernameRegex = /^[a-z0-9]{4,15}$/;
    return usernameRegex.test(username) && !username.includes(' ');
  };

  const handleSave = () => {
    if (!validateUsername(username)) {
      Alert.alert('Error', 'Username tidak valid.');
      return;
    }
    Alert.alert('Konfirmasi', 'Apakah anda ingin menyimpan perubahan?', [
      {text: 'Tidak', style: 'cancel', onPress: () => {}},
      {
        text: 'Ya',
        style: 'default',
        onPress: () => {
          setHasChanges(false); // Reset the change tracker after saving
          alert('Perubahan disimpan');
        },
      },
    ]);
  };

  const uploadImage = async (image, type) => {
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    try {
      const response = await axios.post('URL_TO_UPLOAD_IMAGE', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (type === 'banner') {
        setBanner({uri: response.data.imageUrl});
      } else {
        setProfilePicture({uri: response.data.imageUrl});
      }
      Alert.alert('Success', 'Image uploaded successfully');
      setHasChanges(true); // Set change tracker when an image is uploaded
    } catch (error) {
      console.log('Upload error: ', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const selectImage = (setImage, type) => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.assets[0].uri};
        setImage(source);
        uploadImage(source, type);
      }
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bannerContainer}>
          <TouchableOpacity onPress={() => selectImage(setBanner, 'banner')}>
            <ImageBackground
              source={banner || require('../../assets/banner.png')}
              style={styles.banner}
              resizeMode="cover">
              <View style={styles.overlay}>
                <MaterialCommunityIcons name="camera" size={50} color="#fff" />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            onPress={() => selectImage(setProfilePicture, 'profile')}>
            <ImageBackground
              source={profilePicture || require('../../assets/profile.png')}
              style={styles.profilePicture}
              imageStyle={styles.profilePictureImage}>
              <View style={styles.overlay}>
                <MaterialCommunityIcons name="camera" size={30} color="#fff" />
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.usernameContainer}>
            {isEditing ? (
              <View style={styles.usernameInputContainer}>
                <Text style={styles.usernameStatic}>@</Text>
                <TextInput
                  style={styles.usernameInput}
                  value={username.replace('@', '')}
                  onChangeText={text => {
                    const newUsername =
                      '@' + text.replace('@', '').slice(0, 15);
                    setUsername(newUsername);
                    setHasChanges(true); // Mark as changed
                  }}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              </View>
            ) : (
              <Text style={styles.username}>{username}</Text>
            )}
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <MaterialCommunityIcons name="pencil" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder={userData?.name}
            value={name}
            onChangeText={text => {
              setName(text);
              setHasChanges(true); // Mark as changed
            }}
          />
          <TextInput
            style={styles.input}
            placeholder={userData?.bio || '-'}
            value={bio}
            onChangeText={text => {
              setBio(text);
              setHasChanges(true); // Mark as changed
            }}
            multiline
          />
          <TextInput style={styles.input} placeholder={userData?.email} />
        </View>
      </ScrollView>
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
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 20,
  },
  usernameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameStatic: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  usernameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
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
