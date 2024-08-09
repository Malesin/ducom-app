    import React from 'react';
    import { View, Text } from 'react-native';
    
    function Likescreen() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#03cafc"
                }}
            >
                <Text style={{ fontSize: 30, color: "#ffffff", fontWeight: "800" }}>
                    Home is Here!
                </Text>
            </View>
        );
    }
    
    export default Likescreen;