import {
  StyleSheet,
  Text,
  View,
  TextInput, TouchableOpacity,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';;
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const Forgotpassword = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation(); // Get the navigation prop

  const handleContinue = () => {
    // Validation for email or username
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input) {
      setError('Username or Email is required.');
    } else if (!emailRegex.test(input) && input.length < 4) {
      setError('Please enter a valid email address or username.');
    } else {
      setError('');
      // Navigate to the Captcha screen on successful input
      navigation.navigate('Captcha'); // Replace 'Captcha' with the name of your Captcha screen
    }
  };

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

export default Forgotpassword;;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  innerContainer: {
    alignItems: 'center',
  },
  view: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  input: {
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
    alignItems: 'center',
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
