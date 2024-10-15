import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

export const formatNotification = async notification => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${serverUrl}/userdata`, {token: token});
    const {data} = response.data;

    const idUser = data._id;
    const profilePicture = data.profilePicture;
    const post = notification.post;

    const totalComments =
      post.comments.length +
      post.comments.reduce((acc, comment) => acc + comment.replies.length, 0);

    return {
      id: post._id,
      userAvatar: post.user.profilePicture,
      userName: post.user.name,
      userHandle: post.user.username,
      postDate: post.created_at,
      content: post.description,
      media: Array.isArray(post.media)
        ? post.media.map(mediaItem => ({
            type: mediaItem.type,
            uri: mediaItem.uri,
          }))
        : [],
      likesCount: post.likes.length,
      commentsCount: totalComments,
      bookMarksCount: post.bookmarks.length,
      isLiked: post.likes.some(like => like._id === idUser),
      isBookmarked: post.bookmarks.some(bookmark => bookmark.user === idUser),
      userIdPost: post.user._id,
      idUser: idUser,
      profilePicture: profilePicture,
    };
  } catch (error) {
    console.error('Error formatting notification:', error);
    return null;
  }
};
