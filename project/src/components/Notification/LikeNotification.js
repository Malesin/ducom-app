import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DefaultAvatar from '../../assets/profilepic.png';
import { useNavigation } from '@react-navigation/native';
import { formatNotification } from '../../pages/Home/formatNotification';

const LikeNotification = ({ likeNotification }) => {
  const navigation = useNavigation();
  console.log("formattedTweet: ", likeNotification )

  const handleLikeNotificationPress = async () => {
    const formattedTweet = await formatNotification(likeNotification);

    if (formattedTweet) {
      navigation.navigate('ViewPost', {
        tweet: formattedTweet,
        postId: formattedTweet.id,
        idUser: formattedTweet.idUser,
        emailUser: formattedTweet.emailUser,
        comments: formattedTweet.comments || [],
        userAvatar: formattedTweet.userAvatar, // Pastikan ini dikirim
        userName: formattedTweet.userName, // Pastikan ini dikirim
        userHandle: formattedTweet.userHandle, // Pastikan ini dikirim
      });
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 1) {
      return 'now';
    }

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w ago`;
    }

    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.card}>
      <TouchableOpacity onPress={handleLikeNotificationPress}>
        <View style={styles.notificationRow}>
          <MaterialCommunityIcons name="heart" size={30} color="#E0245E" style={styles.heartIcon} />
          <Image source={likeNotification.like.user.profilePicture ? { uri: likeNotification.like.user.profilePicture } : DefaultAvatar} style={styles.avatar} />
          <Text style={styles.userNameAt}>
            @{likeNotification.like.user.username}
          </Text>
          <Text style={styles.userName}>
            liked your post.</Text>
          <Text style={styles.date}> {formatDate(likeNotification.like.created_at)} </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 15,
    color: '#000',
  },
  userNameAt: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#000',
  },
});

export default LikeNotification;
