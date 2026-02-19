import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserTabParamList } from '../../navigation/types';
import { useCart } from '../../contexts/CartContext';

type NavigationProp = StackNavigationProp<UserTabParamList>;

const CartScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    getCartTotal,
    getTotalSavings,
    clearCart
  } = useCart();

  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState('cod');

  const addresses = [
    {
      id: '1',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      address: '123, Main Street, New Delhi - 110001',
      type: 'Home',
    },
    {
      id: '2',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      address: '456, Sector 15, Gurgaon - 122001',
      type: 'Office',
    },
  ];

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: 'cash-outline' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
    { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline' },
    { id: 'wallet', name: 'Wallet', icon: 'wallet-outline' },
  ];

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert(
      'Remove Item',
      `Remove ${name} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(id)
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to cart first');
      return;
    }
    navigation.navigate('Checkout', {
      addressId: addresses[selectedAddress].id,
      paymentMethod: selectedPayment,
    });
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
          {item.originalPrice && (
            <Text style={styles.itemOriginalPrice}>₹{item.originalPrice.toLocaleString()}</Text>
          )}
        </View>
        <View style={styles.row}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.quantityBtn}>
              <Ionicons name="remove" size={16} color="#1B5E20" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.quantityBtn}>
              <Ionicons name="add" size={16} color="#1B5E20" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleRemoveItem(item.id, item.name)} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const subtotal = getCartSubtotal();
  const delivery = 99;
  const tax = Math.round(subtotal * 0.18);
  const total = getCartTotal();
  const savings = getTotalSavings();

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#C8E6C9" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Start shopping for India's best sports gear!</Text>
          <TouchableOpacity style={styles.shopNowBtn} onPress={() => navigation.navigate('ShopHome')}>
            <Text style={styles.shopNowBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity onPress={() => clearCart()} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cart Items ({cartItems.length})</Text>
          {cartItems.map((item) => (
            <View key={item.id}>{renderCartItem({ item })}</View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {addresses.map((address, index) => (
            <TouchableOpacity
              key={address.id}
              style={[styles.addressCard, selectedAddress === index && styles.addressCardActive]}
              onPress={() => setSelectedAddress(index)}
            >
              <View style={styles.addressHeader}>
                <View style={styles.addressRow}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <View style={styles.badge}><Text style={styles.badgeText}>{address.type}</Text></View>
                </View>
                {selectedAddress === index && (
                  <Ionicons name="checkmark-circle" size={22} color="#2E7D32" />
                )}
              </View>
              <Text style={styles.addressText}>{address.phone}</Text>
              <Text style={styles.addressText}>{address.address}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentGrid}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentCard, selectedPayment === method.id && styles.paymentCardActive]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <Ionicons name={method.icon as any} size={20} color={selectedPayment === method.id ? '#FFFFFF' : '#1B5E20'} />
                <Text style={[styles.paymentLabel, selectedPayment === method.id && styles.paymentLabelActive]} numberOfLines={1}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billItem}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.billItem}>
            <Text style={styles.billLabel}>Delivery Charges</Text>
            <Text style={styles.billValue}>₹{delivery}</Text>
          </View>
          <View style={styles.billItem}>
            <Text style={styles.billLabel}>GST (18%)</Text>
            <Text style={styles.billValue}>₹{tax}</Text>
          </View>
          <View style={[styles.billItem, styles.totalBill]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
          </View>
          {savings > 0 && (
            <View style={styles.savingsBadge}>
              <Ionicons name="gift-outline" size={16} color="#166534" />
              <Text style={styles.savingsText}>You saved ₹{savings.toLocaleString()} on this order!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerLabel}>Grand Total</Text>
          <Text style={styles.footerValue}>₹{total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
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
  clearBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0FDF4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FDF4',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2E7D32',
  },
  itemOriginalPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 4,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 12,
  },
  removeBtn: {
    padding: 4,
  },
  addressCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  addressCardActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#F0FDF4',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  badge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  addressText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  paymentCardActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B5E20',
  },
  paymentLabelActive: {
    color: '#FFFFFF',
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalBill: {
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0FDF4',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },
  savingsText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0FDF4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerTotal: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  footerValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2E7D32',
  },
  checkoutBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B5E20',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 24,
  },
  shopNowBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  shopNowBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default CartScreen;
