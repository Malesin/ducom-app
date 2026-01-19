import React from 'react';
import ducomLogo from '../../../assets/logo1.png';
import {View, Image, StyleSheet} from 'react-native';

const SplashscreenComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image style={styles.logo} source={ducomLogo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 130,
    width: 215,
  },
});

export default SplashscreenComponent;
