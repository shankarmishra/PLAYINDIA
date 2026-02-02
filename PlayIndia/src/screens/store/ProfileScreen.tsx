import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';
import useAuth from '../../hooks/useAuth';

type NavigationProp = StackNavigationProp<StoreTabParamList>;

interface StoreProfile {
  _id: string;
  storeName: string;
  ownerName: string;
  gst?: {
    number?: string;
  };
  category: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
  status: string;
  verified: boolean;
  userId?: {
    name: string;
    email: string;
    mobile: string;
  };
  documents?: {
    ownerID?: {
      front?: string;
      back?: string;
    };
    additionalDocs?: string[];
  };
  stats?: {
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
  };
}

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    gstNumber: '',
    category: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await ApiService.stores.getMyProfile();
      
      if (response.data && response.data.success) {
        const data = response.data.data;
        console.log('Store profile loaded:', {
          storeName: data.storeName,
          hasDocuments: !!data.documents,
          ownerID: data.documents?.ownerID,
          additionalDocs: data.documents?.additionalDocs,
          additionalDocsLength: data.documents?.additionalDocs?.length
        });
        setStoreProfile(data);
        setFormData({
          storeName: data.storeName || '',
          ownerName: data.ownerName || '',
          gstNumber: data.gst?.number || '',
          category: data.category || '',
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          pincode: data.address?.pincode || '',
          phone: data.contact?.phone || data.userId?.mobile || '',
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load store profile');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {
        storeName: formData.storeName,
        ownerName: formData.ownerName,
        gstNumber: formData.gstNumber,
        category: formData.category,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        contact: {
          phone: formData.phone,
        },
      };

      const response = await ApiService.stores.updateProfile(updateData);
      
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Profile updated successfully');
        setEditMode(false);
        await loadProfile();
      } else {
        throw new Error('Update failed');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Store Profile</Text>
        <TouchableOpacity
          onPress={() => {
            if (editMode) {
              setEditMode(false);
              loadProfile();
            } else {
              setEditMode(true);
            }
          }}
          style={styles.editButton}
        >
          <Ionicons
            name={editMode ? 'close-outline' : 'create-outline'}
            size={24}
            color="#1ED760"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header with Images */}
        <View style={styles.profileHeader}>
          {/* Store Photo */}
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionTitle}>Store Photo</Text>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => {
                // Try multiple possible locations for store photo
                const storePhoto = 
                  storeProfile?.documents?.additionalDocs?.[0] ||
                  storeProfile?.documents?.additionalDocs?.[1] ||
                  storeProfile?.storePhoto ||
                  storeProfile?.photo;
                if (storePhoto) {
                  setSelectedImage(storePhoto);
                  setImageModalVisible(true);
                } else {
                  Alert.alert('No Photo', 'Store photo not available');
                }
              }}
            >
              {(() => {
                // Try multiple possible locations for store photo
                const storePhoto = 
                  storeProfile?.documents?.additionalDocs?.[0] ||
                  storeProfile?.documents?.additionalDocs?.[1] ||
                  storeProfile?.storePhoto ||
                  storeProfile?.photo;
                
                if (storePhoto) {
                  return (
                    <Image
                      source={{ uri: storePhoto }}
                      style={styles.profileImage}
                      resizeMode="cover"
                      onError={(error) => {
                        console.log('Store photo load error:', error);
                      }}
                    />
                  );
                }
                return (
                  <View style={[styles.profileImage, styles.imagePlaceholder]}>
                    <Ionicons name="storefront" size={40} color="#9CA3AF" />
                    <Text style={styles.placeholderText}>No Photo</Text>
                  </View>
                );
              })()}
              <View style={styles.imageOverlay}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Owner Photo */}
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionTitle}>Owner Photo</Text>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => {
                // Try multiple possible locations for owner photo
                const ownerPhoto = 
                  storeProfile?.documents?.ownerID?.front ||
                  storeProfile?.documents?.ownerPhoto ||
                  storeProfile?.ownerPhoto;
                if (ownerPhoto) {
                  setSelectedImage(ownerPhoto);
                  setImageModalVisible(true);
                } else {
                  Alert.alert('No Photo', 'Owner photo not available');
                }
              }}
            >
              {(() => {
                // Try multiple possible locations for owner photo
                const ownerPhoto = 
                  storeProfile?.documents?.ownerID?.front ||
                  storeProfile?.documents?.ownerPhoto ||
                  storeProfile?.ownerPhoto;
                
                if (ownerPhoto) {
                  return (
                    <Image
                      source={{ uri: ownerPhoto }}
                      style={styles.profileImage}
                      resizeMode="cover"
                      onError={(error) => {
                        console.log('Owner photo load error:', error);
                      }}
                    />
                  );
                }
                return (
                  <View style={[styles.profileImage, styles.imagePlaceholder]}>
                    <Ionicons name="person" size={40} color="#9CA3AF" />
                    <Text style={styles.placeholderText}>No Photo</Text>
                  </View>
                );
              })()}
              <View style={styles.imageOverlay}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    storeProfile?.status === 'active'
                      ? '#D1FAE5'
                      : storeProfile?.status === 'pending'
                      ? '#FEF3C7'
                      : '#FEE2E2',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      storeProfile?.status === 'active'
                        ? '#10B981'
                        : storeProfile?.status === 'pending'
                        ? '#F59E0B'
                        : '#EF4444',
                  },
                ]}
              >
                {storeProfile?.status?.toUpperCase() || 'PENDING'}
              </Text>
            </View>
            {storeProfile?.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        </View>

        {/* Store Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Store Information</Text>
          
          {editMode ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Store Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.storeName}
                  onChangeText={(text) => setFormData({ ...formData, storeName: text })}
                  placeholder="Enter store name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Owner Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.ownerName}
                  onChangeText={(text) => setFormData({ ...formData, ownerName: text })}
                  placeholder="Enter owner name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>GST Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.gstNumber}
                  onChangeText={(text) => setFormData({ ...formData, gstNumber: text })}
                  placeholder="Enter GST number"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <TextInput
                  style={styles.input}
                  value={formData.category}
                  onChangeText={(text) => setFormData({ ...formData, category: text })}
                  placeholder="Enter category"
                />
              </View>
              
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="storefront-outline" size={20} color="#6B7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Store Name</Text>
                  <Text style={styles.infoValue}>
                    {storeProfile?.storeName || 'N/A'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Owner Name</Text>
                  <Text style={styles.infoValue}>
                    {storeProfile?.ownerName || 'N/A'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="document-text-outline" size={20} color="#6B7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>GST Number</Text>
                  <Text style={styles.infoValue}>
                    {storeProfile?.gst?.number || 'Not provided'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="grid-outline" size={20} color="#6B7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Category</Text>
                  <Text style={styles.infoValue}>
                    {storeProfile?.category || 'N/A'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {editMode ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={storeProfile?.userId?.email || ''}
                  editable={false}
                  placeholder="Email (cannot be changed)"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>
                    {storeProfile?.userId?.email || 'N/A'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#6B7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>
                    {storeProfile?.contact?.phone || storeProfile?.userId?.mobile || 'N/A'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Address Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Address</Text>
          
          {editMode ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Street</Text>
                <TextInput
                  style={styles.input}
                  value={formData.street}
                  onChangeText={(text) => setFormData({ ...formData, street: text })}
                  placeholder="Enter street address"
                  multiline
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    placeholder="City"
                  />
                </View>
                
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.state}
                    onChangeText={(text) => setFormData({ ...formData, state: text })}
                    placeholder="State"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  style={styles.input}
                  value={formData.pincode}
                  onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                  placeholder="Enter pincode"
                  keyboardType="number-pad"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#6B7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>
                    {storeProfile?.address?.street
                      ? `${storeProfile.address.street}, ${storeProfile.address.city || ''}, ${storeProfile.address.state || ''} - ${storeProfile.address.pincode || ''}`
                      : 'Not provided'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Ionicons name="analytics-outline" size={20} color="#3B82F6" />
            <Text style={styles.actionText}>View Analytics</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Inventory')}
          >
            <Ionicons name="cube-outline" size={20} color="#10B981" />
            <Text style={styles.actionText}>Manage Inventory</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Reports')}
          >
            <Ionicons name="document-text-outline" size={20} color="#F59E0B" />
            <Text style={styles.actionText}>View Reports</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Reviews')}
          >
            <Ionicons name="star-outline" size={20} color="#EF4444" />
            <Text style={styles.actionText}>View Reviews</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={20} color="#6B7280" />
            <Text style={styles.actionText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        {storeProfile?.stats && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="cart-outline" size={24} color="#3B82F6" />
                <Text style={styles.statValue}>
                  {storeProfile.stats.totalOrders || 0}
                </Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="cash-outline" size={24} color="#10B981" />
                <Text style={styles.statValue}>
                  {formatCurrency(storeProfile.stats.totalRevenue || 0)}
                </Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="star-outline" size={24} color="#F59E0B" />
                <Text style={styles.statValue}>
                  {storeProfile.stats.averageRating
                    ? storeProfile.stats.averageRating.toFixed(1)
                    : '0.0'}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          >
            <View style={styles.modalContent}>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              )}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setImageModalVisible(false)}
              >
                <Ionicons name="close-circle" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  editButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 16,
  },
  imageSection: {
    flex: 1,
    alignItems: 'center',
  },
  imageSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    width: (width - 72) / 2,
    height: (width - 72) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 40,
    height: width - 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
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
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1ED760',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAFBFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '700',
    flexShrink: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  saveButton: {
    backgroundColor: '#1ED760',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAFBFC',
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default ProfileScreen;
