import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

const Settingsscreen = ({navigation}) => {
  const handleLogout = async () => {
    Alert.alert('Logout Account', 'Are you sure want to Logout', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Logout',

        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.clear();
          navigation.navigate('Auths');
          console.log("Logout successfully");
        },
      },
    ]);
  };
  return (
    <View>
      <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
        <Text style={styles.contentText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settingsscreen;

const styles = StyleSheet.create({
  buttonLogout: {
    width: 100,
    height: 60,
    backgroundColor: 'red',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
