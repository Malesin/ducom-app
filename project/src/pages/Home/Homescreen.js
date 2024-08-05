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
        image: '',
        video: 'https://rr5---sn-aigl6ney.googlevideo.com/videoplayback?expire=1722702805&ei=dQeuZrC_MZGkp-oProGcmAY&ip=41.216.203.29&id=o-ALbOzTu2tWguFpQuKNDHB_oPZq8o6ZvNX6gyh4TDRF80&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AXc671JXfdY4i7DD5I82dLPs3rHUUiuKBKSYozuKi6lZjBOyrVTcXeervA84DXlcOS1RRVFSJaNN1HFv&spc=NO7bAcnhti3_SBZCfAWyZzGIW1hjzNxm0cI-i4YnVhMHV2THR8lnFd2IZTaylkA&vprv=1&svpuc=1&mime=video%2Fmp4&ns=sQiOOQ08dIf121FBjmVNw74Q&rqh=1&gir=yes&clen=40289460&ratebypass=yes&dur=477.982&lmt=1722607431566185&c=WEB&sefc=1&txp=5538434&n=v6ovJiNh-mpzSw&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRgIhAMfn5m2dkbY3So3ZalhvLa0Tei9-mf4_hZXE3BCHfiyAAiEAitaoCF4U1pGwIgmhQgi3sZjp3qFPPvrFFGbyL1YG-R0%3D&title=%5BONCAM%5D%20PANAS%20YA%20BANG%3F%20MATCH%20VIRAL%20%20GSX%20STD%20PORTING%20!&rm=sn-g5po15-j2ue7l,sn-woce776&rrc=79,104&fexp=24350516,24350518,24350557&req_id=a7b5255fcad9a3ee&redirect_counter=2&cms_redirect=yes&cmsv=e&ipbypass=yes&mh=Ev&mip=110.138.90.203&mm=29&mn=sn-aigl6ney&ms=rdu&mt=1722689646&mv=D&mvi=5&pl=0&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AGtxev0wRgIhAPYOE3xoSFQn_VBnXE3AIrUXqZSg_viLfssgTvTkJcGOAiEAwNmNhSjsRxvr76JrInysUbfyf6PzYN3f57XUUqGLELY%3D', // Add video URL if available
        commentsCount: 12,
        likesCount: 56,
        bookMarksCount: 2,
      },
      {
        userName: 'frontendgariskeras',
        userHandle: 'frontend',
        userAvatar: '',
        content: '2 stroke menolak punah ',
        image: 'https://i.pinimg.com/564x/43/7e/a8/437ea88ad75d8ab66c26b75e4b5d28e8.jpg',
        video: '', // Add video URL if available
        commentsCount: 12,
        likesCount: 56,
        bookMarksCount: 2,
      },
      {
        userName: 'admin',
        userHandle: 'adminsl0t',
        userAvatar: '',
        content: 'kakak aknes ygy',
        image: '',
        video: '', // Example video URL
        commentsCount: 12,
        likesCount: 56,
        bookMarksCount: 2,
      },
      {
        userName: 'noturfavmikaaa',
        userHandle: 'mikaa',
        userAvatar: '',
        content: 'sigma skibidi toilet',
        image: '',
        video: '', // Add video URL if available
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
        <MaterialCommunityIcons name="plus" size={40} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
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
