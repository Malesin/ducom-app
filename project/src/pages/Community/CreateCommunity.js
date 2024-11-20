import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DELETE_THRESHOLD = -75;

const SwipeableRule = ({rule, index, updateRule, onDelete, canDelete}) => {
  const translateX = useSharedValue(0);
  const isRemoving = useSharedValue(false);

  const panGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      if (!canDelete) return;
      isRemoving.value = false;
      context.x = translateX.value;
    },
    onActive: (event, context) => {
      if (!canDelete) return;
      if (!isRemoving.value) {
        const newValue = context.x + event.translationX;
        translateX.value = Math.min(0, Math.max(newValue, -100));
      }
    },
    onEnd: () => {
      if (!canDelete) return;
      if (translateX.value < DELETE_THRESHOLD) {
        isRemoving.value = true;
        translateX.value = withSpring(-100, {}, finished => {
          if (finished) {
            runOnJS(onDelete)(index);
            translateX.value = 0;
          }
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  const deleteButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value + 100}],
      opacity: canDelete ? 1 : 0,
    };
  });

  return (
    <View style={styles.ruleWrapper}>
      <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
        <TouchableOpacity
          onPress={() => canDelete && onDelete(index)}
          style={styles.deleteButtonInner}
          disabled={!canDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
      <PanGestureHandler onGestureEvent={panGesture} enabled={canDelete}>
        <Animated.View style={[styles.ruleContainer, rStyle]}>
          <Text style={styles.ruleNumber}>Rule {index + 1}</Text>
          <TextInput
            maxLength={150}
            style={[styles.communityRulesInputTitle, {height: 35}]}
            placeholder="Title"
            placeholderTextColor="#b6b6b6"
            value={rule.title}
            onChangeText={text => updateRule(index, 'title', text)}
          />
          <TextInput
            maxLength={150}
            style={[styles.communityRulesInputDescription, {height: 100}]}
            placeholder="Description"
            placeholderTextColor="#b6b6b6"
            multiline={true}
            textAlignVertical="top"
            value={rule.description}
            onChangeText={text => updateRule(index, 'description', text)}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const CreateCommunity = ({navigation}) => {
  const [inputNameHeight, setInputNameHeight] = useState(35);
  const [inputHeightDescription, setInputHeightDescription] = useState(35);
  const [rules, setRules] = useState([{title: '', description: ''}]);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const serverUrl = config.SERVER_URL;

  const communityNameInputRef = useRef(null);

  const CommunityNameBackspacePress = event => {
    try {
      const key = event?.nativeEvent?.key;
      if (key === 'Backspace' && newCommunityName.length > 0) {
        setNewCommunityName('');
      }
    } catch (error) {
      console.log('Error handling key press:', error);
    }
  };

  const validateCommunityName = name => {
    const symbolRegex = /[@#!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (symbolRegex.test(name)) {
      return false;
    }

    return /^[a-zA-Z0-9\s]+$/.test(name);
  };

  const handleCreateCommunity = async () => {
    if (newCommunityName.length < 3) {
      Alert.alert(
        'Invalid Community Name',
        'Community name must be at least 3 characters long',
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const response = await axios.post(`${serverUrl}/create-community`, {
        token: token,
        communityName: newCommunityName,
        communityDescription: newCommunityDescription,
        description: 'Deskripsi tambahan',
        rules: rules,
      });

      if (response.status === 201) {
        console.log('Community created successfully:', response.data);
        navigation.goBack();
      } else {
        console.error('Error creating community:', response.data);
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', 'Failed to create community. Please try again.');
    }
  };

  const isFormValid = () => {
    return (
      newCommunityName.trim().length >= 3 &&
      newCommunityName.trim() !== '' &&
      newCommunityDescription.trim() !== '' &&
      rules.every(
        rule => rule.title.trim() !== '' && rule.description.trim() !== '',
      )
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
  }, [navigation, newCommunityName, newCommunityDescription, rules]);

  const addNewRule = () => {
    if (rules.length < 5) {
      setRules([...rules, {title: '', description: ''}]);
    }
  };

  const updateRule = (index, field, value) => {
    const updatedRules = rules.map((rule, i) => {
      if (i === index) {
        return {...rule, [field]: value};
      }
      return rule;
    });
    setRules(updatedRules);
  };

  const deleteRule = index => {
    if (rules.length > 1) {
      const newRules = [...rules];
      newRules.splice(index, 1);
      setRules(newRules);
    }
  };

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
            onChangeText={text => {
              if (validateCommunityName(text)) {
                setNewCommunityName(text);
              }
            }}
            ref={communityNameInputRef}
            onKeyPress={CommunityNameBackspacePress}
          />
          <Text style={styles.communityNameSubText}>
            Name must be between 3 and 30 characters and can't include symbols,
            hashtags or @username.
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
            onChangeText={setNewCommunityDescription}
          />
          <Text style={styles.communityDescriptionSubText}>
            A strong description describes your Community and makes people know
            the purpose of the Community you created.
          </Text>
        </View>
        <View style={styles.communityRules}>
          <Text style={styles.communityRulesText}>Community Rules</Text>
          {rules.map((rule, index) => (
            <SwipeableRule
              key={index}
              rule={rule}
              index={index}
              updateRule={updateRule}
              onDelete={deleteRule}
              canDelete={rules.length > 1}
            />
          ))}
          <Text style={styles.communityRulesSubText}>
            The rules you create will help you prevent inappropriate things.
          </Text>
          <View style={styles.communityRulesButtonContainer}>
            {rules.length < 5 && (
              <TouchableOpacity
                style={styles.communityRulesButton}
                onPress={addNewRule}>
                <Text style={styles.communityRulesButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  communityName: {
    marginBottom: 20,
  },
  communityNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  communityNameInput: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f6f6f6',
  },
  communityNameSubText: {
    fontSize: 12,
    color: '#888',
  },
  communityDescription: {
    marginBottom: 20,
  },
  communityDescriptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  communityDescriptionInput: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f6f6f6',
  },
  communityDescriptionSubText: {
    fontSize: 12,
    color: '#888',
  },
  communityRules: {
    marginBottom: 15,
  },
  communityRulesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  communityRulesSubText: {
    fontSize: 12,
    color: '#888',
  },
  communityRulesButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  communityRulesButton: {
    backgroundColor: '#d6d6d6',
    borderRadius: 100,
    width: 40,
    height: 40,
    padding: 5,
    alignItems: 'center',
  },
  communityRulesButtonText: {
    color: '#000',
    fontSize: 22,
  },
  ruleWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  deleteButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ruleContainer: {
    marginTop: 5,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 1,
    backgroundColor: '#f6f6f6',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ruleNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
});

export default CreateCommunity;
