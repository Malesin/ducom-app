import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Switch,
  Animated,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import config from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Skeleton } from 'react-native-elements';

const serverUrl = config.SERVER_URL;

const AccountInformation = () => {
  const [userData, setUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userResponse = await axios.post(`${serverUrl}/userdata`, {
        token: token,
      });
      const user = userResponse.data.data;
      setUserData(user);
      setPhoneNumber(user.phoneNumber || '');
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async function savePhone() {
    if (phoneNumber === '') {
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.post(`${serverUrl}/svPhoneNumber`, {
          token: token,
          phoneNumber: phoneNumber,
        });
        ToastAndroid.show('Phone number cleared successfully.', ToastAndroid.SHORT);
        setIsEditing(false);
        getData(); 
      } catch (error) {
        ToastAndroid.show('Error occurred while clearing phone number.', ToastAndroid.SHORT);
        console.error('Error occurred:', error);
      }
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      ToastAndroid.show('Phone number must be between 10 and 15 digits and contain only numbers.', ToastAndroid.SHORT);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${serverUrl}/svPhoneNumber`, {
        token: token,
        phoneNumber: phoneNumber,
      });
      ToastAndroid.show('Phone number saved successfully.', ToastAndroid.SHORT);
      setIsEditing(false);
      getData(); 
    } catch (error) {
      ToastAndroid.show('Error occurred while saving phone number.', ToastAndroid.SHORT);
      console.error('Error occurred:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        {userData ? (
          <Text style={styles.label}>Username</Text>
        ) : (
          <Skeleton animation="pulse" height={16} width={80} style={styles.skeleton} />
        )}
        <View style={styles.infoRow}>
          {userData ? (
            <Text style={styles.infoText}>@{userData.username}</Text>
          ) : (
            <Skeleton animation="pulse" height={20} width={100} style={styles.skeleton} />
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.infoContainer} onPress={() => setIsEditing(true)}>
        {userData ? (
          <Text style={styles.label}>Phone</Text>
        ) : (
          <Skeleton animation="pulse" height={16} width={80} style={styles.skeleton} />
        )}
        <View style={styles.infoRow}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.infoText}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder={phoneNumber}
                autoFocus={true}
              />
            </>
          ) : userData ? (
            <Text style={styles.infoText}>{phoneNumber || 'add'}</Text>
          ) : (
            <Skeleton animation="pulse" height={20} width={100} style={styles.skeleton} />
          )}
          {isEditing ? (
            <TouchableOpacity style={styles.saveButtonInline} onPress={savePhone}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <MaterialCommunityIcons name="chevron-right" size={25} color="#000" />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.infoContainer}>
        {userData ? (
          <Text style={styles.label}>Email</Text>
        ) : (
          <Skeleton animation="pulse" height={16} width={80} style={styles.skeleton} />
        )}
        <View style={styles.infoRow}>
          {userData ? (
            <Text style={styles.infoText}>{userData.email}</Text>
          ) : (
            <Skeleton animation="pulse" height={20} width={150} style={styles.skeleton} />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.infoContainer}
        onPress={() => navigation.navigate('EditProfile')}>
        <View style={styles.infoRow}>
          {userData ? (
            <Text style={styles.label}>Edit Profile</Text>
          ) : (
            <Skeleton animation="pulse" height={16} width={100} style={styles.skeleton} />
          )}
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
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButtonInline: {
    backgroundColor: '#001374',
    paddingHorizontal: 18,
    borderRadius: 50,
    paddingVertical: 7,
  },
  skeleton: {
    borderRadius: 3,
    marginBottom: 10,
  },
});
