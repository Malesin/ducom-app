import React, { useState, useEffect } from 'react';
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

const MutedAccount = () => {
  const [mutedAccounts, setMutedAccounts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    fetchMutedAccounts();
  }, []);

  const fetchMutedAccounts = () => {
    setShowSkeleton(true);
    setTimeout(() => {
      setMutedAccounts([
        {
          id: '1',
          name: 'John Doe',
          username: 'johndoe',
          profilePicture: null,
        },
        {
          id: '2',
          name: 'Jane Doe',
          username: 'janedoe',
          profilePicture: null,
        },
        {
          id: '3',
          name: 'Alice Smith',
          username: 'alicesmith',
          profilePicture: null,
        },
      ]);
      setShowSkeleton(false);
    }, 2000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMutedAccounts();
    setRefreshing(false);
  };

  const handleUnmute = () => {
    // Logika untuk unmute akun
    onRefresh();
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
          mutedAccounts.length === 0 ? (
            <Text style={styles.noMutedAccountsText}>No muted accounts</Text>
          ) : (
            mutedAccounts.map((account) => (
              <MuteCard key={account.id} mutedAccount={account} onUnmute={handleUnmute} />
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
  noMutedAccountsText: {
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

export default MutedAccount;