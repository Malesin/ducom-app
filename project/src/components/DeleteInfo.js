import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DeleteInfo = ({ navigation }) => {
    const [visible, setVisible] = useState(true);

    const handleOkPress = () => {
        setVisible(false);
        navigation.navigate('VerifyAccount');
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {/* Warning Icon */}
                    <View style={styles.iconContainer}>
                        <Icon name="warning" size={50} color="white" />
                    </View>
                    {/* Info Text */}
                    <Text style={styles.title}>Info</Text>
                    <Text style={styles.message}>
                        When an account is deleted, you will not be able to restore the account and sign up to enter the application.
                    </Text>
                    {/* OK Button */}
                    <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
                        <Text style={styles.okButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default DeleteInfo;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 320,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        paddingBottom: 20,
    },
    iconContainer: {
        width: '100%',
        backgroundColor: '#00A3FF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00A3FF',
        marginVertical: 10,
    },
    message: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    okButton: {
        backgroundColor: '#00A3FF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 40,
    },
    okButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
