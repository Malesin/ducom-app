import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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
  onClosePin,
  onClosePinUser,
  handlePin,
  handlePinUser,
  isUserProfile
}) => {
  const navigation = useNavigation();
  const [isDeletePost, setIsDeletePost] = useState(false);
  const [isOwnAccount, setIsOwnAccount] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPin, setIsPin] = useState(false)
  const [isPinUser, setIsPinUser] = useState(false)

  console.log("isUserProfile: ", isUserProfile)

  useEffect(() => {
    setIsPin(handlePin)
    setIsPinUser(handlePinUser)
  }, [])

  const deletePost = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const delPost = await axios.post(`${serverUrl}/delete-post`, {
        token: token,
        postId: tweet.id
      });
      const respdel = delPost.data.status

      onCloseDel(respdel);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  {/* PIN POST AT HOMESCREEN */ }
  const pinPost = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      if (isPin === false) {
        const pinPost = await axios.post(`${serverUrl}/posts/pin`, {
          token: token,
          postId: tweet.id,
          duration: 8
        })
        const resppin = pinPost.data.status
        onClosePin(resppin)
        onRefreshPage()
      } else if (isPin === true) {
        const unPinPost = await axios.post(`${serverUrl}/posts/unpin`, {
          token: token
        })
        const resppin = unPinPost.data.status
        onClosePin(resppin)
        onRefreshPage()
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }
  {/* PIN POST AT HOMESCREEN */ }

  {/* PIN POST AT POSTSCREEN  */ }
  const pinPostUser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      if (isPinUser === false) {
        const pinPost = await axios.post(`${serverUrl}/pin-post`, {
          token: token,
          postId: tweet.id,
        })
        const resppin = pinPost.data.status
        onClosePinUser(resppin)
        onRefreshPage()
      } else if (isPinUser === true) {
        const unPinPost = await axios.post(`${serverUrl}/unpin-post`, {
          token: token
        })
        const resppin = unPinPost.data.status
        onClosePinUser(resppin)
        onRefreshPage()
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }
  {/* PIN POST AT POSTSCREEN  */ }

  useEffect(() => {
    if (tweet.amIAdmin) {
      setIsAdmin(true)
      setIsDeletePost(true);
      console.log("1 ADMIN")
    } else if (tweet.idUser === tweet.userIdPost) {
      setIsDeletePost(true);
      setIsOwnAccount(true);
      console.log("2 OWNER")
    } else {
      setIsAdmin(false)
      setIsOwnAccount(false);
      setIsDeletePost(false);
      console.log("3 USER")
    }
  }, [tweet.idUser, tweet.userIdPost, isUserProfile]);

  return (
    <SafeAreaView style={styles.container}>

      {!isUserProfile ? (
        <>
          {isAdmin && (
            <View style={styles.optionRow}>
              {/* PIN POST AT HOMESCREEN */}
              <TouchableOpacity style={styles.option} onPress={pinPost}>
                <MaterialCommunityIcons name="pin" size={24} color="#333" />
                <Text style={styles.optionText}>
                  {isPin ? 'Unpin' : 'Pin'} @{tweet.userName}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {!isOwnAccount && (
            <View style={styles.optionRow}>
              <TouchableOpacity style={styles.option}>
                <MaterialIcons name="volume-off" size={24} color="#333" />
                <Text style={styles.optionText}>Mute @{tweet.userName}</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : null}

      {isDeletePost && (
        <>
          {isUserProfile ? (
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
              <View style={styles.optionRow}>
                <TouchableOpacity style={styles.option} onPress={deletePost}>
                  <MaterialIcons name="delete" size={24} color="#333" />
                  <Text style={styles.optionText}>
                    Delete Post
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}

          {!isUserProfile ? (
            <>
              <View style={styles.optionRow}>
                <TouchableOpacity style={styles.option} onPress={deletePost}>
                  <MaterialIcons name="delete" size={24} color="#333" />
                  <Text style={styles.optionText}>
                    Delete {isOwnAccount ? 'Post' : `Post @${tweet.userName}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </>
      )}

      {!isUserProfile ? (
        <>
          {!isOwnAccount && (
            <>
              <View style={styles.optionRow}>
                <TouchableOpacity style={styles.option}>
                  <MaterialIcons name="block" size={24} color="#333" />
                  <Text style={styles.optionText}>Block @{tweet.userName}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.optionRow}>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => navigation.navigate('Report')}>
                  <MaterialIcons name="report" size={24} color="#D60000" />
                  <Text style={styles.optionTextReport}>Report @{tweet.userName}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      ) : null}
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
});

export default BottomSheet;