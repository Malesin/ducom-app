import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import DefaultAvatar from '../assets/iya.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BlockCard = ({ blockUser, onUnblock }) => {

  const handleUnblockPress = (blockUserData) => {
    Alert.alert(
      "Confirm",
      "Do you want to unblock this user?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => onUnblock(blockUserData) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.card}>
      <TouchableOpacity onPress={() => console.log('Blocked user pressed')}>
        <View style={styles.blockedRow}>
          <Image
            source={blockUser.profilePicture ? { uri: blockUser.profilePicture } : DefaultAvatar}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{blockUser.name}</Text>
              <Text style={styles.userNameAt}>@{blockUser.username}</Text>
            </View>
            <Text style={styles.notificationText}>Blocked</Text>
          </View>
          <TouchableOpacity onPress={() => handleUnblockPress(blockUser)}>
            <MaterialCommunityIcons name="block-helper" size={24} color="#657786" style={styles.unblockIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    width: '100%',
    maxWidth: 800,
    borderColor: '#E1E8ED',
    borderWidth: 1,
    borderRadius: 8,
  },
  blockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
  userNameAt: {
    fontSize: 15,
    color: '#657786',
    marginRight: 5,
  },
  notificationText: {
    fontSize: 15,
    color: '#000',
  },
  unblockIcon: {
    marginLeft: 5,
  },
});

export default BlockCard;