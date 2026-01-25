import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreTabParamList } from '../../navigation/StoreNav';
import ApiService from '../../services/ApiService';
import useAuth from '../../hooks/useAuth';

type NavigationProp = StackNavigationProp<StoreTabParamList>;

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeProfile, setStoreProfile] = useState<any>(null);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    lowStockAlerts: true,
    reviewNotifications: true,
    promotional: false,
  });

  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    autoAcceptOrders: false,
    requireApproval: false,
    allowBackorders: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await ApiService.stores.getMyProfile();
      
      if (response.data && response.data.success) {
        setStoreProfile(response.data.data);
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // In a real app, you'd have a settings update endpoint
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'LoginWelcome' }],
                }),
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading settings...</Text>
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Store Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Store Information</Text>
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
              <Text style={styles.infoLabel}>Owner</Text>
              <Text style={styles.infoValue}>
                {storeProfile?.ownerName || 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {storeProfile?.userId?.email || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={20} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Order Updates</Text>
                <Text style={styles.settingDescription}>
                  Get notified about new orders
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.orderUpdates}
              onValueChange={(value) =>
                setNotifications({ ...notifications, orderUpdates: value })
              }
              trackColor={{ false: '#E5E7EB', true: '#1ED760' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="warning-outline" size={20} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Low Stock Alerts</Text>
                <Text style={styles.settingDescription}>
                  Get notified when stock is low
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.lowStockAlerts}
              onValueChange={(value) =>
                setNotifications({ ...notifications, lowStockAlerts: value })
              }
              trackColor={{ false: '#E5E7EB', true: '#1ED760' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="star-outline" size={20} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Review Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get notified about new reviews
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.reviewNotifications}
              onValueChange={(value) =>
                setNotifications({ ...notifications, reviewNotifications: value })
              }
              trackColor={{ false: '#E5E7EB', true: '#1ED760' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="megaphone-outline" size={20} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Promotional</Text>
                <Text style={styles.settingDescription}>
                  Receive promotional updates
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.promotional}
              onValueChange={(value) =>
                setNotifications({ ...notifications, promotional: value })
              }
              trackColor={{ false: '#E5E7EB', true: '#1ED760' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Store Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Store Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Auto Accept Orders</Text>
                <Text style={styles.settingDescription}>
                  Automatically accept new orders
                </Text>
              </View>
            </View>
            <Switch
              value={storeSettings.autoAcceptOrders}
              onValueChange={(value) =>
                setStoreSettings({ ...storeSettings, autoAcceptOrders: value })
              }
              trackColor={{ false: '#E5E7EB', true: '#1ED760' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Require Approval</Text>
                <Text style={styles.settingDescription}>
                  Require approval for orders
                </Text>
              </View>
            </View>
            <Switch
              value={storeSettings.requireApproval}
              onValueChange={(value) =>
                setStoreSettings({ ...storeSettings, requireApproval: value })
              }
              trackColor={{ false: '#E5E7EB', true: '#1ED760' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="cube-outline" size={20} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Allow Backorders</Text>
                <Text style={styles.settingDescription}>
                  Allow orders when out of stock
                </Text>
              </View>
            </View>
            <Switch
              value={storeSettings.allowBackorders}
              onValueChange={(value) =>
                setStoreSettings({ ...storeSettings, allowBackorders: value })
              }
              trackColor={{ false: '#E5E7EB', true: '#1ED760' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <Text style={styles.actionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Ionicons name="analytics-outline" size={20} color="#6B7280" />
            <Text style={styles.actionText}>View Analytics</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Reports')}
          >
            <Ionicons name="document-text-outline" size={20} color="#6B7280" />
            <Text style={styles.actionText}>View Reports</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
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
    fontSize: 24,
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
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: '#1ED760',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SettingsScreen;
