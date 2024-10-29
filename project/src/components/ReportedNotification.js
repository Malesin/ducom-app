import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReportedNotification = () => {
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY: slideAnim}],
          opacity: fadeAnim,
        },
      ]}>
      <Icon
        name="error-outline"
        size={30}
        color="#FF5722"
        style={styles.icon}
      />
      <Text style={styles.message}>
        You have received this warning notification because your account has
        been reported for violating community guidelines.
      </Text>
      <Text style={styles.link}>Click Here</Text>
    </Animated.View>
  );
};

export default ReportedNotification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  icon: {
    marginRight: 10,
  },
  message: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  link: {
    fontSize: 14,
    color: '#002366',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
