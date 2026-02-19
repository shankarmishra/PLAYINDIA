import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '../../theme/colors';

interface PersonalInfoProps {
    name: string;
    email: string;
    phone: string;
    city: string;
    age: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    onEditAge?: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
    name,
    email,
    phone,
    city,
    age,
    isEmailVerified,
    isPhoneVerified,
    onEditAge,
}) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                    <Ionicons name="person-outline" size={18} color={theme.colors.accent.neonGreen} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoValue}>{name}</Text>
                </View>
            </View>

            <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                    <Ionicons name="mail-outline" size={18} color={theme.colors.accent.neonGreen} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <View style={styles.valueWithBadge}>
                        <Text style={styles.infoValue}>{email}</Text>
                        {isEmailVerified && (
                            <Ionicons name="checkmark-circle" size={14} color={theme.colors.status.success} style={styles.badge} />
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                    <Ionicons name="call-outline" size={18} color={theme.colors.accent.neonGreen} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <View style={styles.valueWithBadge}>
                        <Text style={styles.infoValue}>{phone}</Text>
                        {isPhoneVerified && (
                            <Ionicons name="checkmark-circle" size={14} color={theme.colors.status.success} style={styles.badge} />
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                    <Ionicons name="location-outline" size={18} color={theme.colors.accent.neonGreen} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{city}</Text>
                </View>
            </View>

            <View style={[styles.infoItem, styles.noBorder]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="calendar-outline" size={18} color={theme.colors.accent.neonGreen} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.infoLabel}>Age</Text>
                    <View style={styles.valueWithBadge}>
                        <Text style={styles.infoValue}>{age}</Text>
                        {onEditAge && (
                            <TouchableOpacity onPress={onEditAge} style={styles.badge}>
                                <Ionicons name="create-outline" size={14} color={theme.colors.text.secondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1B5E20',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0FDF4',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 2,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '600',
    },
    valueWithBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        marginLeft: 6,
    },
});

export default PersonalInfo;
