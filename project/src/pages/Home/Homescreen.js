import { StyleSheet, ScrollView, View, Text, TouchableOpacity, BackHandler, Alert, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import config from '../../config';
import TweetCard from '../../components/TweetCard'; // Import TweetCard

const serverUrl = config.SERVER_URL;

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState("");
  const [tweets, setTweets] = useState([]); // Add state for tweets

  async function getData() {
    const token = await AsyncStorage.getItem("token");
    axios
      .post(`${serverUrl}/userdata`, { token: token })
      .then(res => {
        setUserData(res.data.data);
        if (res.data.status === "error") {
          Alert.alert('Error', "Anda Telah Keluar dari Akun", [
            { text: 'OK', onPress: () => navigation.navigate('Signin') }
          ]);
        }
      });

    // Fetch tweets 
    // Replace with your actual data fetching logic
    setTweets([
      {
        userName: 'nimyonim',
        userHandle: 'nesir',
        userAvatar: '',
        content: 'banyak bertanya makin tersesat',
        image: 'null',
        commentsCount: 12,
        likesCount: 56,
        bookMarksCount: 2,
      },
      {
        userName: 'frontendgariskeras',
        userHandle: 'frontend',
        userAvatar: '',
        content: 'nanya mulu kayak tamu',
        image: '',
        commentsCount: 12,
        likesCount: 56,
        bookMarksCount: 2,
      },
      {
        userName: 'admin',
        userHandle: 'adminsl0t',
        userAvatar: '',
        content: 'kuntul puqimak',
        image: 'null',
        commentsCount: 12,
        likesCount: 56,
        bookMarksCount: 2,
      },
      {
        userName: 'noturfavmikaa',
        userHandle: 'mikaa',
        userAvatar: '',
        content: 'sigma skibidi toilet',
        image: '',
        commentsCount: 12,
        likesCount: 56,
        bookMarksCount: 2,
      },
      // Add more tweet post here
    ]);
  }

  const handleBackPress = () => {
    Alert.alert(
      'Exit App',
      'Are you sure want to exit',
      [{
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel'
      }, {
        text: 'Exit',
        onPress: () => BackHandler.exitApp()
      }]
    );
    return true;
  }

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      }
    })
  );

  useEffect(() => {
    getData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert(
      'Logout Account',
      'Are you sure want to Logout',
      [{
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel'
      }, {
        text: 'Logout',
        onPress: () => navigation.navigate('Auths'),
      }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {tweets.map((tweet, index) => (
          <View key={index} style={styles.tweetContainer}>
            <TweetCard tweet={tweet} />
          </View>
        ))}
        <Text style={styles.contentText}>Hi, {userData.username}</Text>
        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.contentText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => console.log('Button pressed')}>
        <MaterialCommunityIcons name="plus" size={50} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center', // Aligns items in the center horizontally
    paddingBottom: 20,
  },
  tweetContainer: {
    width: '100%', // Ensures the TweetCard takes full width of the screen
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contentText: {
    fontSize: 18,
    color: '#000',
    marginVertical: 10, // Adds margin around the text
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 65,
    height: 65,
    backgroundColor: '#001374',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonLogout: {
    width: 100,
    height: 60,
    backgroundColor: 'red',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
