// import { StyleSheet, Text, View } from 'react-native';
// import React from 'react';

// const Profilescreen = () => {
//     return (
//         <View style={styles.container}>
//             <View style={styles.content}>
//                 <Text>Profilescreen</Text>
//             </View>
//         </View>
//     );
// };

// export default Profilescreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'space-between',
//     },
//     content: {
//         flex: 1,
//         justifyContent: 'center', 
//     }
// });

import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const Profilescreen = () => {
    const [imageUri, setImageUri] = useState(null);

    const pickImage = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = { uri: response.assets[0].uri };
                setImageUri(source);
                uploadImage(response);
            }
        });
    };

    const uploadImage = async (response) => {
        const formData = new FormData();
        formData.append('image', {
            uri: response.assets[0].uri,
            name: response.assets[0].fileName,
            type: response.assets[0].type,
        });

        try {
            const res = await axios.post('http://192.168.137.188:5001/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Pick an image" onPress={pickImage} />
            {imageUri && <Image source={imageUri} style={{ width: 200, height: 200 }} />}
        </View>
    );
};

export default Profilescreen;
