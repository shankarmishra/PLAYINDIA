import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/constants';

// Mock data for notifications
// Mock data for notifications with more detailed info
const mockNotifications = [
  {
    id: '1',
    title: 'Match Invite',
    message: 'You\'ve been invited to a cricket match on Sunday at 6 PM',
    time: '2h ago',
    date: 'Today',
    type: 'match',
    read: false,
    color: '#3B82F6',
    icon: 'trophy-outline'
  },
  {
    id: '2',
    title: 'Booking Confirmation',
    message: 'Your coaching session with Coach Priya is confirmed for tomorrow',
    time: '5h ago',
    date: 'Today',
    type: 'booking',
    read: false,
    color: '#F59E0B',
    icon: 'calendar-outline'
  },
  {
    id: '3',
    title: 'Order Shipped',
    message: 'Your cricket bat order has been shipped and will arrive in 2 days',
    time: 'yesterday',
    date: 'Yesterday',
    type: 'order',
    read: true,
    color: '#10B981',
    icon: 'cart-outline'
  },
  {
    id: '4',
    title: 'Tournament Update',
    message: 'Summer Cricket League registration is now open',
    time: '2d ago',
    date: 'Feb 15',
    type: 'tournament',
    read: true,
    color: '#8B5CF6',
    icon: 'flag-outline'
  },
  {
    id: '5',
    title: 'Special Offer',
    message: 'Get 20% off on all sports equipment this week',
    time: '3d ago',
    date: 'Feb 14',
    type: 'offer',
    read: true,
    color: '#EF4444',
    icon: 'pricetag-outline'
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // Fetch notifications from API
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Try to fetch from API - use the auth/me endpoint to get user data including notifications
      const response = await axios.get(API_ENDPOINTS.AUTH.ME, {
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
      });

      // If API returns notifications in user data, use it
      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.log('Using mock notifications (API not available)');
      // Keep using mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  // Helper to get auth token
  const getAuthToken = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      return null;
    }
  };

  const filteredNotifications = filter === 'Unread'
    ? notifications.filter(n => !n.read)
    : filter === 'All'
      ? notifications
      : notifications.filter(n => n.type === filter.toLowerCase());

  const notificationTypes = [
    { id: 'All', name: 'All', icon: 'notifications-outline' },
    { id: 'Unread', name: 'Unread', icon: 'notifications-sharp' },
    { id: 'Match', name: 'Matches', icon: 'trophy-outline' },
    { id: 'Booking', name: 'Bookings', icon: 'calendar-outline' },
    { id: 'Order', name: 'Orders', icon: 'cart-outline' },
    { id: 'Offer', name: 'Offers', icon: 'pricetag-outline' },
  ];

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleViewAction = (notification: any) => {
    // Mark as read when viewing
    markAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case 'match':
      case 'tournament':
        navigation.dispatch(
          CommonActions.navigate({ name: 'Tournaments' })
        );
        break;
      case 'booking':
        navigation.dispatch(
          CommonActions.navigate({ name: 'MyOrders' })
        );
        break;
      case 'order':
        navigation.dispatch(
          CommonActions.navigate({ name: 'MyOrders' })
        );
        break;
      case 'offer':
        navigation.dispatch(
          CommonActions.navigate({ name: 'ShopHome' })
        );
        break;
      default:
        // Stay on current screen
        break;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.notificationCard,
        !item.read && styles.unreadCard
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={[styles.iconBox, { backgroundColor: `${item.color || '#64748B'}15` }]}>
        <Ionicons name={item.icon || 'notifications-outline'} size={22} color={item.color || '#64748B'} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !item.read && styles.boldText]}>{item.title}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>

        {!item.read && (
          <View style={styles.unreadRow}>
            <View style={styles.unreadDot} />
            <Text style={styles.unreadLabel}>New</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead} style={styles.markReadBtn}>
          <Text style={styles.markReadText}>Read All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPadding}>
          {notificationTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setFilter(type.id)}
              style={[
                styles.chip,
                filter === type.id && styles.activeChip
              ]}
            >
              <Text style={[
                styles.chipText,
                filter === type.id && styles.activeChipText
              ]}>{type.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="notifications-off-outline" size={48} color="#CBD5E0" />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyDesc}>No new notifications found in this category.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  markReadBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  filterPadding: {
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activeChip: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  unreadCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  unreadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  unreadLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotificationsScreen;