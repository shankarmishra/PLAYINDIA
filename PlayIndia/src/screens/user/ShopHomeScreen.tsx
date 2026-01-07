import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for categories and products
const categories = [
  { id: '1', name: 'Cricket', icon: 'baseball', color: '#FF6B6B' },
  { id: '2', name: 'Football', icon: 'football', color: '#4ECDC4' },
  { id: '3', name: 'Badminton', icon: 'tennisball', color: '#45B7D1' },
  { id: '4', name: 'Tennis', icon: 'tennisball', color: '#96CEB4' },
  { id: '5', name: 'Yoga', icon: 'fitness', color: '#FFEAA7' },
  { id: '6', name: 'Gym', icon: 'barbell', color: '#DDA0DD' },
];

const mockProducts = [
  {
    id: '1',
    name: 'Cricket Bat',
    price: '₹2,499',
    originalPrice: '₹3,999',
    discount: '38%',
    rating: 4.5,
    image: 'https://via.placeholder.com/150',
    category: 'Cricket',
  },
  {
    id: '2',
    name: 'Football',
    price: '₹899',
    originalPrice: '₹1,299',
    discount: '31%',
    rating: 4.3,
    image: 'https://via.placeholder.com/150',
    category: 'Football',
  },
  {
    id: '3',
    name: 'Badminton Racket',
    price: '₹1,299',
    originalPrice: '₹1,999',
    discount: '35%',
    rating: 4.7,
    image: 'https://via.placeholder.com/150',
    category: 'Badminton',
  },
  {
    id: '4',
    name: 'Yoga Mat',
    price: '₹599',
    originalPrice: '₹899',
    discount: '33%',
    rating: 4.8,
    image: 'https://via.placeholder.com/150',
    category: 'Yoga',
  },
  {
    id: '5',
    name: 'Tennis Racket',
    price: '₹2,199',
    originalPrice: '₹3,499',
    discount: '37%',
    rating: 4.4,
    image: 'https://via.placeholder.com/150',
    category: 'Tennis',
  },
  {
    id: '6',
    name: 'Dumbbells Set',
    price: '₹2,999',
    originalPrice: '₹4,999',
    discount: '40%',
    rating: 4.6,
    image: 'https://via.placeholder.com/150',
    category: 'Gym',
  },
];

const ShopHomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = selectedCategory === 'All' 
    ? mockProducts 
    : mockProducts.filter(product => product.category === selectedCategory);

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => setSelectedCategory(item.name)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: any) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>{item.price}</Text>
          <Text style={styles.productOriginalPrice}>{item.originalPrice}</Text>
          <Text style={styles.productDiscount}>{item.discount} OFF</Text>
        </View>
        <View style={styles.productRating}>
          <Ionicons name="star" size={14} color={theme.colors.accent.orange} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.text.secondary} />
          <Text style={styles.searchPlaceholder}>Search products...</Text>
        </View>
        <TouchableOpacity style={styles.cartContainer}>
          <Ionicons name="cart-outline" size={24} color={theme.colors.text.primary} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {/* Offers Banner */}
      <View style={styles.offerBanner}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/300x100' }} 
          style={styles.offerImage}
        />
      </View>

      {/* Products */}
      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>Best Sellers</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.small,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: theme.colors.text.disabled,
    marginLeft: theme.spacing.sm,
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.status.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: theme.colors.text.inverted,
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  categoryName: {
    fontSize: 12,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  offerBanner: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 100,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    color: theme.colors.accent.neonGreen,
    fontWeight: '600',
  },
  productsContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  productCard: {
    flex: 0.48,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: theme.spacing.md,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent.neonGreen,
    marginRight: theme.spacing.xs,
  },
  productOriginalPrice: {
    fontSize: 12,
    color: theme.colors.text.disabled,
    textDecorationLine: 'line-through',
    marginRight: theme.spacing.xs,
  },
  productDiscount: {
    fontSize: 10,
    color: theme.colors.status.error,
    fontWeight: 'bold',
    backgroundColor: '#FFE6E6',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  addToCartButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  addToCartText: {
    color: theme.colors.text.inverted,
    fontWeight: '600',
  },
});

export default ShopHomeScreen;