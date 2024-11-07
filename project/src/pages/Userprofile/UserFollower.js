import FollowCard from '../../components/FollowCard';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements';
const serverUrl = config.SERVER_URL;

const UserFollower = ({ route }) => {
  const [dataFollowers, setDataFollowers] = useState([]);
  const [myId, setMyId] = useState();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = route.params;
  const navigation = useNavigation();

  const getDataFollowers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(`${serverUrl}/show-followers-byId`, {
          token: token,
          userId: userId,
        })
        .then(res => {
          const dataFollow = res.data.data.followers;
          setDataFollowers(dataFollow);
          const myUserId = res.data.myId;
          setMyId(myUserId);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataFollowers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getDataFollowers();
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    await getDataFollowers();
    setRefreshing(false);
    setLoading(false);
  }, []);

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <Skeleton
            animation="pulse"
            height={40}
            width={40}
            style={styles.skeletonAvatar}
          />
          <View style={styles.skeletonTextContainer}>
            <Skeleton
              animation="pulse"
              height={20}
              width="40%"
              style={styles.skeletonText}
            />
            <Skeleton
              animation="pulse"
              height={25}
              width="36%"
              borderRadius={10}
              style={styles.skeletonButton}
            />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {loading
          ? renderSkeleton()
          : dataFollowers.map((data, index) => (
            <View key={index}>
              <FollowCard
                followText="Follow Back"
                followingText="Following"
                removeButtonText="Remove"
                message={
                  <Text>
                    We won't tell{' '}
                    <Text style={styles.boldUsername}>{data?.username}</Text>{' '}
                    they were removed from your followers.
                  </Text>
                }
                data={data}
                myId={myId}
              />
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserFollower;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  scrollView: {
    paddingBottom: 20,
  },
  boldUsername: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    margin: 10,
  },
  skeletonContainer: {
    padding: 15,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skeletonAvatar: {
    borderRadius: 30,
    marginRight: 10,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonText: {
    marginBottom: 5,
  },
  skeletonButton: {
    alignSelf: 'flex-end',
    marginTop: -27,
  },
});
