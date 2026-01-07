import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    title: 'Match Invite',
    message: 'You\'ve been invited to a cricket match on Sunday at 6 PM',
    time: '2 hours ago',
    type: 'match',
    read: false,
  },
  {
    id: '2',
    title: 'Booking Confirmation',
    message: 'Your coaching session with Coach Priya is confirmed for tomorrow',
    time: '5 hours ago',
    type: 'booking',
    read: false,
  },
  {
    id: '3',
    title: 'Order Shipped',
    message: 'Your cricket bat order has been shipped and will arrive in 2 days',
    time: '1 day ago',
    type: 'order',
    read: true,
  },
  {
    id: '4',
    title: 'Tournament Update',
    message: 'Summer Cricket League registration is now open',
    time: '2 days ago',
    type: 'tournament',
    read: true,
  },
  {
    id: '5',
    title: 'Special Offer',
    message: 'Get 20% off on all sports equipment this week',
    time: '3 days ago',
    type: 'offer',
    read: true,
  },
  {
    id: '6',
    title: 'New Player Nearby',
    message: 'A new cricket player has joined near your location',
    time: '4 days ago',
    type: 'player',
    read: true,
  },
];

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('All');

  const filteredNotifications = filter === 'Unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

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

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        { 
          backgroundColor: item.read 
            ? theme.colors.background.card 
            : theme.colors.background.secondary 
        }
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIconContainer}>
        <View style={[
          styles.notificationIcon,
          { 
            backgroundColor: 
              item.type === 'match' ? `${theme.colors.accent.neonGreen}20` :
              item.type === 'booking' ? `${theme.colors.accent.orange}20` :
              item.type === 'order' ? `${theme.colors.status.success}20` :
              item.type === 'tournament' ? `${theme.colors.status.info}20` :
              item.type === 'offer' ? `${theme.colors.status.warning}20` :
              `${theme.colors.text.secondary}20`
          }
        ]}>
          <Ionicons 
            name={
              item.type === 'match' ? 'trophy-outline' :
              item.type === 'booking' ? 'calendar-outline' :
              item.type === 'order' ? 'cart-outline' :
              item.type === 'tournament' ? 'flag-outline' :
              item.type === 'offer' ? 'pricetag-outline' :
              'person-outline'
            } 
            size={20} 
            color={
              item.type === 'match' ? theme.colors.accent.neonGreen :
              item.type === 'booking' ? theme.colors.accent.orange :
              item.type === 'order' ? theme.colors.status.success :
              item.type === 'tournament' ? theme.colors.status.info :
              item.type === 'offer' ? theme.colors.status.warning :
              theme.colors.text.secondary
            } 
          />
        </View>
        {!item.read && <View style={styles.unreadIndicator} />}
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[
            styles.notificationTitle,
            { 
              fontWeight: item.read ? 'normal' : 'bold',
              color: item.read ? theme.colors.text.secondary : theme.colors.text.primary
            }
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={[
          styles.notificationMessage,
          { 
            color: item.read ? theme.colors.text.secondary : theme.colors.text.primary
          }
        ]}>
          {item.message}
        </Text>
        <View style={styles.notificationActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setNotifications(notifications.filter(n => n.id !== item.id))}
          >
            <Text style={styles.actionText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterContainer}
      >
        {notificationTypes.map((type) => (
          <TouchableOpacity 
            key={type.id}
            style={[
              styles.filterChip,
              { 
                backgroundColor: filter === type.id 
                  ? theme.colors.accent.neonGreen 
                  : theme.colors.background.card 
              }
            ]}
            onPress={() => setFilter(type.id)}
          >
            <Ionicons 
              name={type.icon as any} 
              size={16} 
              color={filter === type.id ? theme.colors.text.inverted : theme.colors.text.primary} 
            />
            <Text style={[
              styles.filterText,
              { 
                color: filter === type.id 
                  ? theme.colors.text.inverted 
                  : theme.colors.text.primary 
              }
            ]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationsContainer}
        showsVerticalScrollIndicator={false}
      />

      {filteredNotifications.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={60} color={theme.colors.text.disabled} />
          <Text style={styles.emptyStateTitle}>No notifications</Text>
          <Text style={styles.emptyStateSubtitle}>You're all caught up!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.small,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  markAllText: {
    fontSize: 14,
    color: theme.colors.accent.neonGreen,
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  notificationsContainer: {
    padding: theme.spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  notificationIconContainer: {
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.status.error,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  notificationTitle: {
    fontSize: 16,
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  notificationActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    marginRight: theme.spacing.sm,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});

export default NotificationsScreen;