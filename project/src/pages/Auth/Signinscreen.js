import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const Signinscreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const colorScheme = useColorScheme(); // Detect light or dark mode

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.navigate('Home');
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    console.log("clicked")
    let valid = true;
    if (email === '') {
      setEmailError('Email cannot be empty');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password === '') {
      setPasswordError('Password cannot be empty');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      const userData = {
        email: email,
        password,
      };
      axios
        .post(`${serverUrl}/login-user`, userData)
        .then(res => {
          console.log(res.data);
          if (res.data.status === 'ok') {
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Login Successfully!!',
              onHide: () => {
                setTimeout(() => {
                  navigation.navigate('Home'); // Direct to Home
                }, 1000);
              },
            });

            AsyncStorage.setItem('token', res.data.data);
          } else if (res.data.status === 'error') {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: "Email or User Doesn't Exist!!",
              onHide: () => {
                setTimeout(() => {
                  navigation.navigate('Signin');
                }, 1000);
              },
            });
          } else if (res.data.status === 'errorPass') {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Incorrect Password',
              onHide: () => {
                setTimeout(() => {
                  navigation.navigate('Signin');
                }, 1000);
              },
            });
          }
        })
        .catch(e => {
          console.log(e);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'An error occurred. Please try again later.',
          });
        });
    }
  };

  const handlePasswordChange = text => {
    setPassword(text.slice(0, 25));
  };

  const styles = getStyles(colorScheme); // Get styles based on color scheme

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          style={[styles.input, emailError ? styles.errorInput : null]}
          onChangeText={setEmail}
          value={email}
          placeholder="Email or Username"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'} // Adjust placeholder text color based on theme
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <View
          style={[
            styles.passwordContainer,
            passwordError ? styles.errorInput : null,
          ]}>
          <TextInput
            style={styles.passwordInput}
            onChangeText={handlePasswordChange}
            value={password}
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            placeholderTextColor={
              colorScheme === 'dark' ? '#cccccc' : '#888888'
            } // Adjust placeholder text color based on theme
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => {
              setIsChecked(!isChecked);
              setShowPassword(!showPassword);
            }}>
            {isChecked ? (
              <Icon name="visibility" size={18} color="#000000" />
            ) : (
              <Icon name="visibility-off" size={18} color="#000000" />
            )}
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
          <Text style={styles.textLogin}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Forgotpass')}>
          <Text style={styles.forgotPassLink}>Forgot Password?</Text>
        </TouchableOpacity>
        <Text style={styles.signupText}>
          Don’t have an account?
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('Register')}>
            {' '}
            Sign Up
          </Text>
        </Text>
      </View>
      <Toast />
    </>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff', // Tetap putih untuk kedua mode
      padding: 16,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#000000', // Tetap hitam untuk kedua mode
    },
    input: {
      width: '80%',
      height: 50,
      margin: 12,
      borderWidth: 1,
      borderColor: '#dcdcdc', // Tetap abu-abu untuk kedua mode
      borderRadius: 5,
      padding: 10,
      backgroundColor: '#f5f5f5', // Tetap abu-abu terang untuk kedua mode
      color: '#000000', // Tetap hitam untuk kedua mode
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      margin: 12,
      borderWidth: 1,
      borderColor: '#dcdcdc', // Tetap abu-abu untuk kedua mode
      borderRadius: 5,
      backgroundColor: '#f5f5f5', // Tetap abu-abu terang untuk kedua mode
    },
    passwordInput: {
      flex: 1,
      height: 50,
      padding: 10,
      color: '#000000', // Tetap hitam untuk kedua mode
    },
    eyeIcon: {
      marginRight: 10,
    },
    buttonLogin: {
      width: '80%',
      height: 50,
      backgroundColor: '#001374', // Tetap biru untuk kedua mode
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    textLogin: {
      color: '#fff', // Tetap putih untuk kedua mode
      fontSize: 18,
      fontWeight: 'bold',
    },
    forgotPassLink: {
      color: '#000000', // Tetap hitam untuk kedua mode
      marginTop: 20,
    },
    signupText: {
      color: '#000000', // Tetap hitam untuk kedua mode
      fontSize: 14,
      marginTop: 20,
    },
    signupLink: {
      color: '#0a3e99', // Tetap biru untuk kedua mode
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      width: '80%',
      textAlign: 'left',
      marginBottom: 10,
    },
    errorInput: {
      borderColor: 'red',
    },
  });

export default Signinscreen;
