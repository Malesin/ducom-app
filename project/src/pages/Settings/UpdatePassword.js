import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'react-native';

const serverUrl = config.SERVER_URL;

const UpdatePassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyNewPassword, setVerifyNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showVerifyNewPassword, setShowVerifyNewPassword] = useState(false);
  const colorScheme = useColorScheme();

  const validatePassword = password => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
    return passwordRegex.test(password);
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !verifyNewPassword) {
      setError('All fields are required.');
    } else if (!validatePassword(newPassword)) {
      setError('Password must be between 8 and 15 characters and include at least one letter and one number.');
    } else if (newPassword !== verifyNewPassword) {
      setError('New passwords do not match.');
    } else {
      setError('');
      try {
        const token = await AsyncStorage.getItem('token'); // Assuming token is stored in AsyncStorage
        const response = await axios.post(`${serverUrl}/changepassword`, {
          oldPassword,
          newPassword,
          token,
        });

        if (response.data.status === 'ok') {
          console.log('Success', 'Password updated successfully');
          setSuccessMessage('Password updated successfully');
          setError('');
          setTimeout(() => {
            navigation.navigate('Settings');
          }, 2000);
        } else {
          console.error('Error', response.data.data);
          setError(response.data.data);
        }
      } catch (error) {
        console.error('Error:', error, 'An error occurred while updating the password');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Old Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Please enter current password"
            secureTextEntry={!showOldPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowOldPassword(!showOldPassword)}
          >
            <Icon
              name={showOldPassword ? 'eye' : 'eye-off'}
              size={18}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Please enter new password"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Icon
              name={showNewPassword ? 'eye' : 'eye-off'}
              size={18}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verify New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Please verify new password"
            secureTextEntry={!showVerifyNewPassword}
            value={verifyNewPassword}
            onChangeText={setVerifyNewPassword}
            placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowVerifyNewPassword(!showVerifyNewPassword)}
          >
            <Icon
              name={showVerifyNewPassword ? 'eye' : 'eye-off'}
              size={18}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={() => navigation.navigate('Forgotpass')}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00137F',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    textAlign: 'left',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eyeIcon: {
    marginRight: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  passwordInput: {
    flex: 1,
  },
});
