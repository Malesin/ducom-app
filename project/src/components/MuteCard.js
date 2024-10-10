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

const MuteCard = ({ mutedAccount, onUnmute }) => {
  const handleUnmutePress = () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah anda ingin men-unmute akun ini?",
      [
        { text: "Tidak", style: "cancel" },
        { text: "Ya", onPress: onUnmute }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.card}>
      <TouchableOpacity onPress={() => console.log('halo')}>
        <View style={styles.mutedRow}>
          <Image
            source={mutedAccount.profilePicture ? { uri: mutedAccount.profilePicture } : DefaultAvatar}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{mutedAccount.name}</Text>
              <Text style={styles.userNameAt}>@{mutedAccount.username}</Text>
            </View>
            <Text style={styles.notificationText}>Muted</Text>
          </View>
          <TouchableOpacity onPress={handleUnmutePress}>
            <MaterialCommunityIcons name="volume-off" size={30} color="#657786" style={styles.unmuteIcon} />
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
  mutedRow: {
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
  unmuteIcon: {
    marginLeft: 5,
  },
});

export default MuteCard;