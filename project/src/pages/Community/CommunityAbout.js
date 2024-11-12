import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import config from '../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = config.SERVER_URL;

const formatDate = dateString => {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const CommunityAbout = () => {
  const route = useRoute();
  const { communityId } = route.params;
  const [communityData, setCommunityData] = useState(null);

  useEffect(() => {
    async function fetchCommunityData() {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.post(`${serverUrl}/community-byId`, { token: token, communityId: communityId });
        setCommunityData(response.data.data);
      } catch (error) {
        console.error('Error fetching community data:', error);
      }
    }

    fetchCommunityData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Community Info</Text>
      <View style={styles.infoRow}>
        <MaterialIcons name="person" size={22} color="black" />
        <Text style={styles.infoText}>Only admin can post</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="group" size={22} color="black" />
        <Text style={styles.infoText}>
          Only members can give likes and replies
        </Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="public" size={22} color="black" />
        <Text style={styles.infoText}>
          All Communities are publicly visible.
        </Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="event" size={22} color="black" />
        <Text style={styles.createAt}>
          Created {communityData?.created?.created_at ? formatDate(communityData.created.created_at) : 'Unknown Date'}
          <Text style={styles.username}> by @{communityData?.created?.created_by?.username}</Text>
        </Text>
        <View style={styles.verified}>
          <MaterialIcons name="verified" size={20} color="#699BF7" />
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.rulesContainer}>
        <Text style={styles.header}>Rules</Text>
        <Text style={styles.subHeader}>These are set and enforced by community admins and are in addition to Ducom’s rules.</Text>
        {communityData?.rules.map((rule, index) => (
          <View key={rule._id} style={styles.ruleWrapper}>
            <View style={styles.ruleIcon}>
              <Text style={styles.ruleNumber}>{index + 1}</Text>
            </View>
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>{rule.title}</Text>
              <Text style={styles.ruleDescription}>{rule.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 17,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
    color: 'black',
  },
  subHeader: {
    fontSize: 15,
    color: '#B6B6B6',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingLeft: 13,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  subText: {
    fontSize: 15,
    color: '#B6B6B6',
  },
  ruleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  ruleTextContainer: {
    flex: 1,
  },
  ruleDescription: {
    fontSize: 14,
    color: 'black',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginTop: 16,
    marginBottom: 1,
  },
  createAt: {
    marginLeft: 10,
    fontSize: 16,
    color: '#B6B6B6',
  },
  username: {
    color: 'black',
  },
  verified: {
    marginLeft: 5,
  },
  rulesContainer: {
    marginVertical: 15,
  },
  ruleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ruleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default CommunityAbout;
