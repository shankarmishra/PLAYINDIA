import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TournamentScreen = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data for tournaments
  const tournaments = {
    upcoming: [
      {
        id: '1',
        name: 'Summer Cricket League',
        date: 'Jun 15, 2023',
        venue: 'Delhi Cricket Stadium',
        entryFee: '₹500',
        slotsLeft: 8,
        image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
      {
        id: '2',
        name: 'National Badminton Championship',
        date: 'Jul 20, 2023',
        venue: 'National Sports Complex',
        entryFee: '₹1200',
        slotsLeft: 3,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
    ],
    live: [
      {
        id: '3',
        name: 'Premier Football Cup',
        date: 'May 10, 2023',
        venue: 'City Football Ground',
        entryFee: '₹800',
        slotsLeft: 0,
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
    ],
    past: [
      {
        id: '4',
        name: 'Winter Tennis Open',
        date: 'Mar 5, 2023',
        venue: 'Tennis Academy',
        entryFee: '₹600',
        slotsLeft: 0,
        image: 'https://images.unsplash.com/photo-1564168485212-78b60e0d0b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
      {
        id: '5',
        name: 'Basketball Championship',
        date: 'Feb 18, 2023',
        venue: 'Indoor Sports Complex',
        entryFee: '₹750',
        slotsLeft: 0,
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
    ]
  };

  const bannerTournaments = [
    {
      id: 'promo1',
      title: 'Special Summer Offer',
      subtitle: '50% off on registration fees',
      image: 'https://images.unsplash.com/photo-1598453270038-3a2a337b0a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'promo2',
      title: 'New Tournament Series',
      subtitle: 'Join the elite league',
      image: 'https://images.unsplash.com/photo-1519819239661-77e2010e75c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ];

  const renderTournamentCard = ({ item }: any) => (
    <View style={styles.tournamentCard}>
      <Image source={{ uri: item.image }} style={styles.tournamentImage} />
      <View style={styles.tournamentInfo}>
        <Text style={styles.tournamentName}>{item.name}</Text>
        <View style={styles.tournamentDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.venue}</Text>
          </View>
        </View>
        <View style={styles.tournamentStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Entry Fee</Text>
            <Text style={styles.statValue}>{item.entryFee}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Slots Left</Text>
            <Text style={[
              styles.statValue, 
              { color: item.slotsLeft > 5 ? '#10B981' : item.slotsLeft > 0 ? '#F59E0B' : '#EF4444' }
            ]}>
              {item.slotsLeft}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBanner = ({ item }: any) => (
    <View style={styles.bannerContainer}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tournaments</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Banner Carousel */}
      <FlatList
        data={bannerTournaments}
        renderItem={renderBanner}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.bannerCarousel}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]} 
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'live' && styles.activeTab]} 
          onPress={() => setActiveTab('live')}
        >
          <Text style={[styles.tabText, activeTab === 'live' && styles.activeTabText]}>Live</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]} 
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
      </View>

      {/* Tournament List */}
      <FlatList
        data={tournaments[activeTab as keyof typeof tournaments]}
        renderItem={renderTournamentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tournamentList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerCarousel: {
    marginVertical: 16,
  },
  bannerContainer: {
    width: 300,
    height: 150,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 28, 45, 0.8)',
    padding: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    marginVertical: 4,
  },
  bannerButton: {
    backgroundColor: '#1ED760',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#0B1C2D',
    borderRadius: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tournamentList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  tournamentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tournamentImage: {
    width: '100%',
    height: 120,
  },
  tournamentInfo: {
    padding: 16,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  tournamentDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  tournamentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  registerButton: {
    backgroundColor: '#1ED760',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#1ED760',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default TournamentScreen;