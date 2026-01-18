import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';

// Mock data for achievements and stats
const mockAchievements = [
  { id: '1', name: 'First Win', description: 'Win your first match', icon: 'trophy', earned: true },
  { id: '2', name: 'Social Butterfly', description: 'Connect with 10 players', icon: 'people', earned: true },
  { id: '3', name: 'Champion', description: 'Win 10 matches', icon: 'medal', earned: false },
  { id: '4', name: 'Fitness Enthusiast', description: 'Complete 30 workout sessions', icon: 'fitness', earned: true },
  { id: '5', name: 'Bookworm', description: 'Book 5 coaching sessions', icon: 'book', earned: false },
];

const mockStats = [
  { label: 'Matches Played', value: '24' },
  { label: 'Wins', value: '18' },
  { label: 'Win Rate', value: '75%' },
  { label: 'Calories Burned', value: '12,450' },
];

const ProfileScreen = () => {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(true);

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

  // Get user data with fallbacks
  const userName = user?.name || 'Player';
  const userEmail = user?.email || 'No email';
  const userPhone = user?.mobile || 'No phone';
  const userCity = user?.location?.city || user?.preferences?.city || 'Not set';
  const userSports = user?.preferences?.favoriteGames || [];
  const userSkillLevel = user?.preferences?.skillLevel || 'Not set';
  const userJoinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Recently';
  const userRating = user?.trustScore ? (user.trustScore / 20).toFixed(1) : '4.5';
  
  // Calculate stats from user data
  const userStats = [
    { 
      label: 'Matches Played', 
      value: user?.roleData?.matchesPlayed?.toString() || '0' 
    },
    { 
      label: 'Wins', 
      value: user?.roleData?.wins?.toString() || '0' 
    },
    { 
      label: 'Win Rate', 
      value: user?.roleData?.winRate ? `${user.roleData.winRate}%` : '0%' 
    },
    { 
      label: 'Calories Burned', 
      value: user?.roleData?.caloriesBurned?.toLocaleString() || '0' 
    },
  ];

  // Get achievements from user data
  const userAchievements = user?.achievements?.filter(a => a.unlocked).map(a => ({
    id: a.achievementId?._id || a.achievementId?._id || 'unknown',
    name: a.achievementId?.name || 'Achievement',
    description: a.achievementId?.description || 'Great job!',
    icon: a.achievementId?.icon || 'trophy',
    earned: a.unlocked,
  })) || [];

  const profileOptions = [
    { id: '1', title: 'Edit Profile', icon: 'person-outline', screen: 'EditProfile' },
    { id: '2', title: 'My Bookings', icon: 'calendar-outline', screen: 'Bookings' },
    { id: '3', title: 'My Orders', icon: 'cart-outline', screen: 'Orders' },
    { id: '4', title: 'Wallet', icon: 'wallet-outline', screen: 'Wallet' },
    { id: '5', title: 'Achievements', icon: 'trophy-outline', screen: 'Achievements' },
    { id: '6', title: 'Settings', icon: 'settings-outline', screen: 'Settings' },
    { id: '7', title: 'Help & Support', icon: 'help-circle-outline', screen: 'Support' },
    { id: '8', title: 'Logout', icon: 'log-out-outline', screen: 'Logout' },
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
        { 
          color: item.earned 
            ? theme.colors.text.primary 
            : theme.colors.text.disabled 
        }
      ]}>
        {item.name}
      </Text>
      <Text style={[
        styles.achievementDescription,
        { 
          color: item.earned 
            ? theme.colors.text.secondary 
            : theme.colors.text.disabled 
        }
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

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.card} />
        <View style={styles.loadingContainer}>
          <Ionicons name="person-outline" size={48} color={theme.colors.text.disabled} />
          <Text style={styles.loadingText}>No user data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.card} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerPlaceholder} />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => {
            // Navigate to settings if needed
          }}
        >
          <Ionicons name="settings-outline" size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header with gradient effect */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
          <Image 
            source={{ 
              uri: user?.roleData?.profileImage || 
                   'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=1ED760&color=fff&size=200'
            }} 
            style={styles.profileImage}
            onError={(error) => {
              // If image fails, it will use the generated avatar URL from UI Avatars
              console.log('Profile image failed to load, using generated avatar');
            }}
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
            activeOpacity={0.7}
            onPress={() => {
              // Navigate to edit profile
            }}
          >
            <Ionicons name="create-outline" size={18} color={theme.colors.text.inverted} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {userStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
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
              style={[
                styles.tab,
                { 
                  borderBottomWidth: activeTab === tab ? 2 : 0,
                  borderBottomColor: theme.colors.accent.neonGreen,
                }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { 
                  color: activeTab === tab 
                    ? theme.colors.accent.neonGreen 
                    : theme.colors.text.secondary 
                }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content based on active tab */}
        {activeTab === 'Profile' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{userName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userEmail}</Text>
                {user?.verification?.email?.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.status.success} style={{ marginLeft: 8 }} />
                )}
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userPhone}</Text>
                {user?.verification?.mobile?.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.status.success} style={{ marginLeft: 8 }} />
                )}
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{userCity}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="trophy-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.infoLabel}>Skill Level</Text>
                <Text style={styles.infoValue}>{userSkillLevel}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>{userJoinDate}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <FlatList
                data={profileOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.optionItem}>
                    <Ionicons name={item.icon as any} size={20} color={theme.colors.text.secondary} />
                    <Text style={styles.optionText}>{item.title}</Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.text.disabled} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
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
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="trophy-outline" size={48} color={theme.colors.text.disabled} />
                <Text style={styles.emptyText}>No achievements yet</Text>
                <Text style={styles.emptySubtext}>Start playing to earn achievements!</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'Fitness' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fitness Stats</Text>
            <View style={styles.fitnessChart}>
              <Text style={styles.chartTitle}>Weekly Activity</Text>
              <View style={styles.chartContainer}>
                {/* Mock chart representation */}
                <View style={styles.chartBar}>
                  <View style={[styles.bar, { height: '80%' }]} />
                  <Text style={styles.barLabel}>Mon</Text>
                </View>
                <View style={styles.chartBar}>
                  <View style={[styles.bar, { height: '60%' }]} />
                  <Text style={styles.barLabel}>Tue</Text>
                </View>
                <View style={styles.chartBar}>
                  <View style={[styles.bar, { height: '100%' }]} />
                  <Text style={styles.barLabel}>Wed</Text>
                </View>
                <View style={styles.chartBar}>
                  <View style={[styles.bar, { height: '40%' }]} />
                  <Text style={styles.barLabel}>Thu</Text>
                </View>
                <View style={styles.chartBar}>
                  <View style={[styles.bar, { height: '70%' }]} />
                  <Text style={styles.barLabel}>Fri</Text>
                </View>
                <View style={styles.chartBar}>
                  <View style={[styles.bar, { height: '90%' }]} />
                  <Text style={styles.barLabel}>Sat</Text>
                </View>
                <View style={styles.chartBar}>
                  <View style={[styles.bar, { height: '30%' }]} />
                  <Text style={styles.barLabel}>Sun</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerPlaceholder: {
    width: 40,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.background.card,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  profileImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#E0F2FE',
  },
  profileImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  profileLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  profileLocation: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingCount: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  editButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.accent.neonGreen,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: theme.colors.background.card,
    marginHorizontal: 20,
    marginBottom: theme.spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.accent.neonGreen,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  sportsContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sportsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  sportsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sportChip: {
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  sportChipText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    ...theme.shadows.small,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  infoValue: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  achievementCard: {
    flex: 0.45,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    alignItems: 'center',
    margin: theme.spacing.sm,
    ...theme.shadows.small,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: theme.spacing.sm,
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  fitnessChart: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBar: {
    alignItems: 'center',
    width: 30,
  },
  bar: {
    width: 20,
    backgroundColor: theme.colors.accent.neonGreen,
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});

export default ProfileScreen;