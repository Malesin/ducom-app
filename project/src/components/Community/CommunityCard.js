import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Share,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CommunityCard = ({ navigation }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookMarksCount, setBookMarksCount] = useState(0);
  const [reposted, setReposted] = useState(false);
  const [repostsCount, setRepostsCount] = useState(0);
  const [commentsCount] = useState(0);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prevLikesCount => prevLikesCount - 1);
    } else {
      setLiked(true);
      setLikesCount(prevLikesCount => prevLikesCount + 1);
    }
  };

  const handleBookmark = () => {
    if (bookmarked) {
      setBookmarked(false);
      setBookMarksCount(prevBookmarksCount => prevBookmarksCount - 1);
    } else {
      setBookmarked(true);
      setBookMarksCount(prevBookmarksCount => prevBookmarksCount + 1);
    }
  };

  const handleRepost = () => {
    if (reposted) {
      setReposted(false);
      setRepostsCount(prevRepostsCount => prevRepostsCount - 1);
    } else {
      setReposted(true);
      setRepostsCount(prevRepostsCount => prevRepostsCount + 1);
    }
  };

  const handleShare = () => {
    console.log('share');
  };

  const handlePress = () => {
    navigation.navigate('ViewCommunity');
  };

  const InteractionButton = ({icon, color, count, onPress}) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <Text style={styles.actionText}>{count}</Text>
    </TouchableOpacity>
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
          <Text style={styles.userHandle}>nama_komunitas</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.communityDescription}>
        Deskripsi komunitas di sini.
      </Text>
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
        <InteractionButton
          icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
          color={bookmarked ? '#00c5ff' : '#040608'}
          count={bookMarksCount}
          onPress={handleBookmark}
        />
        <InteractionButton
          icon="repeat-variant"
          color={reposted ? '#097969' : '#040608'}
          count={repostsCount}
          onPress={handleRepost}
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <MaterialCommunityIcons
            name="export-variant"
            size={20}
            color="#657786"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderColor: '#E1E8ED',
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
  },
  actionText: {
    marginLeft: 4,
    color: '#040608',
  },
});

export default CommunityCard;
