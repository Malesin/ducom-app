import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const Settingsscreen = ({ navigation }) => {
  const handleLogout = async () => {
    Alert.alert('Logout Account', 'Are you sure want to Logout', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Logout',

        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.clear();
          navigation.navigate('Auths');
          console.log("Logout successfully");
        },
      },
    ]);
  };

  return (
    <View>
      <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
        <Text style={styles.contentText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settingsscreen;

const styles = StyleSheet.create({
  buttonLogout: {
    width: 100,
    height: 60,
    backgroundColor: 'red',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});
