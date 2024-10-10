import axios from 'axios';
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import config from '../../config';
const serverUrl = config.SERVER_URL;

export default function AdminSettings() {
  // const [areAdmins, setAreAdmins] = useState([]);

  // async function getData() {
  //   const token = await AsyncStorage.getItem('token');
  //   try {
  //     const response = await axios.post(`${serverUrl}/show-admins`, { token: token });
  //     const dataAreAdmins = response.data.data;
  //     setAreAdmins(dataAreAdmins);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text>Admin Settings</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 10,
  }
});
