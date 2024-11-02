import FollowCard from '../../components/FollowCard';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import {Skeleton} from 'react-native-elements';
const serverUrl = config.SERVER_URL;

const FollowingPage = () => {
  const [dataFollowing, setDataFollowing] = useState([]);
  const [myId, setMyId] = useState();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getDataFollowing = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(`${serverUrl}/show-following`, {
          token: token,
        })
        .then(res => {
          const dataFollow = res.data.data.following;
          setDataFollowing(dataFollow);

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
    getDataFollowing();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getDataFollowing();
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    await getDataFollowing();
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
          : dataFollowing.map((data, index) => (
              <View key={index}>
                <FollowCard
                  followText="Follow"
                  followingText="Following"
                  removeButtonText="Unfollow"
                  message={
                    <Text style={styles.boldUsername}>{data?.username}</Text>
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

export default FollowingPage;

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
    padding: 20,
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
