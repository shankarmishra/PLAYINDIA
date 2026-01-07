import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for reviews
const mockReviews = [
  {
    id: '1',
    userName: 'Rahul Sharma',
    userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    comment: 'Excellent coach! Helped me improve my technique significantly.',
    date: '2 days ago',
  },
  {
    id: '2',
    userName: 'Priya Patel',
    userImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    comment: 'Very knowledgeable and patient. Great at explaining fundamentals.',
    date: '1 week ago',
  },
  {
    id: '3',
    userName: 'Amit Kumar',
    userImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 5,
    comment: 'Best coach I\'ve worked with. Highly recommended!',
    date: '2 weeks ago',
  },
];

const CoachProfileScreen = () => {
  const [selectedTab, setSelectedTab] = useState('About');
  const [expanded, setExpanded] = useState(false);

  const coach = {
    name: 'Coach Priya Sharma',
    sport: 'Badminton',
    rating: 4.9,
    experience: '8 years',
    price: '₹500/hr',
    bio: 'Former national level player with expertise in technique and strategy. I believe in building strong fundamentals and developing tactical awareness in my students. My coaching style focuses on personalized training plans based on individual strengths and weaknesses.',
    qualifications: [
      'National Level Player',
      'BWF Certified Coach',
      'Sports Science Degree',
      'Injury Prevention Specialist',
    ],
    availableSlots: [
      { day: 'Mon', time: '6:00 PM - 7:00 PM', available: true },
      { day: 'Tue', time: '5:00 PM - 6:00 PM', available: true },
      { day: 'Wed', time: '7:00 PM - 8:00 PM', available: false },
      { day: 'Thu', time: '6:00 PM - 7:00 PM', available: true },
      { day: 'Fri', time: '5:00 PM - 6:00 PM', available: false },
      { day: 'Sat', time: '4:00 PM - 5:00 PM', available: true },
    ],
  };

  const renderReview = ({ item }: any) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.userImage }} style={styles.reviewUserImage} />
        <View style={styles.reviewUserInfo}>
          <Text style={styles.reviewUserName}>{item.userName}</Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, i) => (
              <Ionicons 
                key={i} 
                name={i < item.rating ? "star" : "star-outline"} 
                size={14} 
                color={i < item.rating ? theme.colors.accent.orange : theme.colors.text.disabled} 
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{coach.name}</Text>
        <TouchableOpacity>
          <Ionicons name="share" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Coach Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{coach.name}</Text>
          <Text style={styles.profileSport}>{coach.sport}</Text>
          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="star" size={16} color={theme.colors.accent.orange} />
              <Text style={styles.detailText}>{coach.rating} • {coach.experience}</Text>
            </View>
            <Text style={styles.price}>{coach.price}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['About', 'Reviews', 'Schedule'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[
              styles.tab,
              { 
                borderBottomWidth: selectedTab === tab ? 2 : 0,
                borderBottomColor: theme.colors.accent.neonGreen,
              }
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              { 
                color: selectedTab === tab 
                  ? theme.colors.accent.neonGreen 
                  : theme.colors.text.secondary 
              }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedTab === 'About' && (
          <View>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>
              {expanded || coach.bio.length < 150 ? coach.bio : `${coach.bio.substring(0, 150)}...`}
            </Text>
            {!expanded && coach.bio.length > 150 && (
              <TouchableOpacity onPress={() => setExpanded(true)}>
                <Text style={styles.readMoreText}>Read more</Text>
              </TouchableOpacity>
            )}
            
            <Text style={styles.sectionTitle}>Qualifications</Text>
            <View style={styles.qualificationsContainer}>
              {coach.qualifications.map((qual, index) => (
                <View key={index} style={styles.qualificationItem}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.status.success} />
                  <Text style={styles.qualificationText}>{qual}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'Reviews' && (
          <View>
            <Text style={styles.sectionTitle}>Reviews ({mockReviews.length})</Text>
            <FlatList
              data={mockReviews}
              renderItem={renderReview}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}

        {selectedTab === 'Schedule' && (
          <View>
            <Text style={styles.sectionTitle}>Available Slots</Text>
            <View style={styles.scheduleContainer}>
              {coach.availableSlots.map((slot, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.slotItem,
                    { 
                      backgroundColor: slot.available 
                        ? theme.colors.background.card 
                        : theme.colors.background.tertiary 
                    }
                  ]}
                  disabled={!slot.available}
                >
                  <Text style={[
                    styles.slotDay,
                    { 
                      color: slot.available 
                        ? theme.colors.text.primary 
                        : theme.colors.text.disabled 
                    }
                  ]}>
                    {slot.day}
                  </Text>
                  <Text style={[
                    styles.slotTime,
                    { 
                      color: slot.available 
                        ? theme.colors.text.primary 
                        : theme.colors.text.disabled 
                    }
                  ]}>
                    {slot.time}
                  </Text>
                  {slot.available && (
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.status.success} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book Session</Text>
      </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  profileHeader: {
    flexDirection: 'row',
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
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  profileSport: {
    fontSize: 16,
    color: theme.colors.accent.neonGreen,
    marginBottom: theme.spacing.xs,
  },
  profileDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent.orange,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
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
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  bioText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  readMoreText: {
    color: theme.colors.accent.neonGreen,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
  },
  qualificationsContainer: {
    marginBottom: theme.spacing.lg,
  },
  qualificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  qualificationText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  reviewCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reviewUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  reviewRating: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  reviewComment: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  scheduleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotItem: {
    width: '48%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  slotDay: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  slotTime: {
    fontSize: 14,
    marginBottom: theme.spacing.sm,
  },
  bookButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    paddingVertical: theme.spacing.lg,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  bookButtonText: {
    color: theme.colors.text.inverted,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CoachProfileScreen;