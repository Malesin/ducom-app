import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Header from './../../components/header';
import Footer from '../../components/footer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {

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

  useEffect(() => {

    getData()

  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>Welcome to the Home Screen!</Text>
        <Text style={styles.contentText}>Hi, {userData.name}</Text>
      </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#000',
  },
});