import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';

const {height} = Dimensions.get('window');

const CommunityExplore = ({communityExploreData}) => {
  const {
    communityId,
    exploreName,
    memberCount,
    description,
    profilePicture,
    backgroundPicture,
  } = communityExploreData;
  const containerHeight = useRef(new Animated.Value(height * 0.25)).current;
  const contentPosition = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);
  const navigation = useNavigation();

  const handlePress = () => {
    setIsPressed(!isPressed);

    if (!isPressed) {
      Animated.parallel([
        Animated.timing(containerHeight, {
          toValue: height * 0.35,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(contentPosition, {
          toValue: -30,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(containerHeight, {
          toValue: height * 0.25,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(contentPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handlePressJoin = () => {
    navigation.navigate('ViewCommunity', {communityId: communityId});
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <Image
            source={
              backgroundPicture
                ? {uri: backgroundPicture}
                : require('../../assets/banner.png')
            }
            style={styles.backgroundImage}
          />
          <Animated.View
            style={[
              styles.overlayAndContent,
              {
                height: containerHeight,
              },
            ]}>
            <Image
              source={
                profilePicture
                  ? {uri: profilePicture}
                  : require('../../assets/profilepic.png')
              }
              style={styles.profileImage}
            />
            <Animated.View
              style={[
                styles.contentContainer,
                {
                  transform: [{translateY: contentPosition}],
                },
              ]}>
              <View style={styles.infoContainer}>
                <Text style={styles.communityName}>{exploreName}</Text>
                <Text style={styles.memberCount}>{memberCount}</Text>
                <Text
                  style={styles.description}
                  numberOfLines={1.5}
                  ellipsizeMode="tail">
                  {description}
                </Text>
              </View>
              <Animated.View
                style={[
                  styles.buttonContainer,
                  {
                    opacity: buttonOpacity,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={handlePressJoin}>
                  <Text style={styles.joinButtonText}>View</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
};

export default CommunityExplore;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    width: 250,
    height: height * 0.4,
  },
  backgroundContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayAndContent: {
    position: 'absolute',
    bottom: -70,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    alignSelf: 'center',
    position: 'absolute',
    top: -28,
    zIndex: 2,
  },
  infoContainer: {
    marginTop: -20,
    marginBottom: 10,
    alignItems: 'center',
  },
  communityName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    marginTop: 10,
  },
  memberCount: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 5,
  },
  description: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
    paddingHorizontal: '30%',
  },
  joinButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    borderRadius: 25,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
