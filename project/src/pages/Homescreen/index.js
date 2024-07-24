import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Header from './../../components/header';
import Footer from '../../components/footer';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>Welcome to the Home Screen!</Text>
      </View>
      <Footer />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#000',
  },
});