import { View, Text, Image, Button, StyleSheet } from 'react-native';
import React from 'react';

export default function Profilescreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/avatar.jpg')}// Ganti dengan URL gambar yang sesuai
        style={styles.logo}
      />
      <Text style={styles.title}>Smkn 2 Jakarta</Text>
      <Text style={styles.username}>@duganofficial_</Text>
      <Text style={styles.description}>
        "SMK BISA, SMK HEBAT, DKI JAYA. SMKN 2 JAKARTA BERADAP, BERPRESTASI, JUARA"
      </Text>
      <Button title="Edit Profile" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});