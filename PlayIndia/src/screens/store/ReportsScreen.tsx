import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<StoreTabParamList>;

interface ReportData {
  sales: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
    returning: number;
  };
}

const ReportsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState('this-month');
  const [reportType, setReportType] = useState<'sales' | 'orders' | 'products' | 'customers'>('sales');

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      // Get dashboard data for reports
      const dashboardResponse = await ApiService.stores.getDashboard();
      const profileResponse = await ApiService.stores.getMyProfile();
      
      if (dashboardResponse.data && dashboardResponse.data.success && 
          profileResponse.data && profileResponse.data.success) {
        const dashboardData = dashboardResponse.data.data;
        const stats = dashboardData.stats || {};
        const storeId = profileResponse.data.data._id;
        
        // Get products for product stats
        const productsResponse = await ApiService.stores.getProducts(storeId);
        const products = productsResponse.data?.data || [];
        
        // Get orders for order stats
        const ordersResponse = await ApiService.orders.getStoreOrders();
        const orders = ordersResponse.data?.data || [];
        
        const thisMonthOrders = orders.filter((o: any) => {
          const orderDate = new Date(o.createdAt);
          const now = new Date();
          return orderDate.getMonth() === now.getMonth() && 
                 orderDate.getFullYear() === now.getFullYear();
        });
        
        const lastMonthOrders = orders.filter((o: any) => {
          const orderDate = new Date(o.createdAt);
          const now = new Date();
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return orderDate.getMonth() === lastMonth.getMonth() && 
                 orderDate.getFullYear() === lastMonth.getFullYear();
        });
        
        const thisMonthRevenue = thisMonthOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        const growth = lastMonthRevenue > 0 
          ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
          : 0;
        
        const lowStockProducts = products.filter((p: any) => {
          const qty = p.inventory?.quantity || 0;
          const threshold = p.inventory?.lowStockThreshold || 10;
          return qty > 0 && qty <= threshold;
        });
        
        const outOfStockProducts = products.filter((p: any) => (p.inventory?.quantity || 0) === 0);
        
        // Get unique customers
        const customerIds = new Set(orders.map((o: any) => o.userId?._id || o.userId));
        const thisMonthCustomerIds = new Set(thisMonthOrders.map((o: any) => o.userId?._id || o.userId));
        
        setReportData({
          sales: {
            total: stats.totalRevenue || 0,
            thisMonth: thisMonthRevenue,
            lastMonth: lastMonthRevenue,
            growth: growth,
          },
          orders: {
            total: stats.totalOrders || 0,
            completed: orders.filter((o: any) => o.status === 'delivered').length,
            cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
            pending: orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length,
          },
          products: {
            total: products.length,
            active: products.filter((p: any) => p.availability?.isActive).length,
            lowStock: lowStockProducts.length,
            outOfStock: outOfStockProducts.length,
          },
          customers: {
            total: customerIds.size,
            newThisMonth: thisMonthCustomerIds.size,
            returning: customerIds.size - thisMonthCustomerIds.size,
          },
        });
      }
    } catch (error: any) {
      console.error('Error loading reports:', error);
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const exportReport = () => {
    Alert.alert('Export Report', 'Report export feature coming soon!');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity onPress={exportReport} style={styles.exportButton}>
          <Ionicons name="download-outline" size={24} color="#1ED760" />
        </TouchableOpacity>
      </View>

      {/* Report Type Selector */}
      <View style={styles.typeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['sales', 'orders', 'products', 'customers'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeChip,
                reportType === type && styles.typeChipActive,
              ]}
              onPress={() => setReportType(type as any)}
            >
              <Text
                style={[
                  styles.typeChipText,
                  reportType === type && styles.typeChipTextActive,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Date Range */}
      <View style={styles.dateContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['this-month', 'last-month', 'this-year', 'all-time'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.dateChip,
                dateRange === range && styles.dateChipActive,
              ]}
              onPress={() => setDateRange(range)}
            >
              <Text
                style={[
                  styles.dateChipText,
                  dateRange === range && styles.dateChipTextActive,
                ]}
              >
                {range.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Sales Report */}
        {reportType === 'sales' && reportData && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Sales Report</Text>
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Total Sales</Text>
                <Text style={styles.metricValue}>
                  {formatCurrency(reportData.sales.total)}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>This Month</Text>
                <Text style={styles.metricValue}>
                  {formatCurrency(reportData.sales.thisMonth)}
                </Text>
              </View>
            </View>
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Last Month</Text>
                <Text style={styles.metricValue}>
                  {formatCurrency(reportData.sales.lastMonth)}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Growth</Text>
                <Text style={[
                  styles.metricValue,
                  { color: reportData.sales.growth >= 0 ? '#10B981' : '#EF4444' }
                ]}>
                  {reportData.sales.growth >= 0 ? '+' : ''}
                  {reportData.sales.growth.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Orders Report */}
        {reportType === 'orders' && reportData && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Orders Report</Text>
            <View style={styles.metricGrid}>
              <View style={styles.metricCard}>
                <Ionicons name="cart-outline" size={24} color="#3B82F6" />
                <Text style={styles.metricValue}>{reportData.orders.total}</Text>
                <Text style={styles.metricLabel}>Total Orders</Text>
              </View>
              <View style={styles.metricCard}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
                <Text style={styles.metricValue}>{reportData.orders.completed}</Text>
                <Text style={styles.metricLabel}>Completed</Text>
              </View>
              <View style={styles.metricCard}>
                <Ionicons name="time-outline" size={24} color="#F59E0B" />
                <Text style={styles.metricValue}>{reportData.orders.pending}</Text>
                <Text style={styles.metricLabel}>Pending</Text>
              </View>
              <View style={styles.metricCard}>
                <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
                <Text style={styles.metricValue}>{reportData.orders.cancelled}</Text>
                <Text style={styles.metricLabel}>Cancelled</Text>
              </View>
            </View>
          </View>
        )}

        {/* Products Report */}
        {reportType === 'products' && reportData && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Products Report</Text>
            <View style={styles.metricGrid}>
              <View style={styles.metricCard}>
                <Ionicons name="cube-outline" size={24} color="#3B82F6" />
                <Text style={styles.metricValue}>{reportData.products.total}</Text>
                <Text style={styles.metricLabel}>Total Products</Text>
              </View>
              <View style={styles.metricCard}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
                <Text style={styles.metricValue}>{reportData.products.active}</Text>
                <Text style={styles.metricLabel}>Active</Text>
              </View>
              <View style={styles.metricCard}>
                <Ionicons name="warning-outline" size={24} color="#F59E0B" />
                <Text style={styles.metricValue}>{reportData.products.lowStock}</Text>
                <Text style={styles.metricLabel}>Low Stock</Text>
              </View>
              <View style={styles.metricCard}>
                <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
                <Text style={styles.metricValue}>{reportData.products.outOfStock}</Text>
                <Text style={styles.metricLabel}>Out of Stock</Text>
              </View>
            </View>
          </View>
        )}

        {/* Customers Report */}
        {reportType === 'customers' && reportData && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Customers Report</Text>
            <View style={styles.metricGrid}>
              <View style={styles.metricCard}>
                <Ionicons name="people-outline" size={24} color="#3B82F6" />
                <Text style={styles.metricValue}>{reportData.customers.total}</Text>
                <Text style={styles.metricLabel}>Total Customers</Text>
              </View>
              <View style={styles.metricCard}>
                <Ionicons name="person-add-outline" size={24} color="#10B981" />
                <Text style={styles.metricValue}>{reportData.customers.newThisMonth}</Text>
                <Text style={styles.metricLabel}>New This Month</Text>
              </View>
              <View style={styles.metricCard}>
                <Ionicons name="repeat-outline" size={24} color="#F59E0B" />
                <Text style={styles.metricValue}>{reportData.customers.returning}</Text>
                <Text style={styles.metricLabel}>Returning</Text>
              </View>
            </View>
          </View>
        )}

        {/* Empty State */}
        {!reportData && (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>No report data available</Text>
            <Text style={styles.emptySubtext}>
              Reports will be generated as you make sales
            </Text>
          </View>
        )}
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  exportButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: '#1ED760',
  },
  typeChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
  },
  dateContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dateChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  dateChipActive: {
    backgroundColor: '#0891B2',
  },
  dateChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  dateChipTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricCard: {
    width: (width - 64) / 2,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ReportsScreen;
