import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const Capthcascreen = ({ navigation }) => {
  const route = useRoute();
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60); // Hitungan mundur 60 detik
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(3); // Maksimal 3 kali

  const handleVerifyOtp = async () => {
    console.log("Verifying OTP:", otp);
    try {
      const response = await axios
        .post(`${serverUrl}/verify-otp`, { email, otp });
      console.log("Verify OTP Response:", response.data);
      if (response.data.status === 'ok') {
        console.log("OTP verified successfully");
        setError('');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'OTP verified successfully',
          onHide: () => {
            setTimeout(() => {
              navigation.navigate('CreatePassword', { email });
            }, 1000); // Delay 1 detik sebelum navigasi
          },
        })
      } else if (response.data.status === 'errorExpired') {
        setError('OTP expired. Try to resend the code.');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error("Error in verifying OTP:", error);
      setError('Error verifying OTP. Please try again.');
    }
  };

  useEffect(() => {
    let interval;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsButtonDisabled(false); // Enable button after countdown
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');

    // Jika timer lebih dari 1 jam, tampilkan format hh:mm:ss
    if (seconds >= 3600) {
      return `${h}:${m}:${s}`;
    } else {
      // Jika kurang dari 1 jam, tampilkan format mm:ss
      return `${m}:${s}`;
    }
  };

  const handleReCode = async () => {
    if (attemptsLeft > 0 && !isButtonDisabled) {
      setIsButtonDisabled(true);
      setTimer(60); // Reset timer to 60 seconds (1 minute)
      setAttemptsLeft(attemptsLeft - 1);

      try {
        const response = await axios
          .post(`${serverUrl}/forgot-password`, { email });
        console.log("OTP Response:", response.data);
        if (response.data.status === 'ok') {
          console.log("Sending OTP to email:", email);
          setError('');
        }
      } catch (error) {
        console.error("Error in sending OTP:", error);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Error in sending OTP',
          autoClose: 1000,
        })
      }
    } else if (attemptsLeft === 0) {
      Alert.alert('Kesempatan Habis', 'Waktu tunggu 1 jam sebelum mencoba lagi.');
      setIsButtonDisabled(true);
      setTimer(3600); // Set timer to 1 hour (3600 seconds)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>
          We sent a code to your email. Enter that code to confirm your account
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={setOtp}
          value={otp}
          placeholder="Enter Code"
          keyboardType="numeric"
          autoCapitalize="none"
          maxLength={6}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.buttonForgot} onPress={handleVerifyOtp}>
          <Text style={styles.textForgot}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReCode} disabled={isButtonDisabled}>
          <Text style={styles.hyperlink}>
            {isButtonDisabled ? `(${formatTime(timer)}) ` : ''}Resend Code OTP
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default Capthcascreen;

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
    padding: 10,
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
  hyperlink: {
    color: '#001374',
    marginTop: 20,
  },
});
