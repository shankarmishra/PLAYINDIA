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
  Image,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';
import useAuth from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<StoreTabParamList>;

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: {
    original: number;
    selling: number;
  };
  category: string;
  images?: string[];
  inventory: {
    quantity: number;
  };
  availability: {
    isActive: boolean;
  };
  ratings?: {
    average: number;
    count: number;
  };
  analytics?: {
    purchases: number;
  };
}

const ManageProductsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadStoreAndProducts();
    }, [])
  );

  const loadStoreAndProducts = async () => {
    try {
      setLoading(true);
      // First get store profile to get store ID
      const profileResponse = await ApiService.stores.getMyProfile();
      if (profileResponse.data && profileResponse.data.success) {
        const storeData = profileResponse.data.data;
        const id = storeData._id;
        setStoreId(id);
        
        // Then get products for this store
        await loadProducts(id);
      }
    } catch (error: any) {
      console.error('Error loading store/products:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (id: string) => {
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      
      const response = await ApiService.stores.getProducts(id, params);
      
      if (response.data && response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    if (storeId) {
      loadProducts(storeId);
    }
  }, [searchQuery, selectedCategory, storeId]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (storeId) {
      await loadProducts(storeId);
    } else {
      await loadStoreAndProducts();
    }
    setRefreshing(false);
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await ApiService.stores.deleteProduct(productToDelete);
      
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Product deleted successfully');
        setDeleteModalVisible(false);
        setProductToDelete(null);
        if (storeId) {
          await loadProducts(storeId);
        }
      } else {
        throw new Error('Delete failed');
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      Alert.alert('Error', error.message || 'Failed to delete product');
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      // Use nested object structure for partial updates (matching website)
      const updateData = {
        availability: {
          isActive: !product.availability.isActive,
        },
      };
      
      const response = await ApiService.stores.updateProduct(product._id, updateData);
      
      if (response.data && response.data.success) {
        if (storeId) {
          await loadProducts(storeId);
        }
      } else {
        throw new Error('Update failed');
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update product status');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProductImage = (product: Product): string => {
    // Check multiple possible image sources
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      if (firstImage && typeof firstImage === 'string' && firstImage.trim()) {
        return firstImage.trim();
      }
    }
    // Fallback to placeholder
    return 'https://via.placeholder.com/300x300?text=No+Image';
  };

  const ProductImage = ({ product }: { product: Product }) => {
    const [imageError, setImageError] = useState(false);
    const imageUri = getProductImage(product);
    const hasValidImage = imageUri && imageUri !== 'https://via.placeholder.com/300x300?text=No+Image';
    
    if (imageError || !hasValidImage) {
      return (
        <View style={[styles.productImage, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={48} color="#9CA3AF" />
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      );
    }
    
    return (
      <Image
        source={{ uri: imageUri }}
        style={styles.productImage}
        resizeMode="cover"
        onError={() => {
          console.log('Image load error for:', imageUri);
          setImageError(true);
        }}
      />
    );
  };

  const renderProduct = ({ item }: { item: Product }) => {
    return (
    <View style={styles.productCard}>
      <ProductImage product={item} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.sellingPrice}>
            {formatCurrency(item.price.selling)}
          </Text>
          {item.price.original > item.price.selling && (
            <Text style={styles.originalPrice}>
              {formatCurrency(item.price.original)}
            </Text>
          )}
        </View>
        
        <View style={styles.productMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="cube-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>
              Qty: {item.inventory.quantity}
            </Text>
          </View>
          
          {item.ratings && (
            <View style={styles.metaItem}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.metaText}>
                {item.ratings.average.toFixed(1)} ({item.ratings.count})
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.availability.isActive
                  ? '#D1FAE5'
                  : '#FEE2E2',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: item.availability.isActive ? '#10B981' : '#EF4444',
                },
              ]}
            >
              {item.availability.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              // Navigate to edit product (could be ListProduct screen with edit mode)
              navigation.navigate('ListProduct', { productId: item._id });
            }}
          >
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.toggleButton]}
            onPress={() => toggleProductStatus(item)}
          >
            <Ionicons
              name={item.availability.isActive ? 'eye-off-outline' : 'eye-outline'}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.actionButtonText}>
              {item.availability.isActive ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item._id)}
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Products</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ListProduct')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'cricket', 'football', 'badminton', 'tennis', 'gym'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  selectedCategory === cat && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === cat && styles.filterChipTextActive,
                  ]}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
              Add your first product to get started
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => navigation.navigate('ListProduct')}
            >
              <Text style={styles.addFirstButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Product</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this product? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setProductToDelete(null);
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonTextDelete}>Delete</Text>
              </TouchableOpacity>
            </View>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1ED760',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
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
  listContent: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusRow: {
    marginBottom: 12,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  toggleButton: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
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
  addFirstButton: {
    marginTop: 24,
    backgroundColor: '#1ED760',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: width - 64,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalButtonDelete: {
    backgroundColor: '#EF4444',
  },
  modalButtonTextCancel: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
  modalButtonTextDelete: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ManageProductsScreen;
