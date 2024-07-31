import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const FAQscreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.contentText}>Welcome to the FAQ!</Text>
            </View>
        </View>
    );
};

export default FAQscreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: {
        fontSize: 18,
        color: '#000',
    },
});
