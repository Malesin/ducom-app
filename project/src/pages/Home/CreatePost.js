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
  Animated,
  useColorScheme,
  ActivityIndicator,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';
import VideoCompressor from 'react-native-video-compressor';

const serverUrl = config.SERVER_URL;

const CreatePost = ({ route, navigation }) => {
  const [newPostText, setNewPostText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [translateY] = useState(new Animated.Value(500)); // Initial position
  const colorScheme = useColorScheme(); // Get color scheme
  const styles = getStyles(colorScheme); // Get styles based on color scheme

  const profilePictureUri = require('../../assets/profilepic.png');

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token Retrieved Successfully');

      const userResponse = await axios.post(`${serverUrl}/userdata`, {
        token: token,
      });
      console.log('Data Retrieved Successfully');

      const user = userResponse.data.data;

      if (user.profilePicture) {
        const profile = { uri: user.profilePicture };
        setProfilePicture(profile);
        console.log('Image Profile Retrieved Successfully');
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

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

  console.log(selectedMedia, 'Selected Media');

  const [UploadProgress, setUploadProgress] = useState(0);
  const [IsUploading, SetIsUploading] = useState(false);
  const handlePostSubmit = async () => {
    SetIsUploading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      if (selectedMedia.length > 0) {
        const formData = new FormData();
        let uploadedMedia = [];

        for (const media of selectedMedia) {
          const compressedUri = await compressMedia(media.uri, mediaType);

          if (typeof compressedUri === 'string') {
            const fileType = compressedUri.endsWith('.mp4')
              ? 'video/mp4'
              : 'image/jpeg';

            formData.append('media', {
              uri: compressedUri,
              type: fileType,
              name: `media.${compressedUri.endsWith('.mp4') ? 'mp4' : 'jpg'}`,
            });

            uploadedMedia.push({
              uri: compressedUri,
              type: fileType,
            });

            if (uploadedMedia.length === 4) {
              break; // Stop adding more media if the limit of 4 is reached
            }
          } else {
            console.error(
              'Compressed URI is not a string, skipping this media.',
            );
          }
        }

        if (uploadedMedia.length === 0) {
          console.error('No valid media to upload.');
          return;
        }

        formData.append('token', token);

        const uploadResponse = await axios.post(
          `${serverUrl}/upload-media`,
          formData,
          {
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: progressEvent => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setUploadProgress(progress);
            },
          },
        );

        if (uploadResponse.data.status === 'ok') {
          const mediaData = uploadResponse.data.data;

          const postResponse = await axios.post(`${serverUrl}/create-post`, {
            token: token,
            media: mediaData.map(item => `${item.url}|${item.type}`).join(','),
            description: newPostText,
          });

          if (postResponse.data.status === 'ok') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
            console.log('Post created successfully with media');
          } else {
            console.error('Failed to create post:', postResponse.data.data);
          }
        } else {
          console.error('Failed to upload media:', uploadResponse.data.data);
        }
      } else {
        const postResponse = await axios.post(`${serverUrl}/create-post`, {
          token: token,
          description: newPostText,
        });

        if (postResponse.data.status === 'ok') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
          console.log('Post created successfully without media');
        } else {
          console.error('Failed to create post:', postResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error submitting post:', error.message);
    } finally {
      SetIsUploading(false);
    }
  };

  const compressMedia = async (uri, mediaType) => {
    if (mediaType === 'image/heic' || mediaType === 'image/heif') {
      try {
        const uriWithPrefix = uri.startsWith('file://') ? uri : `file://${uri}`;

        const { uri: resizedUri } = await ImageResizer.createResizedImage(
          uriWithPrefix,
          1920,
          1080,
          'HEIC',
          80,
        );

        console.log('HEIF image resized successfully:', resizedUri);
        return resizedUri;
      } catch (error) {
        console.error('Error resizing HEIF image:', error);
        return uri; // Return original URI if resizing fails
      }
    } else if (mediaType === 'image/png' || mediaType === 'image/jpeg') {
      try {
        const uriWithPrefix = uri.startsWith('file://') ? uri : `file://${uri}`;

        const { uri: resizedUri } = await ImageResizer.createResizedImage(
          uriWithPrefix,
          1920,
          1080,
          'JPEG',
          80,
        );

        console.log('Image resized successfully:', resizedUri);
        return resizedUri;
      } catch (error) {
        console.error('Error resizing image:', error);
        return uri; // Return original URI if resizing fails
      }
    }
    if (mediaType === 'video/mp4') {
      try {
        console.log('Compressing video...');

        const compressedResult = await VideoCompressor.compress(uri, {
          compressionMethod: 'manual',
          resolution: '1920x1080',
          maxSizeMB: 4.9,
          bitrate: 12000,
        });

        const compressedUri = compressedResult?.path;

        if (typeof compressedUri === 'string') {
          const finalCompressedUri = compressedUri.startsWith('file://')
            ? compressedUri
            : `file://${compressedUri}`;

          console.log('Video was compressed successfully:', finalCompressedUri);
          return finalCompressedUri;
        } else {
          console.log('Compression did not return a string:', compressedUri);
          return uri; // Return original URI if compression fails
        }
      } catch (error) {
        console.error('Error compressing video:', error);
        return uri; // Return original URI if compression fails
      }
    } else {
      console.error('Unsupported media type:', mediaType);
      return uri; // Return original URI if media type is unsuppo rted
    }
  };

  const handleOpenCamera = () => {
    const options = {
      mediaType: 'mixed',
      saveToPhotos: true,
      allowedFileTypes: ['heic', 'heif', 'jpeg', 'jpg', 'png'],
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
          setMediaType(assets[0].type);
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
      allowedFileTypes: ['heic', 'heif', 'jpeg', 'jpg', 'png'],
      saveToPhotos: true,
    };

    ImagePicker.launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled media selection');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const {mediaType, assets} = response;
        if (assets && assets.length > 0) {
          const uri = assets[0].uri;
          setMediaType(assets[0].type);
          if (mediaType === 'video') {
            const {path} = await createThumbnail({
              url: uri,
              timeStamp: 1000,
            });

            setSelectedMedia(prevMedia => [
              ...prevMedia,
              {uri, type: 'video/mp4', thumbnail: path},
            ]);
          } else {
            setSelectedMedia(prevMedia => [
              ...prevMedia,
              {uri, type: mediaType},
            ]);
            setMediaType(mediaType);
          }
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
        setKeyboardVisible(false); // <-- Set to false here
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {IsUploading && (
        <View style={styles.progressBarContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.progressBarText}>
            Uploading... ({UploadProgress}%)
          </Text>
        </View>
      )}
      <Animated.View
        style={[styles.contentContainer, { transform: [{ translateY }] }]}>
        <View style={styles.inputContainer}>
          <Image
            source={profilePicture || profilePictureUri}
            style={styles.profilePicture}
          />
          <TextInput
            style={styles.textInput}
            placeholder="What's going on..... ?"
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
          {/* {keyboardVisible &&
            (newPostText.length > 0 || selectedMedia.length > 0) && ( */}
          <Button
            title="Post"
            buttonStyle={styles.postButton}
            onPress={handlePostSubmit}
            disabled={selectedMedia.length === 0 && !newPostText.trim()}
          />
          {/* )} */}
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

const getStyles = (
  colorScheme, // <-- Add colorScheme parameter
) =>
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
    progressBarContainer: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 8,
    },
    progressBarText: {
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
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
      color: colorScheme === 'dark' ? '#000000' : '#000000', // Use colorScheme parameter
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