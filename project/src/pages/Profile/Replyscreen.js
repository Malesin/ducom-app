import React, { useState } from 'react';
import { Text, View, SafeAreaView } from 'react-native';

function Replyscreen() {

    return (
        <SafeAreaView>
            <View>
                <Text>Replyscreen</Text>
            </View>
        </SafeAreaView>
    );
}
export default Replyscreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 10,
    },
    commentContainer: {
        width: '100%',
    },
    noCommentsText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
});