import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CommentCard = () => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/profilepic.png')} // Assuming you have this image in your assets folder
          style={styles.profileImage}
        />
      </View>
      <View style={styles.commentContainer}>
        <Text style={styles.username}>@agnesputrii_</Text>
        <Text style={styles.commentText}>lorem ipsum sit amet</Text>
        <View style={styles.replyAndLikeContainer}>
          <Text style={styles.replyText}>reply</Text>
          <TouchableOpacity onPress={handleLikePress}>
            <MaterialCommunityIcons
              name={isLiked ? 'heart' : 'heart-outline'} //Change icon based on like state
              size={14}
              color={isLiked ? 'red' : 'black'} //Change color based on like state
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  profileContainer: {
    marginRight: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContainer: {
    flex: 1,
    marginRight: 20,
  },
  username: {
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#000',
  },
  commentText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#000',
  },
  replyAndLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 5,
    marginRight: 5,
  },
});
