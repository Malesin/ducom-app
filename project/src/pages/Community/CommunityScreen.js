import React from 'react';
import {View, Text, FlatList, StyleSheet, SafeAreaView} from 'react-native';
import CommunityExplore from '../../components/Community/CommunityExplore';
import CommunityCard from '../../components/Community/CommunityCard';

const CommunityScreen = () => {
  const data = [
    {
      id: '1',
      communityName: 'Komunitas A',
      memberCount: '1.2K Members',
      description: 'Deskripsi komunitas A.',
    },
    {
      id: '2',
      communityName: 'Komunitas B',
      memberCount: '800 Members',
      description: 'Deskripsi komunitas B.',
    },
    {
      id: '3',
      communityName: 'Komunitas C',
      memberCount: '2.5K Members',
      description: 'Deskripsi komunitas C.',
    },
    {
      id: '4',
      communityName: 'Komunitas D',
      memberCount: '1K Members',
      description: 'Deskripsi komunitas D.',
    },
  ];

  const renderItem = ({item}) => (
    <CommunityExplore
      communityName={item.communityName}
      memberCount={item.memberCount}
      description={item.description}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.exploreContainer}>
        <Text style={styles.exploreText}>Explore</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 0}}
        />
      </View>
      <View style={styles.communityCardContainer}>
        <CommunityCard />
      </View>
    </SafeAreaView>
  );
};

CommunityScreen.navigationOptions = {
  headerTitle: 'Community',
};

export default CommunityScreen;

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
  exploreScroll: {
    paddingVertical: 5,
  },
  communityCardContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
