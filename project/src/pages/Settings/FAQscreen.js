import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const Accordion = ({ title, content, isExpanded, onPress }) => {
    const height = useSharedValue(0);

    // Update the height when `isExpanded` changes
    height.value = withSpring(isExpanded ? 100 : 0, { damping: 20, stiffness: 100 });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
            overflow: 'hidden',
        };
    });

    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity
                style={styles.accordionHeader}
                onPress={onPress}
            >
                <Text style={styles.accordionHeaderText}>{title}</Text>
            </TouchableOpacity>
            <Animated.View style={[styles.accordionContent, animatedStyle]}>
                <Text style={styles.accordionContentText}>{content}</Text>
            </Animated.View>
        </View>
    );
};

const FAQscreen = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleAccordion = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const accordionData = [
        { title: 'What is Ducom?', content: 'Ducom is an app developed by students from SMKN 2 Jakarta.' },
        { title: 'How to use Ducom', content: 'To use Ducom, you need to sign up and log in.' },
        { title: 'Features of Ducom', content: 'Ducom offers various features including discussion forums and feedback systems.' },
        { title: 'Contact Support', content: 'You can contact support via email or through the app’s support feature.' },
        { title: 'Privacy Policy', content: 'Your data is protected according to our privacy policy.' },
        { title: 'Terms of Service', content: 'Please review our terms of service before using the app.' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.contentContainer}>
                    <Text style={styles.contentTitle}>We’re here to help you with {'\n'}
                        anything and everything {'\n'}
                        on Ducom
                    </Text>

                    <Text style={styles.contentText}>
                        At Ducom we hope to be a forum for you to {'\n'}
                        share your experiences and opinions.
                    </Text>

                    {accordionData.map((item, index) => (
                        <Accordion
                            key={index}
                            title={item.title}
                            content={item.content}
                            isExpanded={expandedIndex === index}
                            onPress={() => toggleAccordion(index)}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default FAQscreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    contentContainer: {
        flex: 1,
    },
    contentTitle: {
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    contentText: {
        color: '#000',
        fontSize: 16,
        marginBottom: 20,
    },
    accordionContainer: {
        width: '100%',
        marginBottom: 10,
    },
    accordionHeader: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    accordionHeaderText: {
        fontSize: 16,
        color: '#000',
    },
    accordionContent: {
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#ccc',
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    accordionContentText: {
        fontSize: 14,
        color: '#333',
    },
});
