import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CommunityExplore from '../../components/Community/CommunityExplore';
import CommunityCard from '../../components/Community/CommunityCard';
import {ScrollView} from 'react-native-gesture-handler';

const CommunityScreen = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('CreateCommunity');
  };

  const exploreData = [
    {
      id: '1',
      exploreName: 'Komunitas A',
      memberCount: '1.2K Members',
      description:
        'Deskripsi komunitas A. Tempat berkumpulnya para penggemar A.',
    },
    {
      id: '2',
      exploreName: 'Komunitas B',
      memberCount: '800 Members',
      description: 'Deskripsi komunitas B. Diskusi tentang topik B.',
    },
    {
      id: '3',
      exploreName: 'Komunitas C',
      memberCount: '2.5K Members',
      description: 'Deskripsi komunitas C. Berbagi informasi dan pengalaman.',
    },
    {
      id: '4',
      exploreName: 'Komunitas D',
      memberCount: '1K Members',
      description: 'Deskripsi komunitas D. Komunitas untuk para pecinta D.',
    },
  ];

  const cardData = [
    {
      id: '1',
      communityCardName: 'Komunitas A',
      communityDescription: 'Deskripsi lengkap komunitas A.',
    },
    {
      id: '2',
      communityCardName: 'Komunitas B',
      communityDescription: 'Deskripsi lengkap komunitas B.',
    },
    {
      id: '3',
      communityCardName: 'Komunitas C',
      communityDescription: 'Deskripsi lengkap komunitas C.',
    },
    {
      id: '4',
      communityCardName: 'Komunitas D',
      communityDescription: 'Deskripsi lengkap komunitas D.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.exploreContainer}>
          <Text style={styles.exploreText}>Explore</Text>
          <FlatList
            data={exploreData}
            renderItem={({item}) => (
              <CommunityExplore communityExploreData={item} />
            )}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 0}}
          />
        </View>
        <View style={styles.communityCardContainer}>
          {cardData.map(community => (
            <CommunityCard
              key={community.id}
              navigation={navigation}
              communityCardData={community}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.fabContainer}>
        <TouchableOpacity onPress={handlePress} style={styles.mainButton}>
          <Text style={styles.mainButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exploreContainer: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  exploreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  communityCardContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 2,
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#001374',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mainButtonText: {
    fontSize: 30,
    color: 'white',
  },
});

export default CommunityScreen;
