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
import backgroundCommunity from '../../assets/bannerkom.jpeg';
import profileCommunity from '../../assets/iya.png';

const {height} = Dimensions.get('window');

const CommunityExplore = ({communityName, memberCount, description}) => {
  const containerHeight = useRef(new Animated.Value(height * 0.25)).current;
  const contentPosition = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

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

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <Image source={backgroundCommunity} style={styles.backgroundImage} />
          <Animated.View
            style={[
              styles.overlayAndContent,
              {
                height: containerHeight,
              },
            ]}>
            <Image source={profileCommunity} style={styles.profileImage} />
            <Animated.View
              style={[
                styles.contentContainer,
                {
                  transform: [{translateY: contentPosition}],
                },
              ]}>
              <View style={styles.infoContainer}>
                <Text style={styles.communityName}>{communityName}</Text>
                <Text style={styles.memberCount}>{memberCount}</Text>
                <Text style={styles.description}>{description}</Text>
              </View>
              <Animated.View
                style={[
                  styles.buttonContainer,
                  {
                    opacity: buttonOpacity,
                  },
                ]}>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join</Text>
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
    bottom: -80,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
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
    marginTop: -30,
    marginBottom: 10,
    alignItems: 'center',
  },
  communityName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
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
