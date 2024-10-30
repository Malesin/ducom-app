import FollowCard from '../../components/FollowCard'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;


const FollowingPage = () => {
    const [dataFollowing, setDataFollowing] = useState([])
    const [myId, setMyId] = useState()

    const getDataFollowing = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios
                .post(`${serverUrl}/show-following`, {
                    token: token
                })
                .then(res => {
                    const dataFollow = res.data.data.following
                    setDataFollowing(dataFollow)

                    const myUserId = res.data.myId
                    setMyId(myUserId)
                })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getDataFollowing()
    }, [])

    useFocusEffect(
        useCallback(() => {
            getDataFollowing();
        }, []),
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {dataFollowing.map((data, index) => (
                    <View key={index}>
                        <FollowCard
                            followText="Follow Back"
                            followingText="Following"
                            removeButtonText="Unfollow"
                            message={
                                <Text style={styles.boldUsername}>{data?.username}</Text>
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

export default FollowingPage

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
