import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home-outline" size={40} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => alert('Bell button pressed!')}>
          <MaterialCommunityIcons name="bell-outline" size={35} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton} onPress={() => alert('Profile button pressed!')}>
          <Image
            source={require('./../assets/profile.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#d3d3d3',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  profileButton: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  iconButton: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5, 
  },
});