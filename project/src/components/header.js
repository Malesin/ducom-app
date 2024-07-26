import React, { useState, useRef } from 'react';
import { Animated, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Sidebar from './sidebar';

const Header = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sidebarOffset = useRef(new Animated.Value(-250)).current; 
  const toggleSidebar = () => {
    if (isSidebarVisible) {
      // Sembunyikan sidebar
      Animated.timing(sidebarOffset, {
        toValue: -250,
        duration: 300,
        0: true,
      }).start(() => setSidebarVisible(false));
    } else {
      // Tampilkan sidebar
      setSidebarVisible(true);
      Animated.timing(sidebarOffset, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {isSidebarVisible && (
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarOffset }] }]}>
          <Sidebar onClose={() => setSidebarVisible(false)} />
        </Animated.View>
      )}
      
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuContainer} onPress={toggleSidebar}>
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
    borderBottomColor: '#ddd',
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
  menuContainer: {
    padding: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    zIndex: 1000,
  },
});

export default Header;
