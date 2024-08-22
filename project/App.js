import React from 'react';
import AuthNavigator from './src/navigation/AuthNavigator';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
        <AuthNavigator />
        <Toast />
    </>
  );
};

export default App;
