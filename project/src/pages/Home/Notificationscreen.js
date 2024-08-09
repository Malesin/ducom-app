import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import TweetCard from '../../components/TweetCard'; 

const Notificationscreen = () => {
  const tweets = [
    {
      profilePicture: 'https://example.com/profile1.jpg',
      username: 'Kontolodon',
      handle: 'Kontolodon',
      content: 'Mentioned You!',
      likes: 12,
      comments: 5,
    },
    {
      profilePicture: 'https://example.com/profile2.jpg',
      username: 'Jane Smith',
      handle: 'janesmith',
      content: 'Mentioned You!',
      likes: 8,
      comments: 2,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {tweets.map((tweet, index) => (
          <TweetCard key={index} tweet={tweet} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default Notificationscreen;
