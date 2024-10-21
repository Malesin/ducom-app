import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Homescreen,
  FAQscreen,
  Marksscreen,
  Settingsscreen,
} from '../pages';

import logo from './../assets/logo1.png';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={Settingsscreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigator = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Image source={logo} style={styles.logo} />
              <View style={styles.spacer} />
              <TouchableOpacity style={styles.search} onPress={() => navigation.navigate('SearchPage')}>
                <MaterialIcons name="search" size={25} color="black" />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#e1e8ed',
          },
          headerTintColor: '#000',
          headerTitleAlign: 'center',
          drawerStyle: {
            backgroundColor: '#fff',
          },
          drawerActiveTintColor: 'black',
          drawerInactiveTintColor: 'gray',
          drawerItemStyle: {
            color: 'black',
          },
          drawerIcon: () => ({
            color: 'black',
          }),
        }}>
        <Drawer.Screen
          name="Home"
          component={Homescreen}
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="FAQ"
          component={FAQscreen}
          options={{
            drawerLabel: 'FAQ',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="help-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Bookmarks"
          component={Marksscreen}
          options={{
            drawerLabel: 'Bookmarks',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="bookmark" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsStackNavigator}
          options={{
            drawerLabel: 'Settings',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="settings" size={24} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 50,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  search: {
    paddingLeft: 90,
  },
});

export default DrawerNavigator;