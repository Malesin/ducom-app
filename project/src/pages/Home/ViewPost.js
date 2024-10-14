import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Share,
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
  TextInput,
  Keyboard,
  useColorScheme,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import Video from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';
import CommentCard from '../../components/CommentCard';
import BottomSheet from '../../components/BottomSheet'; // Tambahkan ini jika belum ada
import Icon from 'react-native-vector-icons/MaterialIcons';
const verifiedIcon = <Icon name="verified" size={16} color="#699BF7" />;

const serverUrl = config.SERVER_URL;

const ViewPost = ({ route }) => {
  const {
    tweet,
    comments: initialComments,
    postId,
    idUser,
    emailUser,
    focusCommentInput,
    onRefreshPage,
    isUserProfile
  } = route?.params || {};

  const [liked, setLiked] = useState(tweet.isLiked);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [bookmarked, setBookmarked] = useState(tweet.isBookmarked);
  const [bookmarksCount, setBookmarksCount] = useState(tweet.bookMarksCount);
  const [profilePicture, setProfilePicture] = useState(tweet.profilePicture);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [inputHeight, setInputHeight] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(initialComments || []);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const textInputRef = React.createRef();
  const [visibleComments, setVisibleComments] = useState(3);
  const [placeholder, setPlaceholder] = useState('add comments');
  const colorScheme = useColorScheme();

  const [refreshing, setRefreshing] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false); // Tambahkan state ini

  console.log("tweet:", tweet.comments)

  useEffect(() => {
    if (focusCommentInput && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [focusCommentInput]);

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
          setLikesCount(prevLikesCount => prevLikesCount + 1);
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
        setLikesCount(prevLikesCount => prevLikesCount - 1);
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
          setBookmarksCount(prevBookmarksCount => prevBookmarksCount + 1);
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
        setBookmarksCount(prevBookmarksCount => prevBookmarksCount - 1);
        ToastAndroid.show('Post removed from bookmarks!', ToastAndroid.SHORT);
      } else {
        console.log('Error in unbookmark response data:', response.data.data);
      }
    } catch (error) {
      console.error('Error unbookmarking post:', error.message);
    }
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

  const formatDate = dateString => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day} ${month} ${year}`;
  };

  const InteractionButton = ({ icon, color, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </TouchableOpacity>
  );
  console.log(tweet.isAdmin)
  const handleMediaPress = mediaItem => {
    setSelectedMedia(mediaItem);
    setModalVisible(true);
  };

  const closeMediaPreview = () => {
    setModalVisible(false);
    setSelectedMedia(null);
  };

  const fetchComments = useCallback(async () => {
    setRefreshing(true);
    try {
      const url = `${serverUrl}/comments`;
      const params = { postId: tweet.id };

      const response = await axios.post(url, params);
      const dataComment = response.data.data;

      const formattedComments = dataComment.map(comment => ({
        id: comment._id,
        text: comment.comment,

        userIdPost: comment.user._id,
        idUser: idUser,
        email: comment.user.email,
        isLikedCom: comment.likes.some(like => like.user === idUser),
        replies: Array.isArray(comment.replies)
          ? comment.replies.map(reply => ({
            id: reply._id,
            text: reply.comment,
            userIdPost: reply.user._id,
            idUser: idUser,
            username: reply.user.username,
            email: reply.user.email,
            isLikedCom: reply.likes.some(like => like.user === idUser),
            profilePicture: reply.user.profilePicture,
            replies: reply.replies || [],
            allowedEmail: reply.allowedEmail,
          }))
          : [],
        username: comment.user.username,
        profilePicture: comment.user.profilePicture,
        allowedEmail: comment.allowedEmail,
        isAdmin: comment.user.isAdmin
      }));

      setComments(formattedComments);
      setVisibleComments(3);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [tweet.id]);
  
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const onRefresh = useCallback(() => {
    fetchComments();
  }, [fetchComments]);

  const onDeleteSuccess = () => {
    ToastAndroid.show('Komentar berhasil dihapus', ToastAndroid.SHORT);
    fetchComments();
  };

  const handleTextInputChange = text => {
    setComment(text);
    setIsTyping(text.length > 0);
  };

  const handleTextInputContentSizeChange = event => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };
  const handleAddComment = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(`${serverUrl}/comment-post`, {
        token: token,
        postId: postId,
        comment: comment,
        parentCommentId: replyToCommentId || null,
      });

      fetchComments();
      setReplyToCommentId(null);
      setComment('');
      setPlaceholder('add comments');
      setIsTyping(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error data:', error);
    }
  };

  const handleReplyPress = (commentId, username) => {
    setIsTyping(true);
    setReplyToCommentId(commentId);
    setPlaceholder(`add reply @${username}`);
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleReplyIconPress = () => {
    setIsReplying(true);
    setReplyToCommentId(null);
    setPlaceholder('add comments');
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.postContainer}>
          <View style={styles.headerContainer}>
            <Image
              source={
                tweet.userAvatar
                  ? { uri: tweet.userAvatar }
                  : require('../../assets/profilepic.png')
              }
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <View style={styles.usernameContainer}>
                <Text
                  style={[
                    styles.userName,
                    { color: colorScheme === 'dark' ? '#000000' : '#000' },
                  ]}>
                  {tweet.userName}
                </Text>
                {tweet.isAdmin ? (<Text style={styles.verifiedIcon}>{verifiedIcon}</Text>) : null}
              </View>

              <Text
                style={[
                  styles.userHandle,
                  { color: colorScheme === 'dark' ? '#ccc' : 'gray' },
                ]}>
                @{tweet.userHandle}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => setShowBottomSheet(true)} // Ubah ini
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={26}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.postContent}>{tweet.content}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(tweet.media || []).map((mediaItem, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleMediaPress(mediaItem.uri)}>
                  {mediaItem.type === 'image' ? (
                    <Image
                      source={{ uri: mediaItem.uri }}
                      style={
                        tweet.media.length === 1
                          ? styles.singleMediaImage
                          : styles.tweetImage
                      }
                      onError={() => console.log('Failed to load image')}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleMediaPress(mediaItem.uri)}
                      style={styles.videoContainer}>
                      <Image
                        source={{ uri: thumbnails[mediaItem.uri] }}
                        style={
                          tweet.media.length === 1
                            ? styles.singleMediaVideo
                            : styles.tweetVideo
                        }
                      />
                      <MaterialCommunityIcons
                        name="play-circle-outline"
                        size={40}
                        color="#fff"
                        style={styles.playIcon}
                      />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.postDate}>{formatDate(tweet.postDate)}</Text>
          </View>
          <View style={styles.interactionsContainer}>
            <Text style={styles.interactionText}>
              <Text style={styles.interactionNumber}>
                {tweet.commentsCount}
              </Text>{' '}
              Comments{' '}
            </Text>
            <Text style={styles.interactionText}>
              <Text style={styles.interactionNumber}>{bookmarksCount}</Text>{' '}
              Bookmarks{' '}
            </Text>
            <Text style={styles.interactionText}>
              <Text style={styles.interactionNumber}>{likesCount}</Text> Likes{' '}
            </Text>
          </View>
          <View style={styles.actions}>
            <InteractionButton
              icon={liked ? 'heart' : 'heart-outline'}
              color={liked ? '#E0245E' : '#040608'}
              onPress={handleLike}
            />
            <InteractionButton
              icon="message-reply-outline"
              color="#040608"
              onPress={handleReplyIconPress}
            />
            <InteractionButton
              icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
              color={bookmarked ? '#00c5ff' : '#040608'}
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
          <View style={styles.commentContainer}>
            {comments.slice(0, visibleComments).map(comment => (
              <CommentCard
                key={comment.id}
                text={comment.text}
                tweet={tweet}
                replies={comment.replies}
                hasReplies={comment.replies.length > 0}
                username={comment.username}
                profilePicture={comment.profilePicture}
                onReplyPress={() =>
                  handleReplyPress(comment.id, comment.username)
                }
                onAddReply={replyText => handleAddReply(comment.id, replyText)}
                commentId={comment.id}
                postId={postId}
                userIdPost={comment.userIdPost}
                idUser={idUser}
                allowedEmail={comment.allowedEmail}
                isLikedCom={comment.isLikedCom}
                emailUser={emailUser}
                isAdmin={comment.isAdmin}
                amIAdmin={tweet.amIAdmin}
                userEmailPost={tweet.userEmailPost}
                onDeleteSuccess={onDeleteSuccess}
              />
            ))}
            {visibleComments < comments.length && (
              <TouchableOpacity
                onPress={() => setVisibleComments(prevCount => prevCount + 3)}>
                <Text style={styles.loadMoreText}>Load more comments</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.inputContainer, { height: inputHeight }]}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        <TextInput
          ref={textInputRef}
          style={[
            styles.inputComment,
            {
              height: inputHeight,
              color: colorScheme === 'dark' ? '#000000' : '#000',
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
          maxLength={300}
          multiline={true}
          value={comment}
          onChangeText={handleTextInputChange}
          onContentSizeChange={handleTextInputContentSizeChange}
        />

        {isTyping && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => handleAddComment()}>
            <MaterialCommunityIcons
              name="upload"
              size={20}
              color="#fff"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {selectedMedia && (
        <Modal
          visible={modalVisible}
          transparent
          onRequestClose={closeMediaPreview}
          animationType="fade">
          <TouchableWithoutFeedback onPress={closeMediaPreview}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                {selectedMedia.endsWith('.jpg') ||
                  selectedMedia.endsWith('.png') ? (
                  <Image
                    source={{ uri: selectedMedia }}
                    style={styles.modalImage}
                    onError={() => console.log('Failed to load image')}
                  />
                ) : (
                  <Video
                    source={{ uri: selectedMedia }}
                    style={styles.modalImage}
                    controls
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBottomSheet}
        onRequestClose={() => setShowBottomSheet(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowBottomSheet(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheetContainer}>
          <BottomSheet
              onCloseDel={(respdel) => {
                setShowBottomSheet(false);
                onRefreshPage();
                onDel(respdel)
              }}
              onCloseResp={(resp) => {
                setShowBottomSheet(false);
                onRefreshPage();
                onResp(resp)
              }}
              tweet={tweet}
              onRefreshPage={onRefreshPage}
              isUserProfile={isUserProfile}
              handlePin={false}
              handlePinUser={false}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ViewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  postContainer: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  usernameContainer: {
    flexDirection: 'row', // Tambahkan ini untuk mengatur elemen dalam satu baris
    alignItems: 'center', // Tambahkan ini untuk menyelaraskan elemen secara vertikal
  },
  verifiedIcon: {
    marginLeft: 4,
    marginTop: 2
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  userHandle: {
    color: 'gray',
    fontSize: 13,
  },
  optionsButton: {
    marginLeft: 'auto',
    padding: 10,
  },
  postContent: {
    fontSize: 16,
    marginVertical: 10,
    color: 'black',
  },
  media: {
    width: 300,
    height: 200,
    marginRight: 10,
  },
  postDate: {
    color: 'gray',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  interactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'gray',
    borderBottomColor: 'gray',
    width: '100%',
    padding: 5,
  },
  interactionText: {
    color: 'gray',
  },
  interactionNumber: {
    color: 'black',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
  },
  actionButton: {
    padding: 10,
  },
  fullScreenMedia: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
    width: 390,
    height: 200,
    borderRadius: 8,
  },
  tweetVideo: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
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
  newContainer: {
    padding: 20,
    backgroundColor: 'gray',
  },
  commentContainer: {
    width: '100%',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadMoreText: {
    color: '#616161',
    textAlign: 'center',
    marginVertical: 10,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderTopWidth: 1,
  },
  inputComment: {
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 18,
    flex: 1,
    marginLeft: 10,
    height: null,
    fontSize: 13,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconContainer: {
    backgroundColor: '#001374',
    padding: 4,
    borderRadius: 4,
    width: 28,
    height: 28,
    marginRight: 10,
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
});