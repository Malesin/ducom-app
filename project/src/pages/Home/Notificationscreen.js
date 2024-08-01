import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Notificationscreen = () => {
  return (
    <SafeAreaView style={styles.container} >
      <View>
        <Text>Notificationscreen</Text>
      </View>
    </SafeAreaView>
  )
}

export default Notificationscreen

const styles = StyleSheet.create({
    container: {
      color: "#FFFFFF"
    }
})