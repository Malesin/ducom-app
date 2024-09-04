import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';

const serverUrl = config.SERVER_URL;

const BottomSheet = ({ username, postId, idUser, userIdPost, allowedEmail, emailUser, onClose }) => {
  const [isDeletePost, setIsDeletePost] = useState(false)
  const [isVisible] = useState(true);

  const deletePost = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(`${serverUrl}/delete-post`, {
        token: token,
        postId: postId,
      });

      if (response.data.status === 'ok') {
        console.log('Postingan Berhasil Dihapus');
        ToastAndroid.show('Post deleted successfully!', ToastAndroid.LONG);
        onClose();
      }
    } catch (error) {
      console.error('Error: ', error);
      ToastAndroid.show('Error when deleting post.', ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    if (emailUser === allowedEmail) {
      setIsDeletePost(true);
    } else if (idUser === userIdPost) {
      setIsDeletePost(true);
    } else {
      setIsDeletePost(false);
    }
  }, [idUser, userIdPost, emailUser, allowedEmail]);


  return (
    <SafeAreaView
      style={styles.container}
      pointerEvents={isVisible ? 'auto' : 'none'}>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onClose();
          }}>
          <MaterialIcons name="volume-off" size={24} color="#333" />
          <Text style={styles.optionTextMute}>Mute @{username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.option} onPress={deletePost}>
          <MaterialIcons name="delete" size={24} color="#333" />
          <Text style={styles.optionTextDelete}>Delete Post @{username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onClose();
          }}>
          <MaterialIcons name="block" size={24} color="#333" />
          <Text style={styles.optionTextBlock}>Block @{username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onClose();
          }}>
          <MaterialIcons name="report" size={24} color="#FF2800" />
          <Text style={styles.optionTextReport}>Report @{username}</Text>
        </TouchableOpacity>
      </View>
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
  optionTextMute: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: 'bold',
  },
  optionTextDelete: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: 'bold',
  },
  optionTextBlock: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: 'bold',
  },
  optionTextReport: {
    fontSize: 16,
    color: '#FF2800',
    marginLeft: 16,
    fontWeight: 'bold',
  },
});

export default BottomSheet;
