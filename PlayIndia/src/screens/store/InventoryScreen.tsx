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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';

type NavigationProp = StackNavigationProp<StoreTabParamList>;

interface Product {
  _id: string;
  name: string;
  category: string;
  inventory: {
    quantity: number;
    lowStockThreshold?: number;
  };
  price: {
    selling: number;
  };
  availability: {
    isActive: boolean;
  };
}

const InventoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'low-stock' | 'out-of-stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadStoreAndProducts();
    }, [])
  );

  useEffect(() => {
    if (storeId) {
      loadProducts();
    }
  }, [filter, searchQuery, storeId]);

  const loadStoreAndProducts = async () => {
    try {
      setLoading(true);
      const profileResponse = await ApiService.stores.getMyProfile();
      if (profileResponse.data && profileResponse.data.success) {
        const storeData = profileResponse.data.data;
        const id = storeData._id;
        setStoreId(id);
        await loadProducts();
      }
    } catch (error: any) {
      console.error('Error loading store/products:', error);
      Alert.alert('Error', 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    if (!storeId) return;
    
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await ApiService.stores.getProducts(storeId, params);
      
      if (response.data && response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const updateInventory = async (productId: string, newQuantity: number) => {
    try {
      const response = await ApiService.stores.updateProduct(productId, {
        'inventory.quantity': newQuantity,
      });
      
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Inventory updated successfully');
        await loadProducts();
      } else {
        throw new Error('Update failed');
      }
    } catch (error: any) {
      console.error('Error updating inventory:', error);
      Alert.alert('Error', 'Failed to update inventory');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStockStatus = (product: Product) => {
    const quantity = product.inventory.quantity || 0;
    const threshold = product.inventory.lowStockThreshold || 10;
    
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= threshold) return 'low-stock';
    return 'in-stock';
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const stockStatus = getStockStatus(product);
    const matchesFilter = filter === 'all' || stockStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const renderProduct = ({ item }: { item: Product }) => {
    const stockStatus = getStockStatus(item);
    const isLowStock = stockStatus === 'low-stock';
    const isOutOfStock = stockStatus === 'out-of-stock';

    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.productCategory}>{item.category}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isOutOfStock
                  ? '#FEE2E2'
                  : isLowStock
                  ? '#FEF3C7'
                  : '#D1FAE5',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: isOutOfStock
                    ? '#EF4444'
                    : isLowStock
                    ? '#F59E0B'
                    : '#10B981',
                },
              ]}
            >
              {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
            </Text>
          </View>
        </View>
        
        <View style={styles.inventoryRow}>
          <View style={styles.quantityInfo}>
            <Ionicons name="cube-outline" size={16} color="#6B7280" />
            <Text style={styles.quantityLabel}>Current Stock:</Text>
            <Text style={[styles.quantityValue, isOutOfStock && styles.quantityValueDanger]}>
              {item.inventory.quantity || 0}
            </Text>
          </View>
          <Text style={styles.priceText}>
            {formatCurrency(item.price.selling)}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => {
            Alert.prompt(
              'Update Inventory',
              `Enter new quantity for ${item.name}`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Update',
                  onPress: (quantity) => {
                    const newQty = parseInt(quantity || '0');
                    if (!isNaN(newQty) && newQty >= 0) {
                      updateInventory(item._id, newQty);
                    } else {
                      Alert.alert('Error', 'Please enter a valid number');
                    }
                  },
                },
              ],
              'plain-text',
              item.inventory.quantity?.toString() || '0',
              'numeric'
            );
          }}
        >
          <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          <Text style={styles.updateButtonText}>Update Stock</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => getStockStatus(p) === 'in-stock').length,
    lowStock: products.filter(p => getStockStatus(p) === 'low-stock').length,
    outOfStock: products.filter(p => getStockStatus(p) === 'out-of-stock').length,
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading inventory...</Text>
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
        <Text style={styles.headerTitle}>Inventory</Text>
        <View style={styles.backButton} />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.inStock}</Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.lowStock}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>{stats.outOfStock}</Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
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
          {['all', 'low-stock', 'out-of-stock'].map((f) => (
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
                {f.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Add products to manage inventory'}
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
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
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
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
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  productCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  inventoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  quantityValueDanger: {
    color: '#EF4444',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1ED760',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  updateButtonText: {
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
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default InventoryScreen;
