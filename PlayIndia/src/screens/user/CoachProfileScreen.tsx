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
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coach Profile</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#1B5E20" />
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
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
  },
  shareButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#C8E6C9',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  profileSport: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 4,
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
    color: '#4A5568',
    marginLeft: 6,
    fontWeight: '500',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 12,
    marginTop: 8,
  },
  bioText: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 12,
  },
  readMoreText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  qualificationsContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
  },
  qualificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  qualificationText: {
    fontSize: 15,
    color: '#475569',
    marginLeft: 10,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  reviewRating: {
    flexDirection: 'row',
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  reviewComment: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  scheduleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
  },
  slotDay: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  slotTime: {
    fontSize: 13,
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    margin: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CoachProfileScreen;