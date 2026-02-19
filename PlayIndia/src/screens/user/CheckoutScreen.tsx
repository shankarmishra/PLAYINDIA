import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserTabParamList } from '../../navigation/types';
import { useCart } from '../../contexts/CartContext';

type NavigationProp = StackNavigationProp<UserTabParamList>;
type CheckoutRouteProp = RouteProp<UserTabParamList, 'Checkout'>;

const CheckoutScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CheckoutRouteProp>();
  const { cartItems, getCartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [selectedPayment] = useState(route.params?.paymentMethod || 'cod');

  const total = getCartTotal();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const deliveryFee = 99;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const orderId = `ORD-${Date.now()}`;
      Alert.alert(
        'Order Placed!',
        `Your order has been placed successfully.\nOrder ID: ${orderId}`,
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              navigation.navigate('OrderTracking', { orderId });
            },
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Review Items</Text>
          <View style={styles.sectionCard}>
            {cartItems.map((item, index) => (
              <View key={item.id} style={[styles.orderItem, index === cartItems.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.itemTotal}>₹{(item.price * item.quantity).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentIconBox}>
              <Ionicons
                name={selectedPayment === 'cod' ? 'cash' : 'card'}
                size={24}
                color="#2E7D32"
              />
            </View>
            <View style={styles.paymentMeta}>
              <Text style={styles.paymentName}>
                {selectedPayment === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </Text>
              <Text style={styles.paymentDesc}>Secure transaction guaranteed</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (18%)</Text>
              <Text style={styles.summaryValue}>₹{tax.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.termsBox}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#64748B" />
          <Text style={styles.termsText}>Secure checkout powered by PLAYINDIA</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerLabel}>Total Amount</Text>
          <Text style={styles.footerValue}>₹{total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeBtn, loading && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.placeBtnText}>Confirm Order</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: '#C8E6C9' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  scrollContent: { padding: 16, paddingBottom: 120 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1B5E20', marginBottom: 12, marginLeft: 4 },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0FDF4' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  itemPrice: { fontSize: 13, color: '#64748B', marginTop: 2 },
  itemTotal: { fontSize: 16, fontWeight: '800', color: '#1B5E20' },
  paymentCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#2E7D32' },
  paymentIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' },
  paymentMeta: { flex: 1, marginLeft: 16 },
  paymentName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  paymentDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  summaryValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  totalRow: { borderTopWidth: 2, borderTopColor: '#F0FDF4', borderStyle: 'dashed', marginTop: 10, paddingTop: 16 },
  totalLabel: { fontSize: 18, fontWeight: '900', color: '#1B5E20' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#2E7D32' },
  termsBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 },
  termsText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#C8E6C9', flexDirection: 'row', alignItems: 'center', gap: 16 },
  footerPrice: { flex: 1 },
  footerLabel: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  footerValue: { fontSize: 20, fontWeight: '900', color: '#1B5E20' },
  placeBtn: { flex: 2, height: 60, borderRadius: 20, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  placeBtnDisabled: { opacity: 0.6 },
  placeBtnText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
});

export default CheckoutScreen;
