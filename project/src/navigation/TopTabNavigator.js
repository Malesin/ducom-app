import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StyleSheet, View} from 'react-native';
import { Likescreen, Mediascreen, Postscreen, Profilescreen, Replyscreen } from '../pages';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Tab = createMaterialTopTabNavigator();

function TopTabNavigator() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.profileWrapper}>
        <Profilescreen /> 
      </View>
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
          <Tab.Screen name="Likes" component={Likescreen} />
          <Tab.Screen name="Media" component={Mediascreen} />
        </Tab.Navigator>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileWrapper: {
    height: '43%', // Sesuaikan tinggi profileWrapper
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navigatorWrapper: {
    flex: 1, // Gunakan flex untuk menyesuaikan tinggi secara otomatis
  },
  tabBar: {
    backgroundColor: '#fff', // Background color of the tab bar
    borderBottomWidth: 1, // Hanya garis bawah
    borderBottomColor: '#ddd', // Warna garis bawah
    elevation: 0, // Hilangkan bayangan pada Android
    borderTopWidth: 0, // Hilangkan garis atas
  },
  tabBarLabel: {
    fontSize: 14, // Font size of the tab labels
    fontWeight: '600', // Font weight of the tab labels
    color: '#000', // Color of the tab labels
    textTransform: 'none', // Disable uppercase transformation
  },
  tabBarIndicator: {
    backgroundColor: 'black', // Color of the indicator line
    height: 4, // Height of the indicator line
  },
});

export default TopTabNavigator;