import React, {useState, useCallback} from 'react';
import {Animated, Alert, BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import WelcomeComponent from './WelcomeComponent';

const WelcomeContainer = ({navigation}) => {
  const [selectedButton, setSelectedButton] = useState('login');
  const slideAnim = useState(new Animated.Value(0))[0];

  const handlePress = button => {
    setSelectedButton(button);

    Animated.timing(slideAnim, {
      toValue: button === 'login' ? 0 : 1,
      duration: 650,
      useNativeDriver: true,
    }).start();

    navigation.navigate(button === 'login' ? 'Signin' : 'Register');
  };

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure want to exit', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Exit', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, []),
  );

  return (
    <WelcomeComponent
      selectedButton={selectedButton}
      slideAnim={slideAnim}
      onPressButton={handlePress}
    />
  );
};

export default WelcomeContainer;
