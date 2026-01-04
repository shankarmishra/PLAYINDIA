import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Animated,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserTabParamList } from '../../navigation/UserNav';
import { API_ENDPOINTS } from '../../config/constants';
import BrandLogo from '../../components/BrandLogo';
import useAuth from '../../hooks/useAuth';

type NavigationProp = StackNavigationProp<UserTabParamList, 'Home'>;

export type Tournament = {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  banner: string;
  sportType: string;
  skillLevel: string;
  prize: string;
  leaderboard: { player: string; rank: number }[];
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sportType: '',
    skillLevel: '',
    location: '',
    dateRange: '',
  });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.TOURNAMENTS.BASE, {
          params: filters,
          timeout: 10000, // 10 second timeout
        });
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        
        // Set dummy data if API fails (for development/testing)
        const dummyTournaments: Tournament[] = [
          {
            _id: '1',
            title: 'Mumbai Cricket Championship 2026',
            description: 'Annual cricket tournament',
            location: 'Mumbai, Maharashtra',
            date: new Date('2026-03-15').toISOString(),
            banner: '',
            sportType: 'Cricket',
            skillLevel: 'Intermediate',
            prize: '₹50,000',
            leaderboard: [],
          },
          {
            _id: '2',
            title: 'Delhi Football League',
            description: 'Professional football league',
            location: 'Delhi',
            date: new Date('2026-04-20').toISOString(),
            banner: '',
            sportType: 'Football',
            skillLevel: 'Advanced',
            prize: '₹1,00,000',
            leaderboard: [],
          },
          {
            _id: '3',
            title: 'Bangalore Badminton Open',
            description: 'Open badminton tournament',
            location: 'Bangalore, Karnataka',
            date: new Date('2026-05-10').toISOString(),
            banner: '',
            sportType: 'Badminton',
            skillLevel: 'Beginner',
            prize: '₹25,000',
            leaderboard: [],
          },
        ];
        
        setTournaments(dummyTournaments);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, [filters]);

  const handleViewDetails = (tournament: Tournament) => {
    navigation.navigate('TournamentDetail', { tournamentId: tournament._id });
  };

  const filteredTournaments = (tournaments || []).filter(
    tournament =>
      tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filters.sportType === '' ||
        tournament.sportType
          .toLowerCase()
          .includes(filters.sportType.toLowerCase())) &&
      (filters.skillLevel === '' ||
        tournament.skillLevel
          .toLowerCase()
          .includes(filters.skillLevel.toLowerCase())) &&
      (filters.location === '' ||
        tournament.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.leftHeader}>
          <BrandLogo size={45} style={styles.logoStyle} />
          <View style={styles.brandingText}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Champion! 🏆</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <Animated.View style={[
          styles.searchContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Search tournaments..."
              placeholderTextColor="#A0AEC0"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Categories / Quick Filters */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>🎮 Sports Categories</Text>
        </Animated.View>
        <Animated.ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={{ opacity: fadeAnim }}
        >
          {['Football', 'Cricket', 'Tennis', 'Badminton', 'Hockey'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.categoryTag, filters.sportType === item && styles.categoryTagActive]}
              onPress={() => setFilters(prev => ({ ...prev, sportType: prev.sportType === item ? '' : item }))}
            >
              <Text style={[styles.categoryText, filters.sportType === item && styles.categoryTextActive]}>{item}</Text>
              {filters.sportType === item && <Text style={styles.checkMark}> ✓</Text>}
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>

        {/* Featured Card */}
        <Animated.View style={[
          styles.featuredCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }],
          }
        ]}>
          <View style={styles.featuredContent}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>✨ FEATURED</Text>
            </View>
            <Text style={styles.featuredTitle}>Join Local Matches</Text>
            <Text style={styles.featuredSubtitle}>Connect with players in your area and show your skill.</Text>
            <TouchableOpacity style={styles.featuredButton} onPress={() => navigation.navigate('Bookings')}>
              <Text style={styles.featuredButtonText}>Explore Now</Text>
              <Text style={styles.featuredButtonIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Tournaments List */}
        <Animated.View style={[styles.sectionHeader, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>🏆 Upcoming Tournaments</Text>
          <TouchableOpacity onPress={() => setFilters({ sportType: '', skillLevel: '', location: '', dateRange: '' })}>
            <Text style={styles.seeAllText}>Clear ✕</Text>
          </TouchableOpacity>
        </Animated.View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#00B8D4" style={styles.loader} />
            <Text style={styles.loadingText}>Loading tournaments...</Text>
          </View>
        ) : filteredTournaments.length === 0 ? (
          <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No tournaments found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </Animated.View>
        ) : (
          filteredTournaments.map((tournament, index) => (
            <Animated.View
              key={tournament._id}
              style={{
                opacity: fadeAnim,
                transform: [{
                  translateY: Animated.multiply(slideAnim, new Animated.Value(0.3 * index))
                }]
              }}
            >
              <TouchableOpacity
                style={styles.tournamentCard}
                onPress={() => handleViewDetails(tournament)}
              >
              <View style={styles.tournamentInfo}>
                <View style={styles.sportBadge}>
                  <Text style={styles.sportBadgeText}>{tournament.sportType || 'Sport'}</Text>
                </View>
                <Text style={styles.tournamentTitle} numberOfLines={2}>{tournament.title}</Text>
                <View style={styles.tournamentMeta}>
                  <View style={styles.metaItemContainer}>
                    <Text style={styles.metaIcon}>📍</Text>
                    <Text style={styles.metaItem}>{tournament.location}</Text>
                  </View>
                  <View style={styles.metaItemContainer}>
                    <Text style={styles.metaIcon}>📅</Text>
                    <Text style={styles.metaItem}>{new Date(tournament.date).toLocaleDateString()}</Text>
                  </View>
                </View>
                <View style={styles.tournamentFooter}>
                  <View>
                    <Text style={styles.prizeLabel}>Prize Pool</Text>
                    <Text style={styles.prizeAmount}>{tournament.prize}</Text>
                  </View>
                  <View style={styles.skillBadge}>
                    <Text style={styles.skillBadgeText}>{tournament.skillLevel}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F7FAFC',
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoStyle: {
    padding: 0,
    marginRight: 10,
  },
  brandingText: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D1B1E',
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF4D4D',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F7FAFC',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationIcon: {
    fontSize: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0D1B1E',
  },
  clearIcon: {
    fontSize: 16,
    color: '#A0AEC0',
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0D1B1E',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  categoriesScroll: {
    paddingLeft: 20,
    marginBottom: 25,
  },
  categoryTag: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryTagActive: {
    backgroundColor: '#00B8D4',
    borderColor: '#00B8D4',
    shadowColor: '#00B8D4',
    shadowOpacity: 0.3,
  },
  categoryText: {
    color: '#4A5568',
    fontWeight: '600',
    fontSize: 15,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuredCard: {
    marginHorizontal: 20,
    backgroundColor: '#0D1B1E',
    borderRadius: 28,
    padding: 28,
    marginBottom: 30,
    shadowColor: '#00B8D4',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  featuredBadge: {
    backgroundColor: '#00B8D4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 20,
    lineHeight: 20,
  },
  featuredButton: {
    flexDirection: 'row',
    backgroundColor: '#00B8D4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  featuredButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  featuredButtonIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  seeAllText: {
    color: '#00B8D4',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loader: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
  },
  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyText: {
    color: '#0D1B1E',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#718096',
    fontSize: 14,
    textAlign: 'center',
  },
  tournamentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  tournamentInfo: {
    padding: 22,
  },
  sportBadge: {
    backgroundColor: '#E6FBFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#00B8D4',
  },
  sportBadgeText: {
    color: '#00B8D4',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tournamentTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0D1B1E',
    marginBottom: 12,
    lineHeight: 26,
  },
  tournamentMeta: {
    marginBottom: 18,
  },
  metaItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  metaItem: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  tournamentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F7FAFC',
    paddingTop: 18,
  },
  prizeLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  prizeAmount: {
    color: '#00B8D4',
    fontWeight: 'bold',
    fontSize: 18,
  },
  skillBadge: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skillBadgeText: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
});

export default HomeScreen;


