import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import CheckInternet from '../../components/CheckInternet';

const Authscreen = ({navigation}) => {
  const [selectedButton, setSelectedButton] = useState('login');
  const [slideAnim] = useState(new Animated.Value(0));
  const [isConnected, setIsConnected] = useState(false);

  const handlePress = button => {
    setSelectedButton(button);
    Animated.timing(slideAnim, {
      toValue: button === 'login' ? 0 : 1,
      duration: 650,
      useNativeDriver: true,
    }).start();
    if (button === 'login') {
      navigation.navigate('Signin');
    } else {
      navigation.navigate('Register');
    }
  };

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure want to exit', [
      {
        text: 'cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }),
  );

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // Bisa di adjust sesuai dengan lebar button
  });

  const slideStyle = {
    transform: [{translateX: slideInterpolation}],
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo1.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome Dugam Community</Text>

      <Text style={styles.subtitle}>
        Log In or Sign Up to our community.{'\n'}
        Share your ideas, connect with the community,{'\n'}
        and explore in the Ducom App.
      </Text>

      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.buttonBackground, slideStyle]} />
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={() => handlePress('login')}>
          <Text
            style={
              selectedButton === 'login'
                ? styles.buttonTextLogin
                : styles.buttonTextInactive
            }>
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSignUp}
          onPress={() => handlePress('register')}>
          <Text
            style={
              selectedButton === 'register'
                ? styles.buttonTextSignUp
                : styles.buttonTextInactive
            }>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Authscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontFamily: 'inter',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'inter',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    width: '80%',
    height: 55,
  },
  buttonBackground: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#0a3e99',
    borderRadius: 30,
  },
  buttonLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    flex: 1,
    zIndex: 1,
  },
  buttonSignUp: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    flex: 1,
    zIndex: 1,
  },
  buttonTextLogin: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSignUp: {
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
