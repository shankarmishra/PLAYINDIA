import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Sub-components
import QuickActionCard from '../../components/QuickActionCard';
import StatCard from '../../components/StatCard';
import ActivityItem from '../../components/ActivityItem';

const UserHomeDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const quickActions = [
    { 
      title: 'Find Players', 
      icon: 'people-outline', 
      color: '#1ED760',
      screen: 'FindPlayers'
    },
    { 
      title: 'Book Coach', 
      icon: 'calendar-number-outline', 
      color: '#FF6A00',
      screen: 'BookCoach'
    },
    { 
      title: 'Join Tournament', 
      icon: 'trophy-outline', 
      color: '#3B82F6',
      screen: 'Tournaments'
    },
    { 
      title: 'Buy Sports Gear', 
      icon: 'cart-outline', 
      color: '#8B5CF6',
      screen: 'Store'
    },
  ];

  const fitnessStats = [
    { title: 'Matches Played', value: '24', change: '+2 this week' },
    { title: 'Win Rate', value: '78%', change: '+5%' },
    { title: 'Calories Burned', value: '1,240', change: '+120 today' },
    { title: 'Streak', value: '5 days', change: 'Keep it up!' },
  ];

  return (
    <View style={styles.container}>
      {/* Header with location and notification */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#1F2937" />
          <Text style={styles.locationText}>New Delhi</Text>
          <Ionicons name="chevron-down" size={16} color="#1F2937" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.notificationContainer}>
          <Ionicons name="notifications-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Good Morning,</Text>
          <Text style={styles.userName}>Rahul Sharma</Text>
          <Text style={styles.welcomeSubtitle}>Ready to play some sports today?</Text>
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
              onPress={() => console.log(`Navigate to ${action.screen}`)}
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
          <ActivityItem 
            icon="checkmark-circle" 
            title="Cricket Match Completed" 
            subtitle="You won against Team Alpha" 
            time="2 hours ago" 
            statusColor="#10B981" 
          />
          
          <ActivityItem 
            icon="calendar" 
            title="Upcoming Session" 
            subtitle="Badminton with Coach Priya" 
            time="Tomorrow, 6:00 PM" 
            statusColor="#1ED760" 
          />
          
          <ActivityItem 
            icon="trophy" 
            title="Tournament Joined" 
            subtitle="Summer Cricket League" 
            time="3 days ago" 
            statusColor="#FF6A00" 
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => console.log('Add new activity')}>
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
});

export default UserHomeDashboard;