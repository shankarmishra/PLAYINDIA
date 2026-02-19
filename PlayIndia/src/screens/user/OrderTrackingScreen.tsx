import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserTabParamList } from '../../navigation/types';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/constants';
import ChatBot from '../../components/ChatBot';

type NavigationProp = StackNavigationProp<UserTabParamList>;
type OrderTrackingRouteProp = RouteProp<UserTabParamList, 'OrderTracking'>;

const OrderTrackingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OrderTrackingRouteProp>();
  const orderId = route.params?.orderId || 'ORD-2024-001';

  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('Processing');
  const [order, setOrder] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [deliveryPerson, setDeliveryPerson] = useState<any>(null);
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_ENDPOINTS.ORDERS.DETAIL(orderId)}`);
      if (response.data && response.data.success) {
        const orderData = response.data.data;
        setOrder(orderData);
        const status = orderData.status || 'Processing';
        setOrderStatus(status);
        generateTimeline(status, orderData.createdAt || new Date().toISOString());
        setDeliveryPerson(orderData.deliveryPerson);
      }
    } catch (error) {
      generateTimeline('Shipped', new Date().toISOString());
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = (status: string, createdAt: string) => {
    const statuses = [
      { key: 'placed', label: 'Order Placed', completed: true },
      { key: 'processing', label: 'Processing', completed: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status) },
      { key: 'shipped', label: 'Shipped', completed: ['Shipped', 'Out for Delivery', 'Delivered'].includes(status) },
      { key: 'out_for_delivery', label: 'Out for Delivery', completed: ['Out for Delivery', 'Delivered'].includes(status) },
      { key: 'delivered', label: 'Delivered', completed: status === 'Delivered' },
    ];

    setTimeline(statuses.map((s, i) => ({
      id: String(i + 1),
      status: s.label,
      time: s.completed ? 'Updated' : 'Pending',
      completed: s.completed,
    })));
  };

  const currentOrder = order || {
    id: orderId,
    deliveryDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    deliveryAddress: '123, Stadium Link Road, New Delhi',
    paymentMethod: 'Prepaid (Wallet)',
    items: [{ name: 'Premium Cricket Bat', quantity: 1, price: 2499, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200' }]
  };

  const courier = deliveryPerson || {
    name: 'Amit Kumar',
    rating: 4.9,
    image: 'https://randomuser.me/api/portraits/men/45.jpg'
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (showChatBot) return <ChatBot onClose={() => setShowChatBot(false)} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaLabel}>Order ID</Text>
              <Text style={styles.metaValue}>#{currentOrder.id}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{orderStatus}</Text>
            </View>
          </View>

          <View style={styles.timeline}>
            {timeline.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.dot, item.completed ? styles.dotActive : styles.dotInactive]}>
                    {item.completed && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                  </View>
                  {index < timeline.length - 1 && (
                    <View style={[styles.line, item.completed && timeline[index + 1].completed ? styles.lineActive : styles.lineInactive]} />
                  )}
                </View>
                <View style={styles.timelineRight}>
                  <Text style={[styles.stepTitle, item.completed ? styles.textActive : styles.textInactive]}>{item.status}</Text>
                  <Text style={styles.stepTime}>{item.completed ? 'Completed' : 'Expected'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.courierCard}>
            <Image source={{ uri: courier.image }} style={styles.courierImg} />
            <View style={styles.courierInfo}>
              <Text style={styles.courierName}>{courier.name}</Text>
              <View style={styles.ratingBox}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingText}>{courier.rating}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.addressCard}>
            <View style={styles.iconBox}>
              <Ionicons name="location" size={20} color="#2E7D32" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Shipping Address</Text>
              <Text style={styles.addressText}>{currentOrder.deliveryAddress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Order summary</Text>
          {currentOrder.items.map((item: any, i: number) => (
            <View key={i} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImg} />
              <View style={styles.itemMeta}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Quantity: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.supportBtn} onPress={() => setShowChatBot(true)}>
          <Text style={styles.supportBtnText}>Need Help?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.doneBtnText}>Back to Orders</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: '#C8E6C9' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  statusCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  metaLabel: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  metaValue: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  statusBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusBadgeText: { fontSize: 12, fontWeight: '800', color: '#2E7D32' },
  timeline: { marginLeft: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 12 },
  timelineLeft: { alignItems: 'center', marginRight: 16, width: 22 },
  dot: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  dotActive: { backgroundColor: '#2E7D32' },
  dotInactive: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E2E8F0' },
  line: { width: 3, position: 'absolute', top: 22, bottom: -12, zIndex: 1 },
  lineActive: { backgroundColor: '#2E7D32' },
  lineInactive: { backgroundColor: '#E2E8F0' },
  timelineRight: { flex: 1, paddingBottom: 15 },
  stepTitle: { fontSize: 15, fontWeight: '800' },
  stepTime: { fontSize: 12, color: '#64748B', marginTop: 2 },
  textActive: { color: '#0F172A' },
  textInactive: { color: '#94A3B8' },
  infoSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1B5E20', marginBottom: 12, marginLeft: 4 },
  courierCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C8E6C9' },
  courierImg: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#F1F5F9' },
  courierInfo: { flex: 1, marginLeft: 16 },
  courierName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 13, color: '#64748B', marginLeft: 4, fontWeight: '700' },
  callBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center' },
  addressCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#C8E6C9' },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' },
  addressInfo: { flex: 1, marginLeft: 12 },
  addressLabel: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },
  addressText: { fontSize: 14, color: '#0F172A', fontWeight: '700', marginTop: 2 },
  itemsSection: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  itemImg: { width: 44, height: 44, borderRadius: 8 },
  itemMeta: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  itemQty: { fontSize: 12, color: '#64748B' },
  itemPrice: { fontSize: 15, fontWeight: '900', color: '#2E7D32' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FFFFFF', flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#C8E6C9' },
  supportBtn: { flex: 1, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#2E7D32' },
  supportBtnText: { fontSize: 16, fontWeight: '800', color: '#2E7D32' },
  doneBtn: { flex: 1, height: 54, borderRadius: 16, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center' },
  doneBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
});

export default OrderTrackingScreen;
