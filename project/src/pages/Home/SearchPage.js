import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';

import SearchedCard from '../../components/SearchedCard';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import {useColorScheme} from 'react-native';

const serverUrl = config.SERVER_URL;

const SearchPage = ({navigation, route}) => {
  const { search } = route.params;
  const [searchText, setSearchText] = useState(search || '');
  const [searchs, setSearchs] = useState([]);
  const [myData, setMyData] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const textInputRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

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
    setIsLoading(true);
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
      setIsLoading(false);
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

  const handlePress = async search => {
    if (search._id === myData._id) {
      navigation.navigate('Profile');
    } else if (search._id !== route.params.userIdPost) {
      navigation.navigate('Userprofile', {
        userIdPost: search._id,
        idUser: myData._id,
      });
    }
  };

  return (
    <SafeAreaView style={styles.searchContainer}>
      <View style={styles.headerSearchContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <MaterialIcons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.searchInputContainer,
            {
              transform: [{translateX: slideAnim}],
            },
          ]}>
          <TouchableOpacity onPress={handleSearchPress}>
            <MaterialIcons
              name="search"
              size={20}
              color={colorScheme === 'dark' ? '#ccc' : 'gray'}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
          <TextInput
            ref={textInputRef}
            placeholder="Search"
            style={[
              styles.searchInput,
              {color: colorScheme === 'dark' ? '#000000' : '#000'},
            ]}
            value={searchText}
            onChangeText={setSearchText}
            keyboardType="default"
            placeholderTextColor={
              colorScheme === 'dark' ? '#cccccc' : '#888888'
            }
          />
        </Animated.View>
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
                  <TouchableOpacity onPress={() => handlePress(search)}>
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
