import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for coaches
const mockCoaches = [
  {
    id: '1',
    name: 'Coach Priya Sharma',
    sport: 'Badminton',
    rating: 4.9,
    experience: '8 years',
    price: '₹500/hr',
    bio: 'Former national level player with expertise in technique and strategy.',
    availability: 'Available',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Coach Amit Kumar',
    sport: 'Cricket',
    rating: 4.8,
    experience: '12 years',
    price: '₹700/hr',
    bio: 'Ex-professional player with focus on batting and fielding skills.',
    availability: 'Busy',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'Coach Rajesh Nair',
    sport: 'Tennis',
    rating: 4.7,
    experience: '10 years',
    price: '₹600/hr',
    bio: 'ITF certified coach with focus on junior development.',
    availability: 'Available',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: '4',
    name: 'Coach Sneha Reddy',
    sport: 'Yoga & Fitness',
    rating: 4.9,
    experience: '6 years',
    price: '₹400/hr',
    bio: 'Yoga therapist with focus on injury prevention and flexibility.',
    availability: 'Available',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

const FindCoachScreen = () => {
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const sports = ['All', 'Badminton', 'Cricket', 'Tennis', 'Yoga & Fitness', 'Football', 'Basketball'];
  const filters = ['All', 'Available', 'Top Rated', 'Lowest Price', 'Most Experienced'];

  const filteredCoaches = mockCoaches.filter(coach => {
    const sportMatch = selectedSport === 'All' || coach.sport === selectedSport;
    let filterMatch = true;
    
    if (selectedFilter === 'Available') {
      filterMatch = coach.availability === 'Available';
    } else if (selectedFilter === 'Top Rated') {
      filterMatch = coach.rating >= 4.8;
    } else if (selectedFilter === 'Lowest Price') {
      filterMatch = coach.price === '₹400/hr' || coach.price === '₹500/hr';
    } else if (selectedFilter === 'Most Experienced') {
      filterMatch = parseInt(coach.experience) >= 8;
    }
    
    return sportMatch && filterMatch;
  });

  const renderCoachCard = ({ item }: any) => (
    <View style={styles.coachCard}>
      <View style={styles.coachHeader}>
        <Image source={{ uri: item.image }} style={styles.coachImage} />
        <View style={styles.coachInfo}>
          <Text style={styles.coachName}>{item.name}</Text>
          <Text style={styles.coachSport}>{item.sport}</Text>
          <View style={styles.coachDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="star" size={14} color={theme.colors.accent.orange} />
              <Text style={styles.detailText}>{item.rating} • {item.experience}</Text>
            </View>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.coachBio}>{item.bio}</Text>
      
      <View style={styles.coachFooter}>
        <View style={[
          styles.availabilityBadge, 
          { 
            backgroundColor: item.availability === 'Available' 
              ? `${theme.colors.status.success}20` 
              : `${theme.colors.status.warning}20` 
          }
        ]}>
          <Text style={[
            styles.availabilityText, 
            { 
              color: item.availability === 'Available' 
                ? theme.colors.status.success 
                : theme.colors.status.warning 
            }
          ]}>
            {item.availability}
          </Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Coach</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Sport Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {sports.map((sport, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.filterChip,
              { 
                backgroundColor: selectedSport === sport 
                  ? theme.colors.accent.neonGreen 
                  : theme.colors.background.secondary 
              }
            ]}
            onPress={() => setSelectedSport(sport)}
          >
            <Text style={[
              styles.filterText,
              { 
                color: selectedSport === sport 
                  ? theme.colors.text.inverted 
                  : theme.colors.text.primary 
              }
            ]}>
              {sport}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Coach List */}
      <FlatList
        data={filteredCoaches}
        renderItem={renderCoachCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
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
  filterContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  coachCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  coachHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  coachImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  coachSport: {
    fontSize: 14,
    color: theme.colors.accent.neonGreen,
    marginBottom: theme.spacing.xs,
  },
  coachDetails: {
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
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent.orange,
  },
  coachBio: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  coachFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  bookButtonText: {
    color: theme.colors.text.inverted,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FindCoachScreen;