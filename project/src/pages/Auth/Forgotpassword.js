import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const Forgotpassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleContinue = async () => {
    setIsButtonDisabled(true); // Disable the button immediately
    // Validation for email or username
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Username or Email is required.');
      setIsButtonDisabled(false); // Re-enable the button if validation fails
    } else if (!emailRegex.test(email) && email.length < 4) {
      setError('Please enter a valid email address or username.');
      setIsButtonDisabled(false); // Re-enable the button if validation fails
    } else {
      setError('');
      try {
        const response = await axios.post(`${serverUrl}/forgot-password`, { email });
        console.log("OTP Response:", response.data);
        if (response.data.status === 'ok') {
          console.log("Sending OTP to email:", email);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'OTP successfully sent to email',
            onHide: () => {
              setTimeout(() => {
                setIsButtonDisabled(true); // Button stays disabled after success
                navigation.navigate('OTPScreen', { email: email });
              }, 1000); // Delay 1 detik sebelum navigasi
            },
          });
        } else if (response.data.status === 'errorEmail') {
          setError('Email not registered');
          setIsButtonDisabled(false); // Re-enable button if the email is not registered
        }
      } catch (error) {
        console.error("Error in sending OTP:", error);
        setIsButtonDisabled(false); // Re-enable button if there is an error
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Enter your Email</Text>
        <TextInput
          style={styles.email}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter your Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.subtitle}>
          You may receive Gmail notifications from us for security
        </Text>
        <TouchableOpacity
          style={styles.buttonForgot}
          onPress={isButtonDisabled ? null : handleContinue} // Prevent clicking when disabled
          disabled={isButtonDisabled} // Disable the button
        >
          <Text style={[styles.textForgot, isButtonDisabled && styles.disabledText]}>
            {isButtonDisabled ? 'Sent' : 'Send'}
          </Text>
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
  disabledText: {
    opacity: 0.5, // Reduce the opacity to visually indicate disabled state
  },
  error: {
    color: 'red',
    width: '90%',
    textAlign: 'left',
  },
});
