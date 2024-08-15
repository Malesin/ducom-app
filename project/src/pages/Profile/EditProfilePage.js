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
  ImageBackground, // Import ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker
import axios from 'axios'; // Import axios untuk melakukan permintaan HTTP
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
const serverUrl = config.SERVER_URL;

// Komponen EditProfilePage digunakan untuk mengedit profil pengguna
export default function EditProfilePage() {
  const navigation = useNavigation();
  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [banner, setBanner] = React.useState(null); // State untuk banner
  const [profilePicture, setProfilePicture] = React.useState(null); // State untuk gambar profil
  const [isEditing, setIsEditing] = React.useState(false);

  const [userData, setUserData] = useState("")
  async function getData() {
    const token = await AsyncStorage.getItem("token")
    console.log(token)
    axios
      .post(`${serverUrl}/userdata`, { token: token })
      .then(res => {
        console.log(res.data)
        setUserData(res.data.data)
        // UNTUK CONTOH PENGAPLIKASIAN DATANYA = {userData.name}
      })
  }

  useEffect(() => {

    getData()

  }, []);

  const user = userData?.username
  const dataUser = user
  const [username, setUsername] = React.useState(`@` + dataUser);

  const initialData = {
    username: ``,
    name: '',
    bio: '',
  };

  // Fungsi untuk validasi username
  const validateUsername = (username) => {
    const usernameRegex = /^[a-z0-9]{4,15}$/;
    return usernameRegex.test(username) && !username.includes(' ');
  };

  // Fungsi untuk menangani penyimpanan perubahan
  const handleSave = () => {
    if (!validateUsername(username)) {
      Alert.alert('Error', 'Username tidak valid.');
      return;
    }
    Alert.alert('Konfirmasi', 'Apakah anda ingin menyimpan perubahan?', [
      { text: 'Tidak', style: 'cancel', onPress: () => { } },
      {
        text: 'Ya',
        style: 'default',
        onPress: () => alert('Perubahan disimpan'),
      },
    ]);
  };

  // Fungsi untuk mengunggah gambar ke backend
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
        setBanner({ uri: response.data.imageUrl });
      } else {
        setProfilePicture({ uri: response.data.imageUrl });
      }
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error) {
      console.log('Upload error: ', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  // Fungsi untuk memilih gambar dari galeri
  const selectImage = (setImage, type) => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
        uploadImage(source, type); // Unggah gambar ke backend
      }
    });
  };

  // Mengatur opsi header saat layout effect
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Listener ini akan memunculkan alert konfirmasi ketika pengguna mencoba meninggalkan halaman
  React.useEffect(() => {
    // Menambahkan listener 'beforeRemove' pada navigasi
    const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault(); // Mencegah navigasi default
      Alert.alert('Konfirmasi', 'Apakah anda ingin membatalkan perubahan?', [
        { text: 'Tidak', style: 'cancel', onPress: () => { } }, // Opsi "Tidak" untuk membatalkan navigasi
        {
          text: 'Ya', // Opsi "Ya" untuk mengonfirmasi pembatalan perubahan
          style: 'destructive',
          onPress: () => {
            setUsername(initialData.username); // Mengatur ulang data ke nilai awal
            setName(initialData.name);
            setBio(initialData.bio);
            navigation.dispatch(e.data.action); // Melanjutkan navigasi
          },
        },
      ]);
    });

    return beforeRemoveListener;
  }, [navigation]);


  console.log(userData?.username)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bannerContainer}>
          <TouchableOpacity onPress={() => selectImage(setBanner, 'banner')}>
            <ImageBackground
              source={banner || require('../../assets/banner.jpeg')}
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
              imageStyle={styles.profilePictureImage} // Menambahkan gaya untuk gambar di dalam ImageBackground
            >
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
                  value={username.replace('@', '') || userData?.username}
                  onChangeText={(text) => setUsername('@' + text.replace('@', ''))}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  maxLength={15} // Batas panjang input
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
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder={userData?.bio || "-"}
            value={bio}
            onChangeText={setBio}
            multiline
          />
          <TextInput style={styles.input} placeholder={userData?.email} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Stylesheet untuk komponen EditProfilePage
const styles = StyleSheet.create({
  container: {
    flex: 1, // Mengatur flexbox agar komponen mengambil seluruh ruang yang tersedia
    backgroundColor: '#fff', // Mengatur warna latar belakang menjadi putih
  },
  scrollContainer: {
    flexGrow: 1, // Mengatur flexbox agar konten dapat tumbuh sesuai dengan isi
    alignItems: 'center', // Mengatur semua item di dalam kontainer agar berada di tengah secara horizontal
  },
  bannerContainer: {
    width: '100%', // Mengatur lebar kontainer banner agar 100% dari lebar layar
    height: 150, // Mengatur tinggi kontainer banner menjadi 150 unit
    marginBottom: 20, // Memberikan margin bawah sebesar 20 unit
  },
  banner: {
    width: '100%', // Mengatur lebar gambar banner agar 100% dari lebar kontainer
    height: '100%', // Mengatur tinggi gambar banner agar 100% dari tinggi kontainer
    justifyContent: 'center', // Mengatur konten di dalam gambar agar berada di tengah secara vertikal
    alignItems: 'center', // Mengatur konten di dalam gambar agar berada di tengah secara horizontal
  },
  overlay: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)', // Mengatur warna latar belakang overlay menjadi abu-abu dengan opasitas 50%
    width: '100%', // Mengatur lebar overlay agar 100% dari lebar kontainer
    height: '100%', // Mengatur tinggi overlay agar 100% dari tinggi kontainer
    justifyContent: 'center', // Mengatur konten di dalam overlay agar berada di tengah secara vertikal
    alignItems: 'center', // Mengatur konten di dalam overlay agar berada di tengah secara horizontal
  },
  contentContainer: {
    width: '100%', // Mengatur lebar kontainer konten agar 100% dari lebar layar
    alignItems: 'center', // Mengatur semua item di dalam kontainer agar berada di tengah secara horizontal
    paddingHorizontal: 20, // Memberikan padding horizontal sebesar 20 unit
  },
  profilePicture: {
    width: 100, // Mengatur lebar gambar profil menjadi 100 unit
    height: 100, // Mengatur tinggi gambar profil menjadi 100 unit
    borderRadius: 50, // Mengatur border radius menjadi 50 unit agar gambar menjadi bulat
    marginBottom: 10, // Memberikan margin bawah sebesar 10 unit
    overflow: 'hidden', // Menambahkan overflow hidden agar border radius bekerja dengan ImageBackground
  },
  profilePictureImage: {
    borderRadius: 50, // Mengatur border radius gambar di dalam ImageBackground
  },
  usernameContainer: {
    flexDirection: 'row', // Mengatur arah flexbox menjadi baris
    alignItems: 'center', // Mengatur semua item di dalam kontainer agar berada di tengah secara vertikal
    marginBottom: 25, // Memberikan margin bawah sebesar 25 unit
  },
  username: {
    fontSize: 18, // Mengatur ukuran font menjadi 18 unit
    fontWeight: 'bold', // Mengatur font menjadi tebal
    marginRight: 10, // Memberikan margin kanan sebesar 10 unit
    marginLeft: 20, // Memberikan margin kiri sebesar 20 unit
  },
  usernameInputContainer: {
    flexDirection: 'row', // Mengatur arah flexbox menjadi baris
    alignItems: 'center', // Mengatur semua item di dalam kontainer agar berada di tengah secara vertikal
  },
  usernameStatic: {
    fontSize: 18, // Mengatur ukuran font menjadi 18 unit
    fontWeight: 'bold', // Mengatur font menjadi tebal
    marginLeft: 20, // Memberikan margin kiri sebesar 20 unit
  },
  usernameInput: {
    fontSize: 18, // Mengatur ukuran font menjadi 18 unit
    fontWeight: 'bold', // Mengatur font menjadi tebal
    marginRight: 10, // Memberikan margin kanan sebesar 10 unit
    borderBottomWidth: 1, // Mengatur lebar border bawah menjadi 1 unit
    borderColor: '#ccc', // Mengatur warna border menjadi abu-abu terang
  },
  input: {
    width: '100%', // Mengatur lebar input agar 100% dari lebar kontainer
    padding: 10, // Memberikan padding sebesar 10 unit
    paddingLeft: 15, // Memberikan padding kiri sebesar 15 unit
    borderWidth: 1, // Mengatur lebar border menjadi 1 unit
    borderColor: '#ccc', // Mengatur warna border menjadi abu-abu terang
    borderRadius: 25, // Mengatur border radius menjadi 25 unit agar sudutnya lebih melengkung
    marginBottom: 20, // Memberikan margin bawah sebesar 20 unit
    backgroundColor: '#EBE9E9', // Mengatur warna latar belakang menjadi #d9d9d9
  },
  saveButton: {
    backgroundColor: '#00137F', // Mengatur warna latar belakang tombol menjadi biru tua
    paddingVertical: 7, // Memberikan padding vertikal sebesar 7 unit
    paddingHorizontal: 18, // Memberikan padding horizontal sebesar 18 unit
    borderRadius: 50, // Mengatur border radius menjadi 50 unit agar sudutnya melengkung
  },
  saveButtonText: {
    color: '#fff', // Mengatur warna teks menjadi putih
    fontWeight: 'bold', // Mengatur font menjadi tebal 
  },
});