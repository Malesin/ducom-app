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
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = config.SERVER_URL;

const AccountInformation = () => {
  const [userData, setUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const navigation = useNavigation();
  const privacyHeight = useRef(new Animated.Value(0)).current;

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userResponse = await axios.post(`${serverUrl}/userdata`, {
        token: token,
      });
      const user = userResponse.data.data;
      setUserData(user);
      setPhoneNumber(user.phoneNumber || '');
      // setIsPrivate(user.isPrivate || false); 
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
        getData(); // Refresh data after saving
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
      getData(); // Refresh data after saving
    } catch (error) {
      ToastAndroid.show('Error occurred while saving phone number.', ToastAndroid.SHORT);
      console.error('Error occurred:', error);
    }
  }

  async function savePrivacySetting() {
    try {
      console.log('Saving privacy setting:', isPrivate); // Tambahkan console.log ini
      // const token = await AsyncStorage.getItem('token');
      // await axios.post(`${serverUrl}/updatePrivacy`, {
      //   token: token,
      //   isPrivate: isPrivate,
      // });
      ToastAndroid.show('Privacy setting updated successfully.', ToastAndroid.SHORT);
    } catch (error) {
      console.log('Error occurred while updating privacy setting:', error); // Tambahkan console.log ini
      ToastAndroid.show('Error occurred while updating privacy setting.', ToastAndroid.SHORT);
      // console.error('Error occurred:', error);
    }
  }

  const togglePrivacy = () => {
    setIsPrivacyExpanded(!isPrivacyExpanded);
    Animated.timing(privacyHeight, {
      toValue: isPrivacyExpanded ? 0 : 50,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleSwitch = () => {
    setIsPrivate((previousState) => !previousState);
    savePrivacySetting();
  };

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
      <TouchableOpacity style={styles.infoContainer} onPress={() => setIsEditing(true)}>
        <Text style={styles.label}>Phone</Text>
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
          ) : (
            <Text style={styles.infoText}>{phoneNumber || 'add'}</Text>
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
        <Text style={styles.label}>Email</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            {userData ? userData.email : ''}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.infoContainer} onPress={togglePrivacy}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Account Privacy</Text>
          <MaterialCommunityIcons name={isPrivacyExpanded ? "chevron-up" : "chevron-down"} size={25} color="#000" />
        </View>
        <Animated.View style={{ height: privacyHeight, overflow: 'hidden' }}>
          {isPrivacyExpanded && (
            <View style={styles.privacyToggle}>
              <Text style={styles.privacyText}>
                {isPrivate ? 'Private' : 'Public'}
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#001374' }}
                thumbColor={isPrivate ? '#001374' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isPrivate}
              />
            </View>
          )}
        </Animated.View>
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
  privacyToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  privacyText: {
    fontSize: 16,
    color: '#000',
  },
});
