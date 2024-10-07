import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Alert, Text, RefreshControl, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import LikeNotification from '../../components/Notification/LikeNotification';
import { Skeleton } from 'react-native-elements'; // Tambahkan import Skeleton

const serverUrl = config.SERVER_URL;

const Notificationscreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true); // Tambahkan state untuk skeleton

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${serverUrl}/like-notifications`, { token });
      const { data, status } = response.data;
      if (status === 'ok') {
        setNotifications(data.flat().filter(notification => notification !== null));
      } else {
        Alert.alert('Error', 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications');
    } finally {
      setShowSkeleton(false); // Sembunyikan skeleton setelah data di-load
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setShowSkeleton(true); // Tampilkan skeleton saat refresh
    await fetchNotifications();
    setRefreshing(false);
  };

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
              width="25%" // 25% of the screen width
              style={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={14}
              width="15%" // 15% of the screen width
              style={styles.skeleton}
            />
          </View>
        </View>
        <Skeleton
          animation="pulse"
          height={40}
          width="100%" // 75% of the screen width
          style={[styles.skeleton, { borderRadius: 3 }]}
        />
      </View>
      ))}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {showSkeleton ? (
          renderSkeleton()
        ) : (
          notifications.length === 0 ? (
            <Text style={styles.noNotificationsText}>No notifications</Text>
          ) : (
            notifications.map((notification, index) => (
              <LikeNotification key={index} notification={notification} />
            ))
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  noNotificationsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  skeletonContainer: {
    padding: 20,
    alignItems: 'flex-start', // Align items to the left
    width: '100%', // Ensure the container takes full width
  },
  skeleton: {
    marginBottom: 10,
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
});

export default Notificationscreen;
