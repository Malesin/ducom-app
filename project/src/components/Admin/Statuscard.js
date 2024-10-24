import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import ProfileImage from '../../assets/iya.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Statuscard = () => {
    return (
        <View style={styles.container}>
            <Image
                source={ProfileImage}
                style={styles.profileImage}
            />
            <View style={styles.textContainer}>
                <Text style={styles.username}>orangngoding</Text>
                <Text style={styles.userhandle}>@mikadotjees</Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="refresh" size={25} color="#21c002" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="delete" size={25} color="#C70039" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Statuscard;

const styles = StyleSheet.create({
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
