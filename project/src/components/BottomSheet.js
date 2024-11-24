import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';

const serverUrl = config.SERVER_URL;

const BottomSheet = ({
  tweet,
  onRefreshPage,
  onCloseDel,
  onCloseResp,
  isUserProfile,
  isEnabledComm,
  viewPost,
  handlePin,
  handlePinUser,
}) => {
  const navigation = useNavigation();
  const [isPin, setIsPin] = useState(false);
  const [isOwn, setIsOwn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(tweet?.amIAdmin);
  const [isPinUser, setIsPinUser] = useState(false);
  const [isCommentDisabled, setIsCommentDisabled] = useState(false);
  const [isViewPost, setIsViewPost] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setIsPin(handlePin);
    setIsPinUser(handlePinUser);
    setIsViewPost(viewPost || false);
    isViewPost
      ? setIsCommentDisabled(!isEnabledComm)
      : setIsCommentDisabled(!tweet.commentsEnabled);
  }, [isViewPost, setIsCommentDisabled]);

  console.log(tweet?.id);
  const deletePost = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const delPost = await axios.post(`${serverUrl}/delete-post`, {
        token: token,
        postId: tweet?.id,
      });
      const respdel = delPost.data.status;
      onCloseDel(respdel);
      onRefreshPage();
    } catch (error) {
      console.error('Error: ', error);
    }
  };
  {
    /* PIN POST AT HOMESCREEN */
  }
  const pinPost = async duration => {
    const token = await AsyncStorage.getItem('token');
    try {
      const type = 'Pin';
      const typing = 'pinning';
      const typed = 'Pinned';
      if (!isPinUser) {
        const pinPost = await axios.post(`${serverUrl}/posts/pin`, {
          token: token,
          postId: tweet?.id,
          duration: duration,
        });
        onCloseResp({
          status: pinPost.data.status,
          type: type,
          typing: typing,
          typed: typed,
        });
        onRefreshPage();
      } else if (isPinUser) {
        const unPinPost = await axios.post(`${serverUrl}/posts/unpin`, {
          token: token,
        });
        onCloseResp({
          status: unPinPost.data.status,
          type: type,
          typing: typing,
          typed: typed,
        });
        onRefreshPage();
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handlePinPost = () => {
    if (isPin) {
      pinPost(0);
    } else {
      setModalVisible(true);
    }
  };

  {
    /* PIN POST AT HOMESCREEN */
  }

  {
    /* PIN POST AT POSTSCREEN  */
  }
  const pinPostUser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const type = 'PinUser';
      const typing = 'pinning user';
      const typed = 'Pinned User';
      if (!isPinUser) {
        const pinPost = await axios.post(`${serverUrl}/pin-post`, {
          token: token,
          postId: tweet?.id,
        });
        onCloseResp({
          status: pinPost.data.status,
          type: type,
          typing: typing,
          typed: typed,
        });
        onRefreshPage();
      } else if (isPinUser) {
        const unPinPost = await axios.post(`${serverUrl}/unpin-post`, {
          token: token,
        });
        onCloseResp({
          status: unPinPost.data.status,
          type: type,
          typing: typing,
          typed: typed,
        });
        onRefreshPage();
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };
  {
    /* PIN POST AT POSTSCREEN  */
  }

  const muteUser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const type = 'Mute';
      const typing = 'muted';
      const typed = 'Muted';
      if (!tweet.isMuted) {
        const mute = await axios.post(`${serverUrl}/mute-user`, {
          token: token,
          muteUserId: tweet?.userIdPost,
        });
        onCloseResp({
          status: mute.data.status,
          type: type,
          typing: typing,
          typed: typed,
        });
        onRefreshPage();
      } else if (tweet.isMuted) {
        const unmute = await axios.post(`${serverUrl}/unmute-user`, {
          token: token,
          unmuteUserId: tweet?.userIdPost,
        });
        onCloseResp({
          status: unmute.data.status,
          type: type,
          typing: typing,
          typed: typed,
        });
        onRefreshPage();
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const blockUser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const type = 'Block';
      const typing = 'blocked';
      const typed = 'Blocked';
      if (!tweet.isBlocked) {
        const block = await axios.post(`${serverUrl}/block-user`, {
          token: token,
          blockUserId: tweet?.userIdPost,
        });
        onCloseResp({
          status: block.data.status,
          type: type,
          typing: typing,
          typed: typed,
        });
        onRefreshPage();
      } else if (tweet.isBlocked) {
        const unblock = await axios.post(`${serverUrl}/unblock-user`, {
          token: token,
          unblockUserId: tweet?.userIdPost,
        });
        onCloseResp({
          status: unblock.data.status,
          type: type,
          typing: typing,
          typed: typed,
        });
        onRefreshPage();
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    if (tweet?.idUser === tweet?.userIdPost) {
      setIsOwn(true);
      console.log('1 OWNER');
    } else if (isAdmin) {
      setIsAdmin(true);
      console.log('2.ADMIN');
    } else {
      console.log('3 USER');
    }
  }, [tweet?.idUser, tweet?.userIdPost, isUserProfile]);

  const toggleComment = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const respCom = await axios.post(`${serverUrl}/toggle-comments`, {
        token: token,
        postId: tweet.id,
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
      reportPostId: tweet.id,
    });
    console.log('report post');
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isViewPost ? (
        <>
          {!isUserProfile && (
            <>
              {isAdmin && (
                <>
                  <View style={styles.optionRow}>
                    {/* PIN POST AT HOMESCREEN */}
                    <TouchableOpacity
                      style={styles.option}
                      onPress={handlePinPost}>
                      <MaterialCommunityIcons
                        name="pin"
                        size={24}
                        color="#333"
                      />
                      <Text style={styles.optionText}>
                        {isPin ? 'Unpin' : 'Pin'} @{tweet.userName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          )}
          {!isOwn && (
            <>
              <View style={styles.optionRow}>
                <TouchableOpacity style={styles.option} onPress={muteUser}>
                  {tweet.isMuted ? (
                    <MaterialIcons name="volume-up" size={24} color="#333" />
                  ) : (
                    <MaterialIcons name="volume-off" size={24} color="#333" />
                  )}
                  <Text style={styles.optionText}>
                    {tweet.isMuted ? 'Unmute' : 'Mute'} @{tweet.userName}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {isUserProfile && (
            <>
              <View style={styles.optionRow}>
                {/* PIN POST AT POSTSCREEN  */}
                <TouchableOpacity style={styles.option} onPress={pinPostUser}>
                  <MaterialCommunityIcons name="pin" size={24} color="#333" />
                  <Text style={styles.optionText}>
                    {isPinUser ? 'Unpin' : 'Pin'} Post
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {isAdmin || isOwn ? (
            <>
              <View style={styles.optionRow}>
                <TouchableOpacity style={styles.option} onPress={deletePost}>
                  <MaterialIcons name="delete" size={24} color="#333" />
                  <Text style={styles.optionText}>
                    Delete{' '}
                    {isAdmin && !isOwn ? `Post @${tweet.userName}` : 'Post'}
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
                <TouchableOpacity style={styles.option} onPress={blockUser}>
                  <MaterialIcons name="block" size={24} color="#333" />
                  <Text style={styles.optionText}>Block @{tweet.userName}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.optionRow}>
                <TouchableOpacity
                  style={styles.option}
                  onPress={handleReportPress}>
                  <MaterialIcons name="report" size={24} color="#D60000" />
                  <Text style={styles.optionTextReport}>
                    Report @{tweet.userName}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Pin Duration</Text>
            <Text style={styles.modalSubtitle}>
              Choose how long to pin the post:
            </Text>
            {['8', '12', '24', '48', '148'].map(duration => (
              <TouchableOpacity
                key={duration}
                onPress={() => {
                  pinPost(parseInt(duration));
                  setModalVisible(false);
                }}>
                <Text style={styles.modalOption}>{duration} HOURS</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

export default BottomSheet;
