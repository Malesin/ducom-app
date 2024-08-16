import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Image, StyleSheet, View, Text} from 'react-native';
import {Profilescreen, Notificationscreen} from '../pages';
import DrawerNavigator from './DrawerNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
const serverUrl = config.SERVER_URL;
import TopTabNavigator from './TopTabNavigator';

// Import the profile image
import profileImage from './../assets/profile.png';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const [userData, setUserData] = useState('');
  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios.post(`${serverUrl}/userdata`, {token: token}).then(res => {
      console.log(res.data);
      setUserData(res.data.data);
      // UNTUK CONTOH PENGAPLIKASIAN DATANYA = {userData.name}
    });
  }
  useFocusEffect(
    React.useCallback(() => {
      getData();
      console.log('refresh');
    }, []),
  );
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color}) => {
            let iconName;
            const iconSize = 30;

            if (route.name === 'HomeTab') {
              iconName = 'home';
              return (
                <MaterialIcons name={iconName} size={iconSize} color={color} />
              );
            } else if (route.name === 'Notification') {
              iconName = 'notifications';
              return (
                <MaterialIcons name={iconName} size={iconSize} color={color} />
              );
            } else if (route.name === 'Profile') {
              return (
                <Image
                  source={profileImage}
                  style={[styles.icon, {tintColor: undefined}]}
                />
              );
            }
          },
          tabBarLabel: () => null,
          tabBarStyle: {
            paddingBottom: 10,
            height: 60,
          },
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="HomeTab" component={DrawerNavigator} />
        <Tab.Screen
          name="Notification"
          component={Notificationscreen}
          options={{
            headerShown: true,
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <MaterialIcons
                  name="notifications"
                  size={24}
                  color="black"
                  style={styles.headerIcon}
                />
                <Text style={styles.headerTitle}>Notifications</Text>
              </View>
            ),
            headerStyle: {
              backgroundColor: '#fff',
              borderBottomWidth: 1,
              borderBottomColor: '#e1e8ed',
            },
            headerTitleAlign: 'left',
            headerTitleStyle: {
              fontSize: 18,
            },
          }}
        />
        <Tab.Screen name="Profile" component={TopTabNavigator} />
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8, // Space between icon and text
  },
  headerTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;
