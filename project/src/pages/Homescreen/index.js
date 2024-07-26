import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import Header from './../../components/header';
import Footer from '../../components/footer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {

  const [userData, setUserData] = useState({ name: 'Guest' }); 

  async function getData() {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        console.log(token);
        const response = await axios.post("http://10.224.21.21:5001/userdata", { token: token });
        console.log(response.data);
        setUserData(response.data.data || { name: 'Guest' }); 
      } else {
        console.log("No token found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.contentText}>Welcome to the Home Screen!</Text>
        <Text style={styles.contentText}>Hi, {userData.name}</Text>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.buttonContainer}>
            <MaterialCommunityIcons name="plus" size={40} color="#fff"/>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
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
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#001374',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center', // Fixed to center
  },
});
