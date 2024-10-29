import React, {useEffect, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {formatNotification} from '../../pages/Home/formatNotification';
import {createThumbnail} from 'react-native-create-thumbnail';

const CommentNotification = ({commentNotification}) => {
  const navigation = useNavigation();
  const [thumbnail, setThumbnail] = useState(null);

  const handleCommentNotification = async () => {
    const formattedTweet = await formatNotification(commentNotification);
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

  useEffect(() => {
    const generateThumbnail = async () => {
      if (
        commentNotification?.post?.media &&
        commentNotification.post.media.length > 0
      ) {
        const media = commentNotification.post.media[0];
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
  }, [commentNotification]);

  return (
    <SafeAreaView style={styles.card}>
      <TouchableOpacity onPress={handleCommentNotification}>
        <View style={styles.notificationRow}>
          <MaterialCommunityIcons
            name="comment-text-outline"
            size={15}
            style={styles.icon}
          />
          <Image
            source={
              commentNotification.comment.user.profilePicture
                ? {uri: commentNotification.comment.user.profilePicture}
                : DefaultAvatar
            }
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.nameAt}>
                {commentNotification.comment.user.name}
              </Text>
              <Text style={styles.dot}> • </Text>
              <Text style={styles.userNameAt}>
                @{commentNotification.comment.user.username}
              </Text>
              <Text style={styles.dot}> • </Text>
              <Text style={styles.date}>
                {formatDate(commentNotification.comment.created_at)}
              </Text>
            </View>
            <View style={styles.commentRowContainer}>
              <View style={styles.commentRow}>
                <Text style={styles.comment}>Commented on your post:</Text>
                <Text style={styles.commentDescription}>
                  {commentNotification.post.description.slice(0, 20)}
                  {commentNotification.post.description.length > 20
                    ? '...'
                    : ''}
                </Text>
              </View>
              <View style={styles.postMediaContainer}>
                <Image
                  source={
                    commentNotification?.post?.media &&
                    commentNotification.post.media.length > 0 &&
                    (commentNotification.post.media[0].type === 'video'
                      ? {uri: thumbnail}
                      : {uri: commentNotification.post.media[0].uri})
                  }
                  style={styles.postImage}
                />
              </View>
            </View>
          </View>
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
  icon: {
    marginRight: 8,
    color: '#000',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  nameAt: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  userNameAt: {
    fontSize: 12,
    color: '#657786',
  },
  dot: {
    fontSize: 13,
    color: '#657786',
  },
  commentRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comment: {
    fontSize: 12,
    color: '#000',
  },
  commentDescription: {
    fontSize: 12,
    color: '#000',
  },
  date: {
    fontSize: 11,
    color: '#657786',
  },
  postMediaContainer: {
    alignSelf: 'flex-end',
  },
  postImage: {
    width: 43,
    height: 43,
    marginRight: 5,
  },
  commentRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export default CommentNotification;
