import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Header = () => {

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuContainer} onPress={() => alert('Menubar Pressed!')} >
          <MaterialCommunityIcons name="menu" size={35} color="#000" />        
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