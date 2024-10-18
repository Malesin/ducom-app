import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { height } = Dimensions.get('window');

const PostSheet = () => {
    const [visible, setVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('everyone'); // State to track selected radio option
    const [animationValue] = useState(new Animated.Value(height));

    const openBottomSheet = () => {
        setVisible(true);
        Animated.timing(animationValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeBottomSheet = () => {
        Animated.timing(animationValue, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openBottomSheet} style={styles.openButton}>
                <Text style={styles.openButtonText}>Who can reply?</Text>
            </TouchableOpacity>

            <Modal transparent visible={visible} animationType="none">
                <View style={styles.modalBackground}>
                    <TouchableOpacity style={styles.overlay} onPress={closeBottomSheet} />
                    <Animated.View
                        style={[styles.bottomSheetContainer, { transform: [{ translateY: animationValue }] }]}>

                        <Text style={styles.title}>Who Can Reply?</Text>
                        <Text style={styles.subtitle}>
                            Choose who can reply to this Post. Anyone mentioned can always reply.
                        </Text>

                        {/* Option 1: Everyone */}
                        <TouchableOpacity style={styles.option} onPress={() => setSelectedOption('everyone')}>
                            <MaterialCommunityIcons name="earth" size={25} color="#001374" />
                            <Text style={styles.optionText}>Everyone</Text>
                            <View style={styles.radioCircle}>
                                {selectedOption === 'everyone' && <View style={styles.checkedCircle} />}
                            </View>
                        </TouchableOpacity>

                        {/* Option 2: Only Me */}
                        <TouchableOpacity style={styles.option} onPress={() => setSelectedOption('onlyme')}>
                            <MaterialCommunityIcons name="account-circle" size={25} color="#001374" />
                            <Text style={styles.optionText}>Only me</Text>
                            <View style={styles.radioCircle}>
                                {selectedOption === 'onlyme' && <View style={styles.checkedCircle} />}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

export default PostSheet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    openButton: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 50,
    },
    openButtonText: {
        fontWeight: 'bold',
        color: '#001374',
        fontSize: 15,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    bottomSheetContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#001374',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#001374',
    },
});
