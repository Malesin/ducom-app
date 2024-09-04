import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CommentCard = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };

  const handleActionPress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/profilepic.png')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.commentContainer}>
          <Text style={styles.username}>@agnesputrii_</Text>
          <Text style={styles.commentText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at
            iaculis nisi. In id urna orci. Aenean faucibus ex erat, sit amet
            venenatis tellus congue non.{' '}
          </Text>
          <View style={styles.replyAndLikeContainer}>
            <TouchableOpacity style={styles.replyButton}>
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLikePress}>
              <MaterialCommunityIcons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={16}
                color={isLiked ? 'red' : 'black'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleActionPress}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={dropdownVisible}
          onRequestClose={closeDropdown}>
          <TouchableOpacity style={styles.modalOverlay} onPress={closeDropdown}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>Delete</Text>
              </TouchableOpacity>
              <View style={styles.dropdownDivider} />
              <TouchableOpacity style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>Report</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
    position: 'relative',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  profileContainer: {
    marginRight: 3,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
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
    fontSize: 15,
    marginLeft: 5,
    color: '#000',
  },
  replyAndLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyButton: {
    marginLeft: 5,
    marginRight: 5,
  },
  replyButtonText: {
    fontSize: 13,
    color: 'gray',
  },
  actionButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  dropdownContainer: {
    position: 'absolute',
    alignItems: 'center',
    top: 80,
    right: 50,
  },
  dropdownItem: {
    alignItems: 'center',
    borderWidth: 1,
    width: 65,
    height: 30,
    backgroundColor: '#E1E1E1',
  },
  dropdownItemText: {
    alignItems: 'center',
    fontSize: 15,
    color: '#000',
  },
});
