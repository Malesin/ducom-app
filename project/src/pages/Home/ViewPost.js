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
import BottomSheet from '../../components/BottomSheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Skeleton } from 'react-native-elements';
const verifiedIcon = <Icon name="verified" size={16} color="#699BF7" />;

const serverUrl = config.SERVER_URL;

const ViewPost = ({ route }) => {
  const { tweet, focusCommentInput, isUserProfile } = route?.params || {};

  const [liked, setLiked] = useState(tweet?.isLiked);
  const [likesCount, setLikesCount] = useState(tweet?.likesCount);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookMarksCount, setBookMarksCount] = useState(0);
  const [reposted, setReposted] = useState(false);
  const [repostsCount, setRepostsCount] = useState(0);
  const profilePicture = tweet?.profilePicture;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [inputHeight, setInputHeight] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const textInputRef = React.createRef();
  const [visibleComments, setVisibleComments] = useState(3);
  const [placeholder, setPlaceholder] = useState('Add Comments');
  const colorScheme = useColorScheme();

  const [refreshing, setRefreshing] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isEnabledComm, setIsEnabledComm] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dataSent, setDataSent] = useState();
  const isOwner = tweet?.userIdPost === tweet?.idUser;

  useEffect(() => {
    if (focusCommentInput && textInputRef.current) {
      textInputRef.current.focus();
    }
    const data = async () => {
      const token = await AsyncStorage.getItem('token');
      const dataSent = {
        token: token,
        postId: tweet?.id
      }
      setDataSent(dataSent)
    }
    data()


  }, [focusCommentInput]);

  useEffect(() => {
    const generateThumbnails = async () => {
      const newThumbnails = {};
      for (const media of tweet?.media || []) {
        if (media.type === 'video' && media.uri) {
          try {
            const { path } = await createThumbnail({ url: media.uri });
            newThumbnails[media.uri] = path;
          } catch (error) {
            console.log('Error generating thumbnail:', error);
          }
        }
      }
      setThumbnails(prevThumbnails => ({
        ...prevThumbnails,
        ...newThumbnails,
      }));
    };

    if (tweet?.media) {
      generateThumbnails();
    }
  }, [tweet?.media]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    fetchComments();
    isEnabledComment();

    return () => clearTimeout(timer);
  }, [fetchComments]);

  const handleLike = async () => {
    console.log('Like button pressed');
    try {
      setLiked(liked ? false : true);
      setLikesCount(prevLikesCount =>
        liked ? prevLikesCount - 1 : prevLikesCount + 1,
      );

      await axios.post(
        `${serverUrl}/${liked ? 'unlike' : 'like'}-post`,
        dataSent,
      )

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
    console.log('Bookmark button pressed');
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
        `Failed to ${bookmarked ? 'unbookmark' : 'bookmark'
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

      const formattedComments = dataComment
        .filter(comment => comment.user !== null)
        .map(comment => ({
          id: comment._id,
          text: comment.comment,
          userIdPost: comment.user._id,
          idUser: tweet.idUser,
          isLikedCom: comment.likes.some(like => like.user === tweet.idUser),
          replies: Array.isArray(comment.replies)
            ? comment.replies.map(reply => ({
              id: reply._id,
              text: reply.comment,
              userIdPost: reply.user._id,
              idUser: tweet.idUser,
              username: reply.user.username,
              isLikedCom: reply.likes.some(like => like.user === tweet.idUser),
              profilePicture: reply.user.profilePicture,
              replies: reply.replies || [],
            }))
            : [],
          username: comment.user.username,
          profilePicture: comment.user.profilePicture,
          isAdmin: comment.user.isAdmin,
        }));
      setComments(formattedComments || []);
      setVisibleComments(3);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [tweet.id]);

  const isEnabledComment = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(`${serverUrl}/isenabled-comments`, {
        token: token,
        postId: tweet.id,
      });
      setIsEnabledComm(response.data.data.commentsEnabled);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    fetchComments();
    isEnabledComment();
    setShowBottomSheet(false);

    return () => clearTimeout(timer);
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
        postId: tweet.id,
        comment: comment,
        parentCommentId: replyToCommentId || null,
      });

      fetchComments();
      setReplyToCommentId(null);
      setComment('');
      setPlaceholder('Add Comments');
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
    console.log('Reply button pressed');
    setIsReplying(true);
    setReplyToCommentId(null);
    setPlaceholder('Add Comments');
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const onRefreshPage = () => {
    setRefreshing(true);
    setShowBottomSheet(false);
    onRefresh();
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHeader}>
        <Skeleton
          animation="pulse"
          circle
          height={50}
          width={50}
          style={styles.skeletonAvatar}
        />
        <View style={styles.skeletonTextContainer}>
          <Skeleton
            animation="pulse"
            height={20}
            width="30%"
            style={styles.skeleton}
          />
          <Skeleton
            animation="pulse"
            height={14}
            width="20%"
            style={styles.skeleton}
          />
        </View>
        <Skeleton
          animation="pulse"
          height={30}
          width={10}
          style={styles.skeletonVertical}
          borderRadius={3}
        />
      </View>
      <Skeleton
        animation="pulse"
        height={20}
        width="80%"
        style={[styles.skeleton, { borderRadius: 3 }]}
      />
      <Skeleton
        animation="pulse"
        height={200}
        width="100%"
        style={[styles.skeleton, { borderRadius: 8, marginTop: 10 }]}
      />
      <Skeleton
        animation="pulse"
        height={17}
        width="50%"
        style={[styles.skeleton, { borderRadius: 3, marginTop: 10 }]}
      />
      <Skeleton
        animation="pulse"
        height={1}
        width="100%"
        style={[styles.skeleton, { borderRadius: 3, marginTop: 5 }]}
      />
      <Skeleton
        animation="pulse"
        height={16}
        width="58%"
        style={[styles.skeleton, { borderRadius: 3, marginTop: 5 }]}
      />
      <Skeleton
        animation="pulse"
        height={1}
        width="100%"
        style={[styles.skeleton, { borderRadius: 3, marginTop: 5 }]}
      />
      <View style={styles.skeletonIconRow}>
        <Skeleton
          animation="pulse"
          circle
          height={20}
          width={20}
          style={styles.skeletonIcon}
        />
        <Skeleton
          animation="pulse"
          circle
          height={20}
          width={20}
          style={styles.skeletonIcon}
        />
        <Skeleton
          animation="pulse"
          circle
          height={20}
          width={20}
          style={styles.skeletonIcon}
        />
        <Skeleton
          animation="pulse"
          circle
          height={20}
          width={20}
          style={styles.skeletonIcon}
        />
        <Skeleton
          animation="pulse"
          circle
          height={20}
          width={20}
          style={styles.skeletonIcon}
        />
      </View>
      <Skeleton
        animation="pulse"
        height={1}
        width="100%"
        style={[styles.skeleton, { borderRadius: 3, marginTop: 5 }]}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        renderSkeleton()
      ) : (
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
                  {tweet.isAdmin ? (
                    <Text style={styles.verifiedIcon}>{verifiedIcon}</Text>
                  ) : null}
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
                onPress={() => setShowBottomSheet(true)}>
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
                <Text style={styles.interactionNumber}>{bookMarksCount}</Text>{' '}
                Bookmarks{' '}
              </Text>
              <Text style={styles.interactionText}>
                <Text style={styles.interactionNumber}>{likesCount}</Text> Likes{' '}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLike}>
                <MaterialCommunityIcons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={liked ? '#E0245E' : '#040608'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleReplyIconPress}>
                <MaterialCommunityIcons
                  name={
                    isEnabledComm
                      ? 'message-reply-outline'
                      : 'message-off-outline'
                  }
                  size={20}
                  color="#040608"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleBookmark}>
                <MaterialCommunityIcons
                  name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={bookmarked ? '#00c5ff' : '#040608'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleRepost}>
                <MaterialCommunityIcons
                  name="repeat-variant"
                  size={22}
                  color={reposted ? '#097969' : '#040608'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}>
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
                  onAddReply={replyText =>
                    handleAddReply(comment.id, replyText)
                  }
                  commentId={comment.id}
                  postId={tweet.id}
                  userIdPost={comment.userIdPost}
                  idUser={tweet.idUser}
                  isLikedCom={comment.isLikedCom}
                  isAdmin={comment.isAdmin}
                  amIAdmin={tweet.amIAdmin}
                  onDeleteSuccess={onDeleteSuccess}
                />
              ))}
              {visibleComments < comments.length && (
                <TouchableOpacity
                  onPress={() =>
                    setVisibleComments(prevCount => prevCount + 3)
                  }>
                  <Text style={styles.loadMoreText}>Load more comments</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      )}
      <View style={[styles.inputContainer, { height: inputHeight }]}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />

        {isEnabledComm || isOwner || tweet?.amIAdmin ? (
          <>
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
          </>
        ) : (
          <>
            <Text
              style={[
                styles.commentDisabled,
                { color: colorScheme === 'dark' ? '#ccc' : '#888' },
              ]}>
              Comments Disabled
            </Text>
          </>
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
            isEnabledComm={isEnabledComm}
            viewPost={true}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    marginLeft: 4,
    marginTop: 2,
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
    marginLeft: 1,
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
  commentDisabled: {
    marginLeft: 15,
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
  skeletonContainer: {
    padding: 7,
    alignItems: 'flex-start',
    width: '100%',
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  skeletonAvatar: {
    marginRight: 10,
  },
  skeletonTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  skeleton: {
    marginBottom: 10,
  },
  skeletonIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  skeletonIcon: {
    marginHorizontal: 5,
  },
  skeletonVertical: {
    position: 'absolute',
    right: 20,
    top: 0,
  },
});
