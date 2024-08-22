import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Keyboard,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  Animated, // Import Animated from react-native
  colorScheme,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = config.SERVER_URL;

const CreatePost = ({ route, navigation }) => {
  const [newPostText, setNewPostText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [translateY] = useState(new Animated.Value(500)); // Initial position
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme); // Get styles based on color scheme
  
  const profilePictureUri = require('../../assets/profilepic.png');

  useEffect(() => {
    if (route.params?.mediaUri) {
      setSelectedMedia(prevMedia => [
        ...prevMedia,
        { uri: route.params.mediaUri },
      ]);
      setMediaType(route.params.mediaType);
    }
  }, [route.params?.mediaUri, route.params?.mediaType]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      friction: 8, // Adjust friction for the bounciness effect
      tension: 40, // Adjust tension for the speed of the animation
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const handlePostSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      if (selectedMedia.length > 0) {
        // Prepare the form data for media upload
        const formData = new FormData();
        selectedMedia.forEach((media, index) => {
          formData.append('media', {
            uri: media.uri,
            type: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
            name: `media-${index}.${mediaType === 'video' ? 'mp4' : 'jpg'}`,
          });
        });
        formData.append('token', token);

        // Upload media
        const uploadResponse = await axios.post(`${serverUrl}/upload-media`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (uploadResponse.data.status === 'ok') {
          const mediaData = uploadResponse.data.data;

          // Create a new post with the uploaded media URIs
          const postResponse = await axios.post(`${serverUrl}/create-post`, {
            token: token,
            media: mediaData.map(item => `${item.url}|${item.type}`).join(','),
            description: newPostText,
          });

          if (postResponse.data.status === 'ok') {
            navigation.navigate('Home');
            console.log("Post created successfully with media");
          } else {
            console.error('Failed to create post:', postResponse.data.data);
          }
        } else {
          console.error('Failed to upload media:', uploadResponse.data.data);
        }
      } else {
        // No media selected, create post with description only
        const postResponse = await axios.post(`${serverUrl}/create-post`, {
          token: token,
          description: newPostText, // Replace with your post description variable
        });

        if (postResponse.data.status === 'ok') {
          navigation.navigate('Home');
          console.log("Post created successfully without media");
        } else {
          console.error('Failed to create post:', postResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error submitting post:', error.message);
    }
  };

  const handleOpenCamera = () => {
    const options = {
      mediaType: 'mixed',
      saveToPhotos: true,
    };

    ImagePicker.launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled photo or video capture');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const { mediaType, assets } = response;
        if (assets && assets.length > 0) {
          const uri = assets[0].uri;
          if (mediaType === 'video') {
            try {
              await checkVideoDuration(uri);
              const thumbnailUri = await generateThumbnail(uri);
              setSelectedMedia(prevMedia => [
                ...prevMedia,
                { uri, thumbnailUri },
              ]);
              setMediaType(mediaType);
            } catch (error) {
              Alert.alert('Video Upload Error', error.message);
            }
          } else {
            setSelectedMedia(prevMedia => [...prevMedia, { uri }]);
            setMediaType(mediaType);
          }
        }
      }
    });
  };

  const handleOpenGallery = () => {
    const options = {
      mediaType: 'mixed',
      selectionLimit: 4,
    };

    ImagePicker.launchImageLibrary(options, async response => {
      if (!response.didCancel && !response.error) {
        const uris = response.assets.map(asset => asset.uri);
        const types = response.assets.map(asset => asset.type);
        if (types[0] === 'video') {
          try {
            await checkVideoDuration(uris[0]);
            const thumbnailUris = await Promise.all(
              uris.map(uri => generateThumbnail(uri)),
            );
            setSelectedMedia(prevMedia => [
              ...prevMedia,
              ...uris.map((uri, index) => ({
                uri,
                thumbnailUri: thumbnailUris[index],
              })),
            ]);
            setMediaType(types[0] || 'photo');
          } catch (error) {
            Alert.alert('Video Upload Error', error.message);
          }
        } else {
          setSelectedMedia(prevMedia => [
            ...prevMedia,
            ...uris.map(uri => ({ uri })),
          ]);
          setMediaType(types[0] || 'photo');
        }
      }
    });
  };

  const checkVideoDuration = uri => {
    return new Promise((resolve, reject) => {
      Video.getDuration(uri, duration => {
        if (duration > 60) {
          reject(new Error('Video exceeds 1 minute duration'));
        } else {
          resolve();
        }
      });
    });
  };

  const generateThumbnail = async uri => {
    try {
      const { uri: thumbnailUri } = await createThumbnail({ source: uri });
      return thumbnailUri;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  };




  const handleTextChange = text => {
    setNewPostText(text);
  };

  const handleMediaPress = uri => {
    setPreviewMedia(uri);
    setPreviewVisible(true);
  };

  const removeMedia = uri => {
    setSelectedMedia(prevMedia => prevMedia.filter(item => item.uri !== uri));
  };

  // const convertMediaToUri = media => {
  //   const uri = URL.createObjectURL(media);
  //   return uri;
  // };

  const renderMedia = (media, index) => {
    if (typeof media.uri !== 'string') {
      console.error('Invalid URI Format');
      return null;
    }
    return (
      <View key={index} style={styles.mediaContainer}>
        <TouchableOpacity onPress={() => handleMediaPress(media.uri)}>
          {media.thumbnailUri ? (
            <Image source={{ uri: media.thumbnailUri }} style={styles.media} />
          ) : (
            <Image source={{ uri: media.uri }} style={styles.media} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeMedia(media.uri)}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(true);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.contentContainer, { transform: [{ translateY }] }]}>
        <View style={styles.inputContainer}>
          <Image source={profilePictureUri} style={styles.profilePicture} />
          <TextInput
            style={styles.textInput}
            placeholder="What’s going on..... ?"
            multiline
            value={newPostText}
            onChangeText={handleTextChange}
            maxLength={500}
            placeholderTextColor={
              colorScheme === 'dark' ? '#cccccc' : '#888888'
            } // Adjust placeholder text color based on theme
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedMedia.map((media, index) => renderMedia(media, index))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            icon={<Icon name="camera" size={24} color="#000" />}
            buttonStyle={styles.button}
            onPress={handleOpenCamera}
          />
          <Button
            icon={<Icon name="image-outline" size={24} color="#000" />}
            buttonStyle={styles.button}
            onPress={handleOpenGallery}
          />
          {keyboardVisible && newPostText.length > 0 && (
            <Button
              title="Post"
              buttonStyle={styles.postButton}
              onPress={handlePostSubmit}
            />
          )}
        </View>
      </Animated.View>

      {previewMedia && (
        <Modal
          visible={previewVisible}
          transparent={true}
          onRequestClose={() => setPreviewVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPreviewVisible(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            {previewMedia.endsWith('.mp4') ? (
              <Video
                source={{ uri: previewMedia }}
                style={styles.fullScreenMedia}
                controls
              />
            ) : (
              <Image
                source={{ uri: previewMedia }}
                style={styles.fullScreenMedia}
              />
            )}
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    contentContainer: {
      flex: 1,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    profilePicture: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: 'transparent',
      padding: 12,
      borderRadius: 8,
      color: colorScheme === 'dark' ? '#000000' : '#000000',
    },
    mediaContainer: {
      position: 'relative',
      marginRight: 10,
    },
    media: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
      borderRadius: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    button: {
      backgroundColor: 'transparent',
      borderRadius: 50,
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    postButton: {
      backgroundColor: '#001374',
      borderRadius: 20,
      paddingHorizontal: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
    },
    fullScreenMedia: {
      width: '90%',
      height: '70%',
      borderRadius: 8,
    },
    removeButton: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 20,
      padding: 4,
    },
  });

export default CreatePost;
