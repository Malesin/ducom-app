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
import MuteCard from '../../components/MuteCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const MuteUsers = () => {
  const [muteUsers, setMuteUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    fetchMuteUsers();
  }, []);

  const fetchMuteUsers = async () => {
    setShowSkeleton(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await axios.post(`${serverUrl}/show-mutedUsers`, { token: token })
      const respMuted = resp.data.data
      const formattedMuted = respMuted.map(mute => {
        return {
          id: mute._id,
          name: mute.name,
          username: mute.username,
          profilePicture: mute.profilePicture,
          myToken: token
        };
      });
      setShowSkeleton(false); // Tambahkan baris ini untuk menyembunyikan skeleton
      return formattedMuted;
    } catch (error) {
      setShowSkeleton(false); // Tambahkan baris ini untuk menyembunyikan skeleton
      console.error(error)
    }
  };

  useEffect(() => {
    const loadMuted = async () => {
      setRefreshing(true);
      const newMuted = await fetchMuteUsers();
      setMuteUsers(newMuted)
      setRefreshing(false);
    };
    loadMuted();
  }, []);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const newMuted = await fetchMuteUsers();
    setMuteUsers(newMuted)
    setRefreshing(false);
  }, []);

  const handleUnmute = async (muteUserData) => {
    try {
      const respUnmute = await axios.post(`${serverUrl}/unmute-user`, { token: muteUserData.myToken, unmuteUserId: muteUserData.id })
      console.log(respUnmute)
      await onRefresh();
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
          muteUsers && muteUsers.length === 0 ? (
            <Text style={styles.noMuteUsersText}>No muted accounts</Text>
          ) : (
            muteUsers.map((mute, index) => (
              <MuteCard key={index} muteUser={mute} onUnmute={handleUnmute} />
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
  noMuteUsersText: {
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

export default MuteUsers;