import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
  Likescreen,
  Mediascreen,
  Postscreen,
  Replyscreen,
} from '../pages';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view'; // Import Tabs and MaterialTabBar
import Profilescreen from '../pages/Profile/Profilescreen'; // Import Profilescreen

const { height } = Dimensions.get('window');

function TopTabNavigator() {
  const Header = () => (
    <View style={styles.profileWrapper}>
      <Profilescreen />
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Tabs.Container
        renderHeader={Header}
        renderTabBar={(props) => (
          <MaterialTabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.tabBarIndicator}
            labelStyle={styles.tabBarLabel}
          />
        )}
      >
        <Tabs.Tab name="Posts">
          <Tabs.ScrollView>
            <Postscreen />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Replies">
          <Tabs.ScrollView>
            <Replyscreen />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Likes">
          <Tabs.ScrollView>
            <Likescreen />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Media">
          <Tabs.ScrollView>
            <Mediascreen />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileWrapper: {
    backgroundColor: '#fff',
  },
  tabBar: {
    backgroundColor: '#fff', // Warna latar belakang putih
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Warna border abu-abu
    elevation: 0,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000', // Warna teks hitam
    textTransform: 'none',
  },
  tabBarIndicator: {
    backgroundColor: '#000', // Warna indikator hitam
    height: 3,
  },
});

export default TopTabNavigator;
