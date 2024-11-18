import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import CommunityUserCard from '../../components/Community/CommunityUserCard';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const CommunityUserList = () => {
  const route = useRoute()
  const { communityId } = route?.params
  const [users, setUsers] = useState([]);
console.log(users)
  useEffect(() => {
    // Fetch users from an API or local data
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        await axios
          .post(`${serverUrl}/community-users`, {
            token, communityId
          })
          .then(response => {
            const userData = response?.data?.data?.members
            setUsers(userData);
          })
      } catch (error) {
        console.error(error)
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {users.map((user) => (
          <CommunityUserCard key={user.id} user={user} />
        ))}
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
});