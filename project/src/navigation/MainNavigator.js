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
  EditProfilePage,
  CreatePost,
  ViewPost,
  ReportScreen,
  AccountInformation,
  UpdatePassword,
  BlockedUsers,
  MutedUsers,
  VerifyAccount,
  AccountPrivacy,
  SearchPage,
  AccountLists,
  ReportsManagement,
  DeactivatedorDeletedAccounts,
  CommunityPost,
  CommunityAbout,
  CommunityMedia,
  CreateCommunity,
  CommunitySettings,
  CommunityList,
} from '../pages';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerNavigator from './DrawerNavigator';
import UserTopTabNavigator from './UserTopTabNavigator';
import TopTabNavigator from './TopTabNavigator';
import DeactiveDeleteAccount from '../pages/Settings/Profile/DeactiveDeleteAccount';
import FollowTopTabNavigator from './FollowTopTabNavigator';
import UserFollowTopTabNavigator from './UserFollowTopTabNavigator';
import CommunityTabNavigator from './CommunityTabNavigator';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
          name="SearchPage"
          component={SearchPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ViewPost"
          component={ViewPost}
          options={{headerShown: true, title: 'Post'}}
        />
        <Stack.Screen
          name="Report"
          component={ReportScreen}
          options={{headerShown: true, title: 'Report'}}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{headerShown: true, title: 'Create Post'}}
        />
        <Stack.Screen
          name="Profile"
          component={TopTabNavigator}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Follow"
          component={FollowTopTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfilePage}
          options={{headerShown: true, title: 'Edit Profile'}}
        />
        <Stack.Screen
          name="Userprofile"
          component={UserTopTabNavigator}
          options={{headerShown: true, title: 'User Profile'}}
          initialParams={{userIdPost: '', username: ''}}
        />
        <Stack.Screen
          name="UserFollow"
          component={UserFollowTopTabNavigator}
          options={{headerShown: false, title: 'User Follow'}}
        />
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AccountInformation"
          component={AccountInformation}
          options={{headerShown: true, title: 'Account Information'}}
        />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePassword}
          options={{headerShown: true, title: 'Update Password'}}
        />
        <Stack.Screen
          name="AccountPrivacy"
          component={AccountPrivacy}
          options={{headerShown: true, title: 'Account Privacy'}}
        />
        <Stack.Screen
          name="BlockedUsers"
          component={BlockedUsers}
          options={{headerShown: true, title: 'Blocked Accounts'}}
        />
        <Stack.Screen
          name="MutedUsers"
          component={MutedUsers}
          options={{headerShown: true, title: 'Muted Accounts'}}
        />
        <Stack.Screen
          name="DeactiveDeleteAccount"
          component={DeactiveDeleteAccount}
          options={{headerShown: true, title: 'Deactivate or Delete Account'}}
        />
        <Stack.Screen
          name="AccountLists"
          component={AccountLists}
          options={{headerShown: true, title: 'All Users'}}
        />
        <Stack.Screen
          name="ReportsManagement"
          component={ReportsManagement}
          options={{headerShown: true, title: 'All Reports'}}
        />
        <Stack.Screen
          name="DeactivateorDeletedAccounts"
          component={DeactivatedorDeletedAccounts}
          options={{headerShown: true, title: 'All Account Status'}}
        />
        <Stack.Screen
          name="VerifyAccount"
          component={VerifyAccount}
          options={({route}) => ({
            headerShown: true,
            title:
              route.params?.choice === 'delete'
                ? 'Delete Account'
                : 'Deactivate Account',
          })}
        />
        <Stack.Screen
          name="CommunityPost"
          component={CommunityPost}
          options={{headerShown: true, title: 'Community Post'}}
        />
        <Stack.Screen
          name="CreateCommunity"
          component={CreateCommunity}
          options={{headerShown: true, title: 'Create New Community'}}
        />
        <Stack.Screen
          name="CommunityAbout"
          component={CommunityAbout}
          options={{headerShown: true, title: 'Community About'}}
        />
        <Stack.Screen
          name="CommunityMedia"
          component={CommunityMedia}
          options={{headerShown: true, title: 'Community Media'}}
        />
        <Stack.Screen
          name="CommunityList"
          component={CommunityList}
          options={{headerShown: true, title: 'Community List'}}
        />
        <Stack.Screen
          name="CommunitySettings"
          component={CommunitySettings}
          options={{
            headerShown: true,
            headerTitle: 'Settings',
            headerTitleAlign: 'left',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ViewCommunity"
          component={CommunityTabNavigator}
          options={({navigation}) => ({
            headerShown: true,
            headerTitle: 'Community',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.iconContainer}>
                <Icon name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
