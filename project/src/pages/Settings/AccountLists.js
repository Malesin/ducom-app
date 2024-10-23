import { SafeAreaView, StyleSheet, Text, View, ScrollView, RefreshControl, ToastAndroid, Alert } from 'react-native'
import { Skeleton } from 'react-native-elements';
import React, { useState, useEffect, useCallback } from 'react';
import Usercard from '../../components/Admin/Usercard'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
const serverUrl = config.SERVER_URL;

const AccountLists = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        FetchAllUsers()
    }, [])

    const FetchAllUsers = async () => {
        setShowSkeleton(true);
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.post(`${serverUrl}/all-users`, { token: token });
            const respAll = response.data.data || []; // Pastikan respAll adalah array
            const formattedAll = respAll.map(user => ({
                id: user._id,
                name: user.name,
                username: user.username,
                profilePicture: user.profilePicture,
            }));
            setShowSkeleton(false);
            return formattedAll; // Pastikan mengembalikan array
        } catch (error) {
            setShowSkeleton(false);
            console.error(error);
            return []; // Kembalikan array kosong jika terjadi error
        }
    }

    useEffect(() => {
        const loadAllUsers = async () => {
            setRefreshing(true);
            const newAllUsers = await FetchAllUsers();
            setAllUsers(newAllUsers)
            setRefreshing(false);
        };
        loadAllUsers();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const newAllUsers = await FetchAllUsers();
        setAllUsers(newAllUsers)
        setRefreshing(false);
    }, []);

    const handleDeleteUser = async (idUser) => {
        const token = await AsyncStorage.getItem('token');
        try {
            Alert.alert('Delete User', 'Are you sure want to delete this user?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        await axios
                            .post(`${serverUrl}/deleteUser-byAdmin`, {
                                token: token,
                                idUser: idUser
                            })
                            .then(res => {
                                console.log(res.data)
                                ToastAndroid.show('User successfully deleted', ToastAndroid.SHORT);
                            })
                        await onRefresh();
                    },
                },
            ]);
        } catch (error) {
            console.error(error)
        }
    }

    const renderSkeleton = () => (
        <>
            {[...Array(10)].map((_, index) => (
                <View key={index} style={styles.skeletonContainer}>
                    <View style={styles.skeletonHeader}>
                        <Skeleton
                            animation="pulse"
                            circle
                            height={50}
                            width={50}
                            style={styles.skeletonAvatar}
                        />
                        <Skeleton
                            animation="pulse"
                            height={40}
                            width="78%"
                            marginRight={10}
                            style={[styles.skeleton, { borderRadius: 3 }]}
                        />
                        <Skeleton
                            animation="pulse"
                            height={40}
                            width="10%"
                            style={[styles.skeleton, { borderRadius: 3 }]}
                        />
                    </View>
                </View>
            ))}
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {showSkeleton ? (
                    renderSkeleton()
                ) : (
                    allUsers && allUsers.length === 0 ? (
                        <Text style={styles.noAllUsersText}>No Users accounts</Text>
                    ) : (
                        allUsers && allUsers.map((user, index) => ( // Tambahkan pengecekan allUsers
                            <Usercard key={index} user={user} handleDeleteUser={handleDeleteUser} />
                        ))
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default AccountLists

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    noAllUsersText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
    skeletonContainer: {
        padding: 20,
        alignItems: 'flex-start',
        width: '100%',
    },
    skeleton: {
        marginBottom: 10,
    },
    skeletonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    skeletonAvatar: {
        marginRight: 10,
        marginBottom: 12
    },
    skeletonTextContainer: {
        flex: 1,
    },
});
