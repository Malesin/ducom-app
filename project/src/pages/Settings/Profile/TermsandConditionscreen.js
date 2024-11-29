import { StyleSheet, Text, ScrollView, SafeAreaView, View, TouchableOpacity, useColorScheme } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const TermsandConditionsScreen = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Terms and Conditions</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.sectionTitle}>Conditions of Use</Text>
                <Text style={styles.sectionContent}>
                    By using this application, you certify
                    that you have read and reviewed this
                    Agreement and that you agree to comply
                    with its terms. If you do not want to
                    be bound by the terms of this Agreement,
                    you are advised to stop using the
                    website accordingly. Ducom only grants
                    use and access of this website, its
                    products, and its services to those who
                    have accepted its terms.
                </Text>

                <Text style={styles.sectionTitle}>Intellectual Property</Text>
                <Text style={styles.sectionContent}>
                    You agree that all materials, products
                    and services provided on this application
                    are the property of Ducom, its affiliates,
                    directors, officers, employees, agents,
                    suppliers, or licensors including all
                    copyrights, trade secrets, trademarks,
                    patents, and other intellectual property.
                    You also agree that you will not reproduce
                    or redistribute the Ducom's intellectual
                    property in any way, including electronic,
                    digital, or new trademark registrations.
                </Text>

                <Text style={styles.sectionContent}>
                    You grant Ducom a royalty-free and
                    non-exclusive license to display, use, copy,
                    transmit, and broadcast the content you
                    upload and publish. For issues regarding
                    intellectual property claims, you should
                    contact the company in order to come to an
                    agreement.
                </Text>

                <Text style={styles.sectionTitle}>User Accounts</Text>
                <Text style={styles.sectionContent}>
                    As a user of this application, you may
                    be asked to register with us and provide
                    private information. You are responsible for
                    ensuring the accuracy of this information,
                    and you are responsible for maintaining
                    the safety and security of your identifying
                    information. You are also responsible for
                    all activities that occur under your
                    account or password.
                </Text>

                <Text style={styles.sectionContent}>
                    If you think there are any possible
                    issues regarding the security of your account
                    on the application, inform us immediately so we
                    may address them accordingly. We reserve
                    all rights to terminate accounts, edit or
                    remove content and cancel orders at our
                    sole discretion.
                </Text>

                <Text style={styles.sectionTitle}>Applicable Law</Text>
                <Text style={styles.sectionContent}>
                    By using this application, you agree that
                    the laws of Jakarta Pusat, without regard to
                    principles of conflict laws, will govern
                    these terms and conditions, or any dispute
                    of any sort that might come between Ducom
                    and you, or its business partners and
                    associates.
                </Text>

                <Text style={styles.sectionTitle}>Disputes</Text>
                <Text style={styles.sectionContent}>
                    Any dispute related in any way to your use
                    of this application or to products you
                    purchase from us shall be arbitrated by
                    state or federal court Jakarta Pusat and
                    you consent to exclusive jurisdiction
                    and venue of such courts.
                </Text>

                <Text style={styles.sectionTitle}>Indemnification</Text>
                <Text style={styles.sectionContent}>
                    You agree to indemnify Ducom
                    and its affiliates and hold Ducom
                    harmless against legal claims and demands
                    that may arise from your use or misuse
                    of our services. We reserve the right to
                    select our own legal counsel.
                </Text>

                <Text style={styles.sectionTitle}>Limitation on Liability</Text>
                <Text style={styles.sectionContent}>
                    Ducom is not liable for any damages
                    that may occur to you as a result of your
                    misuse of our application. Ducom reserves
                    the right to edit, modify, and change this
                    Agreement at any time. We shall let our
                    users know of these changes through
                    electronic mail. This Agreement is an
                    understanding between Ducom and the user,
                    and this supersedes and replaces all prior
                    agreements regarding the use of this
                    application.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsandConditionsScreen;

const getStyles = (colorScheme) => {
    const currentTextColor = colorScheme === 'dark' ? '#000' : '#000';
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#ffffff'
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: '#0a3e99',
            justifyContent: 'center',
        },
        backButton: {
            position: 'absolute',
            left: 16,
        },
        headerText: {
            fontSize: 24,
            color: '#fff',
            fontWeight: 'bold',
        },
        scrollView: {
            padding: 16,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginVertical: 10,
            color: currentTextColor,
        },
        sectionContent: {
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 20,
            color: currentTextColor,
        },
    });
};
