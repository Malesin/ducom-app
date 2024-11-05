import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CommunityAbout = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Community Info</Text>
      <View style={styles.infoRow}>
        <MaterialIcons name="person" size={24} color="black" />
        <Text style={styles.infoText}>Only admin can post</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="group" size={24} color="black" />
        <Text style={styles.infoText}>Only members can give likes and replies</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="public" size={24} color="black" />
        <Text style={styles.infoText}>All Communities are publicly visible.</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="event" size={24} color="black" />
        <Text style={styles.createdText}>
          Created April 4, 2024
          <Text style={styles.username}> by @dugam_official</Text>
        </Text>
        <MaterialIcons name="check-circle" size={24} color="blue" />
      </View>
      <View style={styles.separator} />
      <Text style={styles.header}>Rules</Text>
      <Text style={styles.subText}>
        These are set and enforced by community admins and are in addition to Ducom's rules.
      </Text>
      <View style={styles.ruleRow}>
        <View style={styles.ruleTextContainer}>
          <Text style={styles.ruleDescription}>
            Not everyone is on the same technical level. Respect and encourage the questions of others.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
    color: 'black',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingLeft: 13 ,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  subText: {
    fontSize: 15,
    color: '#B6B6B6',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  ruleTextContainer: {
    flex: 1,
  },
  ruleDescription: {
    fontSize: 14,
    color: 'black', 
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: 15,
  },
  createdText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#B6B6B6',
  },
  username: {
    color: 'black',
  },
});

export default CommunityAbout;