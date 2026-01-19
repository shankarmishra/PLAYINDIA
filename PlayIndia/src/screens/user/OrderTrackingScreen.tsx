import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserTabParamList } from '../../navigation/UserNav';

type NavigationProp = StackNavigationProp<UserTabParamList>;
type OrderTrackingRouteProp = RouteProp<UserTabParamList, 'OrderTracking'>;

const OrderTrackingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OrderTrackingRouteProp>();
  const orderId = route.params?.orderId || 'ORD-2024-001';
  
  const [orderStatus] = useState('Shipped'); // 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'

  // Mock order data - in real app, fetch from API using orderId
  const order = {
    id: orderId,
    date: '2024-01-15',
    items: [
      { name: 'Professional Cricket Bat', quantity: 1, price: 2499, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
      { name: 'Cricket Helmet', quantity: 1, price: 1499, image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
      { name: 'Cricket Gloves', quantity: 2, price: 899, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    ],
    total: 4897,
    deliveryAddress: '123, Main Street, New Delhi - 110001',
    deliveryDate: '2024-01-18',
    deliveryTime: '10:00 AM - 12:00 PM',
    paymentMethod: 'Cash on Delivery',
  };

  const timeline = [
    { id: '1', status: 'Order Placed', time: '15 Jan 2024, 10:30 AM', completed: true },
    { id: '2', status: 'Processing', time: '15 Jan 2024, 11:15 AM', completed: true },
    { id: '3', status: 'Shipped', time: '16 Jan 2024, 2:30 PM', completed: true },
    { id: '4', status: 'Out for Delivery', time: '17 Jan 2024, 9:00 AM', completed: false },
    { id: '5', status: 'Delivered', time: '18 Jan 2024, 11:15 AM', completed: false },
  ];

  const deliveryPerson = {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#10B981';
      case 'Shipped': return '#3B82F6';
      case 'Processing': return '#F59E0B';
      case 'Out for Delivery': return '#8B5CF6';
      default: return '#64748B';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.orderDate}>
                Placed on {new Date(order.date).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(orderStatus)}15` }]}>
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={getStatusColor(orderStatus)} 
              />
              <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
                {orderStatus}
              </Text>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.timeline}>
            {timeline.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    { 
                      backgroundColor: item.completed ? getStatusColor(item.status) : '#E2E8F0',
                      borderColor: item.completed ? getStatusColor(item.status) : '#CBD5E0',
                    }
                  ]}>
                    {item.completed && (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  {index < timeline.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      { 
                        backgroundColor: item.completed ? getStatusColor(item.status) : '#E2E8F0' 
                      }
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineStatus,
                    { color: item.completed ? '#0F172A' : '#94A3B8' }
                  ]}>
                    {item.status}
                  </Text>
                  <Text style={styles.timelineTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Person (if out for delivery) */}
        {orderStatus === 'Out for Delivery' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Person</Text>
            <View style={styles.deliveryCard}>
              <Image source={{ uri: deliveryPerson.image }} style={styles.deliveryImage} />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryName}>{deliveryPerson.name}</Text>
                <View style={styles.deliveryRating}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.deliveryRatingText}>{deliveryPerson.rating}</Text>
                </View>
                <Text style={styles.deliveryTime}>Expected: {order.deliveryTime}</Text>
              </View>
              <View style={styles.deliveryActions}>
                <TouchableOpacity style={styles.deliveryActionButton} activeOpacity={0.7}>
                  <Ionicons name="call" size={20} color="#1ED760" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deliveryActionButton} activeOpacity={0.7}>
                  <Ionicons name="chatbubble-outline" size={20} color="#1ED760" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.orderItemImage}
                resizeMode="cover"
              />
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemQuantity}>Quantity: {item.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>₹{(item.price * item.quantity).toLocaleString()}</Text>
            </View>
          ))}
          <View style={styles.orderTotalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{order.total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Ionicons name="location" size={20} color="#1ED760" />
            <Text style={styles.addressText}>{order.deliveryAddress}</Text>
          </View>
          <View style={styles.addressMeta}>
            <View style={styles.addressMetaItem}>
              <Ionicons name="calendar-outline" size={16} color="#64748B" />
              <Text style={styles.addressMetaText}>
                {new Date(order.deliveryDate).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </Text>
            </View>
            <View style={styles.addressMetaItem}>
              <Ionicons name="time-outline" size={16} color="#64748B" />
              <Text style={styles.addressMetaText}>{order.deliveryTime}</Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.paymentCard}>
            <Ionicons name="card-outline" size={20} color="#1ED760" />
            <Text style={styles.paymentText}>{order.paymentMethod}</Text>
            <Text style={styles.paymentStatus}>Paid</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {orderStatus === 'Delivered' ? (
          <>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>Reorder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Rate & Review</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.supportButton} activeOpacity={0.8}>
            <Ionicons name="help-circle-outline" size={20} color="#1F2937" />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#64748B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  timelineLine: {
    position: 'absolute',
    top: 32,
    width: 2,
    height: 40,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 13,
    color: '#94A3B8',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  deliveryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  deliveryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  deliveryRatingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  deliveryTime: {
    fontSize: 13,
    color: '#64748B',
  },
  deliveryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  deliveryActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 13,
    color: '#64748B',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1ED760',
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1ED760',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  addressMeta: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  addressMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressMetaText: {
    fontSize: 13,
    color: '#64748B',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  paymentText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  paymentStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1ED760',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '700',
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  supportButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OrderTrackingScreen;
