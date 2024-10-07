import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
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
  const [isCheckedPass, setIsCheckedPass] = useState(false); // State for checkbox
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Perbaikan deklarasi useState
  const route = useRoute();
  const {email} = route.params;
  const colorScheme = useColorScheme(); // Detect light or dark mode

  const validatePassword = password => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
    return passwordRegex.test(password);
  };

  const handleContinue = async () => {
    setIsButtonDisabled(true); // Disable the button immediately
    if (!password || !confirmPassword) {
      setError('Password and Confirm Password are required.');
      setIsButtonDisabled(false); // Re-enable the button if validation fails
    } else if (!validatePassword(password)) {
      setError('Password must be between 8 and 15 characters and include at least one letter and one number.');
      setIsButtonDisabled(false); // Re-enable the button if validation fails
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsButtonDisabled(false); // Re-enable the button if validation fails
    } else if (!isCheckedPass) {
      setError('You must confirm the password change.');
      setIsButtonDisabled(false); // Re-enable the button if validation fails
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
            textBody: 'Password updated successfully',
            onHide: () => {
              setTimeout(() => {
                Dialog.hide(); // Hide the dialog
                navigation.navigate('Signin');
              }, 1000);
            },
          });
          setTimeout(() => {
            Dialog.hide(); // Hide the dialog if it doesn't already
          }, 3000); // Duration to show the dialog
        } else if (response.data.status === 'errorPassSame') {
          setError('New password cannot be same as old password');
          setIsButtonDisabled(false); // Re-enable the button if validation fails
        } else {
          setError(response.data.data);
          setIsButtonDisabled(false); // Re-enable the button if validation fails
        }
      } catch (error) {
        setError('Failed to update password. Please try again.');
        setIsButtonDisabled(false); // Re-enable the button if there is an error
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
              style={[
                styles.input,
                { color: colorScheme === 'dark' ? '#000000' : '#000000' } // Adjust text color based on theme
              ]}
              onChangeText={setPassword}
              value={password}
              placeholder="New Password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'} // Adjust placeholder text color based on theme
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
              style={[
                styles.input,
                { color: colorScheme === 'dark' ? '#000000' : '#000000' } // Adjust text color based on theme
              ]}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'} // Adjust placeholder text color based on theme
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
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setIsCheckedPass(!isCheckedPass)}>
              <Icon
                name={isCheckedPass ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color="#000000"
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              I'm sure to change the password
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.buttonForgot,
              (isButtonDisabled || !isCheckedPass) && styles.disabledButton, // Add disabled style
            ]}
            onPress={handleContinue}
            disabled={isButtonDisabled || !isCheckedPass}>
            <Text style={[
              styles.textForgot,
              (isButtonDisabled || !isCheckedPass) && styles.disabledText, // Add disabled text style
            ]}>
              Continue
            </Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    margin: 12,
  },
  checkboxLabel: {
    marginLeft: 6,
    fontSize: 14,
    color: '#000',
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
  disabledText: {
    opacity: 0.5, // Reduce the opacity to visually indicate disabled state
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Change background color to indicate disabled state
  },
});