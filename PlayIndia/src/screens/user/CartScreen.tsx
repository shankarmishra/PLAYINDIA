import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for cart items
const mockCartItems = [
  {
    id: '1',
    name: 'Professional Cricket Bat',
    price: 2499,
    quantity: 1,
    image: 'https://via.placeholder.com/100',
    originalPrice: 3999,
    discount: 38,
  },
  {
    id: '2',
    name: 'Cricket Helmet',
    price: 1499,
    quantity: 1,
    image: 'https://via.placeholder.com/100',
    originalPrice: 1999,
    discount: 25,
  },
  {
    id: '3',
    name: 'Cricket Gloves',
    price: 899,
    quantity: 2,
    image: 'https://via.placeholder.com/100',
    originalPrice: 1199,
    discount: 25,
  },
];

const CartScreen = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [selectedAddress, setSelectedAddress] = useState(0);

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

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotalSavings = () => {
    return cartItems.reduce((sum, item) => {
      const savingsPerItem = ((item.originalPrice - item.price) * item.quantity);
      return sum + savingsPerItem;
    }, 0);
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <Text style={styles.itemDiscount}>{item.discount}% OFF</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Ionicons name="trash-outline" size={20} color={theme.colors.text.disabled} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.itemsContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.addressContainer}>
          {addresses.map((address, index) => (
            <TouchableOpacity 
              key={address.id}
              style={[
                styles.addressCard,
                { 
                  borderColor: selectedAddress === index 
                    ? theme.colors.accent.neonGreen 
                    : theme.colors.ui.border 
                }
              ]}
              onPress={() => setSelectedAddress(index)}
            >
              <View style={styles.addressHeader}>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressType}>{address.type}</Text>
              </View>
              <Text style={styles.addressText}>{address.phone}</Text>
              <Text style={styles.addressText}>{address.address}</Text>
              {selectedAddress === index && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color={theme.colors.accent.neonGreen} 
                  style={styles.selectedIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addAddressButton}>
          <Ionicons name="add" size={20} color={theme.colors.accent.neonGreen} />
          <Text style={styles.addAddressText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentContainer}>
          <TouchableOpacity style={styles.paymentOption}>
            <Ionicons name="card" size={20} color={theme.colors.text.primary} />
            <Text style={styles.paymentText}>Credit/Debit Card</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.disabled} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <Ionicons name="logo-google" size={20} color={theme.colors.text.primary} />
            <Text style={styles.paymentText}>Google Pay</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.disabled} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <Ionicons name="cash" size={20} color={theme.colors.text.primary} />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.disabled} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{calculateSubtotal()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>₹99</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>₹{Math.round(calculateSubtotal() * 0.18)}</Text>
        </View>
        <View style={[styles.summaryItem, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{calculateSubtotal() + 99 + Math.round(calculateSubtotal() * 0.18)}</Text>
        </View>
        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>You save</Text>
          <Text style={styles.savingsValue}>₹{calculateTotalSavings()}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>
          Proceed to Checkout - ₹{calculateSubtotal() + 99 + Math.round(calculateSubtotal() * 0.18)}
        </Text>
      </TouchableOpacity>
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
  itemsContainer: {
    padding: theme.spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent.neonGreen,
    marginBottom: theme.spacing.xs,
  },
  itemDiscount: {
    fontSize: 12,
    color: theme.colors.status.error,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  section: {
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
  addressContainer: {
    marginBottom: theme.spacing.md,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  addressHeader: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  addressType: {
    fontSize: 12,
    color: theme.colors.accent.neonGreen,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  addressText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  selectedIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.accent.neonGreen,
  },
  addAddressText: {
    color: theme.colors.accent.neonGreen,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: theme.spacing.sm,
  },
  paymentContainer: {
    marginBottom: theme.spacing.md,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
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
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.medium,
  },
  savingsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.status.success,
  },
  checkoutButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    margin: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  checkoutButtonText: {
    color: theme.colors.text.inverted,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CartScreen;