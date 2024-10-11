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
  ViewPost,
  ReportScreen,
  AccountInformation,
  UpdatePassword,
  BlockedUsers,
  MutedUsers,
  VerifyAccount,
} from '../pages';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerNavigator from './DrawerNavigator';
import UserTopTabNavigator from './UserTopTabNavigator';
import TopTabNavigator from './TopTabNavigator';
import DeactiveDeleteAccount from '../pages/Settings/DeactiveDeleteAccount';
import AdminSettings from '../pages/Settings/AdminSettings';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splashscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Auths"
          component={Authscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signin"
          component={Signinscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Registerscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Forgotpass"
          component={Forgotpassword}
          options={{ headerShown: true, title: 'Find Your Account' }}
        />
        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{ headerShown: true, title: 'Confirm Your Account' }}
        />
        <Stack.Screen
          name="CreatePassword"
          component={CreatePassword}
          options={{ headerShown: true, title: 'Create New Password' }}
        />
        <Stack.Screen
          name="Termsandcondition"
          component={TermsandConditionscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewPost"
          component={ViewPost}
          options={{ headerShown: true, title: 'Post' }}
        />
        <Stack.Screen
          name="Report"
          component={ReportScreen}
          options={{ headerShown: true, title: 'Report' }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{ headerShown: true, title: 'Create Post' }}
        />
        <Stack.Screen
          name="Profile"
          component={TopTabNavigator}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfilePage}
          options={{ headerShown: true, title: 'Edit Profile' }}
        />
        <Stack.Screen
          name="Userprofile"
          component={UserTopTabNavigator}
          options={{ headerShown: true, title: 'User Profile' }}
          initialParams={{ userIdPost: '', username: '' }}  
        />
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccountInformation"
          component={AccountInformation}
          options={{ headerShown: true, title: 'Account Information' }}
        />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePassword}
          options={{ headerShown: true, title: 'Update Password' }}
        />
        <Stack.Screen
          name="BlockedUsers"
          component={BlockedUsers}
          options={{ headerShown: true, title: 'Blocked Accounts' }}
        />
        <Stack.Screen
          name="MutedUsers"
          component={MutedUsers}
          options={{ headerShown: true, title: 'Muted Accounts' }}
        />
        <Stack.Screen
          name="DeactiveDeleteAccount"
          component={DeactiveDeleteAccount}
          options={{ headerShown: true, title: 'Deactivate or Delete Account' }}
        />
        <Stack.Screen
          name="AdminSettings"
          component={AdminSettings}
          options={{ headerShown: true, title: 'Admin Settings' }}
        />
        <Stack.Screen
          name="VerifyAccount"
          component={VerifyAccount}
          options={{
            headerShown: true, title: 'Deactivate or Delete Account'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
