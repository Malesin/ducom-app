import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Image, StyleSheet, View, SafeAreaView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import {Homescreen, FAQscreen, Marksscreen, Settingsscreen} from '../pages';

// Import the logo image
import logo from './../assets/logo1.png'; // Update the path according to your project structure

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Drawer.Navigator
        screenOptions={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Image source={logo} style={styles.logo} />
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
          drawerIcon: ({color, size, focused}) => ({
            color: 'black', 
          }),
        }}>
        <Drawer.Screen
          name="Home"
          component={Homescreen}
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({color}) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="FAQ"
          component={FAQscreen}
          options={{
            drawerLabel: 'FAQ',
            drawerIcon: ({color}) => (
              <MaterialIcons name="help-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Bookmarks"
          component={Marksscreen}
          options={{
            drawerLabel: 'Bookmarks',
            drawerIcon: ({color}) => (
              <MaterialIcons name="bookmark" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={Settingsscreen}
          options={{
            drawerLabel: 'Settings',
            drawerIcon: ({color}) => (
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
  },
  logo: {
    width: 160, 
    height: 60, 
    resizeMode: 'contain', 
  },
});

export default DrawerNavigator;
