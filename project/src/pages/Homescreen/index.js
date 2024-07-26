import { StyleSheet, ScrollView, View, Text, TouchableOpacity, BackHandler, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import Header from './../../components/header';
import Footer from '../../components/footer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ALERT_TYPE, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {

  const [userData, setUserData] = useState("")
  async function getData() {
    const token = await AsyncStorage.getItem("token")
    console.log(token)
    axios
      .post("http://192.168.137.44:5001/userdata", { token: token })
      .then(res => {
        console.log(res.data)
        setUserData(res.data.data)
        // UNTUK CONTOH PENGAPLIKASIAN DATANYA = {userData.name}
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
      ])
    return true
  }

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress)

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress)

      }
    })
  )

  useEffect(() => {

    getData()

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
          removeToken
          console.log(removeToken);
          navigation.navigate('Auths');
        },
      },
      ])
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.contentText}>Welcome to the Home Screen!</Text>
        <Text style={styles.contentText}>Hi, {userData.name}</Text>
        <TouchableOpacity style={styles.buttonContainer}>
          <MaterialCommunityIcons name="plus" size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.contentText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  )
}

export default HomeScreen

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

  buttonContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#001374',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
});