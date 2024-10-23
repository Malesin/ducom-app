import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import FollowCard from '../../components/FollowCard'

const FollowingPage = () => {
    const username = "mikadotjees"; // Ganti dengan username yang sesuai

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <FollowCard
                    followText="Follow"
                    followingText="Following"
                    removeButtonText="Unfollow"
                    message={username} // Hanya username
                    username={username} // Teruskan username
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
    text: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        margin: 10,
    },
})
