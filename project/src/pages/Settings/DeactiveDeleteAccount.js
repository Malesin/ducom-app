import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DeactiveDeleteAccount = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null); // null for no option selected

  // Handler for selecting "Deactivate Account"
  const handleDeactivateCheck = () => {
    if (selectedOption === 'deactivate') {
      setSelectedOption(null); // Uncheck if already selected
    } else {
      setSelectedOption('deactivate'); // Select "Deactivate Account"
    }
  };

  // Handler for selecting "Delete Account"
  const handleDeleteCheck = () => {
    if (selectedOption === 'delete') {
      setSelectedOption(null); // Uncheck if already selected
    } else {
      setSelectedOption('delete'); // Select "Delete Account"
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Deactivating or Deleting your Ducom Account
        </Text>
        <Text style={styles.subtitle}>
          If you want to take a break from Ducom, you can temporarily deactivate this account. If you want to permanently delete your account, let us know. You can only deactivate your account once a week.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardSection}>

          {/* Deactivate Option */}
          <View style={styles.optionRow}>
            <Text style={styles.cardTitle}>Deactivate your Account</Text>
            <Pressable onPress={handleDeactivateCheck}>
              <MaterialCommunityIcons
                name={selectedOption === 'deactivate' ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color="#fff"
              />
            </Pressable>
          </View>
          <Text style={styles.cardSubtitle}>
            Deactivating your account is temporary, and it means your profile will be hidden on Ducom until you log in to your Ducom Account.
          </Text>

          {/* Delete Option */}
          <View style={styles.optionRow}>
            <Text style={styles.cardTitle}>Delete Account</Text>
            <Pressable onPress={handleDeleteCheck}>
              <MaterialCommunityIcons
                name={selectedOption === 'delete' ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color="#fff"
              />
            </Pressable>
          </View>
          <Text style={styles.cardSubtitle}>
            Deleting your account is permanent. When you delete your Ducom account, your profile, photos, videos, comments, and likes will be permanently removed. If you'd just like to take a break, you can temporarily deactivate your account.
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: selectedOption ? '#001374' : '#ccc' }
          ]}
          disabled={!selectedOption}
          onPress={() => navigation.navigate('VerifyAccount')}
        >
          <Text style={[
            styles.buttonText,
            { color: selectedOption ? '#fff' : '#000' }
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeactiveDeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#555',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#001374',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardSection: {
    marginBottom: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  cardSubtitle: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  continueButton: {
    paddingVertical: 15,
    borderRadius: 50,
    alignSelf: 'stretch',
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
