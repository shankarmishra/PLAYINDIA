import React, { useState, useEffect, useRef } from 'react';
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
import { UserTabParamList } from '../../navigation/types';
import { useCart } from '../../contexts/CartContext';
import ApiService from '../../services/ApiService';

type NavigationProp = StackNavigationProp<UserTabParamList>;

const { width } = Dimensions.get('window');

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

const categories = [
  { id: '0', name: 'All', icon: 'grid-outline', color: '#16A34A' },
  { id: '1', name: 'Cricket', icon: 'baseball-outline', color: '#16A34A' },
  { id: '2', name: 'Football', icon: 'football-outline', color: '#16A34A' },
  { id: '3', name: 'Badminton', icon: 'tennisball-outline', color: '#16A34A' },
  { id: '4', name: 'Tennis', icon: 'tennisball-outline', color: '#16A34A' },
  { id: '5', name: 'Yoga', icon: 'fitness-outline', color: '#16A34A' },
  { id: '6', name: 'Gym', icon: 'barbell-outline', color: '#16A34A' },
  { id: '7', name: 'Basketball', icon: 'basketball-outline', color: '#16A34A' },
  { id: '8', name: 'Running', icon: 'walk-outline', color: '#16A34A' },
];

interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  image: string;
  category: string;
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
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerRef = useRef<FlatList>(null);

  const cartCount = getCartCount();

  const dummyBanners: Banner[] = [
    {
      id: '1',
      title: 'Mega Sale!',
      subtitle: 'Up to 50% off on all sports gear',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: '2',
      title: 'New Arrivals',
      subtitle: 'Explore the latest sports equipment',
      image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    }
  ];

  const loadShopBanners = async () => {
    try {
      const response = await ApiService.banners.getAll({
        status: 'active',
        bannerType: 'shop'
      });
      console.log('Shop Banners Response:', response.data);
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
        console.log('No active shop banners found, using defaults.');
        setShopBanners(dummyBanners);
      }
    } catch (error) {
      console.error('Error loading shop banners:', error);
      setShopBanners(dummyBanners);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
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
      if (searchQuery) params.search = searchQuery;

      const response = await ApiService.products.getAll(params);
      if (response.data && response.data.success) {
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

          return {
            id: product._id || product.id,
            _id: product._id || product.id,
            name: product.name || 'Product',
            price: sellingPrice,
            originalPrice: originalPrice,
            discount: discount,
            rating: rating,
            image: image,
            category: product.category,
          };
        });
        setProducts(transformedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShopBanners();
    loadProducts();
  }, [selectedCategory, searchQuery]);

  // Auto-scroll banners
  useEffect(() => {
    if (shopBanners.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (activeBannerIndex + 1) % shopBanners.length;
        setActiveBannerIndex(nextIndex);
        bannerRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [shopBanners, activeBannerIndex]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadShopBanners(), loadProducts()]);
    setRefreshing(false);
  };

  const renderBanner = ({ item }: { item: Banner }) => (
    <View style={styles.bannerContainer}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        <TouchableOpacity style={styles.bannerBtn}>
          <Text style={styles.bannerBtnText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>{item.discount}% OFF</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.productRating}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.productOriginalPrice}>₹{item.originalPrice.toLocaleString()}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={(e) => {
            e.stopPropagation();
            addToCart({ ...item, id: item._id });
          }}
        >
          <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
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
        </View>
        <TouchableOpacity style={styles.cartContainer} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={24} color="#0F172A" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Banners */}
        <View style={styles.bannersWrapper}>
          <FlatList
            ref={bannerRef}
            data={shopBanners}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveBannerIndex(index);
            }}
          />
          <View style={styles.pagination}>
            {shopBanners.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, activeBannerIndex === index && styles.paginationDotActive]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryBtn, selectedCategory === cat.name && styles.categoryBtnActive]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Text style={[styles.categoryBtnText, selectedCategory === cat.name && styles.categoryBtnTextActive]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.productsGrid}>
          {loading ? (
            <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 40 }} />
          ) : products.length > 0 ? (
            products.map((item) => <View key={item._id} style={styles.productWrapper}>{renderProduct({ item })}</View>)
          ) : (
            <Text style={styles.emptyText}>No products found</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#0F172A',
  },
  cartContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannersWrapper: {
    height: 180,
    marginBottom: 20,
  },
  bannerContainer: {
    width: width,
    paddingHorizontal: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#C8E6C9',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 32,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    width: '60%',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  bannerBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B5E20',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B5E20',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  categoryBtnActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  categoryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryBtnTextActive: {
    color: '#FFFFFF',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  productWrapper: {
    width: '50%',
    padding: 4,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    elevation: 2,
  },
  productImageContainer: {
    width: '100%',
    height: 140,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    height: 34,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '700',
    marginLeft: 4,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2E7D32',
  },
  productOriginalPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addToCartButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyText: {
    width: '100%',
    textAlign: 'center',
    marginTop: 40,
    color: '#64748B',
    fontSize: 16,
  },
});

export default ShopHomeScreen;
