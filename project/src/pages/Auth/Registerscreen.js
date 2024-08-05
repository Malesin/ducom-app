import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // Lowercase letters and numbers only, 4-15 characters
    return usernameRegex.test(username) && !username.includes(' '); // No spaces
  };

  const validateName = (name) => {
    const nameRegex = /^[a-z0-9]{4,15}$/;
    return nameRegex.test(name);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = () => {
    const newErrors = {};
    let valid = true;

    if (!name) {
      newErrors.name = 'Name cannot be empty';
      valid = false;
    } else if (!validateName(name)) {
      newErrors.name = 'Can only use letters of the alphabet and a maximum of 45 letters.';
      valid = false;
    }

    if (!username) {
      newErrors.username = 'Username cannot be empty';
      valid = false;
    } else if (!validateUsername(username)) {
      newErrors.username = 'Invalid username. Must be 4-15 characters long, lowercase letters and numbers only, with no spaces.';
      valid = false;
    }

    if (!email) {
      newErrors.email = 'Email cannot be empty';
      valid = false;
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password cannot be empty';
      valid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be more than 8 - 15 characters and character combinations.';
      valid = false;
    }

    if (!isCheckedTerms) {
      Toast.show({
        type: 'info',
        text1: 'Terms and Conditions',
        text2: 'You must agree to the terms and conditions to register.',
      });
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const userData = { name, username, email, password };

      setTimeout(() => {
        axios
          .post(`${serverUrl}/register`, userData)
          .then(res => {
            const { status } = res.data;
            switch (status) {
              case "ok":
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Registered Successfully!!',
                  onHide: () => {
                    setTimeout(() => {
                      navigation.navigate('Signin');
                    }, 1500);
                  }
                });
                break;
              case "alreadyUser":
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: "User Already Exists!!",
                });
                break;
              case "alreadyEmail":
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: "Email Already Exists!!",
                });
                break;
              default:
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'An error occurred. Please try again later.',
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
      }, 1000); // Delay 1 detik
    }
  };


  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.errorInput : null]}
          onChangeText={text => setName(text.slice(0, 40))}
          value={name}
          placeholder="Name"
          autoCapitalize="none"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        <TextInput
          style={[styles.input, errors.username ? styles.errorInput : null]}
          onChangeText={text => setUsername(text.slice(0, 15))}
          value={username}
          placeholder="Username"
          autoCapitalize="none"
        />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        <TextInput
          style={[styles.input, errors.email ? styles.errorInput : null]}
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <View style={[styles.passwordContainer, errors.password ? styles.errorInput : null]}>
          <TextInput
            style={styles.passwordInput}
            onChangeText={text => setPassword(text.slice(0, 25))}
            value={password}
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? "visibility" : "visibility-off"} size={18} color="#000000" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            onChangeText={setConfirmPassword}
            value={confirmpassword}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon name={showConfirmPassword ? "visibility" : "visibility-off"} size={18} color="#000000" />
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setIsCheckedTerms(!isCheckedTerms)}
          >
            <Icon name={isCheckedTerms ? "check-box" : "check-box-outline-blank"} size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>I agree to the <Text style={styles.termslink} onPress={() => navigation.navigate('Termsandcondition')}>terms and conditions</Text></Text>
        </View>
        <TouchableOpacity style={styles.buttonSignup} onPress={handleSignup}>
          <Text style={styles.textSignUp}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>Already signed up? <Text style={styles.loginLink} onPress={() => navigation.navigate('Signin')}>Log In</Text></Text>
      </ScrollView>
      <Toast />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    color: '#000',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    margin: 12,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    color: '#000',
    fontSize: 14,
  },
  buttonSignup: {
    width: '80%',
    height: 50,
    backgroundColor: '#0a3e99',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textSignUp: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termslink: {
    color: '#0a3e99',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  errorText: {
    color: 'red',
    width: '80%',
    textAlign: 'left',
    marginBottom: 10,
  },
  loginLink: {
    color: '#0a3e99',
    fontWeight: 'bold',
  },
  loginText: {
    color: '#000',
    fontSize: 14,
    marginTop: 20,
  },
  errorInput: {
    borderColor: 'red',
  },
});

export default RegisterScreen;
