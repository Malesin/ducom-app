import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ProfilePicture from '../assets/iya.png';

const SearchedCard = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.overlay} />
            <View style={styles.card}>
                <Image source={ProfilePicture} style={styles.profilePicture} />
                <View style={styles.textContainer}>
                    <Text style={styles.username}>ryansunday123</Text>
                    <Text style={styles.handle}>@ryansun</Text>
                    <Text style={styles.description}>
                        bismillah lancar gen z sehat selalu jangan lupa berdoa agar dimudahkan
                    </Text>
                    <TouchableOpacity style={styles.followButton}>
                        <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SearchedCard;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#D3D3D3',
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#000',
        zIndex: -1,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    handle: {
        fontSize: 14,
        color: '#000',
    },
    description: {
        fontSize: 14,
        color: '#333',
        marginTop: 2,
        marginBottom: 10,
    },
    followButton: {
        backgroundColor: '#002366',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 25,
        paddingVertical: 10,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    followButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
