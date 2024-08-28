import React, { useState } from 'react';
import { View } from 'react-native';
import TweetCard from '../../components/TweetCard';

function Replyscreen() {
    const [tweets, setTweets] = useState([
        {
            id: '1',
            content: 'This is a tweet',
            user: 'User1',
            userName: 'User One',
            userHandle: 'user1',
            userAvatar: null,
            likesCount: 10,
            bookMarksCount: 5,
            commentsCount: 2,
            image: null,
            video: null
        },
        {
            id: '2',
            content: 'This is another tweet',
            user: 'User2',
            userName: 'User Two',
            userHandle: 'user2',
            userAvatar: null,
            likesCount: 20,
            bookMarksCount: 10,
            commentsCount: 4,
            image: null,
            video: null
        },
        {
            id: '3',
            content: 'This is another tweet',
            user: 'User2',
            userName: 'User Two',
            userHandle: 'user2',
            userAvatar: null,
            likesCount: 20,
            bookMarksCount: 10,
            commentsCount: 4,
            image: null,
            video: null
        },
        {
            id: '4',
            content: 'This is another tweet',
            user: 'User2',
            userName: 'User Two',
            userHandle: 'user2',
            userAvatar: null,
            likesCount: 20,
            bookMarksCount: 10,
            commentsCount: 4,
            image: null,
            video: null
        }
    ]);

    return (
        <View>
            {tweets.map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} />
            ))}
        </View>
    );
}

export default Replyscreen; 