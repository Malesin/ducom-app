import React from 'react';
import { Authscreen, FAQscreen, Forgotpassword, Homescreen, Registerscreen, Signinscreen, Splashscreen } from './../pages';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }} >
        <Stack.Screen name='Splash' component={Splashscreen} />
        <Stack.Screen name='Auths' component={Authscreen} />
        <Stack.Screen name='Signin' component={Signinscreen} />
        <Stack.Screen name='Register' component={Registerscreen} />
        <Stack.Screen name='Forgotpass' component={Forgotpassword} />
        <Stack.Screen name='Home' component={Homescreen} />
        <Stack.Screen name='FAQ' component={FAQscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;