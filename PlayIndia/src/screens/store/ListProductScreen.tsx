import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';

type NavigationProp = StackNavigationProp<StoreTabParamList>;
type RouteProp = RouteProp<StoreTabParamList, 'ListProduct'>;

const categories = [
  { value: 'cricket', label: 'Cricket' },
  { value: 'football', label: 'Football' },
  { value: 'badminton', label: 'Badminton' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'gym', label: 'Gym' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'sports-wear', label: 'Sports Wear' },
  { value: 'accessories', label: 'Accessories' },
];

const ListProductScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const productId = route.params?.productId;
  const isEditMode = !!productId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    sku: '',
    originalPrice: '',
    sellingPrice: '',
    quantity: '',
    isActive: true,
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadStoreProfile();
    if (isEditMode && productId) {
      loadProduct();
    }
  }, []);

  const loadStoreProfile = async () => {
    try {
      const response = await ApiService.stores.getMyProfile();
      if (response.data && response.data.success) {
        setStoreId(response.data.data._id);
      }
    } catch (error: any) {
      console.error('Error loading store profile:', error);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      // For now, we'll need to get product from store products list
      // In a real app, you'd have a getProductById endpoint
      Alert.alert('Info', 'Edit mode - loading product data...');
    } catch (error: any) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.originalPrice) {
      newErrors.originalPrice = 'Original price is required';
    } else if (parseFloat(formData.originalPrice) <= 0) {
      newErrors.originalPrice = 'Price must be greater than 0';
    }

    if (!formData.sellingPrice) {
      newErrors.sellingPrice = 'Selling price is required';
    } else if (parseFloat(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Price must be greater than 0';
    } else if (parseFloat(formData.sellingPrice) > parseFloat(formData.originalPrice || '0')) {
      newErrors.sellingPrice = 'Selling price cannot be greater than original price';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    if (!storeId) {
      Alert.alert('Error', 'Store ID not found');
      return;
    }

    try {
      setSaving(true);
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        brand: formData.brand.trim() || undefined,
        sku: formData.sku.trim() || undefined, // Will be auto-generated if not provided
        price: {
          original: parseFloat(formData.originalPrice),
          selling: parseFloat(formData.sellingPrice),
          discount: formData.originalPrice && formData.sellingPrice
            ? Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.sellingPrice)) / parseFloat(formData.originalPrice)) * 100)
            : 0,
        },
        inventory: {
          quantity: parseInt(formData.quantity),
        },
        availability: {
          isActive: formData.isActive,
        },
        images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [],
      };

      if (isEditMode && productId) {
        // Update existing product
        const response = await ApiService.stores.updateProduct(productId, productData);
        if (response.data && response.data.success) {
          Alert.alert('Success', 'Product updated successfully', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else {
          throw new Error('Update failed');
        }
      } else {
        // Create new product
        const response = await ApiService.stores.addProduct(storeId, productData);
        if (response.data && response.data.success) {
          Alert.alert('Success', 'Product added successfully', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else {
          throw new Error('Add failed');
        }
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      Alert.alert('Error', error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading product...</Text>
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
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Product' : 'Add Product'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Product Image Preview */}
        {formData.imageUrl && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: formData.imageUrl }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setFormData({ ...formData, imageUrl: '' })}
            >
              <Ionicons name="close-circle" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Product Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Product Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter product name"
            placeholderTextColor="#9CA3AF"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            value={formData.description}
            onChangeText={(text) => {
              setFormData({ ...formData, description: text });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            placeholder="Enter product description"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryChip,
                  formData.category === cat.value && styles.categoryChipActive,
                ]}
                onPress={() => {
                  setFormData({ ...formData, category: cat.value });
                  if (errors.category) setErrors({ ...errors, category: '' });
                }}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    formData.category === cat.value && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>

        {/* Brand */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
            placeholder="Enter brand name (optional)"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* SKU */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>SKU</Text>
          <TextInput
            style={styles.input}
            value={formData.sku}
            onChangeText={(text) => setFormData({ ...formData, sku: text })}
            placeholder="Auto-generated if not provided"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.helperText}>
            Leave empty to auto-generate SKU
          </Text>
        </View>

        {/* Price Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>
              Original Price (₹) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.originalPrice && styles.inputError]}
              value={formData.originalPrice}
              onChangeText={(text) => {
                setFormData({ ...formData, originalPrice: text });
                if (errors.originalPrice) setErrors({ ...errors, originalPrice: '' });
              }}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
            {errors.originalPrice && (
              <Text style={styles.errorText}>{errors.originalPrice}</Text>
            )}
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>
              Selling Price (₹) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.sellingPrice && styles.inputError]}
              value={formData.sellingPrice}
              onChangeText={(text) => {
                setFormData({ ...formData, sellingPrice: text });
                if (errors.sellingPrice) setErrors({ ...errors, sellingPrice: '' });
              }}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
            {errors.sellingPrice && (
              <Text style={styles.errorText}>{errors.sellingPrice}</Text>
            )}
          </View>
        </View>

        {/* Discount Display */}
        {formData.originalPrice && formData.sellingPrice && (
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>
              Discount:{' '}
              {Math.round(
                ((parseFloat(formData.originalPrice) -
                  parseFloat(formData.sellingPrice)) /
                  parseFloat(formData.originalPrice)) *
                  100
              )}
              %
            </Text>
          </View>
        )}

        {/* Quantity */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Stock Quantity <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            value={formData.quantity}
            onChangeText={(text) => {
              setFormData({ ...formData, quantity: text });
              if (errors.quantity) setErrors({ ...errors, quantity: '' });
            }}
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
          />
          {errors.quantity && (
            <Text style={styles.errorText}>{errors.quantity}</Text>
          )}
        </View>

        {/* Image URL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Image URL</Text>
          <TextInput
            style={styles.input}
            value={formData.imageUrl}
            onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
            placeholder="Enter image URL"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
          />
          <Text style={styles.helperText}>
            Enter a valid image URL (optional)
          </Text>
        </View>

        {/* Active Status */}
        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={() =>
              setFormData({ ...formData, isActive: !formData.isActive })
            }
          >
            <View
              style={[
                styles.toggle,
                formData.isActive && styles.toggleActive,
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  formData.isActive && styles.toggleThumbActive,
                ]}
              />
            </View>
            <Text style={styles.toggleLabel}>
              Product is {formData.isActive ? 'Active' : 'Inactive'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditMode ? 'Update Product' : 'Add Product'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#1ED760',
    borderColor: '#1ED760',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  discountContainer: {
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  discountText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#1ED760',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  toggleLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#1ED760',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ListProductScreen;
