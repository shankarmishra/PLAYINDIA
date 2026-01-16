import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Sub-components
import QuickActionCard from '../../components/QuickActionCard';
import StatCard from '../../components/StatCard';
import ActivityItem from '../../components/ActivityItem';
import useAuth from '../../hooks/useAuth';
import ApiService from '../../services/ApiService';
import { UserTabParamList } from '../../navigation/UserNav';

type NavigationProp = StackNavigationProp<UserTabParamList>;

interface DashboardStats {
  matchesPlayed: number;
  winRate: number;
  caloriesBurned: number;
  streak: number;
}

interface RecentActivity {
  id: string;
  type: 'match' | 'session' | 'tournament' | 'achievement';
  title: string;
  subtitle: string;
  time: string;
  statusColor: string;
  icon: string;
}

const UserHomeDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    matchesPlayed: 0,
    winRate: 0,
    caloriesBurned: 0,
    streak: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [location, setLocation] = useState<string>('Loading...');

  useEffect(() => {
    loadDashboardData();
    loadUserLocation();
  }, []);

  const loadUserLocation = async () => {
    try {
      if (user?.location?.city) {
        setLocation(user.location.city);
      } else if (user?.preferences?.city) {
        setLocation(user.preferences.city);
      } else {
        setLocation('New Delhi');
      }
    } catch (error) {
      console.error('Error loading location:', error);
      setLocation('New Delhi');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile to get updated stats
      if (user) {
        await refreshUser();
      }
      
      // Fetch bookings/stats
      try {
        const bookingsResponse = await ApiService.bookings.getMyBookings();
        if (bookingsResponse.data.success) {
          const bookings = bookingsResponse.data.bookings || [];
          const completedBookings = bookings.filter((b: any) => b.status === 'completed');
          const totalBookings = bookings.length;
          
          setStats({
            matchesPlayed: completedBookings.length,
            winRate: totalBookings > 0 ? Math.round((completedBookings.length / totalBookings) * 100) : 0,
            caloriesBurned: completedBookings.length * 500, // Estimate
            streak: user?.behavior?.reliabilityScore ? Math.floor(user.behavior.reliabilityScore / 20) : 0,
          });
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
      
      // Fetch recent activities
      try {
        const activitiesData: RecentActivity[] = [];
        
        // Get recent bookings
        const bookingsResponse = await ApiService.bookings.getMyBookings();
        if (bookingsResponse.data.success) {
          const bookings = bookingsResponse.data.bookings || [];
          bookings.slice(0, 3).forEach((booking: any) => {
            activitiesData.push({
              id: booking._id || booking.id,
              type: booking.type === 'tournament' ? 'tournament' : 'session',
              title: booking.type === 'tournament' ? 'Tournament Joined' : `${booking.sport || 'Session'} Completed`,
              subtitle: booking.coachName || booking.venueName || 'Activity completed',
              time: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Recently',
              statusColor: booking.status === 'completed' ? '#10B981' : '#1ED760',
              icon: booking.type === 'tournament' ? 'trophy' : 'checkmark-circle',
            });
          });
        }
        
        // Get recent achievements
        if (user?.achievements && user.achievements.length > 0) {
          const recentAchievements = user.achievements
            .filter((a: any) => a.unlocked)
            .slice(0, 1)
            .map((achievement: any) => ({
              id: achievement.achievementId?._id || achievement.id,
              type: 'achievement' as const,
              title: achievement.achievementId?.name || 'Achievement Unlocked',
              subtitle: achievement.achievementId?.description || 'You earned a new achievement!',
              time: achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : 'Recently',
              statusColor: '#FF6A00',
              icon: 'trophy',
            }));
          activitiesData.push(...recentAchievements);
        }
        
        setActivities(activitiesData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };

  const quickActions = [
    { 
      title: 'Find Players', 
      icon: 'people-outline', 
      color: '#1ED760',
      onPress: () => navigation.navigate('NearbyPlayers')
    },
    { 
      title: 'Book Coach', 
      icon: 'calendar-number-outline', 
      color: '#FF6A00',
      onPress: () => navigation.navigate('FindCoach')
    },
    { 
      title: 'Join Tournament', 
      icon: 'trophy-outline', 
      color: '#3B82F6',
      onPress: () => navigation.navigate('Tournaments')
    },
    { 
      title: 'Buy Sports Gear', 
      icon: 'cart-outline', 
      color: '#8B5CF6',
      onPress: () => navigation.navigate('ShopHome')
    },
  ];

  const fitnessStats = [
    { 
      title: 'Matches Played', 
      value: stats.matchesPlayed.toString(), 
      change: stats.matchesPlayed > 0 ? `+${Math.floor(stats.matchesPlayed * 0.1)} this week` : 'Start playing!' 
    },
    { 
      title: 'Win Rate', 
      value: `${stats.winRate}%`, 
      change: stats.winRate > 0 ? `+${Math.floor(stats.winRate * 0.05)}%` : 'No matches yet' 
    },
    { 
      title: 'Calories Burned', 
      value: stats.caloriesBurned.toLocaleString(), 
      change: stats.caloriesBurned > 0 ? `+${Math.floor(stats.caloriesBurned * 0.1)} today` : 'Start your journey!' 
    },
    { 
      title: 'Streak', 
      value: `${stats.streak} days`, 
      change: stats.streak > 0 ? 'Keep it up!' : 'Start your streak!' 
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with location and notification */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.locationContainer} activeOpacity={0.7}>
            <Ionicons name="location" size={18} color="#0891B2" />
            <Text style={styles.locationText}>{location}</Text>
            <Ionicons name="chevron-down" size={14} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.notificationContainer}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color="#1F2937" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeText}>
                {new Date().getHours() < 12 ? 'Good Morning' : 
                 new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'} 👋
              </Text>
              <Text style={styles.userName}>{user?.name || 'Player'}</Text>
              <Text style={styles.welcomeSubtitle}>
                {user?.preferences?.favoriteGames && user.preferences.favoriteGames.length > 0
                  ? `Ready to play ${user.preferences.favoriteGames[0]} today?`
                  : 'Ready to play some sports today?'}
              </Text>
            </View>
            <View style={styles.welcomeIconContainer}>
              <Ionicons name="fitness" size={48} color="#1ED760" />
            </View>
          </View>

        {/* Quick action cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <QuickActionCard 
              key={index}
              title={action.title}
              icon={action.icon}
              color={action.color}
              onPress={action.onPress}
            />
          ))}
        </View>

        {/* Fitness Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fitness Summary</Text>
        </View>
        <View style={styles.statsContainer}>
          {fitnessStats.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
            />
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activityCard}>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityItem 
                key={activity.id}
                icon={activity.icon} 
                title={activity.title} 
                subtitle={activity.subtitle} 
                time={activity.time} 
                statusColor={activity.statusColor} 
              />
            ))
          ) : (
            <View style={styles.emptyActivityContainer}>
              <Ionicons name="time-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyActivityText}>No recent activity</Text>
              <Text style={styles.emptyActivitySubtext}>Start playing to see your activities here!</Text>
            </View>
          )}
        </View>
        </ScrollView>
      )}

      {/* Floating Action Button - Only show when not loading */}
      {!loading && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('FindCoach')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Off-white background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 6,
  },
  notificationContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#0891B2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891B2',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1ED760',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 16,
    right: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: '#6B7280',
  },
  emptyActivityContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyActivityText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyActivitySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
});

export default UserHomeDashboard;