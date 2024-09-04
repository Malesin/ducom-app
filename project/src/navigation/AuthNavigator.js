import React from 'react';
import {
  Authscreen,
  Forgotpassword,
  OTPScreen,
  CreatePassword,
  Registerscreen,
  Signinscreen,
  Splashscreen,
  TermsandConditionscreen,
  Profilescreen,
  EditProfilePage,
  CreatePost,
  CommentScreen,
  Userprofile, // Tambahkan import Userprofile
} from '../pages';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerNavigator from './DrawerNavigator'; // Tambahkan import DrawerNavigator
import UserTopTabNavigator from './UserTopTabNavigator';

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
          name="OTPScreen"
          component={OTPScreen}
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
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{headerShown: true, title: 'Create Post'}}
        />
        <Stack.Screen
          name="Comment"
          component={CommentScreen}
          options={{headerShown: true, title: 'Comments'}}
        />
        <Stack.Screen
          name="Profile"
          component={Profilescreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfilePage}
          options={{headerShown: true, title: 'Edit Profile'}}
        />
        <Stack.Screen
          name="Userprofile"
          component={UserTopTabNavigator} // Pastikan UserTopTabNavigator diatur sebagai layar langsung
          options={{headerShown: true, title: 'User Profile'}}
          initialParams={{userIdPost: '', username: ''}} // Tambahkan initialParams untuk userIdPost dan username
        />
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator} 
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
