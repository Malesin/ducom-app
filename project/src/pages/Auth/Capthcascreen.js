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

const Capthcascreen = () => {
  const [code, setCode] = useState(''); // Renamed to 'code' for clarity
  const [error, setError] = useState('');
  const navigation = useNavigation(); // Get the navigation prop

  const handleContinue = () => {
    // Validation for 6-digit code
    if (code.length !== 6) {
      setError('Please enter a 6-digit code.');
    } else {
      setError('');
      // Navigate to the next screen on successful input
      navigation.navigate('CreatePassword');
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
          onChangeText={setCode}
          value={code}
          placeholder="Enter Code"
          keyboardType="numeric"
          autoCapitalize="none"
          maxLength={6} // Limit input length to 6 digits
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.buttonForgot} onPress={handleContinue}>
          <Text style={styles.textForgot}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.hyperlink}>Generate New Code</Text>
        </TouchableOpacity>
      </View>
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
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
