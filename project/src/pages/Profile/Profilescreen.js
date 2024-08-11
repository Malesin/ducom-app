import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

export default function Profilescreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/banner.jpg')} // Ganti dengan path gambar banner Anda
        style={styles.banner}
      />
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
  banner: {
    width: '100%',
    height: 150, // Sesuaikan tinggi banner sesuai kebutuhan
    marginBottom: 20,
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
    marginTop: -42, // Tambahkan margin atas negatif untuk menggeser logo lebih ke atas
  },
  headerText: {
    flex: 1,
    justifyContent: 'center', // Menyelaraskan teks secara vertikal di tengah
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
    marginBottom: 10, // Tambahkan margin bawah untuk memberi ruang bagi tombol
  },
  editButton: {
    alignSelf: 'flex-start', // Sejajarkan tombol dengan deskripsi
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