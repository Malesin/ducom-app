import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Image, StyleSheet } from 'react-native'; // Import StyleSheet for styles
import { Homescreen, Profilescreen, Notificationscreen } from '../pages';

// Import the profile image
import profileImage from './../assets/profile.png';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
    return (
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
            <Tab.Screen name="HomeTab" component={Homescreen} />
            <Tab.Screen name="Notification" component={Notificationscreen} />
            <Tab.Screen name="Profile" component={Profilescreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 30, // Size of the icon
        height: 30, // Size of the icon
        borderRadius: 15, // Half of the width/height to make it circular
    },
});

export default BottomTabNavigator;
