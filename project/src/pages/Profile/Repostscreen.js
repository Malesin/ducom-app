import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import TweetCard from '../../components/TweetCard';

const Repostscreen = () => {
    const repostedTweets = [
        { id: 1, username: '@johnDoe', content: 'This is the first reposted tweet.', likes: 25, reposts: 5, isLiked: true },
        { id: 2, username: '@janeSmith', content: 'Here is another reposted tweet, sharing my thoughts!', likes: 50, reposts: 10, isLiked: false },
        { id: 3, username: '@techGuru', content: 'Yet another reposted tweet about AI developments!', likes: 75, reposts: 20, isLiked: true },
    ];

    return (
        <View style={styles.container}>
            {repostedTweets.map(tweet => (
                <TweetCard
                    key={tweet.id}
                    userName={tweet.username}
                    content={tweet.content}
                    likes={tweet.likes}
                    reposts={tweet.reposts}
                    isLiked={tweet.isLiked}
                />
            ))}
        </View>
    );
};

export default Repostscreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
