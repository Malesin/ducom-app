import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import ProfilePicture from '../assets/profilepic.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ReportedNotification = ({ notif }) => {
  const newNotif = notif[0];
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [adminMessage, setAdminMessage] = useState(newNotif?.message);
  const [message, setMessage] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (adminMessage == '') {
      setMessage(false)
    } else {
      setMessage(true)
    }
    console.log(message)

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [message, adminMessage, slideAnim, fadeAnim]);

  const handleClick = () => {
    setModalVisible(true);
  };
  const reasonText = newNotif?.reportCategoryDescriptions.join(', \n');

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => setModalVisible(false);
    }, []),
  );

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}>
        <Icon
          name="error-outline"
          size={30}
          color="#FF5722"
          style={styles.icon}
        />
        <Text style={styles.message}>
          You have received this warning notification because your account has
          been reported for violating community guidelines.
        </Text>
        <TouchableOpacity onPress={handleClick}>
          <Text style={styles.link}>See Why?</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalMessage}>We are warning you</Text>
              <Text style={styles.modalDate}>
                {formatDate(newNotif?.created_at)}
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.reasonContainer}>
              <View style={styles.separator} />
              <Text style={styles.reasonTitle}>Why this happened</Text>
              <Text style={styles.reasonMessage}>
                It looks like you threatened or harassed others, or targeted
                them with content or messages that shame or disrespect them.
              </Text>
              {newNotif.category == 'user' ? null : (
                <>
                  <View style={styles.reasonMessageContainer}>
                    <Image
                      source={
                        newNotif?.reportedEntity?.user?.profilePicture
                          ? {
                            uri: newNotif?.reportedEntity?.user
                              ?.profilePicture,
                          }
                          : ProfilePicture
                      }
                      style={styles.profileImage}
                    />
                    <Text style={styles.userInfo}>
                      {newNotif?.relatedPost?.user?.username ??
                        newNotif?.report?.reportedPost?.user?.username ??
                        'Post Deleted'}
                    </Text>
                    <Text style={styles.userMessage}>
                      {newNotif?.relatedPost?.description ??
                        newNotif?.report?.reportedPost?.description ??
                        ''}
                    </Text>
                  </View>
                </>
              )}

              <Text style={styles.profileMessage}>
                You shared this on your profile
              </Text>
              <Text style={styles.guidelineMessage}>
                This goes against our Community Guidelines
              </Text>
              <Text style={styles.reasonTitle}>Reports: </Text>

              <Text style={styles.guidelineMessage}>{reasonText}</Text>
              <TouchableOpacity
                style={styles.seeRuleButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Termsandcondition');
                }}>
                <View style={styles.seeRuleContent}>
                  <MaterialCommunityIcons
                    name="note-text-outline"
                    size={24}
                    color="#000"
                  />
                  <Text style={styles.seeRuleText}>See rule</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            {message &&
              (<>
                <View style={styles.adminMessageContainer}>
                  <Text style={styles.adminMessageTitle}>
                    Message from Admin :{' '}
                  </Text>
                  <Text style={styles.adminMessage}>{adminMessage}</Text>
                </View>
              </>)
            }
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ReportedNotification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  icon: {
    marginRight: 10,
  },
  message: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  link: {
    fontSize: 14,
    color: '#002366',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  modalMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#000',
  },
  modalDate: {
    fontSize: 14,
    textAlign: 'left',
    color: '#000',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDD',
    width: '100%',
    marginVertical: 5,
    marginBottom: 5,
  },
  reasonContainer: {
    alignItems: 'flex-start',
  },
  reasonTitle: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 5,
  },
  reasonMessage: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  reasonMessageContainer: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    width: '100%',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  userMessage: {
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 5,
  },
  profileMessage: {
    fontSize: 14,
    color: '#000',
    marginVertical: 5,
    marginBottom: 5,
  },
  guidelineMessage: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  seeRuleButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    padding: 5,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  seeRuleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seeRuleText: {
    color: '#000',
    paddingHorizontal: 5,
  },
  adminMessageContainer: {
    marginTop: 5,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  adminMessage: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    marginBottom: 10,
  },
  adminMessageTitle: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'left',
  },
});
