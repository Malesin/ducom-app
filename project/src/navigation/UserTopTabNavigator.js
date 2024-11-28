import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Dimensions, RefreshControl } from 'react-native';
import { Usermedia, Userpost, Userrepost, Userprofile } from '../pages';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import { Skeleton } from 'react-native-elements';

const { height } = Dimensions.get('window');

function UserTopTabNavigator({ route, navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { userIdPost, profilePicture, username, idUser, isAdmin, amIAdmin, tweet, isUserProfile } = route.params;
  useEffect(() => {
    if (username) {
      navigation.setOptions({ title: `@${username}` });
    }
  }, [username, navigation]);

  // useEffect(() => {
  //   const resetData = () => {
  //     console.log('Data direset');
  //   };

  //   resetData();
  // }, [userIdPost, profilePicture, idUser, isAdmin, amIAdmin, tweet, isUserProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }, []);

  const loadMoreData = useCallback(() => {
    if (!loadingMore) {
      setLoadingMore(true);
      // Simulasi pemuatan data
      setTimeout(() => {
        // Tambahkan logika untuk memuat data tambahan di sini
        setLoadingMore(false);
      }, 1000);
    }
  }, [loadingMore]);

  const handleScroll = event => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    setIsScrollTop(contentOffset.y === 0);

    // Deteksi jika mendekati bagian bawah
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      loadMoreData();
    }
  };

  const Header = () => (
    <View style={styles.profileWrapper}>
      <Userprofile userIdPost={userIdPost} navigation={navigation} idUser={idUser} refreshAllTabs={refreshAllTabs} />
    </View>
  );

  const renderSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.skeletonContainer}>
          <View style={styles.skeletonHeader}>
            <Skeleton
              animation="pulse"
              circle
              height={40}
              width={40}
              style={styles.skeletonAvatar}
            />
            <View style={styles.skeletonTextContainer}>
              <Skeleton
                animation="pulse"
                height={20}
                width={100}
                style={styles.skeleton}
              />
              <Skeleton
                animation="pulse"
                height={14}
                width={60}
                style={styles.skeleton}
              />
            </View>
          </View>
          <Skeleton
            animation="pulse"
            height={20}
            width={200}
            style={styles.skeleton}
          />
          <Skeleton
            animation="pulse"
            height={150}
            width={'100%'}
            style={styles.skeleton}
          />
        </View>
      ))}
    </>
  );

  // Fungsi untuk me-refresh semua tab
  const refreshAllTabs = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  };

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
            {refreshing ? (
              renderSkeleton()
            ) : (
              <Userpost
                userIdPost={userIdPost} profilePicture={profilePicture} idUser={idUser} navigation={navigation} amIAdmin={amIAdmin} isUserProfile={isUserProfile}
              />
            )}
            {loadingMore && renderSkeleton()}
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Reposts">
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
            {refreshing ? renderSkeleton() : <Userrepost userIdPost={userIdPost} />}
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
            {refreshing ? (
              renderSkeleton()
            ) : (
              <Usermedia userIdPost={userIdPost} profilePicture={profilePicture} />
            )}
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
  skeletonContainer: {
    padding: 20,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  skeletonAvatar: {
    marginRight: 10,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeleton: {
    marginBottom: 10,
    backgroundColor: '#e1e1e1',
  },
});

export default UserTopTabNavigator;
