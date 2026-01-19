import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import ducomLogo from '../../../assets/logo1.png';

const WelcomeComponent = ({selectedButton, slideAnim, onPressButton}) => {
  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  const slideStyle = {
    transform: [{translateX: slideInterpolation}],
  };

  return (
    <View style={styles.container}>
      <Image source={ducomLogo} style={styles.logo} />

      <Text style={styles.title}>Welcome Dugam Community</Text>

      <Text style={styles.subtitle}>
        Log In or Sign Up to our community.{'\n'}
        Share your ideas, connect with the community,{'\n'}
        and explore in the Ducom App.
      </Text>

      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.buttonBackground, slideStyle]} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => onPressButton('login')}>
          <Text
            style={
              selectedButton === 'login'
                ? styles.buttonTextActive
                : styles.buttonTextInactive
            }>
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onPressButton('register')}>
          <Text
            style={
              selectedButton === 'register'
                ? styles.buttonTextActive
                : styles.buttonTextInactive
            }>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  logo: {
    marginBottom: 20,
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 30,
    overflow: 'hidden',
    width: '80%',
    height: 55,
    position: 'relative',
  },
  buttonBackground: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#001374',
    borderRadius: 30,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  buttonTextActive: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextInactive: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeComponent;
