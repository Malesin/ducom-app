import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Header = () => {

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.burgerContainer}>
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <Image
            source={require('./../assets/logo1.png')}
            style={styles.logoImage}
          />
        </View>
        <View style={styles.emptySpace} />
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  burgerContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  burgerLine: {
    width: 25,
    height: 3,
    backgroundColor: '#000',
    marginVertical: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySpace: {
    width: 45, 
  },
  logoImage: {
    width: 110,
    height: 70,
  },
});

export default Header;