import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

const CreateCommunity = ({navigation}) => {
  const [inputNameHeight, setInputNameHeight] = useState(35);
  const [inputHeightDescription, setInputHeightDescription] = useState(35);
  const [inputHeightRules, setInputHeightRules] = useState(100);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [newCommunityRules, setNewCommunityRules] = useState('');

  const handleCreateCommunity = () => {
    console.log('Community created with the following details:');
    console.log('Name:', newCommunityName);
    console.log('Description:', newCommunityDescription);
    console.log('Rules:', newCommunityRules);

    // navigation.navigate('CommunityScreen');
  };

  const isFormValid = () => {
    return (
      newCommunityName.trim() !== '' &&
      newCommunityDescription.trim() !== '' &&
      newCommunityRules.trim() !== ''
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            backgroundColor: isFormValid() ? '#00137f' : '#b0b0b0',
            borderRadius: 20,
            paddingVertical: 6,
            paddingHorizontal: 16,
            marginRight: 5,
          }}
          onPress={handleCreateCommunity}
          disabled={!isFormValid()}>
          <Text
            style={{
              color: '#fff',
              fontSize: 13,
              fontWeight: 'bold',
            }}>
            Create
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    newCommunityName,
    newCommunityDescription,
    newCommunityRules,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.communityName}>
          <Text style={styles.communityNameText}>Community Name</Text>
          <TextInput
            maxLength={30}
            style={[
              styles.communityNameInput,
              {height: Math.max(35, inputNameHeight)},
            ]}
            multiline={true}
            onContentSizeChange={e => {
              const {height} = e.nativeEvent.contentSize;
              setInputNameHeight(height);
            }}
            value={newCommunityName}
            onChangeText={setNewCommunityName} // Update state
          />
          <Text style={styles.communityNameSubText}>
            Name must be between 3 and 30 characters and can’t include symbols,
            hastags or @username.{' '}
          </Text>
        </View>
        <View style={styles.communityDescription}>
          <Text style={styles.communityDescriptionText}>
            Community Description
          </Text>
          <TextInput
            maxLength={150}
            style={[
              styles.communityDescriptionInput,
              {height: Math.max(35, inputHeightDescription)},
            ]}
            multiline={true}
            onContentSizeChange={e => {
              const {height} = e.nativeEvent.contentSize;
              setInputHeightDescription(height);
            }}
            value={newCommunityDescription}
            onChangeText={setNewCommunityDescription} // Update state
          />
          <Text style={styles.communityDescriptionSubText}>
            A strong description describes your Community and make people know
            the purpose of the Community you created.
          </Text>
        </View>
        <View style={styles.communityRules}>
          <Text style={styles.communityRulesText}>Community Rules</Text>
          <TextInput
            maxLength={150}
            style={[
              styles.communityRulesInput,
              {height: Math.max(100, inputHeightRules)},
            ]}
            multiline={true}
            textAlignVertical="top"
            onContentSizeChange={e => {
              const {height} = e.nativeEvent.contentSize;
              setInputHeightRules(height);
            }}
            value={newCommunityRules}
            onChangeText={setNewCommunityRules} // Update state
          />
          <Text style={styles.communityRulesSubText}>
            The rules you create will help you prevent inappropriate things.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateCommunity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  communityName: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  communityNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 5,
  },
  communityNameInput: {
    backgroundColor: '#f6f6f6',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 5,
    padding: 5,
    fontSize: 15,
    minHeight: 35,
  },
  communityNameSubText: {
    fontSize: 12,
    color: '#b6b6b6',
  },
  communityDescription: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  communityDescriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 5,
  },
  communityDescriptionInput: {
    backgroundColor: '#f6f6f6',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 5,
    padding: 5,
    fontSize: 15,
    minHeight: 35,
  },
  communityDescriptionSubText: {
    fontSize: 12,
    color: '#b6b6b6',
  },
  communityRules: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  communityRulesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 5,
  },
  communityRulesInput: {
    backgroundColor: '#f6f6f6',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 5,
    padding: 5,
    fontSize: 15,
    minHeight: 100,
  },
  communityRulesSubText: {
    fontSize: 12,
    color: '#b6b6b6',
  },
});
