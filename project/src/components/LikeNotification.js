import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DefaultAvatar from '../assets/profilepic.png';

const LikeNotification = ({ notification }) => {
  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleNotificationPress}>
        <View style={styles.notificationRow}>
          <MaterialCommunityIcons name="heart" size={30} color="#E0245E" style={styles.heartIcon} />
          <Image source={notification.like.user.profilePicture ? { uri: notification.like.user.profilePicture } : DefaultAvatar} style={styles.avatar} />
          <Text style={styles.userName}>{notification.like.user.name} liked your post</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    width: '100%',
    maxWidth: 800,
    borderColor: '#E1E8ED',
    borderWidth: 1,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#040608',
  },
});

export default LikeNotification;
