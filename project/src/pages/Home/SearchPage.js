import { StyleSheet, View, TextInput, SafeAreaView, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import ProfilePicture from '../../assets/iya.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import SearchResultCard from '../../components/SearchResultCard';

const serverUrl = config.SERVER_URL;

const SearchPage = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [searchs, setSearchs] = useState([]);
    const [myData, setMyData] = useState([]);
    const textInputRef = useRef(null);

    const handleSearchPress = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    const getData = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            await axios
                .post(`${serverUrl}/userdata`, { token: token })
                .then(res => {
                    if (res.data.status == 'ok') {
                        setMyData(res.data.data)
                    }
                })
        } catch (error) {
            console.error(error)
        }
    }

    const searchUser = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            await axios
                .post(`${serverUrl}/search-user`, {
                    token: token,
                    query: searchText
                })
                .then(res => {
                    if (res.data.status == 'ok') {
                        setSearchs(res.data.data)
                    }
                })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        searchUser()
        getData()
    }, [searchUser]);

    const handleBackPress = () => {
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.searchContainer}>
            <View style={styles.headerSearchContainer}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <MaterialIcons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchInputContainer}>
                    <TouchableOpacity onPress={handleSearchPress}>
                        <MaterialIcons name="search" size={20} color="gray" style={styles.searchIcon} />
                    </TouchableOpacity>
                    <TextInput
                        ref={textInputRef}
                        placeholder="Search"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                        keyboardType="default"
                    />
                </View>
                {searchText.length > 0 && (
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setSearchText('')}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView style={styles.searchedContainer} showsVerticalScrollIndicator={false}>
                {searchText.length > 0 && searchs.map((search, index) => (
                    <View key={index} >
                        <SearchResultCard
                            search={search}
                            myData={myData}
                            onClose={() => console.log('Close button pressed')}
                        />
                    </View>
                ))}
                {/* <Text style={styles.searchedText}>Recently Searched</Text> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SearchPage;

const styles = StyleSheet.create({
    searchContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        height: 60,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        flex: 1,
        paddingHorizontal: 10,
        height: 40,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingVertical: 10,
    },
    backButtonContainer: {
        marginRight: 15,
    },
    cancelButton: {
        marginLeft: 15,
    },
    cancelText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    searchedContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    searchedText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#000',
    },
    searchedItemContainer: {
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
    searchedItemText: {
        fontSize: 14,
        color: '#000',
    },
    closeIcon: {
        marginLeft: 10,
    },
});
