import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import config from '../../../config';
import {useAuthStore} from '../../../stores/auth.stores';

const serverUrl = config.SERVER_URL;

export const loginUser = async ({email, password, navigation}) => {
  const {setLoading} = useAuthStore.getState();
  setLoading(true);

  try {
    const connection = await NetInfo.fetch();
    if (!connection.isConnected) {
      Alert.alert(
        'No Internet Connection',
        'Please check your network and try again.',
      );
      return;
    }

    const res = await axios.post(`${serverUrl}/login-user`, {
      email,
      password,
    });

    if (res.data.status === 'ok') {
      await AsyncStorage.setItem('token', res.data.data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Login Successfully!!',
        onHide: () => navigation.navigate('Home'),
      });
      return;
    }

    if (res.data.status === 'errorPass') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Incorrect Password',
      });
      return;
    }

    if (res.data.status === 'error') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: "Email or User Doesn't Exist!!",
      });
      return;
    }

    if (res.data.status === 'errorDeleted') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Your account has been deleted',
      });
      return;
    }

    if (res.data.status === 'errorDeactivated') {
      Alert.alert(
        'Your account is deactivated',
        'Do you want to Reactivate Account?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Reactivate',
            onPress: async () => {
              await axios.post(`${serverUrl}/reactivate-account`, {
                email,
                password,
              });
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Reactivate Successfully!!',
              });
            },
          },
        ],
      );
    }
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Something went wrong. Try again later.',
    });
  } finally {
    setLoading(false);
  }
};

export const checkAuthOnSplash = async navigation => {
  setTimeout(async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      navigation.replace('Home');
    } else {
      navigation.replace('Welcome');
    }
  }, 1500);
};
