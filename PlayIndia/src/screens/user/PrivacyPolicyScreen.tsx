import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();

    const policies = [
        { title: 'Data Collection', content: 'We collect information you provide directly to us (name, email, phone) and automatically collect data like location to help you find nearby players and venues.' },
        { title: 'Location Access', content: 'Your location is used ONLY to show nearby sports activities. You can disable this in your device settings or app preferences at any time.' },
        { title: 'Data Sharing', content: 'We do not sell your personal data to third parties. We only share info with venue providers to facilitate your bookings.' },
        { title: 'Data Security', content: 'We implement industry-standard encryption to protect your sensitive information and transactions.' },
        { title: 'Your Rights', content: 'You have the right to request access to, correction of, or deletion of your personal data by contacting our privacy team.' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.privacyHeader}>
                    <View style={styles.privacyIconContainer}>
                        <Ionicons name="lock-closed" size={40} color="#2E7D32" />
                    </View>
                    <Text style={styles.privacyHeaderText}>Your Privacy Matters</Text>
                    <Text style={styles.privacySubText}>We are committed to protecting your personal information and being transparent about how we use it.</Text>
                </View>

                {policies.map((policy, index) => (
                    <View key={index} style={styles.policyCard}>
                        <Text style={styles.policyTitle}>{policy.title}</Text>
                        <Text style={styles.policyContent}>{policy.content}</Text>
                    </View>
                ))}

                <TouchableOpacity style={styles.requestDataBtn}>
                    <Text style={styles.requestDataBtnText}>Request My Data</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.lastUpdate}>Last modified: February 2024</Text>
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
    privacyHeader: {
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    privacyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    privacyHeaderText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0F172A',
    },
    privacySubText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    policyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#C8E6C9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    policyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1B5E20',
        marginBottom: 8,
    },
    policyContent: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 20,
    },
    requestDataBtn: {
        backgroundColor: '#FFFFFF',
        marginVertical: 20,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2E7D32',
    },
    requestDataBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#2E7D32',
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    lastUpdate: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
    },
});

export default PrivacyPolicyScreen;
