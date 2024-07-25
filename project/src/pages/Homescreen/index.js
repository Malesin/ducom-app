import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
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
      .post("http://10.224.21.22:5001/userdata", { token: token })
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.contentText}>Welcome to the Home Screen!</Text>
        <TouchableOpacity style={styles.buttonContainer}>
          <MaterialCommunityIcons name="plus" size={40} color="#fff"/>
        </TouchableOpacity>
      </ScrollView>
        <Text style={styles.contentText}>Hi, {userData.name}</Text>
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
  }
});