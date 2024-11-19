import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const verifiedIcon = <Icon name="verified" size={14} color="#699BF7" />;

const CommunityUserCard = ({ user }) => {
  return (
    <View style={styles.container}>
      <Image
        source={
          user?.user?.profilePicture
            ? { uri: user?.user?.profilePicture }
            : require('../../assets/profilepic.png')
        }
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{user?.user?.name}</Text>
          {user?.user?.isAdmin ? (
            <Text style={styles.verifiedIcon}>{verifiedIcon}</Text>
          ) : null}
        </View>
        <Text style={styles.userhandle}>@{user?.user?.username}</Text>
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
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  verifiedIcon: {
    marginLeft: 5
  },
  userhandle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ccc',
  },
});