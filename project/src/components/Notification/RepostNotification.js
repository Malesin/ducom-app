import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DefaultAvatar from '../../assets/profilepic.png';
import {formatNotification} from '../../pages/Notification/formatNotification';
import { useNavigation } from '@react-navigation/native';

const RepostNotification = ({ repostNotification }) => {
  const navigation = useNavigation();

  const handleRepostNotificationPress = async () => {
    const formattedTweet = await formatNotification(repostNotification);

    if (formattedTweet) {
      navigation.navigate('ViewPost', {
        tweetId: tweet?.id,
        postId: formattedTweet.id,
        idUser: formattedTweet.idUser,
        comments: formattedTweet.comments || [],
        userAvatar: formattedTweet.userAvatar,
        userName: formattedTweet.userName,
        userHandle: formattedTweet.userHandle,
      });
    }
  };


  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 1) return 'now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.card}>
      <TouchableOpacity onPress={handleRepostNotificationPress}>
        <View style={styles.notificationRow}>
          <MaterialCommunityIcons
            name="repeat"
            size={15}
            color="#17BF63"
            style={styles.repostIcon}
          />
          <Image
            source={
              repostNotification?.fromUser?.profilePicture
                ? { uri: repostNotification?.fromUser?.profilePicture }
                : DefaultAvatar
            }
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>
                {repostNotification?.fromUser?.name}
              </Text>
              <Text style={styles.userNameAt}>
                @{repostNotification?.fromUser?.username}
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.date}>
                {formatDate(repostNotification?.created_at)}
              </Text>
            </View>
            <Text style={styles.notificationText}>Reposted your post</Text>
          </View>
          {repostNotification?.post?.media &&
            repostNotification?.post?.media?.length > 0 && (
              <Image
                source={{ uri: repostNotification?.post?.media[0].uri }}
                style={styles.postImage}
              />
            )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repostIcon: {
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 2,
  },
  userNameAt: {
    fontSize: 11,
    color: '#657786',
    marginRight: 5,
  },
  dot: {
    fontSize: 10,
    color: '#657786',
    marginHorizontal: 5,
  },
  notificationText: {
    fontSize: 13,
    color: '#000',
  },
  date: {
    fontSize: 10,
    color: '#657786',
  },
  postImage: {
    width: 40,
    height: 40,
  },
});

export default RepostNotification;
