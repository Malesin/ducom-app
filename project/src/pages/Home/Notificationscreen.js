import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import MentionCard from '../../components/MentionCard'; // Ensure correct path to MentionCard component

const Notificationscreen = () => {
  // Example tweet data
  const mentions = [
    {
      userAvatar:
        'https://i.pinimg.com/564x/3d/22/e2/3d22e2269593b9169e7d74fe222dbab0.jpg',
      userName: 'John Doe',
      userHandle: 'johndoe',
      content: 'This is a sample mention content. #example',
      image: 'https://i.pinimg.com/564x/12/ee/2c/12ee2c54d0ff28cf57df7890c447abf8.jpg',
      video: '',
      likesCount: 10,
      bookMarksCount: 5,
      commentsCount: 2,
    },
    // Add more mentions as needed
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {mentions.map((mention, index) => (
          <MentionCard key={index} tweet={mention} />
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
