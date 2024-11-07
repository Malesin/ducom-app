import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CommunityAbout = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Community Info</Text>
      <View style={styles.infoRow}>
        <MaterialIcons name="person" size={22} color="black" />
        <Text style={styles.infoText}>Only admin can post</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="group" size={22} color="black" />
        <Text style={styles.infoText}>
          Only members can give likes and replies
        </Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="public" size={22} color="black" />
        <Text style={styles.infoText}>
          All Communities are publicly visible.
        </Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="event" size={22} color="black" />
        <Text style={styles.createAt}>
          Created April 4, 2024
          <Text style={styles.username}> by @dugam_official</Text>
        </Text>
        <View style={styles.verified}>
          <MaterialIcons name="verified" size={20} color="#699BF7" />
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.rulesContainer}>
        <Text style={styles.header}>Rules</Text>
        <Text style={styles.subHeader}>
          These are set and eforced by community admins and are in addition to
          Ducom’s rules.
        </Text>
        <View style={styles.ruleRow}>
          <View style={styles.ruleIcon}>
            <Text style={styles.ruleNumber}>1</Text>
          </View>
          <View style={styles.ruleTextContainer}>
            <Text style={styles.ruleTitle}>Be kind and respectful.</Text>
            <Text style={styles.ruleDescription}>
              Not everyone is on the same technical level. Respect and encourage
              the questions of others.
            </Text>
          </View>
        </View>
        <View style={styles.ruleRow}>
          <View style={styles.ruleIcon}>
            <Text style={styles.ruleNumber}>2</Text>
          </View>
          <View style={styles.ruleTextContainer}>
            <Text style={styles.ruleTitle}>Keep post on topic.</Text>
            <Text style={styles.ruleDescription}>
              Stay on topic. Do not hijack another user's thread.
            </Text>
          </View>
        </View>
        <View style={styles.ruleRow}>
          <View style={styles.ruleIcon}>
            <Text style={styles.ruleNumber}>3</Text>
          </View>
          <View style={styles.ruleTextContainer}>
            <Text style={styles.ruleTitle}>No selling or promoting.</Text>
            <Text style={styles.ruleDescription}>
              No selling or promoting of any kind. This is strictly a technical
              support group only.
            </Text>
          </View>
        </View>
        <View style={styles.ruleRow}>
          <View style={styles.ruleIcon}>
            <Text style={styles.ruleNumber}>4</Text>
          </View>
          <View style={styles.ruleTextContainer}>
            <Text style={styles.ruleTitle}>Explore and share.</Text>
            <Text style={styles.ruleDescription}>
              Explore ideas and share knowledge.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 17,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
    color: 'black',
  },
  subHeader: {
    fontSize: 15,
    color: '#B6B6B6',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingLeft: 13,
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
    marginTop: 16,
    marginBottom: 1,
  },
  createAt: {
    marginLeft: 10,
    fontSize: 16,
    color: '#B6B6B6',
  },
  username: {
    color: 'black',
  },
  verified: {
    marginLeft: 5,
  },
  rulesContainer: {
    marginVertical: 15,
  },
  ruleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ruleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default CommunityAbout;
