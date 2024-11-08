import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ToastAndroid
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { useRoute } from '@react-navigation/native';

const serverUrl = config.SERVER_URL;

const ReportScreen = () => {
  const route = useRoute();
  const { reportPostId, reportUserId, commentId, report } = route.params;
  const [checkedItems, setCheckedItems] = useState({});
  const navigation = useNavigation();
  const handleCheckboxPress = item => {
    setCheckedItems(prevState => ({
      ...prevState,
      [item]: !prevState[item],
    }));
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log("commentId:", commentId)
    console.log("report:", report)

    try {
      const reportCategory = Object.keys(checkedItems).reduce((acc, key) => {
        if (checkedItems[key]) {
          switch (key) {
            case 'spam':
              acc.push(1);
              break;
            case 'suicide':
              acc.push(2);
              break;
            case 'impersonation':
              acc.push(3);
              break;
            case 'sensitive':
              acc.push(4);
              break;
            case 'hate':
              acc.push(5);
              break;
            case 'abuse':
              acc.push(6);
              break;
            default:
              break;
          }
        }
        return acc;
      }, []);

      axios
        .post(`${serverUrl}/report`, {
          token: token,
          reportPostId: reportPostId,
          reportCommentId: commentId, // FOR REPORT COMMENT
          reportParentCommentId: commentId, // FOR REPORT CHILD COMMENT
          reportUserId: reportUserId, // FOR REPORT USER
          reportCategory: reportCategory
        })
        .then(res => {
          if (res.data.status == 'ok') {
            setTimeout(() => {
              navigation.navigate('Home');
            }, 1000);
            ToastAndroid.show('Post was Successfully Reported!', ToastAndroid.SHORT);
          }
        })
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.optionContainer}>
          <Text style={styles.title}>Spam</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Fake engagement, scams, fake accounts, malicious links
            </Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleCheckboxPress('spam')}>
              {checkedItems['spam'] ? (
                <MaterialCommunityIcons
                  name="checkbox-marked"
                  size={24}
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={24}
                  color="#000000"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.title}>Suicide</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Encouraging, promoting, providing instructions or sharing
              strategies for self harm
            </Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleCheckboxPress('suicide')}>
              {checkedItems['suicide'] ? (
                <MaterialCommunityIcons
                  name="checkbox-marked"
                  size={24}
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={24}
                  color="#000000"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.title}>Impersonation</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Pretending to be someone else, including non-compliment parody/
              fan accounts
            </Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleCheckboxPress('impersonation')}>
              {checkedItems['impersonation'] ? (
                <MaterialCommunityIcons
                  name="checkbox-marked"
                  size={24}
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={24}
                  color="#000000"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.title}>Sensitive or disturbing media</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Graphic Content, Gratuitous Gore, Adult Nudity & Sexual Behavior,
              Violent Sexual Conduct, Bestiality & Necrophilia, Media depicting
              a deceased individual
            </Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleCheckboxPress('sensitive')}>
              {checkedItems['sensitive'] ? (
                <MaterialCommunityIcons
                  name="checkbox-marked"
                  size={24}
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={24}
                  color="#000000"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.title}>Hate</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Slurs, Racist or exist stereotypes, Dehumanization, Incitement of
              fear or discrimination, Hateful references Hateful symbols & logos
            </Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleCheckboxPress('hate')}>
              {checkedItems['hate'] ? (
                <MaterialCommunityIcons
                  name="checkbox-marked"
                  size={24}
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={24}
                  color="#000000"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.title}>Abuse Harassment</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Insults, Unwanted Sexual Content & Graphic Objectification,
              Unwanted NSFW & Graphic Content, Violent Event Denial, Targeted
              Harassment and Inciting Harassment
            </Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleCheckboxPress('abuse')}>
              {checkedItems['abuse'] ? (
                <MaterialCommunityIcons
                  name="checkbox-marked"
                  size={24}
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={24}
                  color="#000000"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  optionContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    flex: 1,
    flexShrink: 1,
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  checkboxContainer: {
    marginLeft: 5,
    marginBottom: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  submitButton: {
    backgroundColor: '#00137F',
    paddingVertical: 12,
    paddingHorizontal: 90,
    borderRadius: 50,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
