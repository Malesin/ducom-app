import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Switch } from 'react-native';

const AccountPrivacy = () => {
    const [isPrivate, setIsPrivate] = useState(false);

    const togglePrivacy = () => {
        setIsPrivate(!isPrivate);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.privacyContainer}>
                <Text style={styles.title}>Private account</Text>
                <Switch
                    value={isPrivate}
                    onValueChange={togglePrivacy}
                    style={styles.switch}
                />
            </View>
            <Text style={styles.description}>
                When your account is public, your profile and posts can be seen by anyone, on or off Ducom, even if they don't have an Ducom account.
            </Text>
            <Text style={styles.description}>
                When your account is private, only the followers you approve can see what you share, including your photos or videos on hashtag and location pages, and your followers and following lists. Certain info on your profile, like your profile picture and username, is visible to everyone on and off Ducom.
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    privacyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    switch: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    learnMore: {
        color: '#3897f0',
    },
});

export default AccountPrivacy;
