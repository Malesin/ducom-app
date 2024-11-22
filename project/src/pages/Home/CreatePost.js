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
import PostSheet from '../../components/PostSheet';

const serverUrl = config.SERVER_URL;

const CreatePost = ({ route, navigation }) => {
  const [newPostText, setNewPostText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [translateY] = useState(new Animated.Value(500));
  const [UploadProgress, setUploadProgress] = useState(0);
  const [IsUploading, SetIsUploading] = useState(false);
  const [isPostSheetVisible, setIsPostSheetVisible] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [dataVideo, setDataVideo] = useState([]);
  const [dataPhoto, setDataPhoto] = useState([]);
  const [mediaData, setMediaData] = useState([]);
  const closePostSheet = () => setIsPostSheetVisible(false);
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
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
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  useEffect(() => {
    const updatedMediaData = [...dataPhoto, ...dataVideo];
    setMediaData(updatedMediaData);
    console.log('mediaData', updatedMediaData);
  }, [dataPhoto, dataVideo]);

  const handlePostSubmit = async () => {
    if (!newPostText.trim() && selectedMedia.length === 0) {
      Alert.alert('Error', 'Please add some text or media to your post.');
      return;
    }

    SetIsUploading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      let media = '';

      if (selectedMedia.length > 0) {
        const formDataImages = new FormData();
        const formDataVideos = new FormData();
        const uploadedImages = [];
        const uploadedVideos = [];

        for (const media of selectedMedia) {
          const mediaType = media.type || 'image/jpeg';
          try {
            const compressedUri = await compressMedia(media.uri, mediaType);

            if (typeof compressedUri === 'string') {
              const fileType = compressedUri.endsWith('.mp4')
                ? 'video/mp4'
                : mediaType;

              if (fileType.startsWith('image/')) {
                formDataImages.append('media', {
                  uri: compressedUri,
                  type: fileType,
                  name: `media.${compressedUri.endsWith('.mp4') ? 'mp4' : 'png'
                    }`,
                });
                uploadedImages.push({ uri: compressedUri, type: fileType });
              } else if (fileType.startsWith('video/')) {
                formDataVideos.append('media', {
                  uri: compressedUri,
                  type: fileType,
                  name: `media.${compressedUri.endsWith('.mp4') ? 'mp4' : 'mov'
                    }`,
                });
                uploadedVideos.push({ uri: compressedUri, type: fileType });
              }

              if (uploadedImages.length === 4 || uploadedVideos.length === 4) {
                break;
              }
            } else {
              console.error(
                'Compressed URI is not a string, skipping this media.',
              );
            }
          } catch (error) {
            Alert.alert('Upload Error', error.message);
            return;
          }
        }

        let mediaDataImages = [];
        if (uploadedImages.length > 0) {
          formDataImages.append('token', token);
          const uploadResponseImages = await axios.post(
            `${serverUrl}/upload-media`,
            formDataImages,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              onUploadProgress: progressEvent => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total,
                );
                setUploadProgress(progress);
              },
            },
          );

          if (uploadResponseImages.data.status === 'ok') {
            mediaDataImages = uploadResponseImages.data.data;
            console.log('Images uploaded successfully:', mediaDataImages);
          } else {
            console.error(
              'Failed to upload images:',
              uploadResponseImages.data.data,
            );
          }
        }

        let mediaDataVideos = [];
        if (uploadedVideos.length > 0) {
          formDataVideos.append('token', token);
          const uploadResponseVideos = await axios.post(
            `${serverUrl}/upload-media`,
            formDataVideos,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              onUploadProgress: progressEvent => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total,
                );
                setUploadProgress(progress);
              },
            },
          );

          if (uploadResponseVideos.data.status === 'ok') {
            mediaDataVideos = uploadResponseVideos.data.data;
            console.log('Videos uploaded successfully:', mediaDataVideos);
          } else {
            console.error(
              'Failed to upload videos:',
              uploadResponseVideos.data.data,
            );
          }
        }

        const media = [
          ...mediaDataImages.map(item => `${item.url}|${item.type}`),
          ...mediaDataVideos.map(item => `${item.url}|${item.type}`),
        ].join(',');

        console.log('media:', media);

        const postResponse = await axios.post(`${serverUrl}/create-post`, {
          token: token,
          media: media,
          description: newPostText,
          commentsEnabled: commentsEnabled,
        });

        if (postResponse.data.status === 'ok') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
          console.log('Post created successfully');
        } else {
          console.error('Failed to create post:', postResponse.data.data);
          Alert.alert('Error', 'Failed to create post.');
        }
      }
    } catch (error) {
      console.error('Error submitting post:', error.message);
      Alert.alert('Error', 'Failed to create post.');
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
          'JPEG',
          80,
        );
        console.log(
          'HEIF image resized and converted to JPEG successfully:',
          resizedUri,
        );
        return resizedUri;
      } catch (error) {
        console.error('Error resizing HEIF image:', error);
        throw new Error('Failed to convert HEIF/HEIC image to JPEG.');
      }
    } else if (
      mediaType === 'image/png ' ||
      mediaType === 'image/jpeg' ||
      mediaType === 'image/jpg'
    ) {
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
        return uri;
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
          return uri;
        }
      } catch (error) {
        console.error('Error compressing video:', error);
        return uri;
      }
    } else {
      console.error('Unsupported media type:', mediaType);
      return uri;
    }
  };

  const handleOpenCamera = () => {
    const options = {
      mediaType: 'mixed',
      saveToPhotos: true,
      allowedFileTypes: ['jpeg', 'jpg', 'png'],
    };

    ImagePicker.launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User  cancelled photo or video capture');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const { mediaType, assets } = response;
        if (assets && assets.length > 0) {
          const uri = assets[0].uri;
          const type = assets[0].type || mediaType;
          setMediaType(type);
          if (type === 'video') {
            try {
              await checkVideoDuration(uri);
              const thumbnailUri = await generateThumbnail(uri);
              setSelectedMedia(prevMedia => [
                ...prevMedia,
                { uri, thumbnailUri, type },
              ]);
            } catch (error) {
              Alert.alert('Video Upload Error', error.message);
            }
          } else {
            setSelectedMedia(prevMedia => [...prevMedia, { uri, type }]);
          }
        }
      }
    });
  };

  const handleOpenGallery = () => {
    const options = {
      mediaType: 'mixed',
      selectionLimit: 4,
      allowedFileTypes: ['jpeg', 'jpg', 'png'],
      saveToPhotos: true,
    };

    ImagePicker.launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User  cancelled media selection');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const { assets } = response;
        if (assets && assets.length > 0) {
          for (const asset of assets) {
            const type = asset.type || 'image/jpeg';
            if (type === 'image/heic' || type === 'image/heif') {
              Alert.alert('Upload Error', 'HEIC/HEIF format is not supported.');
              return;
            }
          }

          const currentMediaCount = selectedMedia.length;
          const newMediaCount = assets.length;
          if (currentMediaCount + newMediaCount > 4) {
            Alert.alert(
              'Limit Exceeded',
              'You can only upload up to 4 media items.',
            );
            return;
          }

          const newMedia = await Promise.all(
            assets.map(async asset => {
              const type = asset.type || 'image/jpeg';
              const thumbnail =
                type === 'video'
                  ? (await createThumbnail({ url: asset.uri, timeStamp: 1000 }))
                    .path
                  : null;
              return {
                uri: asset.uri,
                type,
                thumbnail,
              };
            }),
          );
          setSelectedMedia(prevMedia => [...prevMedia, ...newMedia]);
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
          {media.thumbnail ? (
            <Image source={{ uri: media.thumbnail }} style={styles.media} />
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
      () => { },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => { },
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
            maxLength={400}
            placeholderTextColor={
              colorScheme === 'dark' ? '#cccccc' : '#888888'
            }
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedMedia.map((media, index) => renderMedia(media, index))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <View style={{ flexDirection: 'row' }}>
            <PostSheet
              isPostSheetVisible={isPostSheetVisible}
              closePostSheet={closePostSheet}
              onOptionSelect={setCommentsEnabled}
            />
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
            <Button
              title="Post"
              buttonStyle={styles.postButton}
              onPress={handlePostSubmit}
              disabled={selectedMedia.length === 0 && !newPostText.trim()}
            />
          </View>
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
                resizeMode="contain"
                controls={true}
              />
            ) : (
              <Image
                source={{ uri: previewMedia }}
                style={styles.fullScreenMedia}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const getStyles = colorScheme =>
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
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonComments: {
      backgroundColor: 'transparent',
      padding: 0,
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
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 1,
      padding: 10,
    },
    fullScreenMedia: {
      width: '100%',
      height: '80%',
      backgroundColor: 'transparent',
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
