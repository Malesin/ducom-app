import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from './../../components/header';
import Footer from '../../components/footer';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.contentText}>Welcome to the Home Screen!</Text>
        <TouchableOpacity style={styles.buttonContainer}>
          <MaterialCommunityIcons name="plus" size={40} color="#fff"/>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  contentText: {
    fontSize: 18,
    color: '#000',
  },
  buttonContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#001374', 
    borderRadius: 30,
    justifyContent: 'center', 
    alignItems: 'center', 
  }
});