import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Usercard = ({ user, handleDeleteUser }) => {
    const userId = user?.id
    return (
        <View style={styles.container}>
            <Image
                source={
                    user?.profilePicture
                        ? { uri: user?.profilePicture }
                        : require('../../assets/profilepic.png')}
                style={styles.profileImage}
            />
            <View style={styles.textContainer}>
                <Text style={styles.username}>{user?.name}</Text>
                <Text style={styles.userhandle}>@{user?.username}</Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={() => handleDeleteUser(userId)}>
                    <MaterialIcons name="delete" size={25} color="#C70039" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Usercard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },
    profileImage: {
        marginLeft: 10,
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    userhandle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ccc',
    },
    iconContainer: {
        flexDirection: 'row',
        padding: 5,
    },
    iconButton: {
        marginHorizontal: 10
    },
});
