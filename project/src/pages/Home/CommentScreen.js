import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CommentCard from '../../components/CommentCard';

const CommentScreen = () => {
  return (
    <SafeAreaView>
      <CommentCard />
    </SafeAreaView>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({});
