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
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../../services/ApiService';

const { width } = Dimensions.get('window');

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
    _id: string;
    name: string;
    price: { selling: number };
    images?: string[];
  };
  storeId?: {
    _id: string;
    storeName: string;
    ownerName: string;
  };
  payment: {
    amount: number;
    status: string;
  };
}

const AdsManagementScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

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
      
      const response = await ApiService.get('/admin/ads', { params });
      
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

  const handleApprove = async (adId: string) => {
    try {
      const response = await ApiService.post(`/admin/ads/${adId}/approve`, {});
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Ad approved successfully');
        setApprovalModalVisible(false);
        setSelectedAd(null);
        loadAds();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to approve ad');
    }
  };

  const handleReject = async (adId: string) => {
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a rejection reason');
      return;
    }

    try {
      const response = await ApiService.post(`/admin/ads/${adId}/reject`, {
        reason: rejectionReason
      });
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Ad rejected');
        setApprovalModalVisible(false);
        setSelectedAd(null);
        setRejectionReason('');
        loadAds();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reject ad');
    }
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
      default:
        return '#9CA3AF';
    }
  };

  const stats = {
    total: ads.length,
    pending: ads.filter(a => a.status === 'pending').length,
    active: ads.filter(a => a.status === 'active').length,
    revenue: ads.reduce((sum, ad) => sum + (ad.payment?.amount || 0), 0),
    totalClicks: ads.reduce((sum, ad) => sum + (ad.metrics.clicks || 0), 0),
    avgCTR: ads.length > 0 
      ? (ads.reduce((sum, ad) => sum + (ad.metrics.ctr || 0), 0) / ads.length).toFixed(2)
      : '0',
  };

  const renderAd = ({ item }: { item: Ad }) => (
    <TouchableOpacity
      style={styles.adCard}
      onPress={() => {
        if (item.status === 'pending') {
          setSelectedAd(item);
          setApprovalModalVisible(true);
        }
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
          <Text style={styles.adStore}>
            Store: {item.storeId?.storeName || 'N/A'}
          </Text>
          <Text style={styles.adProduct}>
            Product: {item.productId?.name || 'N/A'}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '20' },
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
          <Text style={styles.metricText}>{item.metrics.views || 0} views</Text>
        </View>
        <View style={styles.metricItem}>
          <Ionicons name="hand-left-outline" size={16} color="#6B7280" />
          <Text style={styles.metricText}>{item.metrics.clicks || 0} clicks</Text>
        </View>
        <View style={styles.metricItem}>
          <Ionicons name="cash-outline" size={16} color="#6B7280" />
          <Text style={styles.metricText}>
            {formatCurrency(item.payment?.amount || 0)}
          </Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.pendingActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => {
              setSelectedAd(item);
              setApprovalModalVisible(true);
            }}
          >
            <Text style={styles.actionButtonText}>Review</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EF4444" />
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ads Management</Text>
        <View style={{ width: 24 }} />
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
        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>
            {stats.active}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {formatCurrency(stats.revenue)}
          </Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalClicks}</Text>
          <Text style={styles.statLabel}>Total Clicks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.avgCTR}%</Text>
          <Text style={styles.statLabel}>Avg CTR</Text>
        </View>
      </ScrollView>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'pending', 'active', 'rejected'].map((filter) => (
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
          </View>
        }
      />

      {/* Approval Modal */}
      <Modal
        visible={approvalModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setApprovalModalVisible(false);
          setSelectedAd(null);
          setRejectionReason('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Review Ad</Text>
              <TouchableOpacity
                onPress={() => {
                  setApprovalModalVisible(false);
                  setSelectedAd(null);
                  setRejectionReason('');
                }}
              >
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {selectedAd && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalImageContainer}>
                  {selectedAd.bannerImage ? (
                    <Image
                      source={{ uri: selectedAd.bannerImage }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.modalImage, styles.imagePlaceholder]}>
                      <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                    </View>
                  )}
                </View>

                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoLabel}>Title:</Text>
                  <Text style={styles.modalInfoValue}>{selectedAd.title}</Text>

                  <Text style={styles.modalInfoLabel}>Store:</Text>
                  <Text style={styles.modalInfoValue}>
                    {selectedAd.storeId?.storeName || 'N/A'}
                  </Text>

                  <Text style={styles.modalInfoLabel}>Product:</Text>
                  <Text style={styles.modalInfoValue}>
                    {selectedAd.productId?.name || 'N/A'}
                  </Text>

                  <Text style={styles.modalInfoLabel}>Ad Type:</Text>
                  <Text style={styles.modalInfoValue}>
                    {selectedAd.adType.replace('-', ' ').toUpperCase()}
                  </Text>

                  <Text style={styles.modalInfoLabel}>Budget:</Text>
                  <Text style={styles.modalInfoValue}>
                    {formatCurrency(selectedAd.budget.total)} (Daily: {formatCurrency(selectedAd.budget.daily)})
                  </Text>

                  <Text style={styles.modalInfoLabel}>Duration:</Text>
                  <Text style={styles.modalInfoValue}>
                    {formatDate(selectedAd.duration.startDate)} - {formatDate(selectedAd.duration.endDate)}
                  </Text>

                  <Text style={styles.modalInfoLabel}>Payment Amount:</Text>
                  <Text style={styles.modalInfoValue}>
                    {formatCurrency(selectedAd.payment?.amount || 0)}
                  </Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.rejectButton]}
                    onPress={() => {
                      Alert.prompt(
                        'Rejection Reason',
                        'Please provide a reason for rejection:',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Reject',
                            onPress: (reason) => {
                              if (reason) {
                                setRejectionReason(reason);
                                handleReject(selectedAd._id);
                              }
                            },
                          },
                        ],
                        'plain-text'
                      );
                    }}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.approveButton]}
                    onPress={() => handleApprove(selectedAd._id)}
                  >
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#EF4444',
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
  adStore: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  adProduct: {
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
  pendingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalBody: {
    padding: 20,
  },
  modalImageContainer: {
    marginBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInfo: {
    marginBottom: 20,
  },
  modalInfoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  modalInfoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#FEE2E2',
  },
  rejectButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AdsManagementScreen;

