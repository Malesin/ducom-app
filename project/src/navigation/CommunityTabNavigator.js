import React, { useState, useCallback } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import { CommunityPost, CommunityMedia, ViewCommunity, CommunityAbout } from '../pages';
import { useRoute } from '@react-navigation/native';


function CommunityTabNavigator() {
  const route = useRoute();
  const { communityId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }, []);

  const handleScroll = event => {
    const { contentOffset } = event.nativeEvent;
    setIsScrollTop(contentOffset.y === 0);
  };
  const Header = () => (
    <View style={styles.communityWrapper}>
      <ViewCommunity communityId={communityId} />
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Tabs.Container
        renderHeader={Header}
        renderTabBar={props => (
          <MaterialTabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.tabBarIndicator}
            labelStyle={styles.tabBarLabel}
          />
        )}>
        <Tabs.Tab name="Posts">
          <Tabs.ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                enabled={isScrollTop}
              />
            }>
            <CommunityPost />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Media">
          <Tabs.ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                enabled={isScrollTop}
              />
            }>
            <CommunityMedia />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="About">
          <Tabs.ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                enabled={isScrollTop}
              />
            }>
            <CommunityAbout communityId={communityId}/>
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
  communityWrapper: {
    backgroundColor: '#fff',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textTransform: 'none',
  },
  tabBarIndicator: {
    backgroundColor: '#000',
    height: 3,
  },
});

export default CommunityTabNavigator;
