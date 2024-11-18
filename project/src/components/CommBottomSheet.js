import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';

const serverUrl = config.SERVER_URL;

const CommBottomSheet = ({
  post,
  onRefreshPage,
  onCloseDel,
  onCloseResp,
  isUserProfile,
  isEnabledComm,
  viewPost,
}) => {
  const navigation = useNavigation();
  const [isOwn, setIsOwn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(post?.amIAdmin);
  const [isCommentDisabled, setIsCommentDisabled] = useState(false);
  const [isViewPost, setIsViewPost] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  console.log(post)
  useEffect(() => {
    setIsViewPost(viewPost || false);
    isViewPost
      ? setIsCommentDisabled(!isEnabledComm)
      : setIsCommentDisabled(!post.commentsEnabled);
  }, [isViewPost, setIsCommentDisabled]);

  console.log(post?.id);
  const deletePost = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const delPost = await axios.post(`${serverUrl}/delete-post`, {
        token: token,
        postId: post?.id,
      });
      const respdel = delPost.data.status;
      onCloseDel(respdel);
      onRefreshPage();
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    if (post?.idUser === post?.userIdPost) {
      setIsOwn(true);
      console.log('1 OWNER');
    } else if (isAdmin) {
      setIsAdmin(true);
      console.log('2.ADMIN');
    } else {
      console.log('3 USER');
    }
  }, [post?.idUser, post?.userIdPost, isUserProfile]);

  const toggleComment = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const respCom = await axios.post(`${serverUrl}/toggle-comments`, {
        token: token,
        postId: post.id,
        enableComments: isCommentDisabled,
      });
      console.log(respCom.data);
      onRefreshPage();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReportPress = () => {
    navigation.navigate('Report', {
      reportPostId: post.id,
    });
    console.log('report post');
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isViewPost ? (
        <>
          {isAdmin || isOwn ? (
            <>
              <View style={styles.optionRow}>
                <TouchableOpacity style={styles.option} onPress={deletePost}>
                  <MaterialIcons name="delete" size={24} color="#333" />
                  <Text style={styles.optionText}>
                    Delete{' '}
                    {isAdmin && !isOwn ? `Post @${post.userName}` : 'Post'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.optionRow}>
                <TouchableOpacity style={styles.option} onPress={toggleComment}>
                  <MaterialCommunityIcons
                    name={!isCommentDisabled ? 'comment-off' : 'comment'}
                    size={24}
                    color="#333"
                  />
                  <Text style={styles.optionText}>
                    {isCommentDisabled ? 'Enable Comments' : 'Disable Comments'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}

          {!isOwn && (
            <>
              <View style={styles.optionRow}>
                <TouchableOpacity
                  style={styles.option}
                  onPress={handleReportPress}>
                  <MaterialIcons name="report" size={24} color="#D60000" />
                  <Text style={styles.optionTextReport}>
                    Report @{post.userName}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      ) : (
        <>
          {isAdmin || isOwn ? (
            <>
              <View style={styles.optionRow}>
                <TouchableOpacity style={styles.option} onPress={toggleComment}>
                  <MaterialCommunityIcons
                    name={!isCommentDisabled ? 'comment-off' : 'comment'}
                    size={24}
                    color="#333"
                  />
                  <Text style={styles.optionText}>
                    {isCommentDisabled ? 'Enable Comments' : 'Disable Comments'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
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
    marginBottom: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 10,
  },
  modalCancel: {
    fontSize: 16,
    color: '#FF0000',
    marginTop: 20,
  },
});

export default CommBottomSheet;
