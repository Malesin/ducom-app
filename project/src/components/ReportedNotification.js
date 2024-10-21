import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReportedNotification = () => {
    return (
        <View style={styles.container}>
            <Icon name="error-outline" size={30} color="#FF5722" style={styles.icon} />
            <Text style={styles.message}>
                You have received this warning notification because your account has been reported for violating community guidelines.
            </Text>
        </View>
    );
};

export default ReportedNotification;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 10,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    icon: {
        marginRight: 10,
    },
    message: {
        fontSize: 14,
        color: '#000',
        flex: 1,
    },
});
