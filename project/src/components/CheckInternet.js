import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const CheckInternet = ({isConnected, setIsConnected}) => {
  return (
    <View style={style.container}>
      <Text>CheckInternet</Text>
    </View>
  )
}

export default CheckInternet

const style = StyleSheet.create({
    container: {
        flex: 1,
    }
})