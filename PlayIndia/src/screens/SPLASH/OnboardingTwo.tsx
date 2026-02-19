import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingTwo'>;

const OnboardingTwo = () => {
    const navigation = useNavigation<NavigationProp>();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />

            <View style={styles.contentContainer}>
                <Text style={styles.title}>
                    Join games & create{'\n'}your own matches
                </Text>

                <Text style={styles.description}>
                    Connect with local athletes, fill empty spots in your team, or start a brand new league nearby.
                </Text>

                <View style={styles.pagination}>
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('OnboardingThree')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => navigation.navigate('LoginWelcome')}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1B5E20',
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 14,
        color: '#558B2F',
        opacity: 0.9,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 40,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: '#4CAF50',
    },
    button: {
        width: '100%',
        height: 56,
        backgroundColor: '#4CAF50',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    skipButton: {
        padding: 10,
    },
    skipText: {
        fontSize: 14,
        color: '#558B2F',
        opacity: 0.6,
    },
});

export default OnboardingTwo;
