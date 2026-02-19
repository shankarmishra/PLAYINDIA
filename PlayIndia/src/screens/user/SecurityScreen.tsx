import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SecurityScreen = () => {
    const navigation = useNavigation();

    const securityItems = [
        { id: '1', title: 'Two-Factor Authentication', subtitle: 'Add an extra layer of security', icon: 'shield-outline', status: 'Disabled' },
        { id: '2', title: 'Change Password', subtitle: 'Last updated 3 months ago', icon: 'key-outline' },
        { id: '3', title: 'Biometric Login', subtitle: 'Use FaceID or Fingerprint', icon: 'finger-print-outline', status: 'Enabled' },
        { id: '4', title: 'Login Activity', subtitle: 'Check where you are logged in', icon: 'list-outline' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Security</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.infoCard}>
                    <Ionicons name="shield-checkmark" size={48} color="#2E7D32" />
                    <Text style={styles.infoTitle}>Keep your account safe</Text>
                    <Text style={styles.infoSubtitle}>Manage your security settings and protected your data</Text>
                </View>

                <View style={styles.section}>
                    {securityItems.map((item, index) => (
                        <TouchableOpacity key={item.id} style={[styles.item, index === securityItems.length - 1 && { borderBottomWidth: 0 }]}>
                            <View style={styles.itemLeft}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={item.icon as any} size={22} color="#2E7D32" />
                                </View>
                                <View>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                            <View style={styles.itemRight}>
                                {item.status && <Text style={styles.statusText}>{item.status}</Text>}
                                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                            </View>
                        </TouchableOpacity>
                    ))}
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
        padding: 16,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 16,
    },
    infoSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0FDF4',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    itemSubtitle: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2E7D32',
        marginRight: 8,
    },
});

export default SecurityScreen;
