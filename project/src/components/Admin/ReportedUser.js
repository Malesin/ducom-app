import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import ProfileImage from '../../assets/iya.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useColorScheme} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const ReportedUser = ({report, handleDeleteReport}) => {
  const navigator = useNavigation();
  const capitalizeFirstLetter = string => {
    if (typeof string === 'string' && string.length > 0) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return ''; // Kembalikan string kosong jika input tidak valid
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [reportText, setReportText] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [reportDetailsVisible, setReportDetailsVisible] = useState(false);
  const [idUser, setIdUser] = useState(false);
  const [profilePicture, setProfilePicture] = useState(false);
  const [amIAdmin, setAmIAdmin] = useState(false);
  const [isMuteds, setIsMuteds] = useState(false);
  const [isBlockeds, setIsBlockeds] = useState(false);
  const [category, setCategory] = useState(false);
  const [reportDetails, setReportDetails] = useState({
    category: report.category,
    commentProof: report.commentProof,
    reason: report.reason,
  });
  const reportId = report.id;
  const reasonText = reportDetails.reason.join(', \n');
  const reportCategory = capitalizeFirstLetter(reportDetails.category);
  const colorScheme = useColorScheme();

  const getData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(`${serverUrl}/userdata`, {token: token}).then(res => {
        if (res.data.status == 'ok') {
          const data = res.data.data;
          setIdUser(data._id);
          setProfilePicture(data.profilePicture);
          setAmIAdmin(data.isAdmin);
          setIsMuteds(data.mutedUsers);
          setIsBlockeds(data.blockedUsers);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();

    if (reportCategory == 'Comment') {
      setCategory('Comment on post');
    } else if (reportCategory == 'Post') {
      setCategory('Reported Content');
    } else if (reportCategory == 'User') {
      setCategory('User');
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Reset state when screen is focused
      setReportDetailsVisible(false);
      setModalVisible(false);
    }, []),
  );

  const handleReportPress = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setReportText('');
  };

  const handleSend = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios
        .post(`${serverUrl}/send-warning`, {
          token: token,
          userId: report?.userId,
          message: reportText,
          report: report?.id,
        })
        .then(res => {
          console.log(res.data);
        });
    } catch (error) {
      console.error(error);
    } finally {
      console.log('Report sent:', reportText);
      setModalVisible(false);
      setReportText('');
    }
  };

  const handleViewPress = () => {
    setReportDetailsVisible(true);
  };

  const handleViewPostOrComment = async () => {
    try {
      if (reportCategory == 'User') {
        navigator.navigate('Userprofile', {
          userIdPost: report?.userId,
          idUser: report?.myId,
        });
      } else {
        navigator.navigate('ViewPost', {
          tweetId: report.postId,
          focusCommentInput: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={
          report?.profilePicture
            ? {uri: report?.profilePicture}
            : require('../../assets/profilepic.png')
        }
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{report.name}</Text>
        <Text style={styles.userhandle}>@{report.username}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleViewPress}>
          <MaterialIcons name="visibility" size={23} color="#949494" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleReportPress}>
          <MaterialIcons name="report" size={23} color="#FFC300" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleDeleteReport(reportId)}>
          <MaterialIcons name="delete-forever" size={23} color="#C70039" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Report User</Text>
            <Text style={styles.modalsubtitle}>
              Send a warning message to the user
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  height: Math.max(40, inputHeight),
                  color: colorScheme === 'dark' ? '#000000' : '#000000',
                },
              ]}
              placeholder="Enter your message"
              placeholderTextColor={
                colorScheme === 'dark' ? '#cccccc' : '#888888'
              }
              value={reportText}
              onChangeText={setReportText}
              multiline={true}
              onContentSizeChange={event => {
                setInputHeight(event.nativeEvent.contentSize.height);
              }}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={handleCancel}>
                <Text style={styles.buttonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSend} onPress={handleSend}>
                <Text style={styles.buttonTextSend}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={reportDetailsVisible}
        onRequestClose={() => setReportDetailsVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Report Details</Text>
            <Text style={styles.modalsubtitle}>
              Reported Category: {reportCategory}
            </Text>
            <Text style={styles.modalsubtitle}>{category}: </Text>
            <View style={styles.reportContentContainer}>
              <Image
                source={
                  report?.profilePicture
                    ? {
                        uri:
                          reportDetails.category == 'comment'
                            ? report?.profilePicPost
                            : report?.profilePicture,
                      }
                    : require('../../assets/profilepic.png')
                }
                style={styles.reportProfileImage}
              />
              <View style={styles.reportContentDetails}>
                <Text style={styles.reportUsername}>
                  @
                  {reportDetails.category == 'comment'
                    ? report?.usernamePost
                    : report.username}
                </Text>
              </View>
            </View>
            {reportDetails.category == 'comment' && (
              <>
                <Text style={styles.modalsubtitle}>Proof of comment: </Text>
                <ScrollView contentContainerStyle={styles.scrollView}>
                  <Text style={styles.reportContent}>
                    {report.commentProof}
                  </Text>
                </ScrollView>
              </>
            )}
            <Text style={styles.modalsubtitle}>Reason:</Text>
            <Text style={styles.reportContent}>{reasonText}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={() => setReportDetailsVisible(false)}>
                <Text style={styles.buttonTextCancel}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSend}
                onPress={handleViewPostOrComment}>
                <Text style={styles.buttonTextSend}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReportedUser;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  profileImage: {
    marginLeft: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  userhandle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ccc',
  },
  iconContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 5,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
  },
  modalsubtitle: {
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 13,
    color: '#000',
    alignSelf: 'flex-start',
  },
  scrollView: {
    paddingBottom: 20,
  },
  reportContent: {
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 14,
    color: '#000',
    alignSelf: 'flex-start',
  },

  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  buttonCancel: {
    marginRight: 10,
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextCancel: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
  },
  buttonSend: {
    backgroundColor: '#001374',
    borderRadius: 10,
    width: 80,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextSend: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  reportContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 10,
    padding: 5,
    width: '100%',
  },
  reportProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  reportUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  reportContentDetails: {
    flexDirection: 'row',
  },
  reportContentText: {
    fontSize: 14,
    color: '#000',
    flexShrink: 1,
    marginLeft: 5,
  },
});
