import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import CommentCard from '../../components/CommentCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const CommentScreen = ({ route }) => {
  const { postId, idUser, profilePicture } = route?.params;
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(null);
  const [comment, setComment] = useState();
  const textInputRef = React.createRef();
  const [comments, setComments] = useState([]);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.post(`${serverUrl}/comments`, { postId: postId });
      const dataComment = response.data.data;

      const formattedComments = dataComment.map(comment => ({
        id: comment._id,
        text: comment.comment,
        userIdPost: comment.user._id,
        idUser: idUser,
        email: comment.user.email,
        replies: Array.isArray(comment.replies)
          ? comment.replies.map(reply => ({
            id: reply._id,
            text: reply.comment,
            userIdPost: reply.user._id,
            idUser: idUser,
            username: reply.user.username,
            email: reply.user.email,
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
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleTextInputChange = text => {
    if (text.length > 0) {
      setIsTyping(true);
      setComment(text);
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
      const respAddCom = await axios.post(`${serverUrl}/comment-post`, {
        token: token,
        postId: postId,
        comment: comment,
        parentCommentId: replyToCommentId // Parent comment ID is sent
      });

      fetchComments(); // Fetch updated comments after adding a new one
      setReplyToCommentId(null); // Reset the reply-to comment
      setComment(''); // Clear the input field
      Keyboard.dismiss(); // Hide the keyboard after sending the comment
    } catch (error) {
      console.error('Error data:', error);
    }
  };

  const handleReplyPress = (commentId) => {
    setIsTyping(true);
    setReplyToCommentId(commentId); // Set the comment/reply to reply to
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.commentContainer}
        contentContainerStyle={{ paddingBottom: 50 }}>
        {comments.map(comment => (
          <CommentCard
            key={comment.id}
            text={comment.text}
            replies={comment.replies}
            hasReplies={comment.replies.length > 0}
            username={comment.username}
            profilePicture={comment.profilePicture}
            onReplyPress={() => handleReplyPress(comment.id)}
            onAddReply={replyText => handleAddReply(comment.id, replyText)}
            commentId={comment.id}
            postId={postId}
            userIdPost={comment.userIdPost}
            idUser={idUser}
            allowedEmail={comment.allowedEmail}
          />
        ))}
      </ScrollView>
      <View style={[styles.inputContainer, { height: inputHeight }]}>
        <Image
          source={{uri: profilePicture}}
          style={styles.profilePicture}
        />
        <TextInput
          ref={textInputRef}
          style={[styles.inputComment, { height: inputHeight }]}
          placeholder="add comments"
          maxLength={500}
          multiline={true}
          value={comment} // Bind the state to the TextInput
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
