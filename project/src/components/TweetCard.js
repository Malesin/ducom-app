import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Share,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import DefaultAvatar from '../assets/avatar.png';

const TweetCard = ({ tweet }) => {
  if (typeof tweet.content !== 'string') {
    console.error('Invalid tweet content:', tweet.content);
    return null;
  }
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [bookMarksCount, setBookMarksCount] = useState(tweet.bookMarksCount);
  const [commentsCount, setCommentsCount] = useState(tweet.commentsCount);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMediaUri, setModalMediaUri] = useState('');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikesCount(prev => (liked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setBookmarked(prev => !prev);
    setBookMarksCount(prev => (bookmarked ? prev - 1 : prev + 1));
  };

  const handleComment = () => setCommentsCount(prev => prev + 1);

  const openMediaPreview = uri => {
    setModalMediaUri(uri);
    setIsModalVisible(true);
  };

  const closeMediaPreview = () => {
    setIsModalVisible(false);
    setModalMediaUri('');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: tweet.content,
        url: tweet.media && tweet.media.length > 0 ? tweet.media[0].uri : '',
        title: tweet.userName,
      });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getDate()} -${date.getMonth() + 1} -${date.getFullYear()}`;
  };

  const renderMediaItem = ({ item }) => {
    if (!item.uri) {
      // console.error('Media URI is not valid:', item.uri);
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => openMediaPreview(item.uri)}
        style={styles.mediaContainer}>
        {item.type === 'image' ? (
          <Image source={{ uri: item.uri }} style={styles.tweetImage} onError={() => console.log('Failed to load image')} />
        ) : (
          <View style={styles.videoContainer}>
            {!isVideoLoaded && (
              <ActivityIndicator
                size="large"
                color="#000"
                style={styles.videoLoader}
              />
            )}
            <Video
              source={{ uri: item.uri }}
              style={styles.video}
              controls
              resizeMode="contain"
              onLoad={() => setIsVideoLoaded(true)}
              onError={(error) => {
                console.log('Failed to load video', error);
                setIsVideoLoaded(true); // Hide loader
              }}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.card}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={tweet.userAvatar ? { uri: tweet.userAvatar } : DefaultAvatar}
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{tweet.userName}</Text>
          <Text style={styles.userHandle}>@{tweet.userHandle}</Text>
          <Text style={styles.postDate}>{formatDate(tweet.postDate)}</Text>
        </View>

        {/* Options Button */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={() => console.log('More options pressed')}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="#657786"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tweet Content */}
      <Text style={styles.tweetText}>{tweet.content}</Text>

      {/* Tweet Media with Horizontal Scroll */}
      {tweet.media && tweet.media.length > 0 ? (
        <FlatList
          data={tweet.media}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaFlatList}
        />
      ) : null}

      {/* Interactions */}
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
          onPress={handleComment}
        />
        <InteractionButton
          icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
          color={bookmarked ? '#00c5ff' : '#040608'}
          count={bookMarksCount}
          onPress={handleBookmark}
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <MaterialCommunityIcons
            name="export-variant"
            size={20}
            color="#657786"
          />
        </TouchableOpacity>
      </View>

      {/* Modal for Media Preview */}
      <Modal
        visible={isModalVisible}
        transparent
        onRequestClose={closeMediaPreview}
        animationType="fade">
        <TouchableWithoutFeedback onPress={closeMediaPreview}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {modalMediaUri ? (
                modalMediaUri.endsWith('.jpg') || modalMediaUri.endsWith('.png') ? (
                  <Image
                    source={{ uri: modalMediaUri }}
                    style={styles.modalImage}
                    onError={() => console.log('Failed to load image')}
                  />
                ) : (
                  <Video
                    source={{ uri: modalMediaUri }}
                    style={styles.modalImage}
                    controls
                    resizeMode="contain"
                  />
                )
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const InteractionButton = ({ icon, color, count, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={20} color={color} />
    <Text style={styles.actionText}>{count}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    width: '100%',
    maxWidth: 800,
    borderColor: '#E1E8ED',
    borderWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 49,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#040608',
    marginRight: 4,
  },
  userHandle: {
    color: '#718096',
    fontWeight: '700',
    marginRight: 8,
  },
  postDate: {
    color: '#718096',
    fontSize: 12,
  },
  tweetText: {
    fontSize: 15,
    marginVertical: 8,
    color: '#040608',
  },
  mediaFlatList: {
    marginVertical: 8,
  },
  tweetImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    color: '#040608',
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoader: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default TweetCard;