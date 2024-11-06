import { View, Text } from 'react-native'
import React from 'react'
import CommunityCard from '../../components/Community/CommunityCard'

const CommunityPost = ({ navigation }) => {
  return (
    <View>
      <CommunityCard navigation={navigation} />
    </View>
  )
}

export default CommunityPost