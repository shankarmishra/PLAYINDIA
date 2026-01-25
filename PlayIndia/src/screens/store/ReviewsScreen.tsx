import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';

type NavigationProp = StackNavigationProp<StoreTabParamList>;

interface Review {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  productId?: {
    name: string;
    images?: string[];
  };
  rating: number;
  comment: string;
  createdAt: string;
  helpful?: number;
  verified?: boolean;
}

const ReviewsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    loadStoreAndReviews();
  }, []);

  useEffect(() => {
    if (storeId) {
      loadReviews();
    }
  }, [filter, searchQuery, storeId]);

  const loadStoreAndReviews = async () => {
    try {
      setLoading(true);
      const profileResponse = await ApiService.stores.getMyProfile();
      if (profileResponse.data && profileResponse.data.success) {
        const storeData = profileResponse.data.data;
        setStoreId(storeData._id);
        await loadReviews();
      }
    } catch (error: any) {
      console.error('Error loading reviews:', error);
      Alert.alert('Error', 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!storeId) return;
    
    try {
      // Get products first, then get reviews for each product
      const productsResponse = await ApiService.stores.getProducts(storeId);
      if (productsResponse.data && productsResponse.data.success) {
        const products = productsResponse.data.data || [];
        // For now, we'll show placeholder - in real app, you'd have a reviews endpoint
        setReviews([]);
      }
    } catch (error: any) {
      console.error('Error loading reviews:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={16}
        color="#F59E0B"
      />
    ));
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productId?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || review.rating.toString() === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reviews.length,
    average: reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0,
    byRating: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    },
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.userId.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userId.name}</Text>
            <Text style={styles.reviewDate}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
        </View>
      </View>
      
      {item.productId && (
        <View style={styles.productInfo}>
          <Ionicons name="cube-outline" size={14} color="#6B7280" />
          <Text style={styles.productName}>{item.productId.name}</Text>
        </View>
      )}
      
      <Text style={styles.reviewComment}>{item.comment}</Text>
      
      {item.verified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          <Text style={styles.verifiedText}>Verified Purchase</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading reviews...</Text>
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
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.backButton} />
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Reviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.average > 0 ? stats.average.toFixed(1) : '0.0'}
            </Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>
        <View style={styles.ratingBreakdown}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <View key={rating} style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>{rating} Star</Text>
              <View style={styles.ratingBar}>
                <View
                  style={[
                    styles.ratingBarFill,
                    {
                      width: `${stats.total > 0 ? (stats.byRating[rating as keyof typeof stats.byRating] / stats.total) * 100 : 0}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.ratingCount}>
                {stats.byRating[rating as keyof typeof stats.byRating]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reviews..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.filterContainer}>
          {['all', '5', '4', '3', '2', '1'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                filter === f && styles.filterChipActive,
              ]}
              onPress={() => setFilter(f as any)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === f && styles.filterChipTextActive,
                ]}
              >
                {f === 'all' ? 'All' : `${f} Star${f !== '1' ? 's' : ''}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Reviews List */}
      <FlatList
        data={filteredReviews}
        renderItem={renderReview}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>No reviews yet</Text>
            <Text style={styles.emptySubtext}>
              Reviews from customers will appear here
            </Text>
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
  statsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  ratingBreakdown: {
    gap: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 60,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  ratingCount: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
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
  listContent: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1ED760',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  productName: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewComment: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
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

export default ReviewsScreen;
