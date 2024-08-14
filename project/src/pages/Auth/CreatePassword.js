import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from 'react-native-alert-notification';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const CreatePassword = ({navigation}) => {
  const [password, setPassword] = useState(''); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const route = useRoute();
  const {email} = route.params;

  const handleContinue = async () => {
    if (!password || !confirmPassword) {
      setError('Password and Confirm Password are required.');
    } else if (password.length < 8 || password.length > 15) {
      setError('Password must be between 8 and 15 characters.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      try {
        const response = await axios.post(`${serverUrl}/change-password`, {
          email,
          newPassword: password,
        });
        if (response.data.status === 'ok') {
          console.log('Password updated successfully');
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: ' Password successfully updated! ',
            onHide: () => {
              Dialog.hide();
              setTimeout(() => {
                navigation.navigate('Signin');
              }, 1000); // Delay 1 detik sebelum navigasi
            },
          });
          setTimeout(() => {
            Dialog.hide(); // Hide the dialog if it doesn't already
          }, 3000); // Duration to show the dialog
        } else if (response.data.status === 'errorPassSame') {
          setError('New password cannot be same as old password');
        } else {
          setError(response.data.data);
        }
      } catch (error) {
        setError('Failed to update password. Please try again.');
      }
    }
  };

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            Create a password with at least 8 and at most 15 characters. You’ll
            need this password to log in into your account.
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="New Password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={styles.buttonForgot}
            onPress={handleContinue}>
            <Text style={styles.textForgot}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  innerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 60,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    backgroundColor: '#ECECEC',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
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
