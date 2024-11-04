import React, { useState, useCallback, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Image, StyleSheet, View, Text } from 'react-native';
import { CommunityScreen, Notificationscreen } from '../pages';
import DrawerNavigator from './DrawerNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';
import NetInfo from '@react-native-community/netinfo';
const serverUrl = config.SERVER_URL;

import TopTabNavigator from './TopTabNavigator';

import profileImage from './../assets/profilepic.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const [profilePicture, setProfilePicture] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  const getData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token Retrieved Successfully');

      const userResponse = await axios.post(`${serverUrl}/userdata`, {
        token: token,
      });
      console.log('Data Retrieved Successfully');

      const user = userResponse.data.data;

      if (user.profilePicture) {
        const profile = { uri: user.profilePicture };
        setProfilePicture(profile);
        console.log('Image Profile Retrieved Successfully');
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        getData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [getData]);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [getData])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
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
                  source={profilePicture || profileImage}
                  style={[styles.icon, { tintColor: undefined }]}
                />
              );
            } else if (route.name === 'Community') {
              return (
                <MaterialCommunityIcons name="account-group" size={iconSize} color={color} />
              );
            }
          },
          tabBarLabel: () => null,
          tabBarStyle: {
            paddingVertical: 5,
            height: 60,
          },
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="HomeTab" component={DrawerNavigator} />
        <Tab.Screen name="Community" component={CommunityScreen} />
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
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;
