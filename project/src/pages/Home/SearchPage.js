import { StyleSheet, View, TextInput, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SearchPage = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const textInputRef = useRef(null);

    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }, []);

    return (
        <SafeAreaView style={styles.searchContainer}>
            <View style={styles.headerSearchContainer}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchInputContainer}>
                    <MaterialIcons name="search" size={20} color="gray" style={styles.searchIcon} />
                    <TextInput
                        ref={textInputRef}
                        placeholder="Search"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
                {searchText.length > 0 && (
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setSearchText('')}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default SearchPage;

const styles = StyleSheet.create({
    searchContainer: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'flex-start',
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
});
