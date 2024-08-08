import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const Forgotpassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleForgPass = async () => {
    console.log("Sending OTP to email:", email);
    try {
      const response = await axios.post(`${serverUrl}/forgot-password`, { email });
      console.log("OTP Response:", response.data);
      if (response.data.status === 'ok') {
        setIsOtpSent(true);
      }
    } catch (error) {
      console.error("Error in sending OTP:", error);
    }
  };

  const handleVerifyOtp = async () => {
    console.log("Verifying OTP:", otp);
    try {
      const response = await axios.post(`${serverUrl}/verify-otp`, { email, otp });
      console.log("Verify OTP Response:", response.data);
      if (response.data.status === 'ok') {
        // Handle successful OTP verification
        console.log("OTP verified successfully");
        navigation.navigate('Auths')
      }
    } catch (error) {
      console.error("Error in verifying OTP:", error);
    }
  };

  return (
    <View style={styles.view}>
      {!isOtpSent ? (
        <>
          <Text style={styles.title}>Enter your Username or Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleForgPass}>
            <Text style={styles.textButton}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Enter the OTP sent to your email</Text>
          <TextInput
            style={styles.input}
            onChangeText={setOtp}
            value={otp}
            placeholder="OTP"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.textButton}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

export default Forgotpassword;

const styles = StyleSheet.create({
  view: {
    padding: 20,
  },
  title: {
    fontSize: 20,
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
    alignItems: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#0a3e99',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
