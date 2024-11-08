import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
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
import {createThumbnail} from 'react-native-create-thumbnail';
import DefaultAvatar from '../assets/profilepic.png';
import BottomSheet from './BottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import config from '../config';
const serverUrl = config.SERVER_URL;
const verifiedIcon = <Icon name="verified" size={16} color="#699BF7" />;

const TweetCard = ({tweet, onRefreshPage, comments, isUserProfile}) => {
  const [liked, setLiked] = useState(tweet?.isLiked || false);
  const [likesCount, setLikesCount] = useState(tweet?.likesCount || 0);
  const [bookmarked, setBookmarked] = useState(tweet?.isBookmarked || false);
  const [bookMarksCount, setBookMarksCount] = useState(
    tweet?.bookMarksCount || 0,
  );
  const [reposted, setReposted] = useState(tweet?.isReposted || false);
  const [repostsCount, setRepostsCount] = useState(tweet?.repostsCount || 0);
  const [commentsCount] = useState(tweet?.commentsCount || 0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMediaUri, setModalMediaUri] = useState('');
  const [thumbnails, setThumbnails] = useState({});
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [dataSent, setDataSent] = useState();
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const navigator = useNavigation();

  const handleProfilePress = () => {
    if (tweet?.userIdPost === tweet?.idUser) {
      navigator.navigate('Profile');
    } else {
      navigator.navigate('Userprofile', {
        userIdPost: tweet?.userIdPost,
        isUserProfile: isUserProfile,
      });
    }
  };

  useEffect(() => {
    const generateThumbnails = async () => {
      const newThumbnails = {};
      for (const media of tweet?.media || []) {
        if (media.type === 'video' && media.uri) {
          try {
            const {path} = await createThumbnail({url: media.uri});
            newThumbnails[media.uri] = path;
          } catch (error) {
            console.log('Error generating thumbnail:', error);
          }
        }
      }
      setThumbnails(newThumbnails);
    };

    const dataSend = async () => {
      const token = await AsyncStorage.getItem('token');
      const dataSent = {
        token: token,
        postId: tweet?.id,
      };
      setDataSent(dataSent);
    };

    if (tweet?.media) {
      generateThumbnails();
    }
    dataSend();
  }, [tweet?.media]);

  const handleLike = async () => {
    try {
      setLiked(liked ? false : true);
      setLikesCount(prevLikesCount =>
        liked ? prevLikesCount - 1 : prevLikesCount + 1,
      );

      await axios.post(
        `${serverUrl}/${liked ? 'unlike' : 'like'}-post`,
        dataSent,
      );
    } catch (error) {
      console.error(
        `Error in ${liked ? 'unliking' : 'liking'} post:`,
        error.message,
      );
      setLiked(liked ? true : false);
      setLikesCount(prevLikesCount =>
        liked ? prevLikesCount + 1 : prevLikesCount - 1,
      );

      ToastAndroid.show(
        `Failed to ${liked ? 'unlike' : 'like'} post. Please try again.`,
        ToastAndroid.SHORT,
      );
    }
  };

  const handleBookmark = async () => {
    try {
      setBookmarked(bookmarked ? false : true);
      setBookMarksCount(prevBookmarksCount =>
        bookmarked ? prevBookmarksCount - 1 : prevBookmarksCount + 1,
      );

      await axios.post(
        `${serverUrl}/${bookmarked ? 'unbookmark' : 'bookmark'}-post`,
        dataSent,
      );

      ToastAndroid.show(
        `Post ${bookmarked ? 'removed' : 'added'} from bookmarks!`,
        ToastAndroid.SHORT,
      );
    } catch (error) {
      console.error(
        `Error in ${bookmarked ? 'unbookmarking' : 'bookmarking'} post:`,
        error.message,
      );
      setBookmarked(bookmarked ? true : false);
      setBookMarksCount(prevBookmarksCount =>
        bookmarked ? prevBookmarksCount + 1 : prevBookmarksCount - 1,
      );

      ToastAndroid.show(
        `Failed to ${
          bookmarked ? 'unbookmark' : 'bookmark'
        } post. Please try again.`,
        ToastAndroid.SHORT,
      );
    }
  };

  const handleRepost = async () => {
    try {
      setReposted(reposted ? false : true);
      setRepostsCount(prevRepostsCount =>
        reposted ? prevRepostsCount - 1 : prevRepostsCount + 1,
      );

      await axios.post(
        `${serverUrl}/${reposted ? 'unrepost' : 'repost'}-post`,
        dataSent,
      );
    } catch (error) {
      console.error(
        `Error in ${reposted ? 'unreposting' : 'reposting'} post:`,
        error.message,
      );
      setReposted(reposted ? true : false);
      setRepostsCount(prevRepostsCount =>
        reposted ? prevRepostsCount + 1 : prevRepostsCount - 1,
      );

      ToastAndroid.show(
        `Failed to ${reposted ? 'unrepost' : 'repost'} post. Please try again.`,
        ToastAndroid.SHORT,
      );
    }
  };

  const handleCommentPress = () => {
    navigator.navigate('ViewPost', {
      tweet,
      comments,
      focusCommentInput: true,
    });
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

  const renderMediaItem = ({item}) => {
    const isImage =
      item.type === 'image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(item.uri);

    const isVideo =
      item.type === 'video' || /\.(mp4|mov|avi|mkv)$/i.test(item.uri);

    const mediaStyle =
      tweet?.media?.length === 1
        ? isVideo
          ? styles.singleMediaVideo
          : styles.singleMediaImage
        : isVideo
        ? styles.tweetVideo
        : styles.tweetImage;

    return (
      <TouchableOpacity onPress={() => openMediaPreview(item.uri)}>
        {isImage ? (
          <Image
            source={{uri: item.uri}}
            style={mediaStyle}
            onError={e => {
              console.error('Image Load Error:', e.nativeEvent.error);
            }}
          />
        ) : isVideo ? (
          <View style={styles.videoContainer}>
            <Image
              source={{uri: thumbnails[item.uri] || item.uri}}
              style={mediaStyle}
            />
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={40}
              color="#fff"
              style={styles.playIcon}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const onDel = async respdel => {
    try {
      if (respdel === 'ok') {
        ToastAndroid.show('Tweet Successfully Deleted', ToastAndroid.SHORT);
        onRefreshPage();
      } else {
        console.log('Error in delete response data:', respdel);
        Alert.alert('Error', 'Failed to delete post. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    }
  };

  const onResp = async resp => {
    try {
      if (resp.status == `ok${resp.type}`) {
        ToastAndroid.show(
          `Tweet Successfully ${resp.typed}`,
          ToastAndroid.SHORT,
        );
      } else if (resp.status == `okUn${resp.type}`) {
        ToastAndroid.show(
          `Tweet Successfully Un${resp.typed}`,
          ToastAndroid.SHORT,
        );
      } else {
        console.error(`Error in ${resp.typing} response data:`, resp.status);
        Alert.alert('Error', `Failed to ${resp.type} post. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${resp.type}:`, error.message);
      Alert.alert('Error', `Failed to ${resp.type}. Please try again.`);
    }
  };

  return (
    <SafeAreaView style={styles.card}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={
              tweet?.userAvatar ? {uri: tweet?.userAvatar} : DefaultAvatar
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.userDetails}>
          <TouchableOpacity onPress={handleProfilePress}>
            <Text
              style={styles.userName}
              numberOfLines={1}
              ellipsizeMode="tail">
              {tweet?.userName?.length > 15
                ? `${tweet?.userName.substring(0, 20)}...`
                : tweet?.userName}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfilePress}>
            <Text style={styles.userHandle} ellipsizeMode="tail">
              @{tweet?.userHandle}
            </Text>
          </TouchableOpacity>
          {tweet?.isAdmin ? (
            <Text style={styles.verifiedIcon}>{verifiedIcon}</Text>
          ) : null}
          <Text style={styles.postDate}>{formatDate(tweet?.postDate)}</Text>
        </View>
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
              onCloseDel={respdel => {
                setShowBottomSheet(false);
                onRefreshPage();
                onDel(respdel);
              }}
              onCloseResp={resp => {
                setShowBottomSheet(false);
                onRefreshPage();
                onResp(resp);
              }}
              tweet={tweet}
              onRefreshPage={onRefreshPage}
              isUserProfile={isUserProfile}
              handlePin={false}
              handlePinUser={false}
            />
          </View>
        </Modal>
      </View>
      {tweet?.content ? (
        <Text style={styles.tweetText}>{tweet?.content}</Text>
      ) : null}
      {tweet?.media && tweet?.media?.length > 0 ? (
        <FlatList
          data={tweet?.media}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => item.uri || index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaFlatList}
        />
      ) : null}
      <View style={styles.actions}>
        <InteractionButton
          icon={liked ? 'heart' : 'heart-outline'}
          color={liked ? '#E0245E' : '#040608'}
          count={likesCount}
          onPress={handleLike}
        />
        <InteractionButton
          icon={
            tweet?.commentsEnabled
              ? 'message-reply-outline'
              : 'message-off-outline'
          }
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
        <InteractionButton
          icon="repeat-variant"
          color={reposted ? '#097969' : '#040608'}
          count={repostsCount}
          onPress={handleRepost}
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <MaterialCommunityIcons
            name="export-variant"
            size={20}
            color="#657786"
          />
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        transparent
        onRequestClose={closeMediaPreview}
        animationType="fade">
        <TouchableWithoutFeedback onPress={closeMediaPreview}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {modalMediaUri ? (
                // Debug logging
                console.log('Modal Media URI:', {
                  uri: modalMediaUri,
                  type: typeof modalMediaUri,
                  isValidUri: /^(http|https):\/\//.test(modalMediaUri),
                }) ||
                // Pengecekan ekstensi file yang lebih komprehensif
                (/\.(jpg|jpeg|png|gif|webp)$/i.test(modalMediaUri) ? (
                  <Image
                    source={{uri: modalMediaUri}}
                    style={styles.modalImage}
                    resizeMode="contain"
                    onError={e => {
                      console.error('Modal Image Load Error:', {
                        error: e.nativeEvent.error,
                        uri: modalMediaUri,
                      });
                    }}
                  />
                ) : /\.(mp4|mov|avi|mkv)$/i.test(modalMediaUri) ? (
                  <Video
                    source={{uri: modalMediaUri}}
                    style={styles.modalVideo}
                    controls
                    resizeMode="contain"
                    onError={error => {
                      console.error('Modal Video Load Error:', {
                        error,
                        uri: modalMediaUri,
                      });
                    }}
                  />
                ) : (
                  // Fallback untuk tipe media tidak dikenali
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Unsupported media type</Text>
                    <Text>{modalMediaUri}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>No media found</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const InteractionButton = ({icon, color, count, onPress}) => (
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
    shadowOffset: {width: 0, height: 2},
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
    marginTop: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 12,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#040608',
    marginRight: 4,
  },
  userHandle: {
    color: '#718096',
    fontWeight: '700',
    marginRight: 7,
    fontSize: 12,
  },
  verifiedIcon: {
    marginLeft: -3,
    marginRight: 6,
    marginTop: 2,
  },
  postDate: {
    color: '#718096',
    fontSize: 10,
  },
  tweetText: {
    fontSize: 15,
    marginVertical: 8,
    color: '#040608',
    marginTop: 5,
  },
  mediaFlatList: {
    marginTop: 5,
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
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  singleMediaVideo: {
    width: '100%',
    height: '100%',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.1)',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  modalVideo: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
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
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0', // Placeholder color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default TweetCard;
