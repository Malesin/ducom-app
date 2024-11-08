import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import CommunityUserCard from '../../components/Community/CommunityUserCard';

const CommunityUserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from an API or local data
    const fetchUsers = async () => {
      // Example data
      const userData = [
        { id: 1, name: 'John Doe', username: 'johndoe', profilePicture: null },
        { id: 2, name: 'John Doe', username: 'johndoe', profilePicture: null },
        // Add more users as needed
      ];
      setUsers(userData);
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