import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import ProfileImage from '../../assets/iya.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ReportedUser = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [reportText, setReportText] = useState('');
    const [inputHeight, setInputHeight] = useState(40);

    const handleReportPress = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setReportText('');
    };

    const handleSend = () => {
        console.log('Report sent:', reportText);
        setModalVisible(false);
        setReportText('');
    };

    return (
        <View style={styles.container}>
            <Image
                source={ProfileImage}
                style={styles.profileImage}
            />
            <View style={styles.textContainer}>
                <Text style={styles.username}>orangngoding</Text>
                <Text style={styles.userhandle}>@mikadotjees</Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="visibility" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleReportPress}>
                    <MaterialIcons name="report" size={25} color="#FFC300" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="delete-forever" size={25} color="#C70039" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Report User</Text>
                        <TextInput
                            style={[styles.input, { height: Math.max(40, inputHeight) }]}
                            placeholder="Enter your report"
                            value={reportText}
                            onChangeText={setReportText}
                            multiline={true}
                            onContentSizeChange={(event) => {
                                setInputHeight(event.nativeEvent.contentSize.height);
                            }}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
                                <Text style={styles.buttonTextCancel}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSend} onPress={handleSend}>
                                <Text style={styles.buttonTextSend}>
                                    Send
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ReportedUser;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },
    profileImage: {
        marginLeft: 10,
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    userhandle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ccc',
    },
    iconContainer: {
        flexDirection: 'row',
        padding: 5,
    },
    iconButton: {
        marginHorizontal: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'left',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        alignSelf: 'flex-start',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        marginBottom: 15,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
    },
    buttonCancel: {
        marginRight: 10,
        width: 70,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextCancel: {
        color: "#000",
        fontWeight: 'bold'
    },
    buttonSend: {
        backgroundColor: '#001374',
        borderRadius: 10,
        width: 70,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextSend: {
        color: "#fff",
        fontWeight: 'bold'
    },
});
