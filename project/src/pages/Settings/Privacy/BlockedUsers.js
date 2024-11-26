import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  View,
} from 'react-native';
import { Skeleton } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../../config';
import BlockCard from '../../../components/BlockCard';
import { ToastAndroid } from 'react-native'; 

const serverUrl = config.SERVER_URL;

const BlockedUsers = () => {
  const [blockUsers, setBlockUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    fetchBlockUsers();
  }, []);

  const fetchBlockUsers = async () => {
    setShowSkeleton(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await axios.post(`${serverUrl}/show-blockedUsers`, { token: token })
      const respBlocked = resp.data.data
      const formattedBlocked = respBlocked.map(block => {
        return {
          id: block._id,
          name: block.name,
          username: block.username,
          profilePicture: block.profilePicture,
          myToken: token
        };
      });
      setShowSkeleton(false); 
      return formattedBlocked;
    } catch (error) {
      setShowSkeleton(false);
      console.error(error)
    }
  };

  useEffect(() => {
    const loadBlocked = async () => {
      setRefreshing(true);
      const newBlocked = await fetchBlockUsers();
      setBlockUsers(newBlocked)
      setRefreshing(false);
    };
    loadBlocked();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const newBlocked = await fetchBlockUsers();
    setBlockUsers(newBlocked)
    setRefreshing(false);
  }, []);

  const handleUnblock = async (blockUserData) => {
    try {
      await axios.post(`${serverUrl}/unblock-user`, { token: blockUserData.myToken, unblockUserId: blockUserData.id })
      await onRefresh();
      ToastAndroid.show('User berhasil di-unblock', ToastAndroid.SHORT); 
    } catch (error) {
      console.error(error)
    }
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {showSkeleton ? (
          renderSkeleton()
        ) : (
          blockUsers.length === 0 ? (
            <Text style={styles.noBlockUsersText}>No blocked users</Text>
          ) : (
            blockUsers.map((block, index) => (
              <BlockCard key={index} blockUser={block} onUnblock={handleUnblock} />
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
  noBlockUsersText: {
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

export default BlockedUsers;
