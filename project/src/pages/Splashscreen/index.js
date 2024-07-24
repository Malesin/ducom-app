import { StyleSheet, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const Splashscreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      navigation.navigate('Auths');
    }, 2000);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <Image
          style={{ height: 130, width: 215 }}
          source={require('../../assets/logo1.png')}
        />
      </View>
    </View>
  );
};

export default Splashscreen;

const styles = StyleSheet.create({});