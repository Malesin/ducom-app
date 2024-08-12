import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Profilescreen() {

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../assets/banner.jpg')}
          style={styles.banner}
        />
        <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
          <MaterialCommunityIcons name="dots-vertical" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Image
          source={require('../../assets/avatar.jpg')}
          style={styles.profile}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>Smkn 2 Jakarta</Text>
          <Text style={styles.username}>@duganofficial_</Text>
          <Text style={styles.description}>
            "SMK BISA, SMK HEBAT, DKI JAYA. SMKN 2 JAKARTA BERADAP, BERPRESTASI, JUARA"
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={() => {}}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 30,
    padding: 3,
    backgroundColor: 'rgba(217, 217, 217, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    marginTop: -42,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  editButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1E8ED',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
});