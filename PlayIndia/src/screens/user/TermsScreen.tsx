import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const TermsScreen = () => {
    const navigation = useNavigation();

    const sections = [
        { title: '1. Acceptance of Terms', content: 'By accessing or using the PLAYINDIA application, you agree to be bound by these terms of service and all applicable laws and regulations.' },
        { title: '2. User Eligibility', content: 'You must be at least 13 years of age to use this service. If you are under 18, you must have parental consent.' },
        { title: '3. Community Guidelines', content: 'Users must respect other players and venue staff. Harassment, discrimination, or any form of abuse will result in an immediate account ban.' },
        { title: '4. Booking and Refunds', content: 'All bookings are subject to venue availability. Cancellations must be made at least 24 hours in advance to be eligible for a refund to your PlayWallet.' },
        { title: '5. Limitation of Liability', content: 'PLAYINDIA is a platform connecting players and venues. We are not responsible for any injuries sustained during participation in sports activities.' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms of Service</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.introCard}>
                    <Text style={styles.lastUpdated}>Last Updated: January 15, 2024</Text>
                    <Text style={styles.introText}>Please read these terms carefully before using PLAYINDIA.</Text>
                </View>

                {sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionContent}>{section.content}</Text>
                    </View>
                ))}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>For any questions regarding these terms, please contact our support team at support@playindia.com</Text>
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
        padding: 20,
    },
    introCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#2E7D32',
    },
    lastUpdated: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '700',
    },
    introText: {
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '600',
        marginTop: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1B5E20',
        marginBottom: 10,
    },
    sectionContent: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        textAlign: 'justify',
    },
    footer: {
        marginTop: 16,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#C8E6C9',
        paddingTop: 20,
    },
    footerText: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default TermsScreen;
