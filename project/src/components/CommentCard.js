import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import CommentSheet from './CommentSheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommentCard = ({ text, hasReplies, replies, onReplyPress, username, profilePicture, onAddReply, commentId, postId, userIdPost, idUser, allowedEmail }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [gettoken, setGetToken] = useState()

  const tokenconst = async () => {
    const token = await AsyncStorage.getItem('token');
    setGetToken(token)
  }

  useEffect(() => {
    tokenconst()
  }, []);

  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };

  const handleViewMoreReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleActionPress = () => {
    setShowCommentSheet(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: profilePicture } || require('../assets/profilepic.png')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.commentContainer}>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.commentText}>{text}</Text>
          <View style={styles.replyAndLikeContainer}>
            <TouchableOpacity style={styles.replyButton} onPress={onReplyPress}>
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLikePress}>
              <MaterialCommunityIcons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={16}
                color={isLiked ? 'red' : 'black'}
              />
            </TouchableOpacity>
          </View>
          {hasReplies && (
            <TouchableOpacity
              style={styles.viewMoreRepliesButton}
              onPress={handleViewMoreReplies}>
              <Text style={styles.viewMoreRepliesButtonText}>
                {showReplies ? 'Hide replies' : 'View more replies'}
              </Text>
            </TouchableOpacity>
          )}
          {showReplies && (
            <View style={styles.repliesContainer}>
              {replies
                .slice(0, showMoreReplies ? replies.length : 3)
                .map(reply => (
                  <View key={reply.id} style={styles.replyItem}>
                    <CommentCard
                      text={reply.text}
                      username={reply.username}
                      profilePicture={reply.profilePicture}
                      replies={reply.replies} // Nested replies
                      hasReplies={reply.replies.length > 0}
                      onReplyPress={() => onReplyPress(reply.id)} // Reply to nested reply
                      onAddReply={onAddReply}
                      commentId={reply.id}
                      postId={postId}
                      userIdPost={userIdPost}
                      idUser={idUser}
                      allowedEmail={allowedEmail}
                    />
                  </View>
                ))}
              {replies.length > 3 && (
                <TouchableOpacity
                  style={styles.viewMoreRepliesButton}
                  onPress={() => setShowMoreReplies(!showMoreReplies)}>
                  <Text style={styles.viewMoreRepliesButtonText}>
                    {showMoreReplies ? 'Hide more replies' : `View ${replies.length - 3} more replies`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View style={styles.fixedActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleActionPress}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </View>
        <Modal
          style={styles.CommentSheet}
          animationType="slide"
          transparent={true}
          visible={showCommentSheet}
          onRequestClose={() => setShowCommentSheet(false)}>
          <TouchableWithoutFeedback onPress={() => setShowCommentSheet(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.CommentSheetContainer}>
            <CommentSheet
              onClose={() => {
                setShowCommentSheet(false);
              }}
              commentId={commentId}
              postId={postId}
              token={gettoken}
              userIdPost={userIdPost}
              idUser={idUser}
              allowedEmail={allowedEmail}
            />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};


export default CommentCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#fff',
    position: 'relative',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  profileContainer: {
    marginRight: 3,
    position: 'absolute',
    left: 10,
    top: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  commentContainer: {
    flex: 1,
    marginLeft: 60,
    marginRight: 20,
  },
  username: {
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#000',
  },
  commentText: {
    fontSize: 15,
    marginLeft: 5,
    color: '#000',
  },
  replyAndLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyButton: {
    marginLeft: 5,
    marginRight: 5,
  },
  replyButtonText: {
    fontSize: 13,
    color: 'gray',
  },
  actionButton: {
    padding: 5,
  },
  fixedActions: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  CommentSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewMoreRepliesButton: {
    marginTop: 10,
    marginLeft: 5,
  },
  viewMoreRepliesButtonText: {
    fontSize: 13,
    color: 'gray',
  },
  repliesContainer: {
    marginTop: 10,
  },
  replyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  replyUsername: {
    fontWeight: 'bold',
    color: '#000',
  },
  replyText: {
    marginLeft: 5,
    color: '#000',
  },
});
