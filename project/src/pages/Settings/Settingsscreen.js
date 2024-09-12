import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const Settingsscreen = ({navigation}) => {
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
          navigation.reset({
            index: 0,
            routes: [{name: 'Auths'}],
          });
          console.log('Logout successfully');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Your Account and Profile</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AccountInformation')}>
          <MaterialCommunityIcons name="account" size={25} color="#000" />
          <Text style={styles.buttonText}>Account Information</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpdatePassword')}>
          <MaterialCommunityIcons name="key-outline" size={25} color="#000" />
          <Text style={styles.buttonText}>Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons
            name="account-cancel"
            size={25}
            color="#000"
          />
          <Text style={styles.buttonText}>Deactivate or Delete Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={styles.section}>
        <Text style={styles.title}>Privacy and Interactions</Text>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons name="cancel" size={25} color="#000" />
          <Text style={styles.buttonText}>Blocked Accounts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons name="volume-off" size={25} color="#000" />
          <Text style={styles.buttonText}>Muted Accounts</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={styles.section}>
        <Text style={styles.title}>Support</Text>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={25}
            color="#000"
          />
          <Text style={styles.buttonText}>Help Center</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={styles.section}>
        <Text style={styles.title}>Log out</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={25} color="#000" />
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settingsscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 25,
    backgroundColor: '#fff',
  },
  section: {
    width: '100%',
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
  separator: {
    width: '100%',
    height: 3,
    backgroundColor: 'lightgray',
    marginVertical: 5,
  },
});
