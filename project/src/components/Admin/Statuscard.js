import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Statuscard = ({ user, handleDeleteUser, handleRe }) => {
    
    const deactiveIcon = <Icon name="auto-delete" size={16} color={user.isDeactivated ? "#FF6500" : "#C62E2E"} />;
    const userId = user?.id 
    const isRe = user?.isDeactivated ? "Deactivate" : "Deleted"

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
                <View style={styles.userDetails}>
                    <Text style={styles.username}>{user.name}</Text>
                    {user?.isDeactivated && (<Text style={styles.deactiveIcon}>{deactiveIcon}</Text>)}
                    {user?.isDeleted && (<Text style={styles.deactiveIcon}>{deactiveIcon}</Text>)}
                </View>
                <Text style={styles.userhandle}>@{user.username}</Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={() => handleRe(userId, isRe)}>
                    <MaterialIcons name="refresh" size={25} color="#21c002" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => handleDeleteUser(userId)}>
                    <MaterialIcons name="delete" size={25} color="#C70039" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Statuscard;

const styles = StyleSheet.create({
    userDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deactiveIcon: {
        marginLeft: 8
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },
    profileImage: {
        marginLeft: 10,
        width: 40,
        height: 40,
        borderRadius: 30,
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
    },
    username: {
        fontSize: 14,
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
