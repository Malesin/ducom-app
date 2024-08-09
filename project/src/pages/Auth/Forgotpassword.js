import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation

const Forgotpassword = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Enter your Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={setInput}
          value={input}
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
