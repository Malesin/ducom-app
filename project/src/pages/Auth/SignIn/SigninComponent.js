import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

const SigninComponent = ({
  email,
  password,
  emailError,
  passwordError,
  showPassword,
  onChangeEmail,
  onChangePassword,
  onTogglePassword,
  onLogin,
  navigation,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#000' : '#fff',
      padding: 16,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#fff' : '#000',
    },
    input: {
      width: '80%',
      height: 50,
      margin: 12,
      borderWidth: 1,
      borderColor: '#dcdcdc',
      borderRadius: 5,
      padding: 10,
      backgroundColor: isDark ? '#222' : '#f5f5f5',
      color: isDark ? '#fff' : '#000',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      margin: 12,
      borderWidth: 1,
      borderColor: '#dcdcdc',
      borderRadius: 5,
      backgroundColor: isDark ? '#222' : '#f5f5f5',
    },
    passwordInput: {
      flex: 1,
      height: 50,
      padding: 10,
      color: isDark ? '#fff' : '#000',
    },
    eyeIcon: {
      marginRight: 10,
    },
    buttonLogin: {
      width: '80%',
      height: 50,
      backgroundColor: '#001374',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    textLogin: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    forgotPassLink: {
      color: isDark ? '#ccc' : '#000',
      marginTop: 20,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      alignSelf: 'center',
    },
    errorInput: {
      borderColor: 'red',
    },
  });

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>

        <TextInput
          style={[styles.input, emailError && styles.errorInput]}
          value={email}
          onChangeText={onChangeEmail}
          placeholder="Email or Username"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          autoCapitalize="none"
        />

        {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <View
          style={[
            styles.passwordContainer,
            passwordError && styles.errorInput,
          ]}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={onChangePassword}
            secureTextEntry={!showPassword}
            placeholder="Password"
            placeholderTextColor={isDark ? '#aaa' : '#888'}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={onTogglePassword}>
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={18}
              color={isDark ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </View>

        {!!passwordError && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}

        <TouchableOpacity style={styles.buttonLogin} onPress={onLogin}>
          <Text style={styles.textLogin}>Log In</Text>
        </TouchableOpacity>

        <Text
          style={styles.forgotPassLink}
          onPress={() => navigation.navigate('Forgotpass')}>
          Forgot Password?
        </Text>
      </View>

      <Toast />
    </>
  );
};

export default SigninComponent;
