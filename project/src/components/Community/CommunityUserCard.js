import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const CommunityUserCard = ({ user }) => {
  return (
    <View style={styles.container}>
      <Image
        source={
          user?.profilePicture
            ? { uri: user?.profilePicture }
            : require('../../assets/profilepic.png')
        }
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{user?.name}</Text>
        <Text style={styles.userhandle}>@{user?.username}</Text>
      </View>
    </View>
  );
};

export default CommunityUserCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  profileImage: {
    marginLeft: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  userhandle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ccc',
  },
});