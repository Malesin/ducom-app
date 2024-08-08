import React from 'react';
import {
  Authscreen,
  Forgotpassword,
  Capthcascreen,
  CreatePassword,
  Registerscreen,
  Signinscreen,
  Splashscreen,
  TermsandConditionscreen,
} from './../pages';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splashscreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Auths"
          component={Authscreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signin"
          component={Signinscreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Registerscreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Forgotpass"
          component={Forgotpassword}
          options={{headerShown: true, title: 'Find Your Account'}}
        />
        <Stack.Screen
          name="Captcha"
          component={Capthcascreen}
          options={{headerShown: true, title: 'Confirm Your Account'}}
        />
        <Stack.Screen
          name="CreatePassword"
          component={CreatePassword}
          options={{headerShown: true, title: 'Create New Password'}}
        />
        <Stack.Screen
          name="Termsandcondition"
          component={TermsandConditionscreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
