import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import ApiService from '../../services/ApiService';
import useAuth from '../../hooks/useAuth';
import AsyncStorage from '../../utils/AsyncStorageSafe';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const StoreApprovalTrackingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    loadStoreStatus();
  }, []);

  const loadStoreStatus = async () => {
    try {
      setLoading(true);
      // Fetch user profile to get store status
      const response = await ApiService.auth.me();
      if (response.data && response.data.success) {
        const userData = response.data.user || response.data;
        console.log('Store tracking - User data:', {
          email: userData.email,
          createdAt: userData.createdAt,
          status: userData.status,
          role: userData.role,
          roleData: userData.roleData
        });
        
        setStoreData(userData);
        
        // If user is approved, redirect to store dashboard
        if (userData.status === 'active' && (userData.role === 'seller' || userData.role === 'store')) {
          // Ensure userType is set correctly before navigation
          await AsyncStorage.setItem('userType', userData.role || 'store');
          navigation.replace('StoreMain');
        }
      }
    } catch (error: any) {
      console.error('Error loading store status:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadStoreStatus(), refreshUser()]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: 'time-outline',
          color: '#F59E0B',
          bgColor: '#FEF3C7',
          title: 'Pending Approval',
          message: 'Your store registration is under review. Our admin team will review your application shortly.',
          steps: [
            { label: 'Registration Submitted', completed: true },
            { label: 'Document Verification', completed: false },
            { label: 'Admin Review', completed: false },
            { label: 'Approval', completed: false },
          ],
        };
      case 'rejected':
        return {
          icon: 'close-circle-outline',
          color: '#EF4444',
          bgColor: '#FEE2E2',
          title: 'Application Rejected',
          message: 'Your store registration has been rejected. Please contact support for more information.',
          steps: [
            { label: 'Registration Submitted', completed: true },
            { label: 'Document Verification', completed: true },
            { label: 'Admin Review', completed: true },
            { label: 'Approval', completed: false },
          ],
        };
      case 'active':
        return {
          icon: 'checkmark-circle-outline',
          color: '#10B981',
          bgColor: '#D1FAE5',
          title: 'Approved',
          message: 'Congratulations! Your store has been approved. You can now start managing your store.',
          steps: [
            { label: 'Registration Submitted', completed: true },
            { label: 'Document Verification', completed: true },
            { label: 'Admin Review', completed: true },
            { label: 'Approval', completed: true },
          ],
        };
      default:
        return {
          icon: 'help-circle-outline',
          color: '#6B7280',
          bgColor: '#F3F4F6',
          title: 'Unknown Status',
          message: 'Unable to determine your store status.',
          steps: [],
        };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading status...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const status = storeData?.status || 'pending';
  const statusInfo = getStatusInfo(status);

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
        <Text style={styles.headerTitle}>Store Approval Status</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: statusInfo.bgColor }]}>
          <View style={styles.statusIconContainer}>
            <Ionicons name={statusInfo.icon} size={48} color={statusInfo.color} />
          </View>
          <Text style={[styles.statusTitle, { color: statusInfo.color }]}>
            {statusInfo.title}
          </Text>
          <Text style={styles.statusMessage}>{statusInfo.message}</Text>
        </View>

        {/* Store Information */}
        {storeData && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Store Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Store Name:</Text>
              <Text style={styles.infoValue}>
                {storeData.roleData?.storeName || storeData.name || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Owner Name:</Text>
              <Text style={styles.infoValue}>
                {storeData.roleData?.ownerName || storeData.name || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>
                {storeData.email || storeData.user?.email || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile:</Text>
              <Text style={styles.infoValue}>
                {storeData.mobile || storeData.user?.mobile || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                  {status.toUpperCase()}
                </Text>
              </View>
            </View>
            {(storeData.createdAt || storeData.user?.createdAt) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Registered On:</Text>
                <Text style={styles.infoValue}>
                  {new Date(storeData.createdAt || storeData.user?.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Progress Steps */}
        {statusInfo.steps.length > 0 && (
          <View style={styles.stepsCard}>
            <Text style={styles.sectionTitle}>Approval Process</Text>
            {statusInfo.steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepIcon,
                    {
                      backgroundColor: step.completed ? '#10B981' : '#E5E7EB',
                    },
                  ]}
                >
                  {step.completed ? (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  ) : (
                    <View style={styles.stepDot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: step.completed ? '#1F2937' : '#9CA3AF',
                      fontWeight: step.completed ? '600' : '400',
                    },
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {status === 'rejected' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => {
                // Navigate to support or contact page
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.actionButtonText}>Contact Support</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onRefresh}
          >
            <Ionicons name="refresh-outline" size={20} color="#1ED760" />
            <Text style={[styles.actionButtonText, { color: '#1ED760' }]}>
              Refresh Status
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statusCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusIconContainer: {
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 15,
    flex: 1,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1ED760',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#1ED760',
    borderColor: '#1ED760',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default StoreApprovalTrackingScreen;
