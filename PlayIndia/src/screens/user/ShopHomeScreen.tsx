import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Image,
  StatusBar,
  TextInput,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserTabParamList } from '../../navigation/UserNav';
import { useCart } from '../../contexts/CartContext';
import ApiService from '../../services/ApiService';

type NavigationProp = StackNavigationProp<UserTabParamList>;

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

// Categories with better icons
const categories = [
  { id: '0', name: 'All', icon: 'grid-outline', color: '#1ED760' },
  { id: '1', name: 'Cricket', icon: 'baseball-outline', color: '#FF6B6B' },
  { id: '2', name: 'Football', icon: 'football-outline', color: '#4ECDC4' },
  { id: '3', name: 'Badminton', icon: 'tennisball-outline', color: '#45B7D1' },
  { id: '4', name: 'Tennis', icon: 'tennisball-outline', color: '#96CEB4' },
  { id: '5', name: 'Yoga', icon: 'fitness-outline', color: '#FFEAA7' },
  { id: '6', name: 'Gym', icon: 'barbell-outline', color: '#DDA0DD' },
  { id: '7', name: 'Basketball', icon: 'basketball-outline', color: '#FF7675' },
  { id: '8', name: 'Running', icon: 'walk-outline', color: '#74B9FF' },
];


interface Product {
  _id: string;
  id?: string;
  name: string;
  price: {
    selling: number;
    original?: number;
  };
  images?: string[];
  image?: string;
  category: string;
  rating?: number;
  ratings?: {
    average?: number;
  };
  discount?: number;
  originalPrice?: number;
}

const ShopHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { addToCart, getCartCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shopBanners, setShopBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const cartCount = getCartCount();

  // Dummy banners fallback
  const dummyBanners: Banner[] = [
    {
      id: '1',
      title: 'Mega Sale!',
      subtitle: 'Up to 50% off on all sports gear',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Load shop banners
  const loadShopBanners = async () => {
    try {
      const response = await ApiService.banners.getAll({ 
        status: 'active', 
        bannerType: 'shop' 
      });
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const formattedBanners = response.data.data.map((banner: any) => ({
          id: banner._id || banner.id,
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          image: banner.image || '',
          link: banner.link || undefined,
        }));
        setShopBanners(formattedBanners);
      } else {
        setShopBanners(dummyBanners);
      }
    } catch (error: any) {
      if (error.message && !error.message.includes('Network')) {
        console.log('Shop banners API error:', error.message);
      }
      setShopBanners(dummyBanners);
    }
  };

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 100,
      };
      
      // Map category name to backend category
      if (selectedCategory !== 'All') {
        const categoryMap: Record<string, string> = {
          'Cricket': 'cricket',
          'Football': 'football',
          'Badminton': 'badminton',
          'Tennis': 'tennis',
          'Yoga': 'gym',
          'Gym': 'gym',
          'Basketball': 'multi-sports',
          'Running': 'multi-sports',
        };
        params.category = categoryMap[selectedCategory] || selectedCategory.toLowerCase();
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      console.log('Loading products with params:', params);
      const response = await ApiService.products.getAll(params);
      console.log('Products API response:', response.data);
      
      if (response.data && response.data.success) {
        // Transform API products to match UI format
        const transformedProducts = (response.data.data || []).map((product: any) => {
          const sellingPrice = product.price?.selling || product.price || 0;
          const originalPrice = product.price?.original || product.price?.selling || sellingPrice;
          const discount = originalPrice > sellingPrice 
            ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
            : 0;
          const rating = product.ratings?.average || product.rating || 0;
          const image = product.images && product.images.length > 0 
            ? product.images[0] 
            : product.image || 'https://via.placeholder.com/300x300?text=No+Image';
          
          // Map backend category to display category
          const categoryMap: Record<string, string> = {
            'cricket': 'Cricket',
            'football': 'Football',
            'badminton': 'Badminton',
            'tennis': 'Tennis',
            'gym': 'Gym',
            'multi-sports': 'Basketball',
          };
          const displayCategory = categoryMap[product.category] || product.category || 'All';
          
          return {
            id: product._id || product.id,
            _id: product._id || product.id,
            name: product.name || 'Product',
            price: sellingPrice,
            originalPrice: originalPrice,
            discount: discount,
            rating: rating,
            image: image,
            category: displayCategory,
          };
        });
        console.log('Transformed products:', transformedProducts.length);
        setProducts(transformedProducts);
      } else {
        console.log('No products in response or API failed');
        setProducts([]);
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      console.error('Error details:', error.response?.data || error.message);
      // On error, set empty array (no fallback to mock data)
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadShopBanners();
    loadProducts();
  }, []);

  React.useEffect(() => {
    // Reload products when category or search changes
    loadProducts();
  }, [selectedCategory, searchQuery]);

  // Filter products (category filtering is done in API, but we do search filtering here)
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Category is already filtered by API, but double-check for safety
    const matchesCategory = selectedCategory === 'All' || 
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadShopBanners(), loadProducts()]);
    setRefreshing(false);
  };

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity 
      style={[
        styles.categoryCard,
        selectedCategory === item.name && styles.categoryCardActive
      ]}
      onPress={() => setSelectedCategory(item.name)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.categoryIcon, 
        { 
          backgroundColor: selectedCategory === item.name 
            ? item.color 
            : `${item.color}15` 
        }
      ]}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={selectedCategory === item.name ? '#FFFFFF' : item.color} 
        />
      </View>
      <Text style={[
        styles.categoryName,
        selectedCategory === item.name && styles.categoryNameActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id || item._id })}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>{item.discount}% OFF</Text>
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          activeOpacity={0.7}
        >
          <Ionicons name="heart-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.productRating}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({Math.floor(Math.random() * 200 + 50)})</Text>
        </View>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
          <Text style={styles.productOriginalPrice}>₹{item.originalPrice.toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={(e) => {
            e.stopPropagation();
            addToCart({
              id: item.id,
              name: item.name,
              price: item.price,
              originalPrice: item.originalPrice,
              discount: item.discount,
              image: item.image,
              category: item.category,
            });
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.cartContainer}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.7}
        >
          <Ionicons name="cart-outline" size={24} color="#1F2937" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />

        {/* Shop Banners */}
        {shopBanners.length > 0 && (
          <FlatList
            data={shopBanners}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.offerBanner}
                activeOpacity={0.9}
                onPress={() => {
                  if (item.link) {
                    // Handle banner link navigation
                  }
                }}
              >
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.offerImage}
                  resizeMode="cover"
                />
                <View style={styles.offerOverlay}>
                  <View style={styles.offerContent}>
                    <Text style={styles.offerTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
                    )}
                    <TouchableOpacity style={styles.offerButton} activeOpacity={0.8}>
                      <Text style={styles.offerButtonText}>Shop Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannersContainer}
          />
        )}

        {/* Products Header */}
        <View style={styles.productsHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </Text>
            <Text style={styles.productCount}>
              {loading ? 'Loading...' : `${filteredProducts.length} products`}
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Products Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1ED760" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : filteredProducts.length > 0 ? (
          <View style={styles.productsGrid}>
            {filteredProducts.map((item) => (
              <View key={item.id || item._id || Math.random()} style={styles.productWrapper}>
                {renderProduct({ item })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={80} color="#CBD5E0" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? 'Try a different search term' 
                : products.length === 0
                  ? 'No products available. Check back later!'
                  : 'Try selecting a different category'}
            </Text>
            {searchQuery && (
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            )}
            {products.length === 0 && !loading && (
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={onRefresh}
              >
                <Text style={styles.clearSearchText}>Refresh</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    elevation: 0,
    shadowOpacity: 0,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    padding: 0,
  },
  cartContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  productCount: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 16,
  },
  categoryCard: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryCardActive: {
    // Active state styling
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  categoryNameActive: {
    color: '#1ED760',
    fontWeight: '700',
  },
  bannersContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  offerBanner: {
    width: Dimensions.get('window').width - 40,
    marginRight: 0,
    borderRadius: 16,
    overflow: 'hidden',
    height: 130,
    position: 'relative',
  },
  offerImage: {
    width: '100%',
    height: '100%',
  },
  offerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerContent: {
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  offerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 16,
  },
  offerButton: {
    backgroundColor: '#1ED760',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  offerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    color: '#1ED760',
    fontSize: 15,
    fontWeight: '700',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    gap: 12,
  },
  productWrapper: {
    width: '47%',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: 110,
    backgroundColor: '#F8FAFC',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    minHeight: 32,
    lineHeight: 16,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1ED760',
  },
  productOriginalPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: '#1ED760',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  clearSearchButton: {
    backgroundColor: '#1ED760',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  clearSearchText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ShopHomeScreen;
