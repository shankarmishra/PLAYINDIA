import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrderTrackingScreen = () => {
  const [orderStatus, setOrderStatus] = useState('Delivered'); // 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'

  const order = {
    id: 'ORD-2023-001',
    date: '15 Dec 2023',
    items: [
      { name: 'Professional Cricket Bat', quantity: 1, price: 2499 },
      { name: 'Cricket Helmet', quantity: 1, price: 1499 },
      { name: 'Cricket Gloves', quantity: 2, price: 899 },
    ],
    total: 4897,
    deliveryAddress: '123, Main Street, New Delhi - 110001',
    deliveryDate: '18 Dec 2023',
    deliveryTime: '10:00 AM - 12:00 PM',
  };

  const timeline = [
    { id: '1', status: 'Order Placed', time: '15 Dec 2023, 10:30 AM', completed: true },
    { id: '2', status: 'Processing', time: '15 Dec 2023, 11:15 AM', completed: true },
    { id: '3', status: 'Shipped', time: '16 Dec 2023, 2:30 PM', completed: true },
    { id: '4', status: 'Out for Delivery', time: '17 Dec 2023, 9:00 AM', completed: true },
    { id: '5', status: 'Delivered', time: '18 Dec 2023, 11:15 AM', completed: true },
  ];

  const deliveryPerson = {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Order Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>{orderStatus}</Text>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
        </View>
        
        <View style={styles.progressBar}>
          {timeline.map((item, index) => (
            <View key={item.id} style={styles.progressItem}>
              <View style={[
                styles.progressCircle,
                { 
                  backgroundColor: item.completed 
                    ? theme.colors.accent.neonGreen 
                    : theme.colors.background.tertiary 
                }
              ]}>
                {item.completed && (
                  <Ionicons name="checkmark" size={16} color={theme.colors.text.inverted} />
                )}
              </View>
              {index < timeline.length - 1 && (
                <View style={[
                  styles.progressLine,
                  { 
                    backgroundColor: index < timeline.findIndex(t => !t.completed) 
                      ? theme.colors.accent.neonGreen 
                      : theme.colors.background.tertiary 
                  }
                ]} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.statusDetails}>
          {timeline.map((item, index) => (
            <View key={item.id} style={styles.statusDetailItem}>
              <View style={styles.statusDetailCircle}>
                <View style={[
                  styles.statusDetailInnerCircle,
                  { 
                    backgroundColor: item.completed 
                      ? theme.colors.accent.neonGreen 
                      : theme.colors.background.tertiary 
                  }
                ]} />
              </View>
              <View style={styles.statusDetailContent}>
                <Text style={[
                  styles.statusDetailText,
                  { 
                    color: item.completed 
                      ? theme.colors.text.primary 
                      : theme.colors.text.disabled 
                  }
                ]}>
                  {item.status}
                </Text>
                <Text style={styles.statusDetailTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Delivery Person */}
      {orderStatus === 'Out for Delivery' && (
        <View style={styles.deliveryContainer}>
          <Text style={styles.sectionTitle}>Delivery Person</Text>
          <View style={styles.deliveryCard}>
            <Image source={{ uri: deliveryPerson.image }} style={styles.deliveryImage} />
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryName}>{deliveryPerson.name}</Text>
              <View style={styles.deliveryRating}>
                <Ionicons name="star" size={14} color={theme.colors.accent.orange} />
                <Text style={styles.deliveryRatingText}>{deliveryPerson.rating}</Text>
              </View>
              <Text style={styles.deliveryTime}>{order.deliveryTime}</Text>
            </View>
            <View style={styles.deliveryActions}>
              <TouchableOpacity style={styles.deliveryAction}>
                <Ionicons name="call" size={20} color={theme.colors.accent.neonGreen} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deliveryAction}>
                <Ionicons name="chatbubble-outline" size={20} color={theme.colors.accent.neonGreen} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Order Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
          </View>
        ))}
        <View style={styles.orderTotal}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{order.total}</Text>
        </View>
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={20} color={theme.colors.accent.neonGreen} />
          <Text style={styles.addressText}>{order.deliveryAddress}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      {orderStatus === 'Delivered' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Rate & Review</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Buy Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {orderStatus !== 'Delivered' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
  statusContainer: {
    backgroundColor: theme.colors.background.card,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.accent.neonGreen,
    marginBottom: theme.spacing.xs,
  },
  orderId: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLine: {
    position: 'absolute',
    top: 15,
    left: 30,
    right: -30,
    height: 2,
  },
  statusDetails: {
    marginLeft: theme.spacing.md,
  },
  statusDetailItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  statusDetailCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  statusDetailInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusDetailContent: {
    flex: 1,
  },
  statusDetailText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusDetailTime: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  deliveryContainer: {
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
  },
  deliveryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  deliveryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  deliveryRatingText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  deliveryTime: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  deliveryActions: {
    flexDirection: 'row',
  },
  deliveryAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    ...theme.shadows.small,
  },
  section: {
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  itemQuantity: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginHorizontal: theme.spacing.md,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent.neonGreen,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    margin: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.accent.neonGreen,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  actionButtonText: {
    color: theme.colors.text.inverted,
    fontWeight: 'bold',
    fontSize: 16,
  },
  supportButton: {
    backgroundColor: theme.colors.background.card,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.small,
  },
  supportButtonText: {
    color: theme.colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderTrackingScreen;