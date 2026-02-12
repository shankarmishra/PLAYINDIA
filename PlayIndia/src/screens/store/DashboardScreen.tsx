import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';
import useAuth from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<StoreTabParamList>;

interface DashboardStats {
  totalProducts: number;
  todayOrders: number;
  monthlyRevenue: number;
  pendingOrders: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  userId?: {
    name: string;
    email: string;
  };
}

interface TopProduct {
  _id: string;
  name: string;
  price: number;
  'analytics.purchases'?: number;
}

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [storeData, setStoreData] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [hasStoreProfile, setHasStoreProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get dashboard data
      let dashboardResponse: any;
      try {
        dashboardResponse = await ApiService.stores.getDashboard();
      } catch (dashboardErr: any) {
        // If dashboard fails, try profile API as fallback
        if (dashboardErr.response?.status === 404) {
          try {
            const profileResponse = await ApiService.stores.getMyProfile();
            if (profileResponse.data?.success) {
              const profileData = profileResponse.data.data;
              setStoreData(profileData);
              setHasStoreProfile(!!profileData.storeName);
              // Set default stats
              setStats({
                totalProducts: 0,
                todayOrders: 0,
                monthlyRevenue: 0,
                pendingOrders: 0,
                totalOrders: 0,
                completedOrders: 0,
                totalRevenue: 0,
              });
              setRecentOrders([]);
              setTopProducts([]);
              setLoading(false);
              return;
            }
          } catch (profileErr: any) {
            // Profile also failed - store doesn't exist
            setHasStoreProfile(false);
            setStoreData(null);
            setStats({
              totalProducts: 0,
              todayOrders: 0,
              monthlyRevenue: 0,
              pendingOrders: 0,
              totalOrders: 0,
              completedOrders: 0,
              totalRevenue: 0,
            });
            setRecentOrders([]);
            setTopProducts([]);
            setLoading(false);
            return;
          }
        }
        throw dashboardErr;
      }
      
      if (dashboardResponse.data && dashboardResponse.data.success) {
        const data = dashboardResponse.data.data;
        setStoreData(data.store || {});
        setHasStoreProfile(!!(data.store?.storeName));
        
        // Map stats to match website format
        const statsData = data.stats || {};
        setStats({
          totalProducts: statsData.totalProducts || 0,
          todayOrders: statsData.todayOrders || 0,
          monthlyRevenue: statsData.totalRevenue || statsData.monthlyRevenue || 0,
          pendingOrders: statsData.pendingOrders || 0,
          totalOrders: statsData.totalOrders || 0,
          completedOrders: statsData.completedOrders || 0,
          totalRevenue: statsData.totalRevenue || 0,
        });
        setRecentOrders(data.sections?.recentOrders || []);
        setTopProducts(data.sections?.topSellingProducts || []);
        setWalletBalance(data.store?.walletBalance || 0);
      } else {
        // Response not successful, try profile API
        try {
          const profileResponse = await ApiService.stores.getMyProfile();
          if (profileResponse.data?.success) {
            const profileData = profileResponse.data.data;
            setStoreData(profileData);
            setHasStoreProfile(!!profileData.storeName);
          }
        } catch (profileErr) {
          setHasStoreProfile(false);
        }
      }
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      setError('Failed to load dashboard data');
      // Set default empty stats on error
      setStats({
        totalProducts: 0,
        todayOrders: 0,
        monthlyRevenue: 0,
        pendingOrders: 0,
        totalOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
      });
      setRecentOrders([]);
      setTopProducts([]);
      setWalletBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Store Photo */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.storePhotoContainer}
          >
            {(() => {
              // Try multiple possible locations for store photo
              const storePhoto = 
                storeData?.documents?.additionalDocs?.[0] ||
                storeData?.documents?.additionalDocs?.[1] ||
                storeData?.storePhoto ||
                storeData?.photo;
              
              if (storePhoto) {
                return (
                  <Image
                    source={{ uri: storePhoto }}
                    style={styles.storePhoto}
                    resizeMode="cover"
                    onError={(error) => {
                      console.log('Dashboard store photo load error:', error);
                    }}
                  />
                );
              }
              return (
                <View style={[styles.storePhoto, styles.storePhotoPlaceholder]}>
                  <Ionicons name="storefront" size={24} color="#9CA3AF" />
                </View>
              );
            })()}
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              Hi {user?.name || 'Store Owner'}, Welcome Back!
            </Text>
            <Text style={styles.headerSubtitle}>
              Manage your sports store and track your sales
            </Text>
            {storeData?.storeName && (
              <Text style={styles.storeNameText}>
                Store: {storeData.storeName}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.profileButton}
        >
          <Ionicons name="settings-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Warning Banner for Missing Profile */}
      {!hasStoreProfile && !loading && (
        <View style={styles.warningBanner}>
          <View style={styles.warningContent}>
            <Ionicons name="warning-outline" size={20} color="#F59E0B" />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Store profile not found.</Text>
              <Text style={styles.warningText}>
                Please complete your store registration to access all features.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.warningButton}
            onPress={() => {
              // Navigate to registration - you may need to add this route
              Alert.alert('Registration', 'Please complete your store registration');
            }}
          >
            <Text style={styles.warningButtonText}>Complete Registration</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Wallet Balance Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Ionicons name="wallet-outline" size={24} color="#1ED760" />
            <Text style={styles.walletLabel}>Available Balance</Text>
          </View>
          <Text style={styles.walletAmount}>
            {formatCurrency(walletBalance)}
          </Text>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => {/* Navigate to wallet */}}
          >
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid - Matching Website */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>Total Products</Text>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>
              {stats.totalProducts}
            </Text>
            <Text style={styles.statLabel}>Listed products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>Today's Orders</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>
              {stats.todayOrders}
            </Text>
            <Text style={styles.statLabel}>New orders today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>Monthly Revenue</Text>
            <Text style={[styles.statValue, { color: '#3B82F6' }]}>
              {formatCurrency(stats.monthlyRevenue)}
            </Text>
            <Text style={styles.statLabel}>This month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>Pending Orders</Text>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>
              {stats.pendingOrders}
            </Text>
            <Text style={styles.statLabel}>Awaiting processing</Text>
          </View>
        </View>

        {/* Quick Actions - Matching Website */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('ListProduct')}
            >
              <Text style={styles.quickActionIcon}>➕</Text>
              <Text style={styles.quickActionText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.quickActionIcon}>📦</Text>
              <Text style={styles.quickActionText}>View Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Inventory')}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Manage Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Ads')}
            >
              <Text style={styles.quickActionIcon}>📢</Text>
              <Text style={styles.quickActionText}>Run Ads</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentOrders.length > 0 ? (
            recentOrders.slice(0, 5).map((order) => (
              <View key={order._id} style={styles.orderItem}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderNumber}>
                    #{order.orderNumber || order.orderId || order._id.slice(-6)}
                  </Text>
                  <Text style={styles.orderCustomer}>
                    {order.userId?.name || 'Unknown Customer'}
                  </Text>
                  <Text style={styles.orderDate}>
                    {formatDate(order.createdAt)}
                  </Text>
                </View>
                <View style={styles.orderRight}>
                  <Text style={styles.orderAmount}>
                    {formatCurrency(order.totalAmount)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          order.status === 'delivered'
                            ? '#D1FAE5'
                            : order.status === 'processing'
                            ? '#FEF3C7'
                            : order.status === 'shipped'
                            ? '#DBEAFE'
                            : '#F3F4F6',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            order.status === 'delivered'
                              ? '#10B981'
                              : order.status === 'processing'
                              ? '#F59E0B'
                              : order.status === 'shipped'
                              ? '#3B82F6'
                              : '#6B7280',
                        },
                      ]}
                    >
                      {order.status || 'Pending'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No orders yet</Text>
              <Text style={styles.emptySubtext}>
                Start by adding products to your store!
              </Text>
              <TouchableOpacity
                style={styles.addProductButton}
                onPress={() => navigation.navigate('ListProduct')}
              >
                <Text style={styles.addProductButtonText}>Add Products</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>


        {/* Top Selling Products */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Products</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ManageProducts')}
            >
              <Text style={styles.seeAllText}>Manage</Text>
            </TouchableOpacity>
          </View>
          {topProducts.length > 0 ? (
            topProducts.slice(0, 3).map((product, index) => (
              <View key={product._id} style={styles.productItem}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name || 'Product Name'}</Text>
                  <Text style={styles.productBrand}>
                    Brand: {product.brand || 'N/A'}
                  </Text>
                  <Text style={styles.productPrice}>
                    Price: {formatCurrency(product.price?.selling || product.price || 0)}
                  </Text>
                </View>
                <View style={styles.productSales}>
                  <Text style={styles.salesText}>
                    Sold: {product['analytics.purchases'] || product.soldCount || 0} units
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ListProduct', { productId: product._id })}
                  >
                    <Text style={styles.editLink}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No products yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first product to get started!
              </Text>
              <TouchableOpacity
                style={styles.addProductButton}
                onPress={() => navigation.navigate('ListProduct')}
              >
                <Text style={styles.addProductButtonText}>Add Product</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storePhotoContainer: {
    marginRight: 16,
  },
  storePhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#1ED760',
  },
  storePhotoPlaceholder: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  storeNameText: {
    fontSize: 13,
    color: '#1ED760',
    fontWeight: '600',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  warningTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
  },
  warningButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  warningButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  walletCard: {
    backgroundColor: '#1ED760',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  withdrawButtonText: {
    color: '#1ED760',
    fontSize: 14,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginHorizontal: -6,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1ED760',
    fontWeight: '600',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  earningsItem: {
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  earningsDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  productSales: {
    alignItems: 'flex-end',
  },
  salesText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  editLink: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  addProductButton: {
    marginTop: 16,
    backgroundColor: '#1ED760',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addProductButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 64) / 2 - 12, // 2 columns with spacing
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DashboardScreen;
