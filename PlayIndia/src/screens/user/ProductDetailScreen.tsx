import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for product images and reviews
const mockProductImages = [
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300',
];

const mockReviews = [
  {
    id: '1',
    userName: 'Rahul Sharma',
    userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    comment: 'Great quality product! Exactly as described.',
    date: '2 days ago',
  },
  {
    id: '2',
    userName: 'Priya Patel',
    userImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    comment: 'Good product, fast delivery.',
    date: '1 week ago',
  },
  {
    id: '3',
    userName: 'Amit Kumar',
    userImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 5,
    comment: 'Excellent value for money!',
    date: '2 weeks ago',
  },
];

const ProductDetailScreen = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  const product = {
    name: 'Professional Cricket Bat',
    price: '₹2,499',
    originalPrice: '₹3,999',
    discount: '38% OFF',
    rating: 4.5,
    description: 'Premium cricket bat made from high-quality willow wood. Perfect balance and sweet spot for maximum power and control. Ideal for professional and amateur players.',
    features: [
      'Premium willow wood',
      'Perfect balance',
      'Sweet spot for maximum power',
      'Professional grade',
      'Ideal for all levels',
    ],
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
  };

  const renderImage = ({ item, index }: any) => (
    <TouchableOpacity 
      style={[
        styles.imageItem, 
        { 
          borderColor: selectedImageIndex === index 
            ? theme.colors.accent.neonGreen 
            : theme.colors.ui.border 
        }
      ]}
      onPress={() => setSelectedImageIndex(index)}
    >
      <Image source={{ uri: item }} style={styles.thumbnailImage} />
    </TouchableOpacity>
  );

  const renderReview = ({ item }: any) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.userImage }} style={styles.reviewUserImage} />
        <View style={styles.reviewUserInfo}>
          <Text style={styles.reviewUserName}>{item.userName}</Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, i) => (
              <Ionicons 
                key={i} 
                name={i < item.rating ? "star" : "star-outline"} 
                size={14} 
                color={i < item.rating ? theme.colors.accent.orange : theme.colors.text.disabled} 
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="share" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Product Images */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / 300);
          setSelectedImageIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {mockProductImages.map((image, index) => (
          <Image 
            key={index} 
            source={{ uri: image }} 
            style={styles.mainImage} 
          />
        ))}
      </ScrollView>

      {/* Image Thumbnails */}
      <FlatList
        data={mockProductImages}
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailsContainer}
      />

      {/* Product Info */}
      <ScrollView style={styles.content}>
        <Text style={styles.productName}>{product.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{product.price}</Text>
          <Text style={styles.originalPrice}>{product.originalPrice}</Text>
          <Text style={styles.discount}>{product.discount}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingStars}>
            {[...Array(5)].map((_, i) => (
              <Ionicons 
                key={i} 
                name={i < Math.floor(product.rating) ? "star" : "star-outline"} 
                size={16} 
                color={i < Math.floor(product.rating) ? theme.colors.accent.orange : theme.colors.text.disabled} 
              />
            ))}
          </View>
          <Text style={styles.ratingText}>{product.rating} • 128 reviews</Text>
        </View>

        {/* Size Selection */}
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.sizeContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity 
              key={size}
              style={[
                styles.sizeOption,
                { 
                  backgroundColor: selectedSize === size 
                    ? theme.colors.accent.neonGreen 
                    : theme.colors.background.secondary 
                }
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[
                styles.sizeText,
                { 
                  color: selectedSize === size 
                    ? theme.colors.text.inverted 
                    : theme.colors.text.primary 
                }
              ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quantity */}
        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Features */}
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresContainer}>
          {product.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <Text style={styles.sectionTitle}>Reviews (128)</Text>
        <FlatList
          data={mockReviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color={theme.colors.text.inverted} />
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.small,
  },
  mainImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: theme.spacing.md,
  },
  thumbnailsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  imageItem: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.small,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.accent.neonGreen,
    marginRight: theme.spacing.sm,
  },
  originalPrice: {
    fontSize: 16,
    color: theme.colors.text.disabled,
    textDecorationLine: 'line-through',
    marginRight: theme.spacing.sm,
  },
  discount: {
    fontSize: 14,
    color: theme.colors.status.error,
    fontWeight: 'bold',
    backgroundColor: '#FFE6E6',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: theme.spacing.sm,
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeOption: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  sizeText: {
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: theme.spacing.lg,
    color: theme.colors.text.primary,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  reviewCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reviewUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  reviewRating: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  reviewComment: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.sm,
  },
  cartButtonText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: theme.spacing.sm,
  },
  buyButton: {
    flex: 1,
    backgroundColor: theme.colors.accent.neonGreen,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: theme.colors.text.inverted,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductDetailScreen;