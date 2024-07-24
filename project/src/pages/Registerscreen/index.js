import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignup = () => {

    let valid = true;
    if (!name) {
      setNameError('Name cannot be empty');
      valid = false;
    } else {
      setNameError('');
    }

    if (!username) {
      setUsernameError('Username cannot be empty');
      valid = false;
    } else {
      setUsernameError('');
    }

    if (!email) {
      setEmailError('Email cannot be empty');
      valid = false;
    } else if (!email.includes('@')) {
      setEmailError('Invalid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;

    if (!password) {
      setPasswordError('Password cannot be empty');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    }
    // else if (password != passwordRegex) {
    //   setPasswordError('passwords must be a combination of letters and numbers');
    //   valid = false;
    // } 
    else {
      setPasswordError('');
    }

    if (password !== confirmpassword) {
      setPasswordError('Passwords do not match');
      valid = false;
    }

    if (valid) {
      const UserData = {
        name: name,
        username: username,
        email,
        password
      }

      axios
        .post("http://192.168.137.44:5001/register", UserData)
        .then(res => {
          console.log(res.data)
          if(res.data.status == "ok"){
            Alert.alert("Registered Successfully!!")
            navigation.navigate('Signin')
          } else {
            Alert.alert(JSON.stringify(res.data))
          }
        })
        .catch(e => console.log(e))
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={[styles.input, nameError ? styles.errorInput : null]}
        onChangeText={setName}
        value={name}
        placeholder="Name"
        autoCapitalize="none"
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      <TextInput
        style={[styles.input, usernameError ? styles.errorInput : null]}
        onChangeText={setUsername}
        value={username}
        placeholder="Username"
        autoCapitalize="none"
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
      <TextInput
        style={[styles.input, emailError ? styles.errorInput : null]}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <View style={[styles.passwordContainer, passwordError ? styles.errorInput : null]}>
        <TextInput
          style={styles.passwordInput}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            setShowPassword(!showPassword);
          }}
        >
          {showPassword && <Text style={styles.checkboxInner}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Show Password</Text>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          onChangeText={setConfirmPassword}
          value={confirmpassword}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            setIsCheckedTerms(!isCheckedTerms);
          }}
        >
          {isCheckedTerms && <Text style={styles.checkboxInner}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I agree to the <Text style={styles.termslink} >terms and conditions</Text></Text>
      </View>
      <TouchableOpacity style={styles.buttonSignup} onPress={handleSignup}>
        <Text style={styles.textSignUp}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>Already signed up? <Text style={styles.loginLink} onPress={() => navigation.navigate('Signin')} >Log In</Text></Text>
    </ScrollView>
  );
};

export default RegisterScreen;

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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    margin: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#dcdcdc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxInner: {
    color: '#000000',
    fontSize: 14,
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
  forgotPassLink: {
    color: '#0a3e99',
    marginTop: 20,
  },
  agreeText: {
    marginTop: 20,
    color: '#000',
    fontFamily: 'arial'
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
    marginTop: 20,
    color: '#000',
    fontSize: 14,
  },
  errorInput: {
    borderColor: 'red',
  },
});
