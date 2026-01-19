import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserTabParamList } from '../../navigation/UserNav';
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
    // Navigate to checkout or process order
    navigation.navigate('Checkout', { 
      addressId: addresses[selectedAddress].id,
      paymentMethod: selectedPayment,
    });
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        {item.size && (
          <Text style={styles.itemSize}>Size: {item.size}</Text>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
          {item.originalPrice && (
            <Text style={styles.itemOriginalPrice}>₹{item.originalPrice.toLocaleString()}</Text>
          )}
        </View>
        {item.discount && (
          <Text style={styles.itemDiscount}>{item.discount}% OFF</Text>
        )}
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={18} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={18} color="#1F2937" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        onPress={() => handleRemoveItem(item.id, item.name)}
        activeOpacity={0.7}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
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
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#CBD5E0" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add items to get started</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('ShopHome')}
            activeOpacity={0.8}
          >
            <Text style={styles.shopButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity 
          onPress={() => {
            Alert.alert(
              'Clear Cart',
              'Remove all items from cart?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Clear', 
                  style: 'destructive',
                  onPress: clearCart
                },
              ]
            );
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cart Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({cartItems.length})</Text>
          {cartItems.map((item) => (
            <View key={item.id}>
              {renderCartItem({ item })}
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {addresses.map((address, index) => (
            <TouchableOpacity 
              key={address.id}
              style={[
                styles.addressCard,
                { 
                  borderColor: selectedAddress === index 
                    ? '#1ED760' 
                    : '#E2E8F0' 
                }
              ]}
              onPress={() => setSelectedAddress(index)}
              activeOpacity={0.7}
            >
              <View style={styles.addressHeader}>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <View style={styles.addressTypeBadge}>
                    <Text style={styles.addressType}>{address.type}</Text>
                  </View>
                </View>
                {selectedAddress === index && (
                  <Ionicons name="checkmark-circle" size={24} color="#1ED760" />
                )}
              </View>
              <Text style={styles.addressText}>{address.phone}</Text>
              <Text style={styles.addressText}>{address.address}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addAddressButton} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={20} color="#1ED760" />
            <Text style={styles.addAddressText}>Add New Address</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity 
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.paymentOptionActive
              ]}
              onPress={() => setSelectedPayment(method.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={method.icon as any} 
                size={22} 
                color={selectedPayment === method.id ? '#1ED760' : '#64748B'} 
              />
              <Text style={[
                styles.paymentText,
                selectedPayment === method.id && styles.paymentTextActive
              ]}>
                {method.name}
              </Text>
              {selectedPayment === method.id && (
                <Ionicons name="checkmark-circle" size={20} color="#1ED760" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Delivery Charges</Text>
            <Text style={styles.summaryValue}>₹{delivery}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
            <Text style={styles.summaryValue}>₹{tax}</Text>
          </View>
          {savings > 0 && (
            <View style={styles.savingsRow}>
              <Text style={styles.savingsLabel}>You save</Text>
              <Text style={styles.savingsValue}>₹{savings.toLocaleString()}</Text>
            </View>
          )}
          <View style={[styles.summaryItem, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total Amount</Text>
          <Text style={styles.footerTotalValue}>₹{total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
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
  clearText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
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
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#94A3B8',
    marginBottom: 32,
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
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#F8FAFC',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1ED760',
  },
  itemOriginalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  itemDiscount: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '700',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  addressCard: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  addressTypeBadge: {
    backgroundColor: '#1ED760',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addressType: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addressText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1ED760',
    borderStyle: 'dashed',
    gap: 8,
  },
  addAddressText: {
    color: '#1ED760',
    fontWeight: '700',
    fontSize: 15,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  paymentOptionActive: {
    borderColor: '#1ED760',
    backgroundColor: '#F0FDF4',
  },
  paymentText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  paymentTextActive: {
    color: '#1ED760',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  savingsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 8,
    paddingTop: 12,
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
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerTotalLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  footerTotalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1ED760',
  },
  checkoutButton: {
    backgroundColor: '#1ED760',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default CartScreen;
