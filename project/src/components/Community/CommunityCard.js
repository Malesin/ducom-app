import React, {useState, useEffect, useCallback, useMemo} from 'react';
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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import {createThumbnail} from 'react-native-create-thumbnail';

const CommunityCard = ({navigation, communityCardData = {}}) => {
  const {
    communityCardName = '',
    communityDescription = '',
    likesCount: initialLikesCount = 0,
    commentsCount: initialCommentsCount = 0,
    media = [],
  } = communityCardData;

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [joined, setJoined] = useState(false);
  const [thumbnails, setThumbnails] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMediaUri, setModalMediaUri] = useState('');

  const generateThumbnails = useCallback(async mediaItems => {
    const newThumbnails = {};
    for (const mediaItem of mediaItems || []) {
      if (mediaItem.type === 'video' && mediaItem.uri) {
        try {
          const {path} = await createThumbnail({url: mediaItem.uri});
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

  const handleLike = useCallback(() => {
    setLiked(prevLiked => {
      const newLikedState = !prevLiked;
      setLikesCount(prevCount =>
        newLikedState ? prevCount + 1 : prevCount - 1,
      );
      return newLikedState;
    });
  }, []);

  const pressJoin = useCallback(() => {
    setJoined(prevJoined => !prevJoined);
  });

  const handlePress = useCallback(() => {
    navigation.navigate('ViewCommunity');
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
    ({item}) => {
      const isImage =
        item.type === 'image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(item.uri);

      const isVideo =
        item.type === 'video' || /\.(mp4|mov|avi|mkv)$/i.test(item.uri);

      return (
        <TouchableOpacity onPress={() => openMediaPreview(item.uri)}>
          {isImage ? (
            <Image
              source={{uri: item.uri}}
              style={styles.mediaImage}
              onError={e => {
                console.error('Image Load Error:', e.nativeEvent.error);
              }}
            />
          ) : isVideo ? (
            <View style={styles.videoContainer}>
              <Image
                source={{uri: thumbnails[item.uri] || item.uri}}
                style={styles.mediaImage}
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
    [thumbnails, openMediaPreview],
  );

  const InteractionButton = useCallback(
    ({icon, color, count, onPress}) => (
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
        <TouchableOpacity
          style={[styles.joinButton, joined && styles.joinButton]}
          onPress={pressJoin}>
          <Text style={[styles.joinText, joined && styles.joinText]}>
            {joined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.communityDescription}>{communityDescription}</Text>

      {memoizedMedia.length > 0 && (
        <FlatList
          data={memoizedMedia}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => item.uri || index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaFlatList}
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
                    source={{uri: modalMediaUri}}
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
                    source={{uri: modalMediaUri}}
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
  joinButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  joinText: {
    color: '#000',
    fontSize: 13,
  },
  mediaFlatList: {
    marginTop: 10,
    marginBottom: 10,
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  videoContainer: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
