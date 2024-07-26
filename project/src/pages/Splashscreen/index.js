import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Splashscreen = () => {
  const navigation = useNavigation();
  const [isSplashLoaded, setIsSplashLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashLoaded(true);
    }, 2000); // Splash screen duration

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  useEffect(() => {
    if (isSplashLoaded) {
      // Check if navigation is available before navigating
      if (navigation && navigation.navigate) {
        navigation.navigate('Auth'); // Navigate to 'Auth' or another screen
      }
    }
  }, [isSplashLoaded, navigation]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/logo1.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    height: 130,
    width: 215,
  },
});

export default Splashscreen;
