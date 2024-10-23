import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native'
import React from 'react'
import FollowCard from '../../components/FollowCard'

const FollowingPage = () => {
    const username = "mikadotjees";

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <FollowCard
                    followText="Follow Back"
                    followingText="Following"
                    removeButtonText="Unfollow"
                    message={
                        <Text style={styles.boldUsername}>{username}</Text>
                    }
                    username={username}
                />
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
