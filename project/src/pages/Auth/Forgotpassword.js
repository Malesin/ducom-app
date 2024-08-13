import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, {useState} from 'react';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const Forgotpassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    // Validation for email or username
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Username or Email is required.');
    } else if (!emailRegex.test(email) && email.length < 4) {
      setError('Please enter a valid email address or username.');
    } else {
      setError('');
      try {
        const response = await axios.post(`${serverUrl}/forgot-password`, {
          email,
        });
        console.log('OTP Response:', response.data);
        if (response.data.status === 'ok') {
          console.log('Sending OTP to email:', email);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'OTP successfully sent to email',
            onHide: () => {
              setTimeout(() => {
                navigation.navigate('Captcha', {email: email});
              }, 1000); // Delay 1 detik sebelum navigasi
            },
          });
        } else if (response.data.status === 'errorEmail') {
          setError('Email not registered');
        }
      } catch (error) {
        console.error('Error in sending OTP:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Enter your Email</Text>
        <TextInput
          style={[styles.email, error ? styles.emailError : null]} // Apply error style conditionally
          onChangeText={setEmail}
          value={email}
          placeholder="Enter your Email Address"
          keyboardType="email-address" // This can be kept as 'email-address' for better UX
          autoCapitalize="none"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.subtitle}>
          You may receive Gmail notifications from us for security
        </Text>
        <TouchableOpacity style={styles.buttonForgot} onPress={handleContinue}>
          <Text style={styles.textForgot}>Continue</Text>
        </TouchableOpacity>
        <Toast />
      </View>
    </SafeAreaView>
  );
};

export default Forgotpassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  innerContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  email: {
    width: '90%',
    height: 60,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#ECECEC',
  },
  emailError: {
    // Error style for the input field
    borderColor: 'red',
  },
  subtitle: {
    color: '#A19F9F',
    fontSize: 14,
  },
  buttonForgot: {
    width: '80%',
    height: 50,
    backgroundColor: '#001374',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textForgot: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    width: '90%',
    textAlign: 'left',
  },
});
