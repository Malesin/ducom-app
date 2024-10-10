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
import BlockCard from '../../components/BlockCard';

const BlockedAccount = () => {
  const [blockedAccounts, setBlockedAccounts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    fetchBlockedAccounts();
  }, []);

  const fetchBlockedAccounts = () => {
    setShowSkeleton(true);
    setTimeout(() => {
      setBlockedAccounts([
        {
          id: '1',
          name: 'Jane Doe',
          username: 'janedoe',
          profilePicture: null,
        },
        {
          id: '2',
          name: 'Alice Smith',
          username: 'alicesmith',
          profilePicture: null,
        },
        {
          id: '3',
          name: 'Bob Johnson',
          username: 'bobjohnson',
          profilePicture: null,
        },
      ]);
      setShowSkeleton(false);
    }, 2000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBlockedAccounts();
    setRefreshing(false);
  };

  const handleUnblock = () => {
    // Logika untuk unblock akun
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
          blockedAccounts.length === 0 ? (
            <Text style={styles.noBlockedAccountsText}>No blocked accounts</Text>
          ) : (
            blockedAccounts.map((account) => (
              <BlockCard key={account.id} blockedAccount={account} onUnblock={handleUnblock} />
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
  noBlockedAccountsText: {
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

export default BlockedAccount;