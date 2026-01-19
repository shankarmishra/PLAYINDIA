import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserTabParamList } from '../../navigation/UserNav';

type NavigationProp = StackNavigationProp<UserTabParamList>;

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'Delivered',
    total: 4897,
    items: [
      { name: 'Professional Cricket Bat', quantity: 1, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
      { name: 'Cricket Helmet', quantity: 1, image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-12',
    status: 'Shipped',
    total: 2199,
    items: [
      { name: 'Tennis Racket Pro', quantity: 1, image: 'https://images.unsplash.com/photo-1622163642992-6c4ad786e58a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-10',
    status: 'Processing',
    total: 1299,
    items: [
      { name: 'Badminton Racket Pro', quantity: 1, image: 'https://images.unsplash.com/photo-1622163642992-6c4ad786e58a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    ],
  },
  {
    id: 'ORD-2024-004',
    date: '2024-01-08',
    status: 'Cancelled',
    total: 899,
    items: [
      { name: 'Football', quantity: 1, image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    ],
  },
];

const MyOrdersScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [orders, setOrders] = useState(mockOrders);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const filters = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = selectedFilter === 'All' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#10B981';
      case 'Shipped': return '#3B82F6';
      case 'Processing': return '#F59E0B';
      case 'Cancelled': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return 'checkmark-circle';
      case 'Shipped': return 'car';
      case 'Processing': return 'time';
      case 'Cancelled': return 'close-circle';
      default: return 'ellipse';
    }
  };

  const renderOrder = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.orderCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.date).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
          <Ionicons 
            name={getStatusIcon(item.status) as any} 
            size={14} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((orderItem: any, index: number) => (
          <View key={index} style={styles.orderItem}>
            <Image 
              source={{ uri: orderItem.image }} 
              style={styles.orderItemImage}
              resizeMode="cover"
            />
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {orderItem.name}
              </Text>
              <Text style={styles.orderItemQuantity}>Qty: {orderItem.quantity}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotalLabel}>Total Amount</Text>
        <Text style={styles.orderTotal}>₹{item.total.toLocaleString()}</Text>
      </View>

      <View style={styles.orderActions}>
        {item.status === 'Delivered' && (
          <>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Text style={styles.actionButtonText}>Reorder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} activeOpacity={0.7}>
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Rate & Review</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'Shipped' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
          >
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Track Order</Text>
          </TouchableOpacity>
        )}
        {item.status === 'Processing' && (
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#CBD5E0" />
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubtext}>
            {selectedFilter === 'All' 
              ? 'You haven\'t placed any orders yet' 
              : `No ${selectedFilter.toLowerCase()} orders`}
          </Text>
          {selectedFilter !== 'All' && (
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => setSelectedFilter('All')}
            >
              <Text style={styles.clearFilterText}>Show All Orders</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('ShopHome')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#1ED760',
    borderColor: '#1ED760',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  ordersList: {
    padding: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
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
  orderItems: {
    marginBottom: 16,
    gap: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: '#64748B',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 16,
  },
  orderTotalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1ED760',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1ED760',
    borderColor: '#1ED760',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
  },
  clearFilterButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1ED760',
    marginBottom: 16,
  },
  clearFilterText: {
    color: '#1ED760',
    fontSize: 15,
    fontWeight: '700',
  },
  shopButton: {
    backgroundColor: '#1ED760',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MyOrdersScreen;
