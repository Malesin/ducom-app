import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const DELETE_THRESHOLD = -75;

const SwipeableRule = ({rule, index, updateRule, onDelete, colorScheme}) => {
  const translateX = useSharedValue(0);
  const isRemoving = useSharedValue(false);

  const panGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      isRemoving.value = false;
      context.x = translateX.value;
    },
    onActive: (event, context) => {
      if (!isRemoving.value) {
        const newValue = context.x + event.translationX;
        translateX.value = Math.min(0, Math.max(newValue, -100));
      }
    },
    onEnd: () => {
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
    };
  });

  return (
    <View style={styles.ruleWrapper}>
      <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
        <TouchableOpacity
          onPress={() => onDelete(index)}
          style={styles.deleteButtonInner}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[styles.ruleContainer, rStyle]}>
          <Text style={styles.ruleNumber}>Rule {index + 1}</Text>
          <TextInput
            maxLength={30}
            style={[styles.communityRulesInputTitle, {height: 35, color: colorScheme === 'dark' ? '#000000' : '#000000'}]}
            placeholder="Title"
            placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'}
            value={rule.title}
            onChangeText={text => updateRule(index, 'title', text)}
          />
          <TextInput
            maxLength={150}
            style={[styles.communityRulesInputDescription, {height: 100, color: colorScheme === 'dark' ? '#000000' : '#000000'}]}
            placeholder="Description"
            placeholderTextColor={colorScheme === 'dark' ? '#cccccc' : '#888888'}
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

const CommunityEditRules = ({navigation}) => {
  const route = useRoute();
  const {communityData} = route.params;
  const [rules, setRules] = useState(
    communityData.rules || [{title: '', description: ''}],
  );

  const colorScheme = useColorScheme();

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

  const handleSaveRules = async () => {
    console.log('Rules saved:', rules);
    const token = await AsyncStorage.getItem('token');
    try {
      await axios
        .post(`${serverUrl}/edit-rules-community`, {
          token,
          communityId: communityData._id,
          rules,
        })
        .then(res => {
          const response = res.data;
          console.log(response);
          navigation.navigate('ViewCommunity', {communityId: communityData._id});
        });
    } catch (error) {
      console.error(error);
    }
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
          onPress={handleSaveRules}
          disabled={!isFormValid()}>
          <Text
            style={{
              color: '#fff',
              fontSize: 13,
              fontWeight: 'bold',
            }}>
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, rules]);

  const isFormValid = () => {
    return rules.every(
      rule => rule.title.trim() !== '' && rule.description.trim() !== '',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.communityRules}>
          <Text style={styles.communityRulesText}>Community Rules</Text>
          {rules.map((rule, index) => (
            <SwipeableRule
              key={index}
              rule={rule}
              index={index}
              updateRule={updateRule}
              onDelete={deleteRule}
              colorScheme={colorScheme}
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
  communityRulesInputTitle: {
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f6f6f6',
  },
  communityRulesInputDescription: {
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f6f6f6',
  },
});

export default CommunityEditRules;