import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, StyleSheet, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import { Homescreen, FAQscreen, Marksscreen, Settingsscreen } from '../pages';

// Import the logo image
import logo from './../assets/logo1.png'; // Update the path according to your project structure

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerTitle: () => (
                    <View style={styles.headerTitleContainer}>
                        <Image source={logo} style={styles.logo} />
                    </View>
                ),
                headerStyle: {
                    backgroundColor: '#fff', // Background color for the header
                    borderBottomWidth: 1, // Border width
                    borderBottomColor: '#e1e8ed', // Border color
                },
                headerTintColor: '#000', // Color for any text or icons
                headerTitleAlign: 'center', // Center align the header title (logo in this case)
                drawerStyle: {
                    backgroundColor: '#fff', // Background color for the drawer
                },
                drawerActiveTintColor: 'black', // Active color for drawer items
                drawerInactiveTintColor: 'gray', // Inactive color for drawer items
                drawerItemStyle: {
                    color: 'black', // Color for drawer item text
                },
                drawerIcon: ({ color, size, focused }) => ({
                    color: 'black', // Set color for drawer icons
                }),
            }}
        >
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
                component={Settingsscreen}
                options={{
                    drawerLabel: 'Settings',
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="settings" size={24} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 160, // Set your desired width
        height: 60, // Set your desired height
        resizeMode: 'contain', // Ensure the logo maintains its aspect ratio
    },
});

export default DrawerNavigator;
