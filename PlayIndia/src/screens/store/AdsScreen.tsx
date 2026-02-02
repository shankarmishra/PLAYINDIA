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
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';
import { Image } from 'react-native';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<StoreTabParamList>;

interface Ad {
  _id: string;
  title: string;
  adType: 'home-banner' | 'category-banner' | 'sponsored-product';
  status: 'draft' | 'pending' | 'approved' | 'active' | 'paused' | 'rejected' | 'expired' | 'completed';
  bannerImage: string;
  budget: {
    total: number;
    daily: number;
    spent: number;
  };
  duration: {
    startDate: string;
    endDate: string;
  };
  metrics: {
    views: number;
    clicks: number;
    ctr: number;
  };
  productId?: {
    name: string;
    price: { selling: number };
  };
}

const AdsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'pending' | 'expired'>('all');

  useEffect(() => {
    loadAds();
  }, [selectedFilter]);

  const loadAds = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedFilter !== 'all') {
        params.status = selectedFilter;
      }
      
      const response = await ApiService.ads.getStoreAds(params);
      
      if (response.data && response.data.success) {
        setAds(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error loading ads:', error);
      Alert.alert('Error', 'Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAds();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'approved':
        return '#3B82F6';
      case 'rejected':
        return '#EF4444';
      case 'expired':
      case 'completed':
        return '#6B7280';
      case 'paused':
        return '#8B5CF6';
      default:
        return '#9CA3AF';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#D1FAE5';
      case 'pending':
        return '#FEF3C7';
      case 'approved':
        return '#DBEAFE';
      case 'rejected':
        return '#FEE2E2';
      case 'expired':
      case 'completed':
        return '#F3F4F6';
      case 'paused':
        return '#EDE9FE';
      default:
        return '#F3F4F6';
    }
  };

  const getAdTypeLabel = (adType: string) => {
    switch (adType) {
      case 'home-banner':
        return 'Home Banner';
      case 'category-banner':
        return 'Category Banner';
      case 'sponsored-product':
        return 'Sponsored Product';
      default:
        return adType;
    }
  };

  const stats = {
    total: ads.length,
    active: ads.filter(a => a.status === 'active').length,
    pending: ads.filter(a => a.status === 'pending').length,
    expired: ads.filter(a => ['expired', 'completed'].includes(a.status)).length,
    totalSpent: ads.reduce((sum, ad) => sum + (ad.budget.spent || 0), 0),
    totalClicks: ads.reduce((sum, ad) => sum + (ad.metrics.clicks || 0), 0),
  };

  const renderAd = ({ item }: { item: Ad }) => (
    <TouchableOpacity
      style={styles.adCard}
      onPress={() => {
        // Navigate to ad details/edit
        Alert.alert('Ad Details', `View/edit ad: ${item.title}`);
      }}
    >
      <View style={styles.adHeader}>
        <View style={styles.adImageContainer}>
          {item.bannerImage ? (
            <Image
              source={{ uri: item.bannerImage }}
              style={styles.adImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.adImage, styles.adImagePlaceholder]}>
              <Ionicons name="image-outline" size={32} color="#9CA3AF" />
            </View>
          )}
        </View>
        <View style={styles.adInfo}>
          <Text style={styles.adTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.adType}>{getAdTypeLabel(item.adType)}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBgColor(item.status) },
            ]}
          >
            <Text
              style={[styles.statusText, { color: getStatusColor(item.status) }]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.adMetrics}>
        <View style={styles.metricItem}>
          <Ionicons name="eye-outline" size={16} color="#6B7280" />
          <Text style={styles.metricText}>
            {item.metrics.views || 0} views
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Ionicons name="hand-left-outline" size={16} color="#6B7280" />
          <Text style={styles.metricText}>
            {item.metrics.clicks || 0} clicks
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Ionicons name="cash-outline" size={16} color="#6B7280" />
          <Text style={styles.metricText}>
            {formatCurrency(item.budget.spent || 0)} spent
          </Text>
        </View>
      </View>

      <View style={styles.adFooter}>
        <Text style={styles.adDate}>
          {formatDate(item.duration.startDate)} - {formatDate(item.duration.endDate)}
        </Text>
        <Text style={styles.adBudget}>
          Budget: {formatCurrency(item.budget.total)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading ads...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Promote Products</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateAd')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Ads</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>
            {stats.active}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {formatCurrency(stats.totalSpent)}
          </Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalClicks}</Text>
          <Text style={styles.statLabel}>Total Clicks</Text>
        </View>
      </ScrollView>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'active', 'pending', 'expired'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter as any)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ads List */}
      <FlatList
        data={ads}
        renderItem={renderAd}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>No ads found</Text>
            <Text style={styles.emptySubtext}>
              Create your first ad to promote your products
            </Text>
            <TouchableOpacity
              style={styles.createFirstButton}
              onPress={() => navigation.navigate('CreateAd')}
            >
              <Text style={styles.createFirstButtonText}>Create Ad</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1ED760',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsScroll: {
    maxHeight: 100,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
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
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  adCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  adHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  adImageContainer: {
    marginRight: 12,
  },
  adImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  adImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  adInfo: {
    flex: 1,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  adType: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  adMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#6B7280',
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  adBudget: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
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
  createFirstButton: {
    marginTop: 24,
    backgroundColor: '#1ED760',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AdsScreen;

