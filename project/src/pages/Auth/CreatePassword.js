import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';


const CreatePassword = () => {
  const [password, setPassword] = useState(''); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation(); // Get the navigation prop

  const handleContinue = () => {
    // Validation for password fields
    if (!password || !confirmPassword) {
      setError('Password and Confirm Password are required.');
    } else if (password.length < 8 || password.length > 15) {
      setError('Password must be between 8 and 15 characters.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2:
          'Success! Your password has been updated. Please use your new password to log in!!!',
        onHide: () => {
          setTimeout(() => {
            // Navigate to the Signin screen on successful input
            navigation.navigate('Signin');
          }, 1000); // Delay 1 second before navigation
        },
      });
    }
  };

  return (
    <>
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
              secureTextEntry={!showPassword} // Use secureTextEntry for password fields
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)} // Toggle visibility state
            >
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
              secureTextEntry={!showConfirmPassword} // Use secureTextEntry for password fields
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility state
            >
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
    </>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
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
    padding: 10,
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
