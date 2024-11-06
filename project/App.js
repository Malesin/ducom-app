import React from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <MainNavigator />
        <Toast />
      </GestureHandlerRootView>
    </>
  );
};

export default App;
