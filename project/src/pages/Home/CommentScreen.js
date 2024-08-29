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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.commentContainer}>
        <CommentCard />
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
          <TouchableOpacity style={styles.iconContainer}>
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
  },
  commentContainer: {
    flex: 1,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputComment: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 20,
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
    padding: 6,
    borderRadius: 4,
    width: 32,
    height: 32,
    marginRight: 10,
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
  },
});
