import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
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
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
                  navigation.navigate('Home');
                }, 1000); // Delay 1 detik sebelum navigasi
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
                }, 1000); // Delay 1 detik sebelum navigasi
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
                }, 1000); // Delay 1 detik sebelum navigasi
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
            secureTextEntry={!showPassword} // Toggle password visibility based on state
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => {
              setIsChecked(!isChecked);
              setShowPassword(!showPassword); // Update showPassword state
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

export default Signinscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  input: {
    width: '80%',
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    margin: 12,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    padding: 10,
  },
  eyeIcon: {
    marginRight: 10,
  },
  buttonLogin: {
    width: '80%',
    height: 50,
    backgroundColor: '#001374',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textLogin: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassLink: {
    color: '#000000',
    marginTop: 20,
  },
  signupText: {
    color: '#000',
    fontSize: 14,
    marginTop: 20,
  },
  signupLink: {
    color: '#0a3e99',
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
