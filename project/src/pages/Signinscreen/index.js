import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from "axios"

const Signinscreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
      console.log(email, password);
      const userData = {
        email: email,
        password,
      }
      axios
        .post("http://192.168.137.44:5001/login-user", userData)
        .then(res => console.log(res.data))
      // navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container} keyboardShouldPersistTab={"always"}>
      <Text style={styles.title}>Log In</Text>
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
          secureTextEntry={!showPassword} // Toggle password visibility based on state
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => {
            setIsChecked(!isChecked);
            setShowPassword(!showPassword); // Update showPassword state
          }}
        >
          {isChecked ? (
            <Icon name="visibility" size={18} color="#000000" /> // Use visibility icon
          ) : (
            <Icon name="visibility-off" size={18} color="#000000" /> // Use visibility-off icon
          )}
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
        <Text style={styles.textLogin}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Forgotpass')}>
        <Text style={styles.forgotPassLink}>Forgot Password?</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>Don’t have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')} >Sign Up</Text></Text>
    </View>
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
    backgroundColor: '#0a3e99',
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
