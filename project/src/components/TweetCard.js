import React, {useState} from 'react';
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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import DefaultAvatar from '../assets/avatar.png';

const TweetCard = ({tweet}) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [bookMarksCount, setBookMarksCount] = useState(tweet.bookMarksCount);
  const [commentsCount, setCommentsCount] = useState(tweet.commentsCount);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMediaUri, setModalMediaUri] = useState('');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false); // State for video loading

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
        url: tweet.image || tweet.video,
        title: tweet.userName,
      });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.card}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={tweet.userAvatar ? {uri: tweet.userAvatar} : DefaultAvatar}
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{tweet.userName}</Text>
          <Text style={styles.userHandle}>@{tweet.userHandle}</Text>
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

      {/* Tweet Media */}
      {tweet.image || tweet.video ? (
        <TouchableOpacity
          onPress={() => openMediaPreview(tweet.image || tweet.video)}
          style={styles.mediaContainer}>
          {tweet.image ? (
            <Image source={{uri: tweet.image}} style={styles.tweetImage} />
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
                source={{uri: tweet.video}}
                style={styles.video}
                controls
                resizeMode="contain"
                onLoad={() => setIsVideoLoaded(true)} // Set video loaded state
                onError={() => setIsVideoLoaded(true)} // Ensure loader hides on error
              />
            </View>
          )}
        </TouchableOpacity>
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
              {modalMediaUri.endsWith('.mp4') ? (
                <Video
                  source={{uri: modalMediaUri}}
                  style={styles.modalImage}
                  controls
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={{uri: modalMediaUri}}
                  style={styles.modalImage}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const InteractionButton = ({icon, color, count, onPress}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={20} color={color} />
    <Text style={styles.actionText}>{count}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 7,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
  tweetImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
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
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
});

export default TweetCard;
