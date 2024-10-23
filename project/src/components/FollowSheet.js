import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import ProfileImage from '../assets/iya.png';
import Modal from 'react-native-modal';

const FollowSheet = ({ isVisible, onClose, onRemove, removeButtonText, message }) => {
    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
            <View style={styles.container}>
                <Image source={ProfileImage} style={styles.profileImage} />
                <Text style={styles.title}>Remove follower?</Text>
                <Text style={styles.message}>
                    {message}
                </Text>
                <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
                    <Text style={styles.removeButtonText}>{removeButtonText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default FollowSheet;

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    username: {
        fontWeight: 'bold',
    },
    removeButton: {
        paddingVertical: 10,
        paddingHorizontal: 40,
        marginBottom: 5,
    },
    removeButtonText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 40,
    },
    cancelButtonText: {
        color: 'black',
        fontSize: 16,
    },
});
