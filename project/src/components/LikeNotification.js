import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import DefaultAvatar from '../assets/profilepic.png';

const formatDate = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const gmt7Offset = 7 * 60 * 60 * 1000; 
  const diffInSeconds = Math.floor((now - date - gmt7Offset) / 1000);

  if (diffInSeconds < 1) return 'now';
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 52) return `${diffInWeeks}w`;
  const diffInYears = Math.floor(diffInWeeks / 52);
  return `${diffInYears}y`;
};

const LikeNotification = ({ notification }) => {
  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleNotificationPress}>
        <View style={styles.userInfo}>
          <Image source={notification.like.user.profilePicture ? { uri: notification.like.user.profilePicture } : DefaultAvatar} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{notification.like.user.name}</Text>
            <Text style={styles.userHandle}>@{notification.like.user.username}</Text>
            <Text style={styles.postDate}>{formatDate(notification.like.created_at)}</Text>
          </View>
        </View>
        <Text style={styles.tweetText}>Liked your post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 7,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 49,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#040608',
    marginRight: 4,
  },
  userHandle: {
    color: '#718096',
    fontWeight: '700',
    marginRight: 8,
  },
  postDate: {
    color: '#718096',
    fontSize: 12,
  },
  tweetText: {
    fontSize: 15,
    marginVertical: 8,
    color: '#040608',
  },
  noNotificationText: {
    fontSize: 15,
    color: '#040608',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    color: '#040608',
  },
  optionsContainer: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsButton: {
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

export default LikeNotification;