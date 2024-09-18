import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = config.SERVER_URL;

const AccountInformation = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userResponse = await axios.post(`${serverUrl}/userdata`, {
        token: token,
      });
      const user = userResponse.data.data;
      setUserData(user);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username</Text>
        <View style={styles.infoRow}>
        <Text style={styles.infoText}>
            @{userData ? userData.username : ''}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.infoContainer}>
        <Text style={styles.label}>Phone</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>add</Text>
          <MaterialCommunityIcons name="chevron-right" size={25} color="#000" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.infoContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            {userData ? userData.email : ''}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.infoContainer}
        onPress={() => navigation.navigate('EditProfile')}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Edit Profile</Text>
          <MaterialCommunityIcons name="chevron-right" size={25} color="#000" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  infoContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
});
