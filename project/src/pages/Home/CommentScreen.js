import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard,
  RefreshControl,
  ToastAndroid,
  TouchableWithoutFeedback // Tambahkan import TouchableWithoutFeedback
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import CommentCard from '../../components/CommentCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const CommentScreen = ({ route }) => {
  const { postId, idUser, profilePicture, emailUser } = route?.params;
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(null);
  const [comment, setComment] = useState();
  const textInputRef = React.createRef();
  const [comments, setComments] = useState([]);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [refreshing, setRefreshing] = useState(false); 
  const [placeholder, setPlaceholder] = useState("add comments"); // Tambahkan state placeholder

  const fetchComments = useCallback(async () => {
    setRefreshing(true); 
    try {
      const response = await axios.post(`${serverUrl}/comments`, { postId: postId });
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
            allowedEmail: reply.allowedEmail

          }))
          : [],
        username: comment.user.username,
        profilePicture: comment.user.profilePicture,
        allowedEmail: comment.allowedEmail
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false); // Set refreshing to false saat fetch selesai
    }
  }, [postId]);

  const onRefresh = useCallback(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const onDeleteSuccess = () => {
    ToastAndroid.show('Komentar berhasil dihapus', ToastAndroid.SHORT);
    fetchComments(); // Refresh comments after deletion
  };

  const handleTextInputChange = text => {
    setComment(text);

    if (text.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
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
        parentCommentId: replyToCommentId
      });

      fetchComments();
      setReplyToCommentId(null);
      setComment('');
      setPlaceholder("add comments");
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

  const handleBackgroundPress = () => {
    setComment('');
    setPlaceholder("add comments");
    setReplyToCommentId(null);
    setIsTyping(false);
    Keyboard.dismiss()
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.commentContainer}
            contentContainerStyle={{ paddingBottom: 50 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {comments.map(comment => (
              <CommentCard
                key={comment.id}
                text={comment.text}
                replies={comment.replies}
                hasReplies={comment.replies.length > 0}
                username={comment.username}
                profilePicture={comment.profilePicture}
                onReplyPress={() => handleReplyPress(comment.id, comment.username)} 
                onAddReply={replyText => handleAddReply(comment.id, replyText)}
                commentId={comment.id}
                postId={postId}
                userIdPost={comment.userIdPost}
                idUser={idUser}
                allowedEmail={comment.allowedEmail}
                isLikedCom={comment.isLikedCom}
                emailUser={emailUser}
                onDeleteSuccess={onDeleteSuccess}
              />
            ))}
          </ScrollView>
          <View style={[styles.inputContainer, { height: inputHeight }]}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
            <TextInput
              ref={textInputRef}
              style={[styles.inputComment, { height: inputHeight }]}
              placeholder={placeholder} 
              maxLength={500}
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
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commentContainer: {
    flex: 1,
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
});
