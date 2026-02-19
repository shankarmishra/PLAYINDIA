import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MyBookingsScreen = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState('All');

    const bookings = [
        {
            id: '1',
            sport: 'Cricket',
            venue: 'Greenfield Sports Complex',
            date: '20 Dec, 2023',
            time: '04:00 PM - 06:00 PM',
            status: 'Upcoming',
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80',
        },
        {
            id: '2',
            sport: 'Badminton',
            venue: 'Shuttle Pro Arena',
            date: '15 Dec, 2023',
            time: '10:00 AM - 11:00 AM',
            status: 'Completed',
            image: 'https://images.unsplash.com/photo-1626225967045-9c76db7b6ecd?w=500&q=80',
        },
        {
            id: '3',
            sport: 'Football',
            venue: 'City Football Ground',
            date: '10 Dec, 2023',
            time: '06:00 PM - 08:00 PM',
            status: 'Cancelled',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80',
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming': return '#F9A825';
            case 'Completed': return '#2E7D32';
            case 'Cancelled': return '#C62828';
            default: return '#64748B';
        }
    };

    const filteredBookings = filter === 'All'
        ? bookings
        : bookings.filter(b => b.status === filter);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1B5E20" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Bookings</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.filterContainer}>
                {['All', 'Upcoming', 'Completed', 'Cancelled'].map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterChip, filter === f && styles.filterChipActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((item) => (
                        <View key={item.id} style={styles.bookingCard}>
                            <Image source={{ uri: item.image }} style={styles.venueImage} />
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.sportText}>{item.sport}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.venueText}>{item.venue}</Text>
                                <View style={styles.infoRow}>
                                    <Ionicons name="calendar-outline" size={14} color="#64748B" />
                                    <Text style={styles.infoText}>{item.date}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Ionicons name="time-outline" size={14} color="#64748B" />
                                    <Text style={styles.infoText}>{item.time}</Text>
                                </View>
                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.detailsBtn}>
                                        <Text style={styles.detailsBtnText}>View Details</Text>
                                    </TouchableOpacity>
                                    {item.status === 'Upcoming' && (
                                        <TouchableOpacity style={styles.cancelBtn}>
                                            <Text style={styles.cancelBtnText}>Cancel</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={60} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>No Bookings Found</Text>
                        <Text style={styles.emptyDesc}>You haven't made any {filter !== 'All' ? filter.toLowerCase() : ''} bookings yet.</Text>
                    </View>
                )}
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
        backgroundColor: '#E8F5E9',
        borderBottomWidth: 1,
        borderBottomColor: '#C8E6C9',
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#C8E6C9',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0F172A',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#2E7D32',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    scrollContent: {
        padding: 16,
    },
    bookingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    venueImage: {
        width: '100%',
        height: 120,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sportText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1B5E20',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    venueText: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '600',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoText: {
        fontSize: 13,
        color: '#64748B',
        marginLeft: 8,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    detailsBtn: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    detailsBtnText: {
        color: '#2E7D32',
        fontSize: 14,
        fontWeight: '700',
    },
    cancelBtn: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1B5E20',
        marginTop: 16,
    },
    emptyDesc: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
});

export default MyBookingsScreen;
