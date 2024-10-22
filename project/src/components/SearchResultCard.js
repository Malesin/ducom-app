import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const SearchResultCard = ({ search, myData, onClose }) => {
    const navigator = useNavigation();

    const handleSearchCard = async (search) => {
        if (search._id === myData._id) {
            navigator.navigate('Profile');
        } else {
            navigator.navigate('Userprofile', {
                userIdPost: search.id,
                idUser: myData._id,
            });
        }
    }

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => handleSearchCard(search)}>
            <View style={styles.profileTextContainer}>
                <Image source={
                    search?.profilePicture
                        ? { uri: search?.profilePicture }
                        : require('../assets/profilepic.png')} style={styles.profilePicture} />
                <Text style={styles.usernameText}>{search?.username}</Text>
            </View>
            {/* <TouchableOpacity onPress={onClose}>
                <MaterialIcons style={styles.closeIcon} name="close" size={20} color="#000" />
            </TouchableOpacity> */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
        marginHorizontal: -10,
    },
    profileTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 10,
    },
    usernameText: {
        fontSize: 14,
        color: '#000',
    },
    closeIcon: {
        marginLeft: 10,
    },
});

export default SearchResultCard;