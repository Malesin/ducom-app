import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SigninComponent from './SigninComponent';
import {loginUser} from './SigninActions';

const SigninContainer = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (token) navigation.replace('Home');
    });
  }, [navigation]);

  const onLogin = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email cannot be empty');
      valid = false;
    } else setEmailError('');

    if (!password) {
      setPasswordError('Password cannot be empty');
      valid = false;
    } else setPasswordError('');

    if (!valid) return;

    loginUser({email, password, navigation});
  };

  return (
    <SigninComponent
      email={email}
      password={password}
      emailError={emailError}
      passwordError={passwordError}
      showPassword={showPassword}
      onChangeEmail={setEmail}
      onChangePassword={text => setPassword(text.slice(0, 25))}
      onTogglePassword={() => setShowPassword(v => !v)}
      onLogin={onLogin}
      navigation={navigation}
    />
  );
};

export default SigninContainer;
