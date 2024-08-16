import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Keyboard,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';

const CreatePost = ({route, navigation}) => {
  const [newPostText, setNewPostText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (route.params?.mediaUri) {
      setSelectedMedia([route.params.mediaUri]); // Initialize with the mediaUri from route params
    }
  }, [route.params?.mediaUri]);

  const handlePostSubmit = () => {
    // 1. Send post data to your backend (e.g., using a fetch request)
    // 2. Update the state or navigate to the feed screen after success
    navigation.navigate('Home');
  };

  const handleOpenCamera = () => {
    const options = {
      mediaType: 'mixed', // Allows both photos and videos
      saveToPhotos: true,
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo or video');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        setSelectedMedia(prevMedia => [...prevMedia, uri]);
      }
    });
  };

  const handleOpenGallery = () => {
    const options = {
      mediaType: 'mixed', // Allows both photos and videos
      selectionLimit: 4, // Allow multiple selections
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uris = response.assets.map(asset => asset.uri);
        setSelectedMedia(prevMedia => [...prevMedia, ...uris]); // Append multiple media URIs
      }
    });
  };

  const handleTextChange = text => {
    setNewPostText(text);
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

  const renderMedia = (uri, index) => {
    const isVideo = uri.endsWith('.mp4'); // Basic check for video file

    return isVideo ? (
      <Video key={index} source={{uri}} style={styles.media} controls />
    ) : (
      <Image key={index} source={{uri}} style={styles.media} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="What’s going on..... ?"
          multiline
          value={newPostText}
          onChangeText={handleTextChange}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedMedia.map(renderMedia)}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            icon={<Icon name="camera" size={24} color="#000" />}
            buttonStyle={styles.button}
            onPress={handleOpenCamera} // Open camera when button is pressed
          />
          <Button
            icon={<Icon name="image-outline" size={24} color="#000" />}
            buttonStyle={styles.button}
            onPress={handleOpenGallery} // Open gallery when button is pressed
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
  textInput: {
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
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
});

export default CreatePost;
