import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';

const serverUrl = config.SERVER_URL;

const BottomSheet = ({ username, postId }) => {

  const deletePost = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(`${serverUrl}/delete-post`, {
        token: token,
        postId: postId,
      });
  
      if (response.data.status === 'ok') {
        console.log("Postingan Berhasil Dihapus")
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="volume-off" size={24} color="#333" />
          <Text style={styles.optionText}>Mute @{username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.option} onPress={deletePost}>
          <MaterialIcons name="delete" size={24} color="#333" />
          <Text style={styles.optionText}>Delete Post @{username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="block" size={24} color="#333" />
          <Text style={styles.optionText}>Block @{username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="report" size={24} color="#333" />
          <Text style={styles.optionText}>Report @{username}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: 'bold',
  },
});

export default BottomSheet;
