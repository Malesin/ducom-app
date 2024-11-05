import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import config from '../config';
import {UserFollower} from '../pages';
import UserFollowing from './../pages/Userprofile/UserFollowing';
const serverUrl = config.SERVER_URL;

const Tab = createMaterialTopTabNavigator();

const UserFollowTopTabNavigator = ({navigation, route}) => {
  const {username, userId} = route?.params;
  
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <MaterialIcons name="chevron-left" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerUsername}>{username}</Text>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      {Header()}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarLabelStyle: styles.tabBarLabel,
        }}>
        <Tab.Screen
          name="Followers"
          component={UserFollower}
          initialParams={{ userId }}
        />
        <Tab.Screen
          name="Following"
          component={UserFollowing}
          initialParams={{ userId }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default UserFollowTopTabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
  },
  tabBarIndicator: {
    backgroundColor: '#000',
  },
  tabBarLabel: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  headerUsername: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
});
