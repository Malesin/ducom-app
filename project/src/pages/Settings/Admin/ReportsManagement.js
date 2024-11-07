import { SafeAreaView, StyleSheet, Text, View, ScrollView, RefreshControl, ToastAndroid, Alert } from 'react-native'
import { Skeleton } from 'react-native-elements';
import React, { useState, useEffect, useCallback } from 'react';
import ReportedUser from '../../../components/Admin/ReportedUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../../config';
const serverUrl = config.SERVER_URL;

const ReportsManagement = () => {

    const [reportUsers, setReportUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        FetchReports()
    }, [])

    const FetchReports = async () => {
        setShowSkeleton(true);
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.post(`${serverUrl}/show-reports`, { token: token });
            const resp = response.data.data;
            console.log(resp)
            const formatted = resp.map(report => {
                const userId = report.reportedEntity?.user?._id ?? report.reportedEntity?._id ??  report.reportedEntity?.user  ?? '';
                const name = report.reportedEntity?.user?.name ?? report.reportedEntity?.name ?? '';
                const username = report.reportedEntity?.user?.username ?? report.reportedEntity?.username ?? '';
                const usernamePost = report.relatedPost?.user?.username ?? '';
                const profilePicPost = report.relatedPost?.user?.profilePicture ?? '';
                const profilePicture = report.reportedEntity?.user?.profilePicture ?? report.reportedEntity?.profilePicture ?? '';
                const bio = report.reportedEntity?.description ?? '';
                const commentProof = report.reportedEntity?.comment ?? '';
                const reason = report.reportCategoryDescriptions;
                const reportedAt = report.reported_at;
                const myId = report.myId

                // Validasi untuk memastikan username adalah string sebelum menggunakan charAt
                if (typeof username === 'string' && username.length > 0) {
                    const firstChar = username.charAt(0);
                    // Lakukan sesuatu dengan firstChar jika diperlukan
                }

                return {
                    id: report._id,
                    postId: report.reportedPost?._id ?? report.relatedPost?._id,
                    category: report.category,
                    userId,
                    name,
                    username,
                    usernamePost,
                    profilePicPost,
                    profilePicture,
                    bio,
                    commentProof,
                    reason,
                    reportedAt,
                    myId
                };
            });
            setShowSkeleton(false);
            return formatted; // Pastikan mengembalikan array
        } catch (error) {
            setShowSkeleton(false);
            console.error(error);
            return []; // Kembalikan array kosong jika terjadi error
        }
    }
    
    useEffect(() => {
        const loadReportUsers = async () => {
            setRefreshing(true);
            const newReportUsers = await FetchReports();
            setReportUsers(newReportUsers)
            setRefreshing(false);
        };
        loadReportUsers();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const newReportUsers = await FetchReports();
        setReportUsers(newReportUsers)
        setRefreshing(false);
    }, []);

    const handleDeleteReport = async (reportId) => {
        const token = await AsyncStorage.getItem('token');
        try {
            Alert.alert('Delete Report', 'Are you sure want to delete this report?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await axios
                                .post(`${serverUrl}/delete-report`, {
                                    token: token,
                                    reportId: reportId
                                })
                                .then(res => {
                                    console.log(res.data)
                                    ToastAndroid.show('Report successfully deleted', ToastAndroid.SHORT);
                                })
                            await onRefresh();
                        } catch (error) {
                            console.error(error)
                            ToastAndroid.show('Something error, try again later', ToastAndroid.SHORT);
                        }
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
                    reportUsers && reportUsers.length === 0 ? (
                        <Text style={styles.noReportUsersText}>No Users accounts</Text>
                    ) : (
                        reportUsers && reportUsers.map((report, index) => (
                            <ReportedUser key={index} report={report} handleDeleteReport={handleDeleteReport} />
                        ))
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default ReportsManagement

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    noReportUsersText: {
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
