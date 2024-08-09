import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Image, StyleSheet, View, Text} from 'react-native';
import { Likescreen, Mediascreen, Postscreen, Profilescreen, Replyscreen } from '../pages';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Tab = createMaterialTopTabNavigator();

function TopTabNavigator() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.navigatorWrapper}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarIndicatorStyle: styles.tabBarIndicator,
            tabBarStyle: styles.tabBar,
          }}
        >
          <Tab.Screen name="Posts" component={Postscreen} />
          <Tab.Screen name="Replies" component={Replyscreen} />
          <Tab.Screen name="Like" component={Likescreen} />
          <Tab.Screen name="Media" component={Mediascreen} />
        </Tab.Navigator>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  navigatorWrapper: {
    height: '50%', // Adjust the height as needed
    width: '100%',
  },
  tabBar: {
    backgroundColor: '#f8f8f8', // Background color of the tab bar
    height: 39, // Height of the tab bar
  },
  tabBarLabel: {
    fontSize: 14, // Font size of the tab labels
    fontWeight: '600', // Font weight of the tab labels
    color: '#333', // Color of the tab labels
  },
  tabBarIndicator: {
    backgroundColor: 'black', // Color of the indicator line
    height: 4, // Height of the indicator line
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

export default TopTabNavigator;