import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowerPage from '../pages/Home/FollowerPage';
import FollowingPage from '../pages/Home/FollowingPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createMaterialTopTabNavigator();

const FollowTopTabNavigator = ({ navigation }) => {

    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="chevron-left" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerUsername}>mikadotjees</Text>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {Header()}
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarIndicatorStyle: styles.tabBarIndicator,
                    tabBarLabelStyle: styles.tabBarLabel,
                }}
            >
                <Tab.Screen name="Followers" component={FollowerPage} />
                <Tab.Screen name="Following" component={FollowingPage} />
            </Tab.Navigator>
        </View>
    );
};

export default FollowTopTabNavigator;

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
