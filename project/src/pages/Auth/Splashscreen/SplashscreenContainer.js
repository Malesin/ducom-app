import React, {useEffect} from 'react';
import SplashscreenComponent from './SplashscreenComponent';
import {checkAuthOnSplash} from '../SignIn/SigninActions';

const SplashscreenContainer = ({navigation}) => {
  useEffect(() => {
    checkAuthOnSplash(navigation);
  }, [navigation]);

  return <SplashscreenComponent />;
};

export default SplashscreenContainer;
