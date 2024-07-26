import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator'; // Adjust path as necessary

const App = () => (
  <NavigationContainer>
    <AuthNavigator />
  </NavigationContainer>
);

export default App;
