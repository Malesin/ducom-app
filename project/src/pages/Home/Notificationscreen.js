import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Alert, Text, RefreshControl, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import LikeNotification from '../../components/Notification/LikeNotification';
import CommentNotification from '../../components/Notification/CommentNotification';
import { Skeleton } from 'react-native-elements';
import ReportedNotification from '../../components/ReportedNotification';
import FollowNotification from '../../components/Notification/FollowNotification';


const serverUrl = config.SERVER_URL;

const Notificationscreen = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [followNotifs, setFollowNotifs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      let likeNotifications = [];
      await axios
        .post(`${serverUrl}/like-notifications`, { token })
        .then(res => {
          if (res.data.status === 'ok') {
            likeNotifications = res.data.data.flat().filter(notification => notification !== null);
          } else {
            Alert.alert('Error', 'Failed to fetch like notifications');
          }
        })

      let commentNotifications = [];
      await axios
        .post(`${serverUrl}/comment-notifications`, { token })
        .then(res => {
          if (res.data.status === 'ok') {
            commentNotifications = res.data.data.flat().filter(notification => notification !== null);
          } else {
            Alert.alert('Error', 'Failed to fetch comment notifications');
          }
        })

      let followNotifications = [];
      await axios
        .post(`${serverUrl}/follow-notifications`, { token })
        .then(res => {
          if (res.data.status === 'ok') {
            followNotifications = res.data.data.flat().filter(notification => notification !== null);
          } else {
            Alert.alert('Error', 'Failed to fetch follow notifications');
          }
        })
      setFollowNotifs(followNotifications)

      const allNotifications = [...likeNotifications, ...commentNotifications, ...followNotifications].sort((a, b) => {
        const aDate = a.like?.created_at || a.comment?.created_at || a?.created_at;
        const bDate = b.like?.created_at || b.comment?.created_at || b?.created_at;
        return new Date(bDate) - new Date(aDate);
      });

      setAllNotifications(allNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications');
    } finally {
      setShowSkeleton(false);
    }
  };

  useEffect(() => {
    allNotifications
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setShowSkeleton(true);
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
                width="25%"
                style={styles.skeleton}
              />
              <Skeleton
                animation="pulse"
                height={14}
                width="15%"
                style={styles.skeleton}
              />
            </View>
          </View>
          <Skeleton
            animation="pulse"
            height={40}
            width="100%"
            style={[styles.skeleton, { borderRadius: 3 }]}
          />
        </View>
      ))}
    </>
  );
  return (
    <SafeAreaView style={styles.container}>
      {/* <ReportedNotification /> */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {showSkeleton ? (
          renderSkeleton()
        ) : (
          allNotifications.length === 0 ? (
            <Text style={styles.noNotificationsText}>No notifications</Text>
          ) : (
            allNotifications.map((notification, index) => (
              notification.like ? (
                <LikeNotification key={index} likeNotification={notification} />
              ) : notification.comment ? (
                <CommentNotification key={index} commentNotification={notification} />
              ) : (
                <FollowNotification key={index} followNotif={notification} />
              )
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
    alignItems: 'flex-start',
    width: '100%',
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
