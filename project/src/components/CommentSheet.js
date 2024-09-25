import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid // Tambahkan import ToastAndroid
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const serverUrl = config.SERVER_URL;

const CommentSheet = ({ commentId, postId, token, emailUser, allowedEmail, idUser, userIdPost, onDeleteSuccess, onClose, parentCommentId, userEmailPost }) => {
  const [isDeleteComment, setIsDeleteComment] = useState(false);
  const [isReportComment, setIsReportComment] = useState(false);

  const deleteComment = async () => {
    try {
      const response = await axios.post(`${serverUrl}/delete-comment`, {
        token: token,
        postId: postId,
        commentId: parentCommentId || commentId,
        replyId: parentCommentId ? commentId : null
      });

      if (response.data.status === 'ok') {
        console.log('Comment Berhasil Dihapus');
        ToastAndroid.show('Komentar berhasil dihapus', ToastAndroid.SHORT);
        onDeleteSuccess();
        onClose();
      } else {
        console.error('Failed to delete comment:', response.data.message);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    if (idUser === userIdPost) {
      // Pengguna dapat menghapus komentarnya sendiri dan melaporkan komentar orang lain / USER
      setIsDeleteComment(true);
      setIsReportComment(false);
    } else if (allowedEmail.includes(emailUser)) {
      // Pengguna dengan email yang diizinkan dapat menghapus dan melaporkan semua komentar / ADMIN
      setIsDeleteComment(true);
      setIsReportComment(true);
    } else if (emailUser === userEmailPost) {
      // Pemilik akun postingan dapat menghapus dan melaporkan semua komentar / OWNER POST
      setIsDeleteComment(true);
      setIsReportComment(true);
    } else {
      // Pengguna lain hanya dapat melaporkan komentar / OTHER USER
      setIsDeleteComment(false);
      setIsReportComment(true);
    }
  }, [idUser, userIdPost, emailUser, allowedEmail, commentId]);

  const reportComment = async () => {
    // try {
    //   const response = await axios.post(`${serverUrl}/report-comment`, {
    //     token: token,
    //     postId: postId,
    //     commentId: commentId,
    //     reporterEmail: emailUser
    //   });

    //   if (response.data.status === 'ok') {
    //     console.log('Comment reported successfully');
    //     ToastAndroid.show('Komentar berhasil dilaporkan', ToastAndroid.SHORT);
    //   } else {
    //     console.error('Failed to report comment:', response.data.message);
    //   }
    // } catch (error) {
    //   console.error('Error reporting comment: ', error);
    // }
    console.log("report comment")
  };

  return (
    <SafeAreaView>
      <View style={styles.optionRow}>
        {isDeleteComment ? (
          <TouchableOpacity style={styles.option} onPress={deleteComment}>
            <MaterialIcons name="delete" size={24} color="#333" />
            <Text style={styles.optionText}>Delete Comment</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {isReportComment ? (
        <View style={styles.optionRow}>
          <TouchableOpacity style={styles.option} onPress={reportComment}>
            <MaterialIcons name="report" size={24} color="#D60000" />
            <Text style={styles.optionTextReport}>Report Comment</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
