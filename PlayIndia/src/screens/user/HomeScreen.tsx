import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from '../../utils/LinearGradientSafe';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserTabParamList } from '../../navigation/UserNav';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_ENDPOINTS } from '../../config/constants';

type NavigationProp = StackNavigationProp<UserTabParamList, 'Home'>;

export type Tournament = {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  banner: string;
  sportType: string; // New Field
  skillLevel: string; // New Field
  prize: string; // New Field
  leaderboard: { player: string; rank: number }[]; // New Field
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

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.TOURNAMENTS.BASE, {
          params: filters,
        });
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        Alert.alert(
          'Error',
          'Failed to load tournaments. Please try again later.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, [filters]);

  const handleViewDetails = (tournament: Tournament) => {
    navigation.navigate('TournamentDetail', { tournamentId: tournament._id });
  };

  const filteredTournaments = tournaments.filter(
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
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Home</Text>
        <TouchableOpacity>
          <Icon name="notifications" size={24} color="#00B8D4" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroBanner}>
          <Image
            source={require('../../assets/onboarding1.png')}
            style={styles.heroImage}
          />
          <Text style={styles.heroText}>Welcome Back, Player!</Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#718096" style={styles.searchIcon} />
            <TextInput
              placeholder="Search for players or tournaments"
              placeholderTextColor="#666"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filters Section */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Filter Tournaments</Text>
          <View style={styles.filterRow}>
            <TextInput
              placeholder="Enter Sport Type (e.g., Football)"
              placeholderTextColor="#666"
              value={filters.sportType}
              onChangeText={text => setFilters({ ...filters, sportType: text })}
              style={styles.filterInput}
            />
            <TextInput
              placeholder="Enter Skill Level (e.g., Beginner)"
              placeholderTextColor="#666"
              value={filters.skillLevel}
              onChangeText={text =>
                setFilters({ ...filters, skillLevel: text })
              }
              style={styles.filterInput}
            />
          </View>
          <View style={styles.filterRow}>
            <TextInput
              placeholder="Enter Location (e.g., New York)"
              placeholderTextColor="#666"
              value={filters.location}
              onChangeText={text => setFilters({ ...filters, location: text })}
              style={styles.filterInput}
            />
            <TouchableOpacity
              onPress={() => setFilters({ ...filters, dateRange: 'today' })}
              style={styles.filterButton}
            >
              <Text style={styles.filterButtonText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilters({ ...filters, dateRange: 'this-week' })}
              style={styles.filterButton}
            >
              <Text style={styles.filterButtonText}>This Week</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tournaments List */}
        <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#555" style={styles.loader} />
        ) : filteredTournaments.length === 0 ? (
          <Text style={styles.emptyText}>No tournaments available.</Text>
        ) : (
          <View style={styles.tournamentList}>
            {filteredTournaments.map(tournament => (
              <View key={tournament._id} style={styles.tournamentCard}>
                <Image
                  source={{ uri: tournament.banner }}
                  style={styles.tournamentImage}
                />
                <View style={styles.tournamentDetails}>
                  <Text style={styles.tournamentTitle}>{tournament.title}</Text>
                  <Text style={styles.tournamentDate}>
                    {new Date(tournament.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.tournamentSkillLevel}>
                    Skill Level: {tournament.skillLevel}
                  </Text>
                  <Text style={styles.tournamentPrize}>
                    Prize: {tournament.prize}
                  </Text>
                  <TouchableOpacity
                    style={styles.tournamentButton}
                    onPress={() => handleViewDetails(tournament)}
                  >
                    <LinearGradient
                      colors={['#6EE7B7', '#3B82F6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.tournamentButtonGradient}
                    >
                      <Text style={styles.tournamentButtonText}>
                        View Details
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

// Ensure Dimensions is available in all environments (tests too)
const windowWidth =
  Dimensions && typeof Dimensions.get === 'function'
    ? Dimensions.get('window').width
    : 375;

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 4,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },
  heroBanner: {
    alignItems: 'center',
    marginVertical: 20,
  },
  heroImage: {
    width: windowWidth * 0.9,
    height: 150,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  heroText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  filterInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 25,
    color: '#111',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: '#3B82F6',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  loader: {
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 30,
  },
  tournamentList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tournamentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  tournamentImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tournamentDetails: {
    padding: 15,
  },
  tournamentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  tournamentDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  tournamentSkillLevel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  tournamentPrize: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  tournamentButton: {
    alignSelf: 'flex-start',
  },
  tournamentButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  tournamentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  notificationIcon: {
    fontSize: 20,
  },
});
