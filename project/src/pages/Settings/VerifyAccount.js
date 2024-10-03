import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const VerifyAccount = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('../../assets/iya.png')}
                    style={styles.profile}
                />
                <Text style={styles.username}>Dugam_Official</Text>
                <Text style={styles.instruction}>For your security, please re-enter your password to continue</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                        <MaterialCommunityIcons
                            name={isPasswordVisible ? "eye" : "eye-off"}
                            size={24}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.continueButton}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    },
    instruction: {
        textAlign: 'center',
        marginBottom: 20,
        color: 'gray',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        marginBottom: 20,
        width: '100%',
    },
    input: {
        flex: 1,
        padding: 10,
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
        color: '#000',
    },
});