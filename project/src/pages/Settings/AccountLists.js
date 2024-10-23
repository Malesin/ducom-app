import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Usercard from '../../components/Admin/Usercard'

const AccountLists = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <Usercard />
            </ScrollView>
        </SafeAreaView>
    )
}

export default AccountLists

const styles = StyleSheet.create({})