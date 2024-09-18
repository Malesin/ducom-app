import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import DefaultAvatar from '../assets/avatar.png';

const MentionCard = ({tweet}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: tweet.content,
        // url: tweet.image || tweet.video,
        title: tweet.userName,
      });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`;
  };

  return (
    <TouchableOpacity>
      <View style={styles.card}>
        <View style={styles.userInfo}>
          <Image
            source={tweet.userAvatar ? {uri: tweet.userAvatar} : DefaultAvatar}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{tweet.userName}</Text>
            <Text style={styles.userHandle}>@{tweet.userHandle}</Text>
            <Text style={styles.postDate}>{formatDate(tweet.postDate)}</Text>
          </View>
        </View>
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
        <Text style={styles.tweetText}>{tweet.content}</Text>
        {tweet.image || tweet.video ? (
          <View>
            {tweet.image ? (
              <Image source={{uri: tweet.image}} style={styles.tweetImage} />
            ) : (
              <TouchableOpacity>
                <Video
                  source={{uri: tweet.video}}
                  style={styles.tweetImage}
                  controls
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
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
});

export default MentionCard;
