import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import CommentCard from '../../components/CommentCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CommentScreen = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(null);
  const textInputRef = React.createRef();

  const [comments, setComments] = useState([
    {
      id: 1,
      text: 'dikit lagi lucu bang',
      replies: [
        {id: 1, text: 'elu kali yang lucu'},
        {id: 2, text: 'lol amat ni orang'},
      ],
    },
    {
      id: 2,
      text: 'keren bang motornya, info spek',
      replies: [
        {id: 1, text: 'spek 63 kayaknya bang'},
        {id: 2, text: 'knalpot pake merk apa bang'},
        {id: 3, text: 'arm bor2an'},
        {id: 4, text: 'master rem pake apa bang'},
      ],
    },
    {
      id: 3,
      text: 'info settingan kiriannya bang',
      replies: [],
    },
  ]);

  const handleTextInputChange = text => {
    if (text.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  };

  const handleTextInputContentSizeChange = event => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const handleAddComment = text => {
    setComments([...comments, {id: comments.length + 1, text, replies: []}]);
  };

  const handleAddReply = (commentId, replyText) => {
    setComments(
      comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {id: comment.replies.length + 1, text: replyText},
            ],
          };
        }
        return comment;
      }),
    );
  };

  const handleReplyPress = useCallback(
    commentId => {
      setIsTyping(true);
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    },
    [textInputRef, setIsTyping],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.commentContainer}
        contentContainerStyle={{paddingBottom: 50}}>
        {comments.map(comment => (
          <CommentCard
            key={comment.id}
            text={comment.text}
            replies={comment.replies}
            hasReplies={comment.replies.length > 0}
            onAddReply={replyText => handleAddReply(comment.id, replyText)}
            onReplyPress={() => handleReplyPress(comment.id)}
          />
        ))}
      </ScrollView>
      <View style={[styles.inputContainer, {height: inputHeight}]}>
        <Image
          source={require('../../assets/profilepic.png')}
          style={styles.profilePicture}
        />
        <TextInput
          ref={textInputRef}
          style={[styles.inputComment, {height: inputHeight}]}
          placeholder="add comments"
          maxLength={500}
          multiline={true}
          onChangeText={handleTextInputChange}
          onContentSizeChange={handleTextInputContentSizeChange}
        />
        {isTyping && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => handleAddComment(text)}>
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
