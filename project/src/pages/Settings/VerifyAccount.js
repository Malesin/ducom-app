import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { Skeleton } from 'react-native-elements';
import { Alert } from 'react-native';

const serverUrl = config.SERVER_URL;

const VerifyAccount = ({navigation}) => {
    const colorScheme = useColorScheme(); // Dapatkan mode tema saat ini
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState('');
    // const [myToken, setMyToken] = useState('');
    const [error, setError] = useState(''); // Tambahkan state untuk error

    async function myData() {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log('Token Retrieved Successfully');

            const userResponse = await axios.post(`${serverUrl}/userdata`, {
                token: token,
            });
            console.log('Data Retrieved Successfully');

            const user = userResponse.data.data;

            if (user) {
                const profile = { uri: user.profilePicture };
                const username = user.username;
                setUsername(username);
                setProfilePicture(profile);
                console.log('Image Profile Retrieved Successfully');
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }

    useEffect(() => {
        myData();
    }, []);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const checkPassword = async (password) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`${serverUrl}/check-password`, {
                token: token,
                password: password,
            });
            return response.data;
        } catch (error) {
            console.error('Error checking password:', error);
            throw error;
        }
    };

    const deactivateAcc = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`${serverUrl}/deactivate-account`, {
                token: token,
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleContinue = async () => {
        try {
            const result = await checkPassword(password);
            if (result.status !== 'ok') {
                setError('Password wrong.');
            } else {
                const result = await deactivateAcc();
                console.log(result);
                setError('');
                Alert.alert('Success', 'Deactivate Account Successfully', [
                    {
                        text: 'Ok',
                        onPress: async() => {
                            await AsyncStorage.removeItem('token');
                            await AsyncStorage.clear();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Auths' }],
                            });
                        },
                    },
                ]);
            }
        } catch (error) {
            console.error('Password verification failed:', error);
            setError('An error occurred during password verification.');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? 'white' : 'white', // Sesuaikan warna latar belakang
        },
        content: {
            alignItems: 'center',
            padding: 20,
        },
        profile: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 20,
        },
        username: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            color: colorScheme === 'dark' ? 'black' : 'black', // Sesuaikan warna teks
        },
        instruction: {
            textAlign: 'center',
            marginBottom: 20,
            color: colorScheme === 'dark' ? 'gray' : 'gray', // Sesuaikan warna teks
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'lightgray',
            borderRadius: 5,
            marginBottom: 15,
            width: '100%',
        },
        input: {
            flex: 1,
            padding: 10,
            color: colorScheme === 'dark' ? 'black' : 'black', // Sesuaikan warna teks input
        },
        eyeIcon: {
            padding: 10,
        },
        continueButton: {
            backgroundColor: '#001374',
            padding: 15,
            borderRadius: 25,
            width: '100%',
            alignItems: 'center',
            marginBottom: 20,
        },
        continueButtonText: {
            color: 'white',
            fontWeight: 'bold',
        },
        forgotPassword: {
            color: colorScheme === 'dark' ? '#000' : '#000', // Sesuaikan warna teks
        },
        skeletonProfile: {
            marginBottom: 20,
            borderRadius: 50,
        },
        skeletonUsername: {
            marginBottom: 20,
        },
        skeletonInstruction: {
            marginBottom: 20,
        },
        error: {
            color: 'red',
            marginBottom: 30,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {!username ? (
                    <>
                        <Skeleton
                            animation="pulse"
                            height={100}
                            width={100}
                            style={styles.skeletonProfile}
                        />
                        <Skeleton
                            animation="pulse"
                            height={20}
                            width={150}
                            style={styles.skeletonUsername}
                        />
                        <Skeleton
                            animation="pulse"
                            height={14}
                            width={250}
                            style={styles.skeletonInstruction}
                        />
                    </>
                ) : (
                    <>
                        <Image
                            source={profilePicture || require('../../assets/profilepic.png')}
                            style={styles.profile}
                        />
                        <Text style={styles.username}>@{username}</Text>
                        <Text style={styles.instruction}>For your security, please re-enter your password to continue</Text>
                    </>
                )}


                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colorScheme === 'dark' ? 'gray' : 'gray'}
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                        <MaterialCommunityIcons
                            name={isPasswordVisible ? "eye" : "eye-off"}
                            size={24}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default VerifyAccount;
