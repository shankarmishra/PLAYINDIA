import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserTabParamList } from '../../navigation/types';
import { useCart } from '../../contexts/CartContext';

type NavigationProp = StackNavigationProp<UserTabParamList>;
type ProductDetailRouteProp = RouteProp<UserTabParamList, 'ProductDetail'>;

// Mock data for product images and reviews
const mockProductImages = [
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1622163642992-6c4ad786e58a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1601925260368-ae2f83d34b08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const { addToCart } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock product data - in real app, fetch from API using route.params.productId
  const product = {
    id: route.params?.productId || '1',
    name: 'Professional Cricket Bat',
    price: 2499,
    originalPrice: 3999,
    discount: 38,
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
    image: mockProductImages[0],
    category: 'Cricket',
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      category: product.category,
      size: selectedSize,
    });
    Alert.alert('Success', 'Product added to cart!', [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      category: product.category,
      size: selectedSize,
    });
    navigation.navigate('Cart');
  };

  const renderImage = ({ item, index }: any) => (
    <TouchableOpacity
      style={[
        styles.imageItem,
        {
          borderColor: selectedImageIndex === index
            ? '#2E7D32'
            : '#C8E6C9'
        }
      ]}
      onPress={() => setSelectedImageIndex(index)}
      activeOpacity={0.7}
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
                color={i < item.rating ? "#F59E0B" : "#CBD5E0"}
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} activeOpacity={0.7}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#EF4444" : "#1F2937"}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="share-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const screenWidth = Dimensions.get('window').width;
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setSelectedImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {mockProductImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.imagePagination}>
            {mockProductImages.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.paginationDot,
                  i === selectedImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

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
        <View style={styles.content}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>₹{product.price.toLocaleString()}</Text>
            <Text style={styles.originalPrice}>₹{product.originalPrice?.toLocaleString()}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(product.rating) ? "star" : "star-outline"}
                  size={16}
                  color={i < Math.floor(product.rating) ? "#F59E0B" : "#CBD5E0"}
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
                      ? '#2E7D32'
                      : '#FFFFFF',
                    borderColor: selectedSize === size ? '#2E7D32' : '#C8E6C9',
                  }
                ]}
                onPress={() => setSelectedSize(size)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.sizeText,
                  {
                    color: selectedSize === size
                      ? '#FFFFFF'
                      : '#1F2937'
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
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={20} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#1F2937" />
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
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
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
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={24} color="#2E7D32" />
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={handleBuyNow}
          activeOpacity={0.8}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  mainImage: {
    width: Dimensions.get('window').width,
    height: 350,
    backgroundColor: '#FFFFFF',
  },
  imagePagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(46, 125, 50, 0.2)',
  },
  paginationDotActive: {
    backgroundColor: '#2E7D32',
    width: 20,
  },
  thumbnailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  imageItem: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  productName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  currentPrice: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  originalPrice: {
    fontSize: 18,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 8,
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 24,
    marginBottom: 12,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    minWidth: 60,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  sizeText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 16,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    minWidth: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 8,
  },
  featuresContainer: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#475569',
    marginLeft: 10,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  reviewComment: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#C8E6C9',
    gap: 12,
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
  },
  cartButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductDetailScreen;
