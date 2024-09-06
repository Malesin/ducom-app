import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Share,
  FlatList,
  SafeAreaView,
  Alert,
  ToastAndroid,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';
import DefaultAvatar from '../assets/avatar.png';
import BottomSheet from './BottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import config from '../config';
const serverUrl = config.SERVER_URL;

const TweetCard = ({tweet, onDeleteSuccess}) => {
  const [liked, setLiked] = useState(tweet.isLiked);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [bookmarked, setBookmarked] = useState(tweet.isBookmarked);
  const [bookMarksCount, setBookMarksCount] = useState(tweet.bookMarksCount);
  const [commentsCount, setCommentsCount] = useState(tweet.commentsCount);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMediaUri, setModalMediaUri] = useState('');
  const [thumbnails, setThumbnails] = useState({});
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const navigator = useNavigation();

  const handleProfilePress = () => {
    navigator.navigate('Userprofile', { userIdPost: tweet.userIdPost, profilePicture: tweet.profilePicture });
  };

  useEffect(() => {
    const generateThumbnails = async () => {
      const newThumbnails = {};
      for (const media of tweet.media || []) {
        if (media.type === 'video' && media.uri) {
          try {
            const { path } = await createThumbnail({ url: media.uri });
            newThumbnails[media.uri] = path;
          } catch (error) {
            console.log('Error generating thumbnail:', error);
          }
        }
      }
      setThumbnails(newThumbnails);
    };

    generateThumbnails();
  }, [tweet.media]);

  const handleLike = async () => {
    const token = await AsyncStorage.getItem('token');

    if (liked) {
      await handleUnlike();
    } else {
      try {
        const response = await axios.post(`${serverUrl}/like-post`, {
          token: token,
          postId: tweet.id,
        });

        if (response.data.status === 'ok') {
          setLiked(true);
          setLikesCount(prevLikesCount => {
            const newLikesCount = prevLikesCount + 1;
            return newLikesCount;
          });
        } else {
          console.log('Error in like response data:', response.data.data);
          Alert.alert('Error', 'Failed to like post. Please try again.');
        }
      } catch (error) {
        console.error('Error liking post:', error.message);
        Alert.alert('Error', 'Failed to like post. Please try again.');
      }
    }
  };

  const handleUnlike = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.post(`${serverUrl}/unlike-post`, {
        token: token,
        postId: tweet.id,
      });

      if (response.data.status === 'ok') {
        setLiked(false);
        setLikesCount(prevLikesCount => {
          const newLikesCount = prevLikesCount - 1;
          return newLikesCount;
        });
      } else {
        console.log('Error in unlike response data:', response.data.data);
        Alert.alert('Error', 'Failed to unlike post. Please try again.');
      }
    } catch (error) {
      console.error('Error unliking post:', error.message);
      Alert.alert('Error', 'Failed to unlike post. Please try again.');
    }
  };

  const handleBookmark = async () => {
    const token = await AsyncStorage.getItem('token');

    if (bookmarked) {
      await handleUnbookmark();
    } else {
      try {
        const response = await axios.post(`${serverUrl}/bookmark-post`, {
          token: token,
          postId: tweet.id,
        });

        if (response.data.status === 'ok') {
          setBookmarked(true);
          setBookMarksCount(prevBookmarksCount => {
            const newBookmarksCount = prevBookmarksCount + 1;
            return newBookmarksCount;
          });
          ToastAndroid.show('Post added to bookmarks!', ToastAndroid.SHORT);
        } else {
          console.log('Error in bookmark response data:', response.data.data);
        }
      } catch (error) {
        console.error('Error bookmarking post:', error.message);
      }
    }
  };

  const handleUnbookmark = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.post(`${serverUrl}/unbookmark-post`, {
        token: token,
        postId: tweet.id,
      });

      if (response.data.status === 'ok') {
        setBookmarked(false);
        setBookMarksCount(prevBookmarksCount => {
          const newBookmarksCount = prevBookmarksCount - 1;
          return newBookmarksCount;
        });
        ToastAndroid.show('Post removed from bookmarks!', ToastAndroid.SHORT);
      } else {
        console.log('Error in unbookmark response data:', response.data.data);
      }
    } catch (error) {
      console.error('Error unbookmarking post:', error.message);
    }
  };

  const handleCommentPress = () => {
    navigator.navigate('Comment', { postId: tweet.id, idUser: tweet.idUser, profilePicture: tweet.profilePicture});
  };

  const openMediaPreview = uri => {
    setModalMediaUri(uri);
    setIsModalVisible(true);
  };

  const closeMediaPreview = () => {
    setIsModalVisible(false);
    setModalMediaUri('');
  };
  const handleShare = async () => {
    try {
      await Share.share({
        message: tweet.content,
        url: tweet.media && tweet.media.length > 0 ? tweet.media[0].uri : '',
        title: tweet.userName,
      });
    } catch (error) {
      console.error('Error sharing:', error.message);
      Alert.alert('Error', 'Failed to share post. Please try again.');
    }
  };

  const handleOptionPress = () => {
    setShowBottomSheet(true);
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

  const renderMediaItem = ({ item }) => {
    if (!item.uri) {
      return null;
    }

    const mediaStyle =
      tweet.media.length === 1
        ? item.type === 'video'
          ? styles.singleMediaVideo
          : styles.singleMediaImage
        : item.type === 'video'
          ? styles.tweetVideo
          : styles.tweetImage;

    return (
      <TouchableOpacity
        onPress={() => openMediaPreview(item.uri)}
        style={styles.mediaContainer}>
        {item.type === 'image' ? (
          <Image
            source={{ uri: item.uri }}
            style={mediaStyle}
            onError={() => console.log('Failed to load image')}
          />
        ) : (
          <TouchableOpacity
            onPress={() => openMediaPreview(item.uri)}
            style={styles.videoContainer}>
            <Image source={{ uri: thumbnails[item.uri] }} style={mediaStyle} />
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={40}
              color="#fff"
              style={styles.playIcon}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const tweetId = tweet.userId;

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(`${serverUrl}/delete-post`, {
        token: token,
        postId: tweet.id,
      });

      if (response.data.status === 'ok') {
        ToastAndroid.show('Post deleted successfully!', ToastAndroid.SHORT);
        setShowBottomSheet(false); // Tutup BottomSheet
        onDeleteSuccess(); // Panggil fungsi refresh setelah penghapusan berhasil
      } else {
        console.log('Error in delete response data:', response.data.data);
        Alert.alert('Error', 'Failed to delete post. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.card}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => handleProfilePress()}>
          <Image
            source={tweet.userAvatar ? { uri: tweet.userAvatar } : DefaultAvatar}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.userDetails}>
          <TouchableOpacity onPress={() => handleProfilePress()}>
            <Text style={styles.userName}>{tweet.userName}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleProfilePress()}>
            <Text style={styles.userHandle}>@{tweet.userHandle}</Text>
          </TouchableOpacity>
          <Text style={styles.postDate}>{formatDate(tweet.postDate)}</Text>
        </View>

        {/* Options Button */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={handleOptionPress}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="#657786"
            />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showBottomSheet}
          onRequestClose={() => setShowBottomSheet(false)}>
          <TouchableWithoutFeedback onPress={() => setShowBottomSheet(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.bottomSheetContainer}>
            <BottomSheet
              onClose={() => {
                setShowBottomSheet(false);
                onDeleteSuccess(); // Panggil onDeleteSuccess setelah BottomSheet tertutup
              }}
              username={tweet.userHandle}
              postId={tweet.id}
              idUser={tweet.idUser}
              userIdPost={tweet.userIdPost}
              userEmailPost={tweet.userEmailPost}
              allowedEmail={tweet.allowedEmail}
              emailUser={tweet.emailUser}
              onDelete={handleDelete}
            />
          </View>
        </Modal>
      </View>

      {/* Tweet Content */}
      <Text style={styles.tweetText}>{tweet.content || null}</Text>

      {/* Tweet Media with Horizontal Scroll */}
      {tweet.media && tweet.media.length > 0 ? (
        <FlatList
          data={tweet.media}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => item.uri || index.toString()} // Use a unique identifier like 'uri' or fallback to 'index'
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaFlatList}
        />
      ) : null}

      {/* Interactions */}
      <View style={styles.actions}>
        <InteractionButton
          icon={liked ? 'heart' : 'heart-outline'}
          color={liked ? '#E0245E' : '#040608'}
          count={likesCount}
          onPress={handleLike}
        />

        <InteractionButton
          icon="message-reply-outline"
          color="#040608"
          count={commentsCount}
          onPress={() => handleCommentPress()}
        />
        <InteractionButton
          icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
          color={bookmarked ? '#00c5ff' : '#040608'}
          count={bookMarksCount}
          onPress={handleBookmark}
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <MaterialCommunityIcons
            name="export-variant"
            size={20}
            color="#657786"
          />
        </TouchableOpacity>
      </View>

      {/* Modal for Media Preview */}
      <Modal
        visible={isModalVisible}
        transparent
        onRequestClose={closeMediaPreview}
        animationType="fade">
        <TouchableWithoutFeedback onPress={closeMediaPreview}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {modalMediaUri ? (
                modalMediaUri.endsWith('.jpg') ||
                  modalMediaUri.endsWith('.png') ? (
                  <Image
                    source={{ uri: modalMediaUri }}
                    style={styles.modalImage}
                    onError={() => console.log('Failed to load image')}
                  />
                ) : (
                  <Video
                    source={{ uri: modalMediaUri }}
                    style={styles.modalImage}
                    controls
                    resizeMode="contain"
                  />
                )
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const InteractionButton = ({ icon, color, count, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={20} color={color} />
    <Text style={styles.actionText}>{count}</Text>
  </TouchableOpacity>
);

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
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  mediaFlatList: {
    marginVertical: 8,
  },
  tweetImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  singleMediaImage: {
    width: 390,
    height: 200, // Adjust height if needed
    borderRadius: 8,
    resizeMode: 'cover',
  },
  singleMediaVideo: {
    width: 390,
    height: 200, // Adjust height if needed
    borderRadius: 8,
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
  modalContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  videoContainer: {
    width: 390,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  playIcon: {
    position: 'absolute',
  },
});

export default TweetCard;
