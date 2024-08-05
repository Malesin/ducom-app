import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Debounce utility function
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
};

const Accordion = ({ title, content, isExpanded, onPress }) => {
    const height = useSharedValue(0);
    const borderOpacity = useSharedValue(0);

    // Update the height and border opacity when `isExpanded` changes
    height.value = withSpring(isExpanded ? 60 : 0, { damping: 20, stiffness: 100 });
    borderOpacity.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
        overflow: 'hidden',
    }));

    const contentTextStyle = useAnimatedStyle(() => ({
        borderWidth: height.value > 0 ? 1 : 0, // Ensure border is visible during expansion
        borderColor: '#ccc', // Static border color
        opacity: borderOpacity.value, // Animated border opacity
        padding: height.value > 0 ? 10 : 0, // Add padding when expanded
    }));

    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity
                style={styles.accordionHeader}
                onPress={onPress}
            >
                <Text style={styles.accordionHeaderText}>{title}</Text>
                <Icon
                    name={isExpanded ? 'expand-less' : 'expand-more'}
                    size={24}
                    color="#000"
                />
            </TouchableOpacity>
            <Animated.View style={[styles.accordionContent, animatedStyle]}>
                <Animated.Text style={[styles.accordionContentText, contentTextStyle]}>
                    {content}
                </Animated.Text>
            </Animated.View>
        </View>
    );
};

const FAQscreen = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    // Wrap toggleAccordion in debounce
    const toggleAccordion = useCallback(debounce((index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    }, 300), [expandedIndex]);


    // Email API
    const handlePress = async () => {
        const email = 'reysend01@gmail.com'; // Replace with admin email
        const subject = 'Support Request';
        const body = 'Please describe your issue here.';
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('An error occurred while opening the email client:', error);
        }
    };

    const accordionData = [
        { title: 'What is Ducom?', content: 'Ducom is an app developed by students from SMKN 2 Jakarta.' },
        { title: 'How to use Ducom', content: 'To use Ducom, you need to register an account and sign in.' },
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

                {/* Section for text and button */}
                <View style={styles.helpSection}>
                    <Text style={styles.helpText}>Let Us Help You</Text>
                    <TouchableOpacity style={styles.pillButton} onPress={handlePress}>
                        <Text style={styles.pillButtonText}>Send a Question?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 20,
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
        marginBottom: 15,
    },
    accordionHeader: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    accordionHeaderText: {
        fontSize: 16,
        color: '#000',
    },
    accordionContent: {
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        padding: 0,
        overflow: 'hidden',
    },
    accordionContentText: {
        fontSize: 14,
        color: '#333',
        borderRadius: 5,
    },
    helpSection: {
        backgroundColor: '#d3d3d3',
        shadowColor: '#d3d3d3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        padding: 20,
        alignItems: 'center',
    },
    helpText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    pillButton: {
        backgroundColor: '#001374',
        paddingVertical: 16,
        paddingHorizontal: 36,
        borderRadius: 50,
        alignItems: 'center',
    },
    pillButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FAQscreen;
