import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Profilescreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text>Profilescreen</Text>
            </View>
        </View>
    );
};

export default Profilescreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center', 
    }
});
