import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Image, StyleSheet, View } from 'react-native'; // Import StyleSheet for styles
import { Profilescreen, Notificationscreen } from '../pages';
import DrawerNavigator from './DrawerNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import the profile image and logo
import profileImage from './../assets/profile.png';
import logo from './../assets/logo1.png'; // Update the path according to your project structure

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => {
                        let iconName;
                        const iconSize = 30; // Adjust the icon size here

                        if (route.name === 'HomeTab') {
                            iconName = 'home';
                            return <MaterialIcons name={iconName} size={iconSize} color={color} />;
                        } else if (route.name === 'Notification') {
                            iconName = 'notifications';
                            return <MaterialIcons name={iconName} size={iconSize} color={color} />;
                        } else if (route.name === 'Profile') {
                            // Use Image component for Profile tab with circular style
                            return (
                                <Image
                                    source={profileImage}
                                    style={[styles.icon, { tintColor: undefined }]} // Remove tintColor for the profile image
                                />
                            );
                        }
                    },
                    tabBarLabel: () => null, // Hide tab bar labels
                    tabBarStyle: {
                        paddingBottom: 10, // Adjust the bottom padding here
                        height: 60, // Optionally adjust the height of the tab bar
                    },
                    headerShown: false, // Hide the header for all screens
                    tabBarActiveTintColor: 'black', // Color of the icon when active
                    tabBarInactiveTintColor: 'gray', // Color of the icon when inactive
                })}
            >
                <Tab.Screen name="HomeTab" component={DrawerNavigator} />
                <Tab.Screen
                    name="Notification"
                    component={Notificationscreen}
                    options={{
                        headerShown: true,
                        headerTitle: () => (
                            <View style={styles.headerTitleContainer}>
                                <Image source={logo} style={styles.logo} />
                            </View>
                        ),
                        headerStyle: {
                            backgroundColor: '#fff', // Optional: Set a background color for the header
                            paddingHorizontal: 50, // Add horizontal padding to the header
                            paddingVertical: 50, // Add vertical padding to the header
                        },
                        headerTitleAlign: 'center', // Center align the header title (logo in this case)
                    }}
                />
                <Tab.Screen name="Profile" component={Profilescreen} />
            </Tab.Navigator>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 30, // Size of the icon
        height: 30, // Size of the icon
        borderRadius: 15, // Half of the width/height to make it circular
    },
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

export default BottomTabNavigator;
