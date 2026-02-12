import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<StoreTabParamList>;
type RouteProp = RouteProp<StoreTabParamList, 'CreateAd'>;

const adTypes = [
  {
    value: 'home-banner',
    label: 'Home Banner Ad',
    description: 'Top banner on home page',
    price: 500,
    icon: '🏠',
  },
  {
    value: 'category-banner',
    label: 'Category Banner',
    description: 'Inside category pages',
    price: 300,
    icon: '📂',
  },
  {
    value: 'sponsored-product',
    label: 'Sponsored Product',
    description: 'Appears in product lists',
    price: 200,
    icon: '⭐',
  },
];

const categories = [
  'cricket',
  'football',
  'badminton',
  'tennis',
  'gym',
  'multi-sports',
  'sports-wear',
  'accessories',
  'all',
];

const CreateAdScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const adId = route.params?.adId;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    productId: '',
    adType: '',
    title: '',
    description: '',
    bannerImage: '',
    targetCities: [] as string[],
    targetStates: [] as string[],
    targetCategory: 'all',
    targetGender: 'all',
    startDate: '',
    endDate: '',
    totalBudget: '',
    dailyBudget: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  useEffect(() => {
    loadStoreAndProducts();
  }, []);

  const loadStoreAndProducts = async () => {
    try {
      setLoading(true);
      const profileResponse = await ApiService.stores.getMyProfile();
      if (profileResponse.data && profileResponse.data.success) {
        const storeData = profileResponse.data.data;
        setStoreId(storeData._id);

        // Load products
        const productsResponse = await ApiService.stores.getProducts(storeData._id);
        if (productsResponse.data && productsResponse.data.success) {
          setProducts(productsResponse.data.data || []);
        }
      }
    } catch (error: any) {
      console.error('Error loading store/products:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.productId) {
        newErrors.productId = 'Please select a product';
      }
    } else if (stepNum === 2) {
      if (!formData.adType) {
        newErrors.adType = 'Please select an ad type';
      }
    } else if (stepNum === 3) {
      // Targeting validation (optional)
    } else if (stepNum === 4) {
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
      }
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required';
      }
      if (!formData.totalBudget) {
        newErrors.totalBudget = 'Total budget is required';
      }
      if (!formData.dailyBudget) {
        newErrors.dailyBudget = 'Daily budget is required';
      }
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end <= start) {
          newErrors.endDate = 'End date must be after start date';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      
      // Validate dates
      if (!formData.startDate || !formData.endDate) {
        Alert.alert('Error', 'Please select both start and end dates');
        setSaving(false);
        return;
      }

      // Calculate days for pricing
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (days <= 0) {
        Alert.alert('Error', 'End date must be after start date');
        setSaving(false);
        return;
      }

      const adData = {
        productId: formData.productId,
        adType: formData.adType,
        title: formData.title || products.find(p => p._id === formData.productId)?.name,
        description: formData.description,
        bannerImage: formData.bannerImage || (products.find(p => p._id === formData.productId)?.images?.[0] || ''),
        targetCities: Array.isArray(formData.targetCities) ? formData.targetCities : [],
        targetStates: Array.isArray(formData.targetStates) ? formData.targetStates : [],
        targetCategory: formData.targetCategory || 'all',
        targetGender: formData.targetGender || 'all',
        // Backend needs both: duration object for pricing calculation AND separate startDate/endDate
        duration: {
          startDate: formData.startDate,
          endDate: formData.endDate
        },
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalBudget: parseFloat(formData.totalBudget) || 0,
        dailyBudget: parseFloat(formData.dailyBudget) || 0,
      };

      console.log('Creating ad with data:', JSON.stringify(adData, null, 2));

      const response = await ApiService.ads.createAd(adData);

      if (response.data && response.data.success) {
        const ad = response.data.data;
        const paymentAmount = ad.payment?.amount || estimatedCost;
        
        // Show payment options
        Alert.alert(
          'Ad Created Successfully!',
          `Total Cost: ₹${paymentAmount.toLocaleString('en-IN')}\n\nChoose payment method:`,
          [
            {
              text: 'Pay with Wallet',
              onPress: async () => {
                try {
                  const submitResponse = await ApiService.ads.submitAd(ad._id, {
                    paymentMethod: 'wallet'
                  });
                  if (submitResponse.data && submitResponse.data.success) {
                    Alert.alert('Success', 'Payment completed! Ad submitted for approval.', [
                      { text: 'OK', onPress: () => navigation.navigate('Ads') }
                    ]);
                  } else {
                    throw new Error('Payment failed');
                  }
                } catch (error: any) {
                  Alert.alert('Payment Failed', error.response?.data?.message || 'Insufficient balance or payment failed');
                }
              }
            },
            {
              text: 'Pay Later',
              style: 'cancel',
              onPress: () => {
                Alert.alert('Payment Pending', 'Please complete payment to submit ad for approval.', [
                  { text: 'OK', onPress: () => navigation.navigate('Ads') }
                ]);
              }
            }
          ]
        );
      } else {
        throw new Error('Failed to create ad');
      }
    } catch (error: any) {
      console.error('Error creating ad:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create ad');
    } finally {
      setSaving(false);
    }
  };

  const selectedProduct = products.find((p) => p._id === formData.productId);
  const selectedAdType = adTypes.find((at) => at.value === formData.adType);
  const days = formData.startDate && formData.endDate
    ? Math.ceil(
        (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;
  const estimatedCost = selectedAdType && days > 0 ? selectedAdType.price * days : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Ad</Text>
        <View style={styles.backButton} />
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((stepNum) => (
          <React.Fragment key={stepNum}>
            <View
              style={[
                styles.progressStep,
                step >= stepNum && styles.progressStepActive,
              ]}
            >
              <Text
                style={[
                  styles.progressStepText,
                  step >= stepNum && styles.progressStepTextActive,
                ]}
              >
                {stepNum}
              </Text>
            </View>
            {stepNum < 5 && (
              <View
                style={[
                  styles.progressLine,
                  step > stepNum && styles.progressLineActive,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1: Select Product */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Select Product to Promote</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.productsList}>
              {products.map((item) => (
                <TouchableOpacity
                  style={[
                    styles.productOption,
                    formData.productId === item._id && styles.productOptionSelected,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, productId: item._id });
                    setErrors({ ...errors, productId: '' });
                  }}
                >
                  {item.images && item.images[0] && 
                   typeof item.images[0] === 'string' && 
                   (item.images[0].startsWith('http://') || item.images[0].startsWith('https://')) ? (
                    <Image
                      source={{ 
                        uri: item.images[0],
                        cache: 'default'
                      }}
                      style={styles.productOptionImage}
                      resizeMode="cover"
                      onError={(error) => {
                        console.log('Product image load error:', item.images[0]);
                      }}
                    />
                  ) : (
                    <View style={[styles.productOptionImage, styles.productOptionImagePlaceholder]}>
                      <Ionicons name="cube-outline" size={24} color="#9CA3AF" />
                    </View>
                  )}
                  <View style={styles.productOptionInfo}>
                    <Text style={styles.productOptionName}>{item.name}</Text>
                    <Text style={styles.productOptionPrice}>
                      ₹{item.price?.selling || item.price || 0}
                    </Text>
                  </View>
                  {formData.productId === item._id && (
                    <Ionicons name="checkmark-circle" size={24} color="#1ED760" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.productId && (
              <Text style={styles.errorText}>{errors.productId}</Text>
            )}
          </View>
        )}

        {/* Step 2: Choose Ad Type */}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Choose Ad Type</Text>
            <Text style={styles.stepDescription}>
              Select where you want your ad to appear
            </Text>
            {adTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.adTypeCard,
                  formData.adType === type.value && styles.adTypeCardSelected,
                ]}
                onPress={() => {
                  setFormData({ ...formData, adType: type.value });
                  setErrors({ ...errors, adType: '' });
                }}
              >
                <View style={styles.adTypeHeader}>
                  <Text style={styles.adTypeIcon}>{type.icon}</Text>
                  <View style={styles.adTypeInfo}>
                    <Text style={styles.adTypeLabel}>{type.label}</Text>
                    <Text style={styles.adTypeDescription}>{type.description}</Text>
                  </View>
                  <View style={styles.adTypePrice}>
                    <Text style={styles.adTypePriceText}>₹{type.price}</Text>
                    <Text style={styles.adTypePriceLabel}>/day</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {errors.adType && (
              <Text style={styles.errorText}>{errors.adType}</Text>
            )}
          </View>
        )}

        {/* Step 3: Targeting */}
        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>Target Audience</Text>
            <Text style={styles.stepDescription}>
              Select who should see your ad
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      formData.targetCategory === cat && styles.categoryChipActive,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, targetCategory: cat })
                    }
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        formData.targetCategory === cat &&
                          styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter cities (comma separated)"
                value={formData.targetCities.join(', ')}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    targetCities: text
                      .split(',')
                      .map((c) => c.trim())
                      .filter((c) => c),
                  })
                }
              />
            </View>
          </View>
        )}

        {/* Step 4: Budget & Duration */}
        {step === 4 && (
          <View>
            <Text style={styles.stepTitle}>Budget & Duration</Text>
            <Text style={styles.stepDescription}>
              Set your ad budget and duration
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date *</Text>
              <TouchableOpacity
                style={[styles.input, styles.dateInput, errors.startDate && styles.inputError]}
                onPress={() => {
                  setTempStartDate(formData.startDate || '');
                  setShowStartDatePicker(true);
                }}
              >
                <Text style={formData.startDate ? styles.dateText : styles.datePlaceholder}>
                  {formData.startDate || 'Tap to select start date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
              {errors.startDate && (
                <Text style={styles.errorText}>{errors.startDate}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>End Date *</Text>
              <TouchableOpacity
                style={[styles.input, styles.dateInput, errors.endDate && styles.inputError]}
                onPress={() => {
                  setTempEndDate(formData.endDate || '');
                  setShowEndDatePicker(true);
                }}
              >
                <Text style={formData.endDate ? styles.dateText : styles.datePlaceholder}>
                  {formData.endDate || 'Tap to select end date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
              {errors.endDate && (
                <Text style={styles.errorText}>{errors.endDate}</Text>
              )}
            </View>

            {days > 0 && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>
                  Duration: {days} day{days > 1 ? 's' : ''}
                </Text>
                {selectedAdType && (
                  <Text style={styles.summaryText}>
                    Estimated Cost: ₹{estimatedCost.toLocaleString('en-IN')}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Budget (₹) *</Text>
              <TextInput
                style={[styles.input, errors.totalBudget && styles.inputError]}
                placeholder="0"
                value={formData.totalBudget}
                onChangeText={(text) => {
                  setFormData({ ...formData, totalBudget: text });
                  setErrors({ ...errors, totalBudget: '' });
                }}
                keyboardType="decimal-pad"
              />
              {errors.totalBudget && (
                <Text style={styles.errorText}>{errors.totalBudget}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.budgetHeader}>
                <Text style={styles.label}>Daily Budget (₹) *</Text>
                <Text style={styles.budgetValue}>
                  ₹{parseFloat(formData.dailyBudget || '0').toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View
                    style={[
                      styles.sliderFill,
                      {
                        width: `${Math.min(
                          (parseFloat(formData.dailyBudget || '0') / 10000) * 100,
                          100
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>₹0</Text>
                  <Text style={styles.sliderLabel}>₹10,000</Text>
                </View>
              </View>
              <View style={styles.budgetInputRow}>
                <TouchableOpacity
                  style={styles.budgetButton}
                  onPress={() => {
                    const current = parseFloat(formData.dailyBudget || '0');
                    const newValue = Math.max(0, current - 100);
                    setFormData({ ...formData, dailyBudget: newValue.toString() });
                  }}
                >
                  <Ionicons name="remove" size={20} color="#1ED760" />
                </TouchableOpacity>
                <TextInput
                  style={[styles.budgetInput, errors.dailyBudget && styles.inputError]}
                  placeholder="0"
                  value={formData.dailyBudget}
                  onChangeText={(text) => {
                    const numValue = text.replace(/[^0-9.]/g, '');
                    setFormData({ ...formData, dailyBudget: numValue });
                    setErrors({ ...errors, dailyBudget: '' });
                  }}
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity
                  style={styles.budgetButton}
                  onPress={() => {
                    const current = parseFloat(formData.dailyBudget || '0');
                    const newValue = Math.min(10000, current + 100);
                    setFormData({ ...formData, dailyBudget: newValue.toString() });
                  }}
                >
                  <Ionicons name="add" size={20} color="#1ED760" />
                </TouchableOpacity>
              </View>
              {errors.dailyBudget && (
                <Text style={styles.errorText}>{errors.dailyBudget}</Text>
              )}
              {days > 0 && formData.dailyBudget && (
                <View style={styles.estimateCard}>
                  <Text style={styles.estimateLabel}>Estimated Metrics:</Text>
                  <Text style={styles.estimateText}>
                    Views: ~{Math.floor(parseFloat(formData.dailyBudget || '0') * 10).toLocaleString('en-IN')} per day
                  </Text>
                  <Text style={styles.estimateText}>
                    Clicks: ~{Math.floor(parseFloat(formData.dailyBudget || '0') * 0.5).toLocaleString('en-IN')} per day
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Step 5: Preview & Submit */}
        {step === 5 && (
          <View>
            <Text style={styles.stepTitle}>Ad Preview</Text>
            <View style={styles.previewCard}>
              {formData.bannerImage || selectedProduct?.images?.[0] ? (
                <Image
                  source={{
                    uri: formData.bannerImage || selectedProduct.images[0],
                  }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.previewImage, styles.previewImagePlaceholder]}>
                  <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                </View>
              )}
              <View style={styles.previewContent}>
                <Text style={styles.previewTitle}>
                  {formData.title || selectedProduct?.name}
                </Text>
                <Text style={styles.previewDescription}>
                  {formData.description || selectedProduct?.description}
                </Text>
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>SPONSORED</Text>
                </View>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Ad Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Product:</Text>
                <Text style={styles.summaryValue}>
                  {selectedProduct?.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ad Type:</Text>
                <Text style={styles.summaryValue}>
                  {selectedAdType?.label || 'N/A'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration:</Text>
                <Text style={styles.summaryValue}>
                  {days} day{days > 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Budget:</Text>
                <Text style={styles.summaryValue}>
                  ₹{formData.totalBudget || '0'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backButtonLarge}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.nextButton,
              saving && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.nextButtonText}>
                {step === 5 ? 'Create Ad' : 'Next'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Start Date Picker Modal */}
      <Modal
        visible={showStartDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStartDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Start Date</Text>
              <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Enter date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.modalDateInput}
                placeholder="2024-01-01"
                value={tempStartDate}
                onChangeText={setTempStartDate}
                keyboardType="default"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.dateHint}>
                Example: {new Date().toISOString().split('T')[0]}
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowStartDatePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  // Validate date format
                  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                  if (dateRegex.test(tempStartDate)) {
                    const date = new Date(tempStartDate);
                    if (!isNaN(date.getTime())) {
                      setFormData({ ...formData, startDate: tempStartDate });
                      setErrors({ ...errors, startDate: '' });
                      setShowStartDatePicker(false);
                    } else {
                      Alert.alert('Invalid Date', 'Please enter a valid date');
                    }
                  } else {
                    Alert.alert('Invalid Format', 'Please use YYYY-MM-DD format (e.g., 2024-01-15)');
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* End Date Picker Modal */}
      <Modal
        visible={showEndDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEndDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select End Date</Text>
              <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Enter date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.modalDateInput}
                placeholder="2024-12-31"
                value={tempEndDate}
                onChangeText={setTempEndDate}
                keyboardType="default"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.dateHint}>
                Example: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEndDatePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  // Validate date format
                  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                  if (dateRegex.test(tempEndDate)) {
                    const date = new Date(tempEndDate);
                    if (!isNaN(date.getTime())) {
                      // Check if end date is after start date
                      if (formData.startDate && tempEndDate <= formData.startDate) {
                        Alert.alert('Invalid Date', 'End date must be after start date');
                        return;
                      }
                      setFormData({ ...formData, endDate: tempEndDate });
                      setErrors({ ...errors, endDate: '' });
                      setShowEndDatePicker(false);
                    } else {
                      Alert.alert('Invalid Date', 'Please enter a valid date');
                    }
                  } else {
                    Alert.alert('Invalid Format', 'Please use YYYY-MM-DD format (e.g., 2024-12-31)');
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#1ED760',
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  progressStepTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#1ED760',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 16,
  },
  productsList: {
    maxHeight: 400,
  },
  productOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  productOptionSelected: {
    borderColor: '#1ED760',
    backgroundColor: '#F0FDF4',
  },
  productOptionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  productOptionImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productOptionInfo: {
    flex: 1,
  },
  productOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productOptionPrice: {
    fontSize: 14,
    color: '#6B7280',
  },
  adTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  adTypeCardSelected: {
    borderColor: '#1ED760',
    backgroundColor: '#F0FDF4',
  },
  adTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adTypeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  adTypeInfo: {
    flex: 1,
  },
  adTypeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  adTypeDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  adTypePrice: {
    alignItems: 'flex-end',
  },
  adTypePriceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1ED760',
  },
  adTypePriceLabel: {
    fontSize: 10,
    color: '#6B7280',
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
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#1F2937',
  },
  datePlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1ED760',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#1ED760',
    borderRadius: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  budgetInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1ED760',
  },
  budgetInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  estimateCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1ED760',
  },
  estimateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  estimateText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  // Date Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  dateInputContainer: {
    marginBottom: 20,
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalDateInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  dateHint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#1ED760',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
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
  },
  categoryChipActive: {
    backgroundColor: '#1ED760',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1ED760',
  },
  summaryText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
    fontWeight: '600',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  previewImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    padding: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  previewBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButtonLarge: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#1ED760',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CreateAdScreen;

