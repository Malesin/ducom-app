import { View, Text } from 'react-native'
import React from 'react'
import CommunityCard from '../../components/Community/CommunityCard'

const CommunityPost = ({ navigation }) => {
  const communityCardData = {
    communityCardName: 'Nama Komunitas',
    communityDescription: 'Deskripsi komunitas ini.',
  };

  return (
    <View>
      <CommunityCard navigation={navigation} communityCardData={communityCardData} />
    </View>
  )
}

export default CommunityPost