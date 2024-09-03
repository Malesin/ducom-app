import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import CommentCard from '../../components/CommentCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CommentScreen = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(null);
  const [comments, setComments] = useState([
    {id: 1, text: 'Comment 1'},
    {id: 2, text: 'Comment 2'},
    {id: 3, text: 'Comment 3'},
    {id: 4, text: 'Comment 4'},
    {id: 5, text: 'Comment 5'},
    {id: 6, text: 'Comment 6'},
    {id: 7, text: 'Comment 7'},
    {id: 8, text: 'Comment 8'},
    {id: 9, text: 'Comment 9'},
    {id: 10, text: 'Comment 10'},
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
    setComments([...comments, {id: comments.length + 1, text}]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.commentContainer}
        contentContainerStyle={{paddingBottom: 50}}>
        {comments.map(comment => (
          <CommentCard key={comment.id} text={comment.text} />
        ))}
      </ScrollView>
      <View style={[styles.inputContainer, {height: inputHeight}]}>
        <Image
          source={require('../../assets/profilepic.png')}
          style={styles.profilePicture}
        />
        <TextInput
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
