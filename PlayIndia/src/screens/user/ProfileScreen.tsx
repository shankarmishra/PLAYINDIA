import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, StatusBar, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';
import { UserTabParamList } from '../../navigation/types';
import ApiService from '../../services/ApiService';
import FitnessDashboard from '../../components/FitnessDashboard';
import { useFitness } from '../../contexts/FitnessContext';
import PersonalInfo from '../../components/profile/PersonalInfo';

type NavigationProp = StackNavigationProp<UserTabParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, refreshUser, logout, loading: authLoading } = useAuth();
  const { fitnessData, loading: fitnessLoading } = useFitness();
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(true);
  const [editingAge, setEditingAge] = useState(false);
  const [tempAge, setTempAge] = useState<string>(((user?.preferences as any)?.age?.toString()) || '');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (user) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Update user age
  const updateAge = async () => {
    try {
      const ageValue = parseInt(tempAge);
      if (isNaN(ageValue) || ageValue < 13 || ageValue > 100) {
        Alert.alert('Invalid Age', 'Please enter a valid age between 13 and 100');
        return;
      }

      const profileData = {
        preferences: {
          ...(user?.preferences || {}),
          age: ageValue
        }
      };

      const response = await ApiService.users.updateProfile(profileData);

      if (response.data.success) {
        Alert.alert('Success', 'Age updated successfully');
        setEditingAge(false);
        await refreshUser();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update age');
      }
    } catch (error: any) {
      console.error('Update age error:', error);
      Alert.alert('Error', error.message || 'Failed to update age');
    }
  };

  // Get user data with fallbacks
  const userName = user?.name || 'Player';
  const userEmail = user?.email || 'No email';
  const userPhone = user?.mobile || 'No phone';
  const userCity = user?.location?.city || user?.preferences?.city || 'Not set';
  const userSports = user?.preferences?.favoriteGames || [];
  const userJoinDate = (user as any)?.createdAt
    ? new Date((user as any).createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Recently';
  const userRating = (user as any)?.trustScore ? ((user as any).trustScore / 20).toFixed(1) : '4.5';

  const rawAge = (user?.preferences as any)?.age;
  const userAge = (rawAge !== undefined && rawAge !== null && rawAge !== '')
    ? `${rawAge} years`
    : (user?.preferences?.ageGroup || 'Not set');

  const userStats = [
    { label: 'Matches Played', value: user?.roleData?.matchesPlayed?.toString() || '0' },
    { label: 'Wins', value: user?.roleData?.wins?.toString() || '0' },
    { label: 'Win Rate', value: user?.roleData?.winRate ? `${user.roleData.winRate}%` : '0%' },
    { label: (user?.preferences as any)?.age ? 'Age' : 'Age Group', value: userAge }
  ];

  const fitnessStats = fitnessData ? [
    { label: 'Steps', value: fitnessData.steps.toLocaleString() },
    { label: 'Calories', value: fitnessData.calories.toString() },
    { label: 'Workout', value: `${fitnessData.workoutMinutes} min` },
    { label: 'Heart Rate', value: `${fitnessData.heartRateAvg} BPM` }
  ] : [];

  const userAchievements = user?.achievements?.filter(a => a.unlocked).map(a => ({
    id: a.achievementId?._id || 'unknown',
    name: a.achievementId?.name || 'Achievement',
    description: a.achievementId?.description || 'Great job!',
    icon: a.achievementId?.icon || 'trophy',
    earned: a.unlocked,
  })) || [];

  const profileOptions = [
    { id: '1', title: 'Edit Profile', icon: 'person-outline', screen: 'EditProfile' },
    { id: '2', title: 'My Bookings', icon: 'calendar-outline', screen: 'Bookings' },
    { id: '3', title: 'My Orders', icon: 'receipt-outline', screen: 'MyOrders' },
    { id: '4', title: 'Wallet', icon: 'wallet-outline', screen: 'Wallet' },
    { id: '7', title: 'Settings', icon: 'settings-outline', screen: 'Settings' },
    { id: '8', title: 'Help & Support', icon: 'help-circle-outline', screen: 'HelpSupport' },
    { id: '9', title: 'Logout', icon: 'log-out-outline', screen: 'Logout' },
  ];

  const renderAchievement = ({ item }: any) => (
    <View style={[
      styles.achievementCard,
      {
        opacity: item.earned ? 1 : 0.5,
        backgroundColor: item.earned
          ? theme.colors.background.card
          : theme.colors.background.tertiary
      }
    ]}>
      <Ionicons
        name={item.icon as any}
        size={32}
        color={item.earned ? theme.colors.accent.neonGreen : theme.colors.text.disabled}
      />
      <Text style={[
        styles.achievementName,
        { color: item.earned ? theme.colors.text.primary : theme.colors.text.disabled }
      ]}>
        {item.name}
      </Text>
      <Text style={[
        styles.achievementDescription,
        { color: item.earned ? theme.colors.text.secondary : theme.colors.text.disabled }
      ]}>
        {item.description}
      </Text>
    </View>
  );

  if (loading || authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.card} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent.neonGreen} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerPlaceholder} />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Settings' as any)}
        >
          <Ionicons name="settings-outline" size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: user?.profileImage ||
                  'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=1ED760&color=fff&size=200'
              }}
              style={styles.profileImage}
            />
            {user?.verification?.email?.verified && (
              <View style={styles.profileImageBadge}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <View style={styles.profileLocationContainer}>
              <Ionicons name="location" size={14} color={theme.colors.text.secondary} />
              <Text style={styles.profileLocation}>{userCity}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={theme.colors.accent.orange} />
              <Text style={styles.ratingText}>{userRating}</Text>
              <Text style={styles.ratingCount}>
                ({user?.level || 'rookie'})
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile' as any)}
          >
            <Ionicons name="create-outline" size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {(activeTab === 'Profile' ? userStats : fitnessStats).slice(0, 4).map((stat, index) => (
            <View key={index} style={styles.statItemContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Sports Chips */}
        {userSports.length > 0 && (
          <View style={styles.sportsContainer}>
            <Text style={styles.sportsLabel}>Favorite Sports</Text>
            <View style={styles.sportsChips}>
              {userSports.map((sport, index) => (
                <View key={index} style={styles.sportChip}>
                  <Text style={styles.sportChipText}>{sport}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Navigation Tabs */}
        <View style={styles.tabsContainer}>
          {['Profile', 'Achievements', 'Fitness'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab ? theme.colors.accent.neonGreen : theme.colors.text.secondary }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content based on active tab */}
        {activeTab === 'Profile' && (
          <View>
            <PersonalInfo
              name={userName}
              email={userEmail}
              phone={userPhone}
              city={userCity}
              age={userAge}
              isEmailVerified={user?.verification?.email?.verified}
              isPhoneVerified={user?.verification?.mobile?.verified}
              onEditAge={() => {
                setEditingAge(true);
                setTempAge(((user?.preferences as any)?.age?.toString()) || '');
              }}
            />

            {/* Age Editor */}
            {editingAge && (
              <View style={[styles.section, { borderLeftWidth: 4, borderLeftColor: theme.colors.accent.neonGreen }]}>
                <Text style={styles.sectionTitle}>Update Age</Text>
                <View style={styles.editAgeRow}>
                  <TextInput
                    style={styles.ageInput}
                    value={tempAge}
                    onChangeText={setTempAge}
                    keyboardType="numeric"
                    placeholder="Enter age"
                    autoFocus
                  />
                  <View style={styles.editAgeButtons}>
                    <TouchableOpacity onPress={() => setEditingAge(false)} style={styles.cancelBtn}>
                      <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={updateAge} style={styles.saveBtn}>
                      <Ionicons name="checkmark" size={24} color={theme.colors.accent.neonGreen} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Account & Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account & Settings</Text>
              {profileOptions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionItem}
                  onPress={() => {
                    if (item.screen === 'Logout') {
                      Alert.alert('Logout', 'Are you sure?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Logout', style: 'destructive', onPress: async () => {
                            await logout();
                            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
                          }
                        }
                      ]);
                    } else {
                      navigation.navigate(item.screen as any);
                    }
                  }}
                >
                  <View style={styles.optionIconContainer}>
                    <Ionicons name={item.icon as any} size={18} color={theme.colors.accent.neonGreen} />
                  </View>
                  <Text style={styles.optionText}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'Achievements' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {userAchievements.length > 0 ? (
              <FlatList
                data={userAchievements}
                renderItem={renderAchievement}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="trophy-outline" size={48} color={theme.colors.text.disabled} />
                <Text style={styles.emptyText}>No achievements yet</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'Fitness' && (
          <View style={styles.fitnessSection}>
            <View style={styles.fitnessHeader}>
              <Text style={styles.fitnessTitle}>Fitness Dashboard</Text>
            </View>
            <FitnessDashboard />
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  headerPlaceholder: { width: 40 },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  profileHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  profileImageContainer: { marginRight: 16 },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4CAF50',
    backgroundColor: '#F0FDF4',
  },
  profileImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  profileLocationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  profileLocation: { fontSize: 13, color: '#64748B', marginLeft: 4, fontWeight: '500' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingCount: { fontSize: 12, color: '#64748B', marginLeft: 6 },
  ratingText: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginLeft: 4 },
  editButton: { padding: 10, backgroundColor: '#F1F5F9', borderRadius: 12 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  statItemContainer: { flex: 1 },
  statItem: { alignItems: 'center', padding: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  statLabel: { fontSize: 10, color: '#64748B', marginTop: 2, fontWeight: '600', textTransform: 'uppercase' },
  sportsContainer: { paddingHorizontal: 20, marginBottom: 24 },
  sportsLabel: { fontSize: 18, fontWeight: '700', color: '#1B5E20', marginBottom: 12 },
  sportsChips: { flexDirection: 'row', flexWrap: 'wrap' },
  sportChip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  sportChipText: { fontSize: 13, color: '#2E7D32', fontWeight: '600' },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  tabText: { fontSize: 16, fontWeight: '800' },
  tabActive: { backgroundColor: '#F0FDF4', borderBottomWidth: 2, borderBottomColor: '#1ED760' },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1B5E20', marginBottom: 16 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FDF4',
  },
  optionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '500' },
  achievementCard: {
    flex: 0.45,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    margin: 8,
    elevation: 3,
  },
  achievementName: { fontSize: 15, fontWeight: '700', textAlign: 'center', marginVertical: 10, color: '#1B5E20' },
  achievementDescription: { fontSize: 12, textAlign: 'center', color: '#558B2F' },
  fitnessSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    elevation: 2,
  },
  fitnessHeader: { padding: 18, alignItems: 'center' },
  fitnessTitle: { fontSize: 20, fontWeight: '700', color: '#1B5E20' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#558B2F' },
  emptyContainer: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { marginTop: 12, fontSize: 16, fontWeight: '700', color: '#1B5E20' },
  editAgeRow: { flexDirection: 'row', alignItems: 'center' },
  ageInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#C8E6C9', borderRadius: 8, paddingHorizontal: 12, marginRight: 8 },
  editAgeButtons: { flexDirection: 'row' },
  cancelBtn: { padding: 4, marginRight: 8 },
  saveBtn: { padding: 4 },
  scrollContent: { paddingBottom: 40 },
});

export default ProfileScreen;