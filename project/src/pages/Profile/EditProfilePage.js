import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EditProfilePage() {
  return (
    <View style={styles.container}>
      <Text>Edit Profile Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});