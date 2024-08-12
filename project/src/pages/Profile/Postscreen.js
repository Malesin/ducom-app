import React from 'react';
import { View, Text } from 'react-native';

function Postscreen() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff"
            }}
        >
            <Text style={{ fontSize: 16, color: "#333", fontWeight: "600" }}>
                Posts content goes here.
            </Text>
        </View>
    );
}

export default Postscreen;