import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiService from '../../services/ApiService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserTabParamList } from '../../navigation/UserNav';

type NavigationProp = StackNavigationProp<UserTabParamList>;

const TournamentScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState<any>({
    upcoming: [],
    live: [],
    past: [],
  });

  // Dummy data as fallback
  const dummyTournaments = {
    upcoming: [
      {
        id: '1',
        _id: '1',
        name: 'Summer Cricket League',
        category: 'Cricket',
        dates: { tournamentStart: '2024-06-15', tournamentEnd: '2024-06-20' },
        entryFee: 500,
        maxTeams: 16,
        registeredTeams: 8,
        location: { city: 'Delhi', address: 'Delhi Cricket Stadium' },
        image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
      {
        id: '2',
        _id: '2',
        name: 'National Badminton Championship',
        category: 'Badminton',
        dates: { tournamentStart: '2024-07-20', tournamentEnd: '2024-07-25' },
        entryFee: 1200,
        maxTeams: 32,
        registeredTeams: 29,
        location: { city: 'Mumbai', address: 'National Sports Complex' },
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
    ],
    live: [
      {
        id: '3',
        _id: '3',
        name: 'Premier Football Cup',
        category: 'Football',
        dates: { tournamentStart: '2024-05-10', tournamentEnd: '2024-05-15' },
        entryFee: 800,
        maxTeams: 24,
        registeredTeams: 24,
        location: { city: 'Bangalore', address: 'City Football Ground' },
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
    ],
    past: [
      {
        id: '4',
        _id: '4',
        name: 'Winter Tennis Open',
        category: 'Tennis',
        dates: { tournamentStart: '2024-03-05', tournamentEnd: '2024-03-10' },
        entryFee: 600,
        maxTeams: 16,
        registeredTeams: 16,
        location: { city: 'Pune', address: 'Tennis Academy' },
        image: 'https://images.unsplash.com/photo-1564168485212-78b60e0d0b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
      {
        id: '5',
        _id: '5',
        name: 'Basketball Championship',
        category: 'Basketball',
        dates: { tournamentStart: '2024-02-18', tournamentEnd: '2024-02-23' },
        entryFee: 750,
        maxTeams: 20,
        registeredTeams: 20,
        location: { city: 'Hyderabad', address: 'Indoor Sports Complex' },
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
    ]
  };

  useEffect(() => {
    loadTournaments();
  }, [activeTab]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const response = await ApiService.tournaments.getAll({ 
        status: activeTab === 'upcoming' ? 'upcoming' : activeTab === 'live' ? 'live' : 'completed',
        limit: 20 
      });
      
      if (response.data.success && response.data.data) {
        const fetchedTournaments = response.data.data;
        if (activeTab === 'upcoming') {
          setTournaments({ ...tournaments, upcoming: fetchedTournaments });
        } else if (activeTab === 'live') {
          setTournaments({ ...tournaments, live: fetchedTournaments });
        } else {
          setTournaments({ ...tournaments, past: fetchedTournaments });
        }
      } else {
        // Use dummy data
        setTournaments(dummyTournaments);
      }
    } catch (error: any) {
      // Silently use dummy data on network error
      setTournaments(dummyTournaments);
    } finally {
      setLoading(false);
    }
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

  const renderTournamentCard = ({ item }: any) => {
    const slotsLeft = (item.maxTeams || 0) - (item.registeredTeams || 0);
    const startDate = item.dates?.tournamentStart
      ? new Date(item.dates.tournamentStart).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : item.date || 'TBA';
    const venue = item.location?.address || item.location?.city || item.venue || 'TBA';
    const entryFee = item.entryFee ? `₹${item.entryFee}` : 'Free';
    const imageUrl = item.banner || item.image || 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

    return (
      <TouchableOpacity
        style={styles.tournamentCard}
        onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item._id || item.id })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: imageUrl }} style={styles.tournamentImage} />
        <View style={styles.tournamentInfo}>
          <View style={styles.tournamentHeader}>
            <View style={styles.tournamentCategory}>
              <Ionicons name="trophy" size={16} color="#F59E0B" />
              <Text style={styles.tournamentCategoryText}>{item.category || 'Tournament'}</Text>
            </View>
            <View style={[styles.slotsBadge, slotsLeft <= 5 && styles.slotsBadgeWarning]}>
              <Text style={styles.slotsText}>
                {slotsLeft > 0 ? `${slotsLeft} slots` : 'Full'}
              </Text>
            </View>
          </View>
          <Text style={styles.tournamentName}>{item.name}</Text>
          <View style={styles.tournamentDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{startDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{venue}</Text>
            </View>
          </View>
          <View style={styles.tournamentStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Entry Fee</Text>
              <Text style={styles.statValue}>{entryFee}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Teams</Text>
              <Text style={styles.statValue}>
                {item.registeredTeams || 0}/{item.maxTeams || 0}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item._id || item.id })}
          >
            <Text style={styles.registerButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading tournaments...</Text>
        </View>
      ) : tournaments[activeTab as keyof typeof tournaments].length > 0 ? (
        <FlatList
          data={tournaments[activeTab as keyof typeof tournaments]}
          renderItem={renderTournamentCard}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.tournamentList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="trophy-outline" size={64} color="#CBD5E0" />
          <Text style={styles.emptyText}>No tournaments found</Text>
          <Text style={styles.emptySubtext}>
            {activeTab === 'upcoming' 
              ? 'Check back soon for upcoming tournaments!'
              : activeTab === 'live'
              ? 'No live tournaments at the moment.'
              : 'No past tournaments to display.'}
          </Text>
        </View>
      )}
    </SafeAreaView>
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
    paddingTop: 12,
    paddingBottom: 12,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    elevation: 0,
    shadowOpacity: 0,
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
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tournamentCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tournamentCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 4,
  },
  slotsBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  slotsBadgeWarning: {
    backgroundColor: '#FEE2E2',
  },
  slotsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default TournamentScreen;