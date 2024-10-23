import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import FollowCard from '../../components/FollowCard'

const FollowerPage = () => {
    const username = "mikadotjees"; 

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <FollowCard
                    followText="Follow Back"
                    followingText="Following"
                    removeButtonText="Remove Follower"
                    message={`We won't tell ${username} they were removed from your followers.`}
                    username={username} 
                />
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
    text: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        margin: 10,
    },
})
