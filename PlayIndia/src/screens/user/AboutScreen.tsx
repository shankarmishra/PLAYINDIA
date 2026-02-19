import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const AboutScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Us</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoSection}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="play" size={50} color="#2E7D32" />
                    </View>
                    <Text style={styles.appName}>PLAYINDIA</Text>
                    <Text style={styles.version}>Version 2.4.1</Text>
                </View>

                <View style={styles.contentCard}>
                    <Text style={styles.cardTitle}>Our Mission</Text>
                    <Text style={styles.cardText}>
                        At PLAYINDIA, we believe that sports have the power to transform lives. Our mission is to build the largest sports community in India, making it easier for every athlete to find players, book venues, and participate in tournaments.
                    </Text>
                </View>

                <View style={styles.contentCard}>
                    <Text style={styles.cardTitle}>Why PLAYINDIA?</Text>
                    <View style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                        <Text style={styles.featureText}>Connect with local players</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                        <Text style={styles.featureText}>Track your performance</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                        <Text style={styles.featureText}>Premium rewards for consistency</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 PLAYINDIA Sports Pvt. Ltd.</Text>
                    <TouchableOpacity>
                        <Text style={styles.websiteText}>www.playindia.com</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#C8E6C9',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
    },
    scrollContent: {
        padding: 24,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    appName: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1B5E20',
        marginTop: 16,
        letterSpacing: 2,
    },
    version: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
    },
    contentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 12,
    },
    cardText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureText: {
        fontSize: 14,
        color: '#475569',
        marginLeft: 10,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
        paddingBottom: 40,
    },
    footerText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    websiteText: {
        fontSize: 14,
        color: '#2E7D32',
        fontWeight: '700',
        marginTop: 4,
    },
});

export default AboutScreen;
