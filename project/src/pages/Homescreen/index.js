import { StyleSheet, ScrollView, View, Text, TouchableOpacity, BackHandler, Alert, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/header';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import config from '../../config'
const serverUrl = config.SERVER_URL

const HomeScreen = ({ navigation }) => {

  const [open, setOpen] = useState(false)
  const [userData, setUserData] = useState("");
  async function getData() {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    axios
      .post(`${serverUrl}/userdata`, { token: token })
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
        if (res.data.status == "error") {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: "Anda Telah Keluar dari Akun",
            onShow: () => {
              setTimeout(() => {
                Dialog.hide();
                navigation.navigate('Signin');
              }, 1500); // MENAMPILKAN TOAST SELAMA 1.5 DETIK
            }
          });
        };
      })
  }

  const handleBackPress = () => {
    Alert.alert(
      'Exit App',
      'Are you sure want to exit',
      [{
        text: 'cancel',
        onPress: () => null,
        style: 'cancel'
      }, {
        text: 'Exit',
        onPress: () => BackHandler.exitApp()
      },
      ]);
    return true;
  }

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      }
    })
  );

  useEffect(() => {
    getData();
  }, []);

  const handleLogout = async () => {
    const removeToken = await AsyncStorage.removeItem('token');
    Alert.alert(
      'Logout Account',
      'Are you sure want to Logout',
      [{
        text: 'cancel',
        onPress: () => null,
        style: 'cancel'
      }, {
        text: 'Exit',
        onPress: () => {
          removeToken;
          console.log(removeToken);
          navigation.navigate('Auths');
        },
      },
      ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header /> */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.contentText}>Welcome to the Home Screen!</Text>
        <Text style={styles.contentText}>Hi, {userData.name}</Text>
        <TouchableOpacity style={styles.buttonLogout} onPress={() => { setOpen(true) }}>
          <Text style={styles.contentText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => console.log('Button pressed')}>
        <MaterialCommunityIcons name="plus" size={50} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  contentText: {
    fontSize: 18,
    color: '#000',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 70,
    height: 70,
    backgroundColor: '#001374',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonLogout: {
    width: 100,
    height: 60,
    backgroundColor: 'red',
    borderRadius: 20,
    textShadowColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    // marginBottom: -40,
    marginTop: -40,
    marginLeft: 1,
  }
});
