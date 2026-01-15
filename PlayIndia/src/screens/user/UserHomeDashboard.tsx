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
        <TouchableOpacity style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#1F2937" />
          <Text style={styles.locationText}>{location}</Text>
          <Ionicons name="chevron-down" size={16} color="#1F2937" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.notificationContainer}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
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
          {/* Welcome section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              {new Date().getHours() < 12 ? 'Good Morning' : 
               new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'},
            </Text>
            <Text style={styles.userName}>{user?.name || 'Player'}</Text>
            <Text style={styles.welcomeSubtitle}>
              {user?.preferences?.favoriteGames && user.preferences.favoriteGames.length > 0
                ? `Ready to play ${user.preferences.favoriteGames[0]} today?`
                : 'Ready to play some sports today?'}
            </Text>
          </View>

        {/* Quick action cards */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
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
        <Text style={styles.sectionTitle}>Fitness Summary</Text>
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
        <Text style={styles.sectionTitle}>Recent Activity</Text>
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

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('FindCoach')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Off-white background
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 8,
  },
  notificationContainer: {
    padding: 8,
  },
  welcomeSection: {
    marginVertical: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 16,
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
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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