import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';

const CreatePost = ({route, navigation}) => {
  const [newPostText, setNewPostText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  // Load profile picture from assets
  const profilePictureUri = require('../../assets/profilepic.png');

  useEffect(() => {
    if (route.params?.mediaUri) {
      setSelectedMedia([route.params.mediaUri]);
      setMediaType(route.params.mediaType); // Set media type from params
    }
  }, [route.params?.mediaUri, route.params?.mediaType]);

  const handlePostSubmit = () => {
    // Navigate to Home and pass the post data
    navigation.navigate('Home', {
      postText: newPostText,
      media: selectedMedia,
      profilePicture: profilePictureUri,
    });
  };

  const handleOpenCamera = () => {
    const options = {
      mediaType: 'mixed', // Allow both photo and video
      saveToPhotos: true,
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo or video capture');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        // Handle the captured media based on its type
        const {mediaType, assets} = response;
        if (assets && assets.length > 0) {
          const uri = assets[0].uri;
          setSelectedMedia([uri]);
          setMediaType(mediaType);
          console.log(
            `${
              mediaType === 'mixed' ? 'Captured photo' : 'Captured video'
            } URI:`,
            uri,
          );
          // Navigate to CreatePost and pass the media URI
          navigation.navigate('CreatePost', {mediaUri: uri, mediaType});
        }
      }
    });
  };

  const handleOpenGallery = () => {
    const options = {
      mediaType: 'mixed',
      selectionLimit: 4,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (!response.didCancel && !response.error) {
        const uris = response.assets.map(asset => asset.uri);
        const types = response.assets.map(asset => asset.type);
        setSelectedMedia(prevMedia => [...prevMedia, ...uris]);
        setMediaType(types[0] || 'photo');
      }
    });
  };

  const handleTextChange = text => {
    setNewPostText(text);
  };

  const handleMediaPress = uri => {
    setPreviewMedia(uri);
    setPreviewVisible(true);
  };

  const renderMedia = (uri, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => handleMediaPress(uri)}>
        <Image source={{uri}} style={styles.media} />
      </TouchableOpacity>
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
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Image source={profilePictureUri} style={styles.profilePicture} />
          <TextInput
            style={styles.textInput}
            placeholder="What’s going on..... ?"
            multiline
            value={newPostText}
            onChangeText={handleTextChange}
            maxLength={500}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedMedia.map((uri, index) => renderMedia(uri, index))}
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
      </View>

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
                source={{uri: previewMedia}}
                style={styles.fullScreenMedia}
                controls
              />
            ) : (
              <Image
                source={{uri: previewMedia}}
                style={styles.fullScreenMedia}
              />
            )}
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  media: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
    marginRight: 10,
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
    borderRadius: 50,
    height: 40,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenMedia: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default CreatePost;
