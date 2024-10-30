import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';

import SearchedCard from '../../components/SearchedCard';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import ProfilePicture from '../../assets/iya.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';

const serverUrl = config.SERVER_URL;

const SearchPage = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [searchs, setSearchs] = useState([]);
  const [myData, setMyData] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const textInputRef = useRef(null);

  const handleSearchPress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const getData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(`${serverUrl}/userdata`, {token: token}).then(res => {
        if (res.data.status == 'ok') {
          setMyData(res.data.data);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  const searchUser = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLoading(true); // Set loading to true
    try {
      await axios
        .post(`${serverUrl}/search-user`, {
          token: token,
          query: searchText,
        })
        .then(res => {
          if (res.data.status == 'ok') {
            setSearchs(res.data.data);
          }
        });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  }, [searchText]);

  useEffect(() => {
    getData();
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeoutId = setTimeout(() => {
      if (searchText.length > 0) {
        searchUser();
      }
    }, 300); // Adjust the delay as needed
    setDebounceTimeout(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [searchText, searchUser]);

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
            <MaterialIcons
              name="search"
              size={20}
              color="gray"
              style={styles.searchIcon}
            />
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
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setSearchText('')}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        style={styles.searchedContainer}
        showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : searchText.trim().length > 0 ? ( // Check if searchText has non-space characters
          searchs.filter(
            search =>
              search.username
                .replace(/\s+/g, '')
                .toLowerCase()
                .includes(searchText.replace(/\s+/g, '').toLowerCase()) ||
              search.name
                .replace(/\s+/g, '')
                .toLowerCase()
                .includes(searchText.replace(/\s+/g, '').toLowerCase()),
          ).length > 0 ? (
            searchs
              .filter(
                search =>
                  search.username
                    .replace(/\s+/g, '')
                    .toLowerCase()
                    .includes(searchText.replace(/\s+/g, '').toLowerCase()) ||
                  search.name
                    .replace(/\s+/g, '')
                    .toLowerCase()
                    .includes(searchText.replace(/\s+/g, '').toLowerCase()),
              )
              .map((search, index) => (
                <View key={index} style={styles.cardWrapper}>
                  <TouchableOpacity>
                    <SearchedCard
                      search={search}
                      myData={myData}
                      onClose={() => console.log('Close button pressed')}
                    />
                  </TouchableOpacity>
                </View>
              ))
          ) : (
            <Text style={styles.notFoundText}>User not found</Text>
          )
        ) : null}
        {/* <Text style={styles.searchedText}>Recently Searched</Text> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchPage;

const styles = StyleSheet.create({
  notFoundText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
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
    marginRight: 10,
  },
  cancelText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchedContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    marginBottom: 10, // Adjust the margin as needed
  },
});
