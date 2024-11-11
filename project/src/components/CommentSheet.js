import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const serverUrl = config.SERVER_URL;

const CommentSheet = ({ commentId, postId, token, idUser, userIdPost, onDeleteSuccess, onClose, parentCommentId, amIAdmin, childComment }) => {

  const navigation = useNavigation();
  const [isOwn, setIsOwn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(amIAdmin)
  useEffect(() => {

    if (idUser == userIdPost) {
      console.log("own")
      setIsOwn(true)
    } else if (amIAdmin) {
      console.log("admin")
      setIsAdmin(true)
    } else {
      console.log("user")
      setIsOwn(false)
    }
  }, [idUser, userIdPost, amIAdmin]);

  // reportCommentId ITU ANAK COMMENT
  // reportParentCommentId ITU ORANGTUA COMMENT
  // KITA KIRIMKAN KE REPORT NYA ITU SEBALIKNYA 

  const idComment = childComment ? parentCommentId : commentId
  const report = childComment ? 'reportParentCommentId' : 'reportCommentId'

  const deleteComment = async () => {
    console.log(parentCommentId)
    try {
      const response = await axios.post(`${serverUrl}/delete-comment`, {
        token: token,
        postId: postId,
        commentId: idComment,
        replyId: !idComment
      });

      if (response.data.status === 'ok') {
        console.log('Comment was deleted successfully');
        ToastAndroid.show('Comment was deleted successfully', ToastAndroid.SHORT);
        onDeleteSuccess();
        onClose();
      } else {
        console.error('Failed to delete comment:', response.data.message);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const reportComment = async () => {
    navigation.navigate('Report', {
      commentId: idComment,
      report: report
    })
    console.log("report comment")
  };

  return (
    <SafeAreaView>
      {isOwn || isAdmin ? (<>
        <View style={styles.optionRow}>
          <TouchableOpacity style={styles.option} onPress={deleteComment}>
            <MaterialIcons name="delete" size={24} color="#333" />
            <Text style={styles.optionText}>Delete Comment</Text>
          </TouchableOpacity>
        </View>
      </>) : null}

      {!isOwn ? (<>
        <View style={styles.optionRow}>
          <TouchableOpacity style={styles.option} onPress={reportComment}>
            <MaterialIcons name="report" size={24} color="#D60000" />
            <Text style={styles.optionTextReport}>Report Comment</Text>
          </TouchableOpacity>
        </View>
      </>) : null}

    </SafeAreaView>
  );
};


export default CommentSheet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: 'bold',
  },
  optionTextReport: {
    fontSize: 16,
    color: '#D60000',
    marginLeft: 16,
    fontWeight: 'bold',
  },
});
