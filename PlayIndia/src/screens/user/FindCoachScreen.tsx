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
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Coach</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#1B5E20" />
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
  filterButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  coachCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  coachHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  coachImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#C8E6C9',
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  coachSport: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 4,
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
    fontSize: 13,
    color: '#4A5568',
    marginLeft: 4,
    fontWeight: '500',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  coachBio: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 12,
    lineHeight: 20,
  },
  coachFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
    paddingTop: 12,
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default FindCoachScreen;