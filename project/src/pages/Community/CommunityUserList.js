import {StyleSheet, View, ScrollView, RefreshControl, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import CommunityUserCard from '../../components/Community/CommunityUserCard';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import {Skeleton} from 'react-native-elements';

const serverUrl = config.SERVER_URL;

const CommunityUserList = () => {
  const route = useRoute();
  const {communityId} = route?.params;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.post(`${serverUrl}/community-users`, {
          token,
          communityId,
        });
        const userData = response?.data?.data?.members;
        setUsers(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderSkeleton = () => (
    <>
      {[...Array(10)].map((_, index) => (
        <View key={index} style={styles.skeletonContainer}>
          <View style={styles.skeletonHeader}>
            <Skeleton
              animation="pulse"
              circle
              height={50}
              width={50}
              style={styles.skeletonAvatar}
            />
            <Skeleton
              animation="pulse"
              height={40}
              width="78%"
              marginRight={10}
              style={[styles.skeleton, {borderRadius: 3}]}
            />
            <Skeleton
              animation="pulse"
              height={40}
              width="10%"
              style={[styles.skeleton, {borderRadius: 3}]}
            />
          </View>
        </View>
      ))}
    </>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {loading ? (
          renderSkeleton()
        ) : users.length === 0 ? (
          <Text style={styles.noUsersText}>No users available</Text>
        ) : (
          users.map(user => <CommunityUserCard key={user.id} user={user} />)
        )}
      </ScrollView>
    </View>
  );
};

export default CommunityUserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skeletonContainer: {
    padding: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  skeletonAvatar: {
    marginRight: 10,
    marginBottom: 12,
  },
  skeleton: {
    marginBottom: 10,
  },
  noUsersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
