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

interface AnalyticsData {
  totalSales: number;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    _id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topCategories: Array<{
    category: string;
    revenue: number;
    orders: number;
  }>;
}

const AnalyticsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('this-month');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await ApiService.stores.getDashboard();
      
      if (response.data && response.data.success) {
        const data = response.data.data;
        const stats = data.stats || {};
        const sections = data.sections || {};
        
        // Calculate analytics from dashboard data
        const orderAnalytics = data.analytics?.orderAnalytics || [];
        const monthlyRevenue = orderAnalytics.reduce((sum: number, day: any) => 
          sum + (day.totalRevenue || 0), 0
        );

        setAnalytics({
          totalSales: stats.totalRevenue || 0,
          monthlyRevenue: monthlyRevenue || stats.totalRevenue || 0,
          totalOrders: stats.totalOrders || 0,
          averageOrderValue: stats.totalOrders > 0 
            ? (stats.totalRevenue || 0) / stats.totalOrders 
            : 0,
          topProducts: sections.topSellingProducts?.slice(0, 5).map((p: any) => ({
            _id: p._id,
            name: p.name,
            sales: p['analytics.purchases'] || 0,
            revenue: (p['analytics.purchases'] || 0) * (p.price?.selling || p.price || 0),
          })) || [],
          monthlyBreakdown: orderAnalytics.slice(0, 12).map((day: any) => ({
            month: new Date(day.date || day._id).toLocaleDateString('en-IN', { month: 'short' }),
            revenue: day.totalRevenue || 0,
            orders: day.orderCount || 0,
          })) || [],
          topCategories: [], // Will be calculated from products if available
        });
      }
    } catch (error: any) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading analytics...</Text>
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
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.backButton} />
      </View>

      {/* Date Range Selector */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['this-month', 'last-month', 'this-year', 'all-time'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.filterChip,
                dateRange === range && styles.filterChipActive,
              ]}
              onPress={() => setDateRange(range)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  dateRange === range && styles.filterChipTextActive,
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
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Ionicons name="cash-outline" size={24} color="#10B981" />
            <Text style={styles.metricValue}>
              {formatCurrency(analytics?.totalSales || 0)}
            </Text>
            <Text style={styles.metricLabel}>Total Sales</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
            <Text style={styles.metricValue}>
              {formatCurrency(analytics?.monthlyRevenue || 0)}
            </Text>
            <Text style={styles.metricLabel}>Monthly Revenue</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Ionicons name="cart-outline" size={24} color="#F59E0B" />
            <Text style={styles.metricValue}>
              {analytics?.totalOrders || 0}
            </Text>
            <Text style={styles.metricLabel}>Total Orders</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Ionicons name="trending-up-outline" size={24} color="#EF4444" />
            <Text style={styles.metricValue}>
              {formatCurrency(analytics?.averageOrderValue || 0)}
            </Text>
            <Text style={styles.metricLabel}>Avg Order Value</Text>
          </View>
        </View>

        {/* Top Products */}
        {analytics?.topProducts && analytics.topProducts.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Top Selling Products</Text>
            {analytics.topProducts.map((product, index) => (
              <View key={product._id} style={styles.productItem}>
                <View style={styles.productRank}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productStats}>
                    {product.sales} sold • {formatCurrency(product.revenue)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Monthly Breakdown */}
        {analytics?.monthlyBreakdown && analytics.monthlyBreakdown.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
            {analytics.monthlyBreakdown.map((month, index) => (
              <View key={index} style={styles.breakdownItem}>
                <Text style={styles.breakdownMonth}>{month.month}</Text>
                <View style={styles.breakdownRight}>
                  <Text style={styles.breakdownRevenue}>
                    {formatCurrency(month.revenue)}
                  </Text>
                  <Text style={styles.breakdownOrders}>
                    {month.orders} orders
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {(!analytics || (!analytics.topProducts?.length && !analytics.monthlyBreakdown?.length)) && (
          <View style={styles.emptyContainer}>
            <Ionicons name="analytics-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>No analytics data available</Text>
            <Text style={styles.emptySubtext}>
              Analytics will appear here as you make sales
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
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#1ED760',
  },
  filterChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginHorizontal: -6,
  },
  metricCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
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
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  breakdownMonth: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  breakdownRight: {
    alignItems: 'flex-end',
  },
  breakdownRevenue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  breakdownOrders: {
    fontSize: 12,
    color: '#6B7280',
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

export default AnalyticsScreen;
