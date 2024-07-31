import React from 'react';
import { Authscreen, Forgotpassword, Homescreen, Registerscreen, Signinscreen, Splashscreen, TermsandConditionscreen } from './../pages';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
      >
        <Stack.Screen name='Splash' component={Splashscreen} options={{ headerShown: false }} />
        <Stack.Screen name='Auths' component={Authscreen} options={{ headerShown: false }} />
        <Stack.Screen name='Signin' component={Signinscreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={Registerscreen} options={{ headerShown: false }} />
        <Stack.Screen name='Forgotpass' component={Forgotpassword} options={{ headerShown: false }} />
        <Stack.Screen name='Termsandcondition' component={TermsandConditionscreen} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
