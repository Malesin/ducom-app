import { View, Text } from 'react-native'
import React from 'react'
import CommunityCard from '../../components/Community/CommunityCard';

const CommunityMedia = ({ navigation }) => {
  const communityCardData = {
    communityCardName: 'Nama Komunitas Media',
    communityDescription: 'Deskripsi komunitas media ini.',
  };

  return (
    <View>
      <CommunityCard navigation={navigation} communityCardData={communityCardData} />
    </View>
  )
}

export default CommunityMedia