import React, {useState, useEffect} from 'react';
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
import PostImage from '../../assets/iya.png';
import {useNavigation} from '@react-navigation/native';
import {formatNotification} from '../../pages/Notification/formatNotification';
import {createThumbnail} from 'react-native-create-thumbnail';

const LikeNotification = ({likeNotification}) => {
  const navigation = useNavigation();
  const [thumbnail, setThumbnail] = useState(null);

  const handleLikeNotificationPress = async () => {
    const formattedTweet = await formatNotification(likeNotification);

    if (formattedTweet) {
      navigation.navigate('ViewPost', {
        tweet: formattedTweet,
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

  const renderUsername = (name, maxLength = 15) => {
    return name.length > maxLength
      ? `${name.substring(0, maxLength)}...`
      : name;
  };

  useEffect(() => {
    const generateThumbnail = async () => {
      if (
        likeNotification?.post?.media &&
        likeNotification.post.media.length > 0
      ) {
        const media = likeNotification.post.media[0];
        if (media.type === 'video' && media.uri) {
          try {
            const {path} = await createThumbnail({url: media.uri});
            setThumbnail(path);
          } catch (error) {
            console.log('Error generating thumbnail:', error);
          }
        }
      }
    };

    generateThumbnail();
  }, [likeNotification]);

  return (
    <SafeAreaView style={styles.card}>
      <TouchableOpacity onPress={handleLikeNotificationPress}>
        <View style={styles.notificationRow}>
          <MaterialCommunityIcons
            name="heart"
            size={15}
            color="#E0245E"
            style={styles.heartIcon}
          />
          <Image
            source={
              likeNotification.like.user.profilePicture
                ? {uri: likeNotification.like.user.profilePicture}
                : DefaultAvatar
            }
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>
                {renderUsername(likeNotification.like.user.name)}
              </Text>
              <Text style={styles.userNameAt}>
                @{likeNotification.like.user.username}
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.date}>
                {formatDate(likeNotification.like.created_at)}
              </Text>
            </View>
            <Text style={styles.notificationText}>Liked your post</Text>
          </View>
          <Image
            source={
              likeNotification?.post?.media &&
              likeNotification.post.media.length > 0 &&
              (likeNotification.post.media[0].type === 'video'
                ? {uri: thumbnail}
                : {uri: likeNotification.post.media[0].uri})
            }
            style={styles.postImage}
          />
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
  heartIcon: {
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

export default LikeNotification;
