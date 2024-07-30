import React from 'react';
import { Authscreen, Forgotpassword, Homescreen, Registerscreen, Signinscreen, Splashscreen, TermsandConditionscreen } from './../pages';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerNavigator from '../navigation/DrawerNavigator'
// Main Navigation

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={({ route }) => ({
          headerShown: route.name === 'Home'  // Show header only for 'Home'
        })}
      >
        
        
        <Stack.Screen name='Splash' component={Splashscreen} />
        <Stack.Screen name='Drawer' component={DrawerNavigator} />

        <Stack.Screen name='Auths' component={Authscreen} />
        <Stack.Screen name='Signin' component={Signinscreen} />
        <Stack.Screen name='Register' component={Registerscreen} />
        <Stack.Screen name='Forgotpass' component={Forgotpassword} />
        <Stack.Screen name='Termsandcondition' component={TermsandConditionscreen} />
        <Stack.Screen name='Home' component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
