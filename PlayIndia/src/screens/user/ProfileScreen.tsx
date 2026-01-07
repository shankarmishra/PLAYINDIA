import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const [activeTab, setActiveTab] = useState('Profile');

  const user = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    sports: ['Cricket', 'Badminton', 'Tennis'],
    skillLevel: 'Intermediate',
    joinDate: 'Jan 2023',
    rating: 4.5,
  };

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileLocation}>{user.city}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={theme.colors.accent.orange} />
              <Text style={styles.ratingText}>{user.rating}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color={theme.colors.text.inverted} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {mockStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Sports Chips */}
        <View style={styles.sportsContainer}>
          <Text style={styles.sportsLabel}>Sports</Text>
          <View style={styles.sportsChips}>
            {user.sports.map((sport, index) => (
              <View key={index} style={styles.sportChip}>
                <Text style={styles.sportChipText}>{sport}</Text>
              </View>
            ))}
          </View>
        </View>

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
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{user.city}</Text>
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
            <FlatList
              data={mockAchievements}
              renderItem={renderAchievement}
              keyExtractor={(item) => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
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
    </View>
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.small,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.small,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  profileLocation: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  editButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    ...theme.shadows.small,
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
});

export default ProfileScreen;