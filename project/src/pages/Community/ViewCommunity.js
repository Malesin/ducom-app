import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl, // Tambahkan import ini
  Alert, // Tambahkan import ini
} from 'react-native';
import axios from 'axios';
import config from '../../config';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = config.SERVER_URL;

const ViewCommunity = () => {
  const route = useRoute();
  const {communityId} = route.params;
  const [communityData, setCommunityData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);
  const [userData, setUserData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(userData?.isAdmin || false); // true buat admin, false buat member 😛
  const [isJoined, setIsJoined] = useState();
  const navigation = useNavigation();

  // Fungsi untuk fetch data komunitas
  const fetchCommunityData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(`${serverUrl}/community-byId`, {
        token: token,
        communityId: communityId,
      });
      setCommunityData(response.data.data);

      // Opsional: Tambahkan logika untuk mengecek apakah pengguna adalah admin
      // setIsAdmin(response.data.data.isAdmin);
    } catch (error) {
      console.error('Error fetching community data:', error);
      Alert.alert('Error', 'Failed to fetch community data');
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  // Fungsi untuk handle refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchCommunityData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh community data');
    } finally {
      setRefreshing(false);
    }
  }, [communityId]);

  const handleSettingsPress = () => {
    navigation.navigate('CommunitySettings', {
      communityId: communityId,
      communityDataBefore: communityData,
    });
  };
  const handleJoinPress = async () => {
    const token = await AsyncStorage.getItem('token');
    const data = {
      token,
      communityId: communityData?._id
    }

    if (isJoined) {
      setIsJoined(!isJoined)
      axios
        .post(`${serverUrl}/leave-community`, data)
        .then((response) => {
          console.log(response.data)
        })
        .catch(error => {
          setIsJoined(isJoined)
          console.error(error)
        })
    } else {
      setIsJoined(!isJoined)
      axios
        .post(`${serverUrl}/join-community`, data)
        .then((response) => {
          console.log(response.data)
        })
        .catch(error => {
          setIsJoined(isJoined)
          console.error(error)
        })
    }
    console.log(`${isJoined ? 'Leaved' : 'Joined'} Community`);
  };

  const handleCreate = () => {
    console.log('Creating post in community');
    navigation.navigate('CreatePostCommunity', {communityId: communityId});
  };

  useEffect(() => {
    async function fetchCommunityData() {
      const token = await AsyncStorage.getItem('token');

      try {
        const response = await axios.post(`${serverUrl}/community-byId`, {
          token: token,
          communityId: communityId,
        });
        setCommunityData(response.data.data);
      } catch (error) {
        console.error('Error fetching community data:', error);
      }
    }
    fetchCommunityData();

    async function getData() {
      const token = await AsyncStorage.getItem('token');

      try {
        const userResponse = await axios.post(`${serverUrl}/userdata`, {
          token: token,
        });

        const userData = userResponse.data.data;
        setUserData(userData)

      } catch (error) {
        console.error('Error occurred:', error);
      }
    }
    getData()
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#001374']} // Warna loading indicator (opsional)
            tintColor="#001374" // Warna loading indicator untuk iOS
          />
        }>
        <View style={styles.bannerContainer}>
          <Image
            source={
              communityData?.picture?.banner?.bannerPicture
                ? {uri: communityData.picture.banner.bannerPicture}
                : require('../../assets/banner.png')
            }
            style={styles.banner}
          />
        </View>
        <View style={styles.infoActionContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {communityData?.communityName || 'Community Name'}
              </Text>
              <Text style={styles.bio}>
                {communityData?.communityDescription || 'Community bio'}
              </Text>
            </View>
          </View>
          <View style={styles.actionContainer}>
            {isAdmin ? (<>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreate}>
                <MaterialIcons
                  name="add"
                  size={20}
                  color="#000"
                  style={styles.addIcon}
                />
                <Text style={styles.create}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={handleSettingsPress}>
                <Text style={styles.settings}>Settings</Text>
              </TouchableOpacity>
            </>
            ) : (isJoined ?
              <TouchableOpacity
                style={styles.joinedButton}
                onPress={handleJoinPress}>
                <Text style={styles.joined}>Joined</Text>
              </TouchableOpacity>
              : (<>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={handleJoinPress}>
                  <Text style={styles.join}>Join</Text>
                </TouchableOpacity>
              </>)
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    width: '100%',
    height: 185,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  infoActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  nameContainer: {
    padding: 10,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1E8ED',
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 100,
    marginRight: 10,
  },
  joinButton: {
    backgroundColor: '#001374',
    paddingVertical: 6,
    paddingHorizontal: 25,
    borderRadius: 100,
    borderColor: '#000',
    borderWidth: 1,
  },
  join: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  joinedButton: {
    backgroundColor: '#E1E8ED',
    paddingVertical: 6,
    paddingHorizontal: 25,
    borderRadius: 100,
    borderColor: '#000',
    borderWidth: 1,
  },
  joined: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#E1E8ED',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 100,
    borderColor: '#000',
    borderWidth: 1,
  },
  settings: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  create: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ViewCommunity;
