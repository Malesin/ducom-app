import FollowCard from '../../components/FollowCard'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const FollowerPage = () => {
    const [dataFollowers, setDataFollowers] = useState([])
    const [myId, setMyId] = useState()

    const getDataFollowers = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios
                .post(`${serverUrl}/show-followers`, {
                    token: token
                })
                .then(res => {
                    const dataFollow = res.data.data.followers
                    setDataFollowers(dataFollow)
                    const myUserId = res.data.myId
                    setMyId(myUserId)
                })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getDataFollowers()
    }, [])

    useFocusEffect(
        useCallback(() => {
            getDataFollowers();
        }, []),
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {dataFollowers.map((data, index) => (
                    <View key={index}>
                        <FollowCard
                            followText="Follow Back"
                            followingText="Following"
                            removeButtonText="Remove"
                            message={
                                <Text>
                                    We won't tell <Text style={styles.boldUsername}>{data?.username}</Text> they were removed from your followers.
                                </Text>
                            }
                            data={data}
                            myId={myId}
                        />
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default FollowerPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    scrollView: {
        paddingBottom: 20,
    },
    boldUsername: {
        fontWeight: 'bold',
    },
    text: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        margin: 10,
    },
})
