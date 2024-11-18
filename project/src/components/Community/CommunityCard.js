import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import CommBottomSheet from '../CommBottomSheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;
const CommunityCard = ({ navigation, communityCardData = {} }) => {
  const {
    communityCardName = '',
    communityDescription = '',
    likesCount: initialLikesCount = 0,
    commentsCount: initialCommentsCount = 0,
    media = [],
  } = communityCardData;
  const [liked, setLiked] = useState(communityCardData?.isLiked);
  const [likesCount, setLikesCount] = useState();
  const [commentsCount, setCommentsCount] = useState();
  const [thumbnails, setThumbnails] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [modalMediaUri, setModalMediaUri] = useState('');
  const [dataSent, setDataSent] = useState(null);

  const generateThumbnails = useCallback(async mediaItems => {
    const newThumbnails = {};
    for (const mediaItem of mediaItems || []) {
      if (mediaItem.type === 'video' && mediaItem.uri) {
        try {
          const { path } = await createThumbnail({ url: mediaItem.uri });
          newThumbnails[mediaItem.uri] = path;
        } catch (error) {
          console.log('Error generating thumbnail:', error);
        }
      }
    }
    return newThumbnails;
  }, []);

  const memoizedMedia = useMemo(() => media || [], [media]);
  useEffect(() => {
    const dataSend = async () => {
      const token = await AsyncStorage.getItem('token');
      const dataSent = {
        token: token,
        postId: communityCardData?.id,
      };
      setDataSent(dataSent);
    };
    dataSend();

    setLikesCount(initialLikesCount);
    setCommentsCount(initialCommentsCount);

    const loadThumbnails = async () => {
      if (memoizedMedia.length > 0) {
        const newThumbnails = await generateThumbnails(memoizedMedia);
        setThumbnails(prevThumbnails => ({
          ...prevThumbnails,
          ...newThumbnails,
        }));
      }
    };

    loadThumbnails();

  }, [
    initialLikesCount,
    initialCommentsCount,
    memoizedMedia,
    generateThumbnails,
  ]);

  const onResp = async resp => {
    try {
      if (resp.status == `ok${resp.type}`) {
        ToastAndroid.show(
          `Tweet Successfully ${resp.typed}`,
          ToastAndroid.SHORT,
        );
      } else if (resp.status == `okUn${resp.type}`) {
        ToastAndroid.show(
          `Tweet Successfully Un${resp.typed}`,
          ToastAndroid.SHORT,
        );
      } else {
        console.error(`Error in ${resp.typing} response data:`, resp.status);
        Alert.alert('Error', `Failed to ${resp.type} post. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${resp.type}:`, error.message);
      Alert.alert('Error', `Failed to ${resp.type}. Please try again.`);
    }
  };

  const handleLike = async () => {
    try {
      setLiked(liked ? false : true);
      setLikesCount(prevLikesCount =>
        liked ? prevLikesCount - 1 : prevLikesCount + 1,
      );

      await axios.post(
        `${serverUrl}/${liked ? 'unlike' : 'like'}-post`,
        dataSent,
      );
    } catch (error) {
      console.error(
        `Error in ${liked ? 'unliking' : 'liking'} post:`,
        error.message,
      );
      setLiked(liked ? true : false);
      setLikesCount(prevLikesCount =>
        liked ? prevLikesCount + 1 : prevLikesCount - 1,
      );

      ToastAndroid.show(
        `Failed to ${liked ? 'unlike' : 'like'} post. Please try again.`,
        ToastAndroid.SHORT,
      );
    }
  };

  const handlePress = useCallback(() => {
    navigation.navigate('ViewCommunity', { communityId: communityCardData?.communityId });
  }, [navigation]);

  const openMediaPreview = useCallback(uri => {
    setModalMediaUri(uri);
    setIsModalVisible(true);
  }, []);

  const closeMediaPreview = useCallback(() => {
    setIsModalVisible(false);
    setModalMediaUri('');
  }, []);

  const renderMediaItem = useCallback(
    ({ item, index }) => {
      const isImage =
        item.type === 'image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(item.uri);

      const isVideo =
        item.type === 'video' || /\.(mp4|mov|avi|mkv)$/i.test(item.uri);

      const mediaWidth =
        memoizedMedia.length === 1
          ? Dimensions.get('window').width * 0.9
          : Dimensions.get('window').width * 0.5;

      return (
        <TouchableOpacity
          onPress={() => openMediaPreview(item.uri)}
          style={[
            styles.mediaItemContainer,
            {
              width: mediaWidth,
              height: memoizedMedia.length === 1 ? 250 : 200,
            },
          ]}>
          {isImage ? (
            <Image
              source={{ uri: item.uri }}
              style={styles.mediaImage}
              resizeMode="cover"
              onError={e => {
                console.error('Image Load Error:', e.nativeEvent.error);
              }}
            />
          ) : isVideo ? (
            <View style={styles.videoContainer}>
              <Image
                source={{ uri: thumbnails[item.uri] || item.uri }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
              <MaterialCommunityIcons
                name="play-circle-outline"
                size={40}
                color="#fff"
                style={styles.playIcon}
              />
            </View>
          ) : null}
        </TouchableOpacity>
      );
    },
    [thumbnails, openMediaPreview, memoizedMedia.length],
  );

  const handleOptionPress = () => {
    setShowBottomSheet(true);
  };

  const InteractionButton = useCallback(
    ({ icon, color, count, onPress }) => (
      <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
        <Text style={styles.actionText}>{count}</Text>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.card}>
      <View style={styles.userInfo}>
        <MaterialCommunityIcons
          name="account-multiple"
          size={15}
          color="#000"
        />
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.userHandle}>{communityCardName}</Text>
        </TouchableOpacity>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={handleOptionPress}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="#657786"
            />
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showBottomSheet}
          onRequestClose={() => setShowBottomSheet(false)}>
          <TouchableWithoutFeedback onPress={() => setShowBottomSheet(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.bottomSheetContainer}>
            <CommBottomSheet
              onCloseDel={respdel => {
                setShowBottomSheet(false);
                onRefreshPage();
                onDel(respdel);
              }}
              onCloseResp={resp => {
                setShowBottomSheet(false);
                onRefreshPage();
                onResp(resp);
              }}
            post={communityCardData}
            // onRefreshPage={onRefreshPage}
            // isUserProfile={isUserProfile}
            // handlePin={false}
            // handlePinUser={false}
            />
          </View>
        </Modal>
      </View>
      <Text style={styles.communityDescription}>{communityDescription}</Text>
      {memoizedMedia.length > 0 && (
        <FlatList
          data={memoizedMedia}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => item.uri || index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={memoizedMedia.length > 1}
          style={styles.mediaFlatList}
          snapToAlignment="start"
          snapToInterval={
            memoizedMedia.length === 1
              ? Dimensions.get('window').width * 0.9
              : Dimensions.get('window').width * 0.5
          }
          decelerationRate="fast"
        />
      )}
      <View style={styles.actions}>
        <InteractionButton
          icon={liked ? 'heart' : 'heart-outline'}
          color={liked ? '#E0245E' : '#040608'}
          count={likesCount}
          onPress={handleLike}
        />
        <InteractionButton
          icon="message-reply-outline"
          color="#040608"
          count={commentsCount}
          onPress={handlePress}
        />
      </View>
      <Modal
        visible={isModalVisible}
        transparent
        onRequestClose={closeMediaPreview}
        animationType="fade">
        <TouchableWithoutFeedback onPress={closeMediaPreview}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {modalMediaUri ? (
                /\.(jpg|jpeg|png|gif|webp)$/i.test(modalMediaUri) ? (
                  <Image
                    source={{ uri: modalMediaUri }}
                    style={styles.modalImage}
                    resizeMode="contain"
                    onError={e => {
                      console.error(
                        'Modal Image Load Error:',
                        e.nativeEvent.error,
                      );
                    }}
                  />
                ) : /\.(mp4|mov|avi|mkv)$/i.test(modalMediaUri) ? (
                  <Video
                    source={{ uri: modalMediaUri }}
                    style={styles.modalVideo}
                    controls
                    resizeMode="contain"
                    onError={error => {
                      console.error('Modal Video Load Error:', error);
                    }}
                  />
                ) : (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Unsupported media type</Text>
                  </View>
                )
              ) : (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>No media found</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderColor: '#E1E8ED',
    borderWidth: 1,
    borderRadius: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  optionsContainer: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsButton: {
    marginLeft: 10,
  },
  userHandle: {
    color: '#718096',
    fontSize: 14,
    paddingHorizontal: 5,
  },
  communityDescription: {
    fontSize: 14,
    color: '#040608',
    paddingVertical: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  actionText: {
    marginLeft: 3,
    color: '#040608',
  },
  mediaFlatList: {
    paddingHorizontal: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  mediaItemContainer: {
    marginRight: 10,
    borderRadius: 8,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    resizeMode: 'contain',
  },
  modalVideo: {
    width: '100%',
    height: '100%',
    maxWidth: '85%',
    maxHeight: '85%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.1)',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CommunityCard;
