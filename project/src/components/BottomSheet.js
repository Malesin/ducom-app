import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';

const serverUrl = config.SERVER_URL;

const BottomSheet = () => {
  const [userData, setUserData] = useState(null); // Initialize state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token Retrieved Successfully');

        const userResponse = await axios.post(`${serverUrl}/userdata`, {
          token: token,
        });
        console.log('Data Retrieved Successfully');

        const user = userResponse.data.data;
        setUserData(user); // Update the state with the fetched data
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="volume-off" size={24} color="#333" />
          <Text style={styles.optionText}>Mute @{userData?.username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="delete" size={24} color="#333" />
          <Text style={styles.optionText}>Delete @{userData?.username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="block" size={24} color="#333" />
          <Text style={styles.optionText}>Block @{userData?.username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="report" size={24} color="#333" />
          <Text style={styles.optionText}>Report @{userData?.username}</Text>
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
