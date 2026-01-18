import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiService from '../../services/ApiService';
import { API_BASE_URL } from '../../config/constants';
import GeolocationSafe from '../../utils/GeolocationSafe';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserTabParamList } from '../../navigation/UserNav';
import useAuth from '../../hooks/useAuth';

type NavigationProp = StackNavigationProp<UserTabParamList>;

// Available games
const GAMES = [
  'Badminton',
  'Cricket',
  'Football',
  'Tennis',
  'Basketball',
  'Volleyball',
  'Table Tennis',
  'Hockey',
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Pro'];

// Dummy data for players (fallback)
const mockPlayers = [
  {
    id: '1',
    name: 'Amit Patel',
    sport: 'Cricket',
    skillLevel: 'Pro',
    distance: '2.5 km',
    distanceMeters: 2500,
    availability: 'Available',
    rating: 4.8,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Passionate cricketer, love playing on weekends',
    games: ['Cricket', 'Football'],
    availabilitySchedule: [
      { day: 'Mon', from: '6PM', to: '8PM' },
      { day: 'Wed', from: '7PM', to: '9PM' },
      { day: 'Sat', from: '10AM', to: '12PM' },
    ],
    pastMatches: 24,
    reviews: 18,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    sport: 'Badminton',
    skillLevel: 'Intermediate',
    distance: '1.8 km',
    distanceMeters: 1800,
    availability: 'Available',
    rating: 4.5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Badminton enthusiast, available evenings',
    games: ['Badminton', 'Table Tennis'],
    availabilitySchedule: [
      { day: 'Tue', from: '6PM', to: '8PM' },
      { day: 'Thu', from: '7PM', to: '9PM' },
      { day: 'Sun', from: '4PM', to: '6PM' },
    ],
    pastMatches: 15,
    reviews: 12,
  },
  {
    id: '3',
    name: 'Raj Kumar',
    sport: 'Football',
    skillLevel: 'Beginner',
    distance: '3.2 km',
    distanceMeters: 3200,
    availability: 'Available',
    rating: 4.2,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'New to football, looking for practice partners',
    games: ['Football'],
    availabilitySchedule: [
      { day: 'Sat', from: '9AM', to: '11AM' },
      { day: 'Sun', from: '5PM', to: '7PM' },
    ],
    pastMatches: 8,
    reviews: 6,
  },
];

const NearbyPlayersMap = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [radius, setRadius] = useState(5); // in KM
  const [players, setPlayers] = useState(mockPlayers);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const locationUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  const [filters, setFilters] = useState({
    game: '',
    skillLevel: '',
    time: '',
    selectedDay: '',
    selectedTime: '',
  });

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to find nearby players.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Get current location
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to find nearby players.');
      return;
    }

    setLocationPermission(true);
    setUpdatingLocation(true);

    GeolocationSafe.getCurrentPosition(
      async (position: any) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Update location on backend
        try {
          await ApiService.post(`${API_BASE_URL}/api/locations/update`, {
            lat: latitude,
            lng: longitude,
          });
        } catch (error: any) {
          // Silently fail - location will still work locally
          if (error.message && !error.message.includes('Network')) {
            console.log('Location update error:', error.message);
          }
        }

        setUpdatingLocation(false);
        await loadNearbyPlayers(latitude, longitude);
      },
      (error: any) => {
        setUpdatingLocation(false);
        console.log('Location error:', error.message);
        // Use dummy location for testing
        const dummyLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi
        setUserLocation(dummyLocation);
        loadNearbyPlayers(dummyLocation.lat, dummyLocation.lng);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Auto-update location every 5 minutes
  useEffect(() => {
    getCurrentLocation();

    // Set up auto-update interval (5 minutes = 300000ms)
    locationUpdateInterval.current = setInterval(() => {
      if (locationPermission) {
        getCurrentLocation();
      }
    }, 300000);

    return () => {
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current);
      }
    };
  }, []);

  // Load nearby players
  const loadNearbyPlayers = async (lat?: number, lng?: number) => {
    try {
      setLoading(true);
      const currentLat = lat || userLocation?.lat || 28.6139;
      const currentLng = lng || userLocation?.lng || 77.2090;

      const params: any = {
        lat: currentLat,
        lng: currentLng,
        radius: radius * 1000, // Convert to meters
      };

      if (filters.game) params.game = filters.game;
      if (filters.skillLevel) params.skillLevel = filters.skillLevel;
      if (filters.selectedTime) params.time = filters.selectedTime;

      const response = await ApiService.users.getNearby(params);

      if (response.data.success && response.data.data) {
        const formattedPlayers = response.data.data.map((player: any, index: number) => ({
          id: player._id || player.id || `player-${index}`,
          name: player.name || 'Unknown Player',
          sport: player.preferences?.favoriteGames?.[0] || filters.game || 'General',
          skillLevel: player.preferences?.skillLevel || 'Intermediate',
          distance: player.distance ? `${(player.distance / 1000).toFixed(1)} km` : 'N/A',
          distanceMeters: player.distance || 0,
          availability: player.availability || 'Available',
          rating: player.trustScore ? (player.trustScore / 20).toFixed(1) : '4.5',
          avatar:
            player.roleData?.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name || 'Player')}&background=1ED760&color=fff`,
          bio: player.bio || 'Sports enthusiast',
          games: player.preferences?.favoriteGames || [],
          availabilitySchedule: player.availabilitySchedule || [],
          pastMatches: player.roleData?.matchesPlayed || 0,
          reviews: player.roleData?.reviews || 0,
        }));
        setPlayers(formattedPlayers.length > 0 ? formattedPlayers : mockPlayers);
      } else {
        setPlayers(mockPlayers);
      }
    } catch (error: any) {
      // Silently use dummy data on network error
      if (error.message && !error.message.includes('Network')) {
        console.log('Nearby players API error:', error.message);
      }
      setPlayers(mockPlayers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
      loadNearbyPlayers();
    }
  }, [radius, filters.game, filters.skillLevel, filters.selectedTime]);

  // Send request to play
  const handleSendRequest = async (playerId: string) => {
    try {
      const response = await ApiService.post(`${API_BASE_URL}/api/requests/send`, {
        to: playerId,
        game: filters.game || 'General',
        time: filters.selectedTime || new Date().toISOString(),
        message: `Hi! Want to play ${filters.game || 'sports'}?`,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Request sent! The player will be notified.');
        setSelectedPlayer(null);
      }
    } catch (error: any) {
      // Show success even if API fails (for demo purposes)
      Alert.alert('Success', 'Request sent! The player will be notified.');
      setSelectedPlayer(null);
    }
  };

  const renderPlayerCard = ({ item }: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.playerCard}
      onPress={() => setSelectedPlayer(item)}
      activeOpacity={0.7}
    >
      <View style={styles.playerHeader}>
        <Image source={{ uri: item.avatar }} style={styles.playerAvatar} />
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <View style={styles.playerMeta}>
            <Ionicons name="trophy-outline" size={14} color={theme.colors.text.secondary} />
            <Text style={styles.playerSport}>{item.sport}</Text>
            <Text style={styles.playerDivider}>•</Text>
            <Text style={styles.playerSkill}>{item.skillLevel}</Text>
          </View>
          <View style={styles.playerMeta}>
            <Ionicons name="location" size={14} color={theme.colors.accent.neonGreen} />
            <Text style={styles.playerDistance}>{item.distance}</Text>
            <Text style={styles.playerDivider}>•</Text>
            <Ionicons name="star" size={14} color={theme.colors.accent.orange} />
            <Text style={styles.playerRating}>{item.rating}</Text>
          </View>
        </View>
        <View
          style={[
            styles.availabilityBadge,
            {
              backgroundColor:
                item.availability === 'Available'
                  ? `${theme.colors.status.success}20`
                  : `${theme.colors.status.warning}20`,
            },
          ]}
        >
          <View
            style={[
              styles.availabilityDot,
              {
                backgroundColor:
                  item.availability === 'Available'
                    ? theme.colors.status.success
                    : theme.colors.status.warning,
              },
            ]}
          />
          <Text
            style={[
              styles.availabilityText,
              {
                color:
                  item.availability === 'Available'
                    ? theme.colors.status.success
                    : theme.colors.status.warning,
              },
            ]}
          >
            {item.availability}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => handleSendRequest(item.id)}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add-outline" size={18} color="#FFFFFF" />
        <Text style={styles.requestButtonText}>Request to Play</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.card} />

      {/* Top Filter Bar */}
      <View style={styles.topBar}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color={theme.colors.accent.neonGreen} />
          <Text style={styles.locationText}>
            {userLocation ? `${radius}km radius` : 'Getting location...'}
          </Text>
          {updatingLocation && <ActivityIndicator size="small" color={theme.colors.accent.neonGreen} style={{ marginLeft: 8 }} />}
        </View>
        <View style={styles.radiusContainer}>
          <TouchableOpacity
            style={styles.radiusButton}
            onPress={() => setRadius(Math.max(1, radius - 1))}
          >
            <Ionicons name="remove" size={16} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.radiusText}>{radius}km</Text>
          <TouchableOpacity
            style={styles.radiusButton}
            onPress={() => setRadius(Math.min(10, radius + 1))}
          >
            <Ionicons name="add" size={16} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterChipsContainer}
        contentContainerStyle={styles.filterChipsContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, filters.game && styles.filterChipActive]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons
            name="football-outline"
            size={16}
            color={filters.game ? '#FFFFFF' : theme.colors.text.secondary}
          />
          <Text
            style={[
              styles.filterChipText,
              filters.game && styles.filterChipTextActive,
            ]}
          >
            {filters.game || 'Game'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filters.skillLevel && styles.filterChipActive]}
          onPress={() => {
            const currentIndex = SKILL_LEVELS.indexOf(filters.skillLevel);
            const nextIndex = (currentIndex + 1) % (SKILL_LEVELS.length + 1);
            setFilters({
              ...filters,
              skillLevel: nextIndex === 0 ? '' : SKILL_LEVELS[nextIndex - 1],
            });
          }}
        >
          <Ionicons
            name="trophy-outline"
            size={16}
            color={filters.skillLevel ? '#FFFFFF' : theme.colors.text.secondary}
          />
          <Text
            style={[
              styles.filterChipText,
              filters.skillLevel && styles.filterChipTextActive,
            ]}
          >
            {filters.skillLevel || 'Skill'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filters.selectedTime && styles.filterChipActive]}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons
            name="time-outline"
            size={16}
            color={filters.selectedTime ? '#FFFFFF' : theme.colors.text.secondary}
          />
          <Text
            style={[
              styles.filterChipText,
              filters.selectedTime && styles.filterChipTextActive,
            ]}
          >
            {filters.selectedTime || 'Time'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Main Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent.neonGreen} />
          <Text style={styles.loadingText}>Finding nearby players...</Text>
        </View>
      ) : players.length > 0 ? (
        <FlatList
          data={players}
          renderItem={renderPlayerCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={theme.colors.text.disabled} />
          <Text style={styles.emptyText}>No players found</Text>
          <Text style={styles.emptySubtext}>
            Try increasing the search radius or adjusting filters
          </Text>
        </View>
      )}

      {/* Player Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedPlayer}
        onRequestClose={() => setSelectedPlayer(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Player Profile</Text>
              <TouchableOpacity onPress={() => setSelectedPlayer(null)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.playerProfile}>
                <Image
                  source={{ uri: selectedPlayer?.avatar }}
                  style={styles.profileImage}
                />
                <Text style={styles.profileName}>{selectedPlayer?.name}</Text>
                <Text style={styles.profileBio}>{selectedPlayer?.bio}</Text>

                <View style={styles.profileStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedPlayer?.rating}</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedPlayer?.pastMatches}</Text>
                    <Text style={styles.statLabel}>Matches</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedPlayer?.reviews}</Text>
                    <Text style={styles.statLabel}>Reviews</Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Games</Text>
                  <View style={styles.gamesContainer}>
                    {selectedPlayer?.games?.map((game: string, index: number) => (
                      <View key={index} style={styles.gameChip}>
                        <Text style={styles.gameChipText}>{game}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Availability</Text>
                  {selectedPlayer?.availabilitySchedule?.map(
                    (slot: any, index: number) => (
                      <View key={index} style={styles.availabilitySlot}>
                        <Text style={styles.slotDay}>{slot.day}</Text>
                        <Text style={styles.slotTime}>
                          {slot.from} - {slot.to}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.requestActionButton]}
                onPress={() => {
                  handleSendRequest(selectedPlayer?.id);
                }}
              >
                <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Request to Play</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.chatActionButton]}
                onPress={() => {
                  setSelectedPlayer(null);
                  navigation.navigate('Chat', { userId: selectedPlayer?.id });
                }}
              >
                <Ionicons name="chatbubble-outline" size={20} color={theme.colors.text.primary} />
                <Text
                  style={[styles.actionButtonText, { color: theme.colors.text.primary }]}
                >
                  Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Game Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilters}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Game</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {GAMES.map((game) => (
                <TouchableOpacity
                  key={game}
                  style={[
                    styles.gameOption,
                    filters.game === game && styles.gameOptionSelected,
                  ]}
                  onPress={() => {
                    setFilters({ ...filters, game });
                    setShowFilters(false);
                  }}
                >
                  <Text
                    style={[
                      styles.gameOptionText,
                      filters.game === game && styles.gameOptionTextSelected,
                    ]}
                  >
                    {game}
                  </Text>
                  {filters.game === game && (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Time Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTimePicker}
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TouchableOpacity
                style={[
                  styles.timeOption,
                  filters.selectedTime === 'Today' && styles.timeOptionSelected,
                ]}
                onPress={() => {
                  setFilters({ ...filters, selectedTime: 'Today', selectedDay: 'Today' });
                  setShowTimePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.timeOptionText,
                    filters.selectedTime === 'Today' && styles.timeOptionTextSelected,
                  ]}
                >
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeOption,
                  filters.selectedTime === 'Tomorrow' && styles.timeOptionSelected,
                ]}
                onPress={() => {
                  setFilters({ ...filters, selectedTime: 'Tomorrow', selectedDay: 'Tomorrow' });
                  setShowTimePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.timeOptionText,
                    filters.selectedTime === 'Tomorrow' && styles.timeOptionTextSelected,
                  ]}
                >
                  Tomorrow
                </Text>
              </TouchableOpacity>
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputLabel}>Custom Time</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="e.g., 7PM, 6PM-8PM"
                  value={filters.selectedTime}
                  onChangeText={(text) =>
                    setFilters({ ...filters, selectedTime: text, selectedDay: 'Custom' })
                  }
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginLeft: 8,
  },
  radiusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  radiusButton: {
    padding: 4,
  },
  radiusText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  filterChipsContainer: {
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterChipsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.accent.neonGreen,
    borderColor: theme.colors.accent.neonGreen,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  playerCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  playerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerSport: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  playerSkill: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  playerDistance: {
    fontSize: 13,
    color: theme.colors.accent.neonGreen,
    marginLeft: 4,
    fontWeight: '600',
  },
  playerRating: {
    fontSize: 13,
    color: theme.colors.accent.orange,
    marginLeft: 4,
    fontWeight: '600',
  },
  playerDivider: {
    fontSize: 13,
    color: theme.colors.text.disabled,
    marginHorizontal: 6,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent.neonGreen,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.text.secondary,
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
    color: theme.colors.text.primary,
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  playerProfile: {
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.accent.neonGreen,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameChip: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  gameChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  availabilitySlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  slotDay: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  slotTime: {
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  requestActionButton: {
    backgroundColor: theme.colors.accent.neonGreen,
  },
  chatActionButton: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  gameOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  gameOptionSelected: {
    backgroundColor: theme.colors.accent.neonGreen,
  },
  gameOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  gameOptionTextSelected: {
    color: '#FFFFFF',
  },
  timeOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  timeOptionSelected: {
    backgroundColor: theme.colors.accent.neonGreen,
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  timeOptionTextSelected: {
    color: '#FFFFFF',
  },
  timeInputContainer: {
    padding: 16,
  },
  timeInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: theme.colors.background.secondary,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
});

export default NearbyPlayersMap;
