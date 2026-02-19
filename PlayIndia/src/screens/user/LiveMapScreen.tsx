import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
// import LottieView from 'lottie-react-native'; // Temporarily disabled due to native module issues
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiService from '../../services/ApiService';
import { useLocation } from '../../context/LocationContext';
import { theme } from '../../theme/colors';
import MapView, { Marker } from 'react-native-maps';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCYcfLYKpRtW-bQiVL1K85ZQTlag0bPwHM';

const DUMMY_PLAYERS: NearbyPlayer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    distance: 0.8,
    skill: 'Advanced',
    image: 'https://i.pravatar.cc/150?img=12',
    lat: 19.0751,
    lng: 72.8789,
    status: 'available',
  },
  {
    id: '2',
    name: 'Priya Singh',
    distance: 1.2,
    skill: 'Intermediate',
    image: 'https://i.pravatar.cc/150?img=45',
    lat: 19.0770,
    lng: 72.8760,
    status: 'available',
  },
  {
    id: '3',
    name: 'Amit Patel',
    distance: 1.5,
    skill: 'Beginner',
    image: 'https://i.pravatar.cc/150?img=32',
    lat: 19.0745,
    lng: 72.8805,
    status: 'available',
  },
  {
    id: '4',
    name: 'Neha Sharma',
    distance: 2.1,
    skill: 'Advanced',
    image: 'https://i.pravatar.cc/150?img=23',
    lat: 19.0780,
    lng: 72.8740,
    status: 'available',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    distance: 2.8,
    skill: 'Intermediate',
    image: 'https://i.pravatar.cc/150?img=56',
    lat: 19.0735,
    lng: 72.8825,
    status: 'available',
  },
  {
    id: '6',
    name: 'Ananya Das',
    distance: 3.2,
    skill: 'Advanced',
    image: 'https://i.pravatar.cc/150?img=67',
    lat: 19.0790,
    lng: 72.8720,
    status: 'available',
  },
];

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height; // Full height for better visibility
const MAP_TOP_OFFSET = 0;

interface NearbyPlayer {
  id: string;
  name: string;
  distance: number;
  skill: string;
  image: string;
  lat: number;
  lng: number;
  status: 'available' | 'pending' | 'matched';
}

type SearchState = 'searching' | 'waiting' | 'matched' | 'cancelled' | 'timeout';

const LiveMapScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { currentLocation, currentAddress, refreshLocation: refreshLoc, locationLoading: contextLoading, isInitialized } = useLocation();
  const mapRef = useRef<any>(null);

  const { searchRequest } = route.params || {};

  const [searchState, setSearchState] = useState<SearchState>('searching');
  const [searchTime, setSearchTime] = useState(0);
  const [nearbyPlayers, setNearbyPlayers] = useState<NearbyPlayer[]>([]);
  const locationLoading = contextLoading;
  const [userAddress, setUserAddress] = useState<string>(currentAddress || '');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Removed all animations for cleaner UI

  // Get fresh location when screen opens
  useEffect(() => {
    const getFreshLocation = async () => {
      // Wait for context to initialize and permission
      await new Promise(resolve => setTimeout(resolve, 500));
      // Get fresh location if permission granted
      if (isInitialized) {
        await refreshLoc();
      }
    };
    getFreshLocation();
  }, []);

  // User location from context - use currentLocation when available
  const [userLat, setUserLat] = useState<number>(currentLocation?.latitude || 19.0760);
  const [userLng, setUserLng] = useState<number>(currentLocation?.longitude || 72.8777);

  // Map region - use currentLocation when available
  const [region, setRegion] = useState<any>({
    latitude: currentLocation?.latitude || 19.0760,
    longitude: currentLocation?.longitude || 72.8777,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  // Fetch nearby players from API
  const fetchNearbyPlayers = async (lat: number, lng: number) => {
    const radius = searchRequest?.radius || 5;

    // First update our own location to be visible to others
    try {
      await ApiService.users.updateProfile({
        location: {
          type: 'Point',
          coordinates: [lng, lat],
          address: currentAddress || 'Current Location'
        }
      });
    } catch (error: any) {
      console.log('Location sync error:', error.message);
    }

    // Call API to get nearby players
    try {
      const response = await ApiService.users.getNearby({
        lat,
        lng,
        distance: radius,
        ageMin: searchRequest?.ageMin,
        ageMax: searchRequest?.ageMax
      });

      if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
        const players = response.data.data.map((user: any) => ({
          id: user._id,
          name: user.name,
          distance: user.distance || 0,
          skill: user.preferences?.skillLevel || 'Intermediate',
          image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          lat: user.location?.coordinates ? user.location.coordinates[1] : lat,
          lng: user.location?.coordinates ? user.location.coordinates[0] : lng,
          status: 'available' as const,
        }));
        setNearbyPlayers(players);
      } else {
        // Use dummy players if no API results
        const dummyWithDistance = DUMMY_PLAYERS.map(player => ({
          ...player,
          distance: Math.round((Math.random() * 4 + 0.5) * 10) / 10, // Random distance 0.5-4.5km
        })).sort((a, b) => a.distance - b.distance);
        setNearbyPlayers(dummyWithDistance);
      }
    } catch (error: any) {
      console.log('Nearby players API error:', error.message);
      // Fallback to dummy players on error
      const dummyWithDistance = DUMMY_PLAYERS.map(player => ({
        ...player,
        distance: Math.round((Math.random() * 4 + 0.5) * 10) / 10,
      })).sort((a, b) => a.distance - b.distance);
      setNearbyPlayers(dummyWithDistance);
    }
  };

  // Recenter map to user location
  const centerOnUser = () => {
    mapRef.current?.animateToRegion({
      latitude: userLat,
      longitude: userLng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    }, 500);
  };

  // Initialize location - use context
  useEffect(() => {
    if (currentLocation) {
      setUserLat(currentLocation.latitude);
      setUserLng(currentLocation.longitude);
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      });
      fetchNearbyPlayers(currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation]);

  // Update map region when currentLocation changes
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 500);
    }
  }, [currentLocation]);

  // Update address when context address changes
  useEffect(() => {
    if (currentAddress) {
      setUserAddress(currentAddress);
    }
  }, [currentAddress]);

  // Search timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (searchState === 'searching' || searchState === 'waiting') {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [searchState]);

  // Removed pulse animation for cleaner UI

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        onMapReady={() => setMapLoaded(true)}
      >
        {/* User Location Marker - Custom Icon */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="My Location"
            description="You are here"
          >
            <View style={userMarkerStyles.markerContainer}>
              <View style={userMarkerStyles.markerRing} />
              <View style={userMarkerStyles.marker}>
                <Ionicons name="navigate" size={20} color="#FFFFFF" />
              </View>
              <View style={userMarkerStyles.markerPulse} />
              <View style={userMarkerStyles.markerPointer} />
            </View>
          </Marker>
        )}

        {/* Nearby Players Markers */}
        {nearbyPlayers.map((player) => (
          <Marker
            key={player.id}
            coordinate={{ latitude: player.lat, longitude: player.lng }}
            title={player.name}
            description={`${player.distance} km away • ${player.skill} level`}
          >
            <View style={playerMarkerStyles.markerContainer}>
              <View style={playerMarkerStyles.marker}>
                <Ionicons name="person-circle" size={24} color="#FFFFFF" />
              </View>
              <View style={playerMarkerStyles.markerPointer} />
              <View style={playerMarkerStyles.skillBadge}>
                <Text style={playerMarkerStyles.skillText}>{player.skill.charAt(0)}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Fallback UI when map is loading */}
      {!mapLoaded && (
        <View style={styles.mapFallback}>
          <Ionicons name="map" size={80} color="#2E7D32" />
          <Text style={styles.mapFallbackText}>Loading Map...</Text>
          <ActivityIndicator size="small" color="#2E7D32" style={{ marginTop: 10 }} />
        </View>
      )}

      {locationLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingOverlayText}>Getting your location...</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {searchState === 'searching' ? 'Searching Players...' :
              searchState === 'waiting' ? 'Waiting for match...' :
                searchState === 'matched' ? 'Matched!' : 'Find Players'}
          </Text>
          <View style={styles.headerSubtitle}>
            <Ionicons name="location" size={14} color="#6B7280" />
            <Text style={styles.headerAddress}>{userAddress || 'Current Location'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Recenter Button */}
      <TouchableOpacity style={styles.recenterButton} onPress={centerOnUser}>
        <Ionicons name="locate" size={24} color="#2E7D32" />
      </TouchableOpacity>

      {/* Search Status Card */}
      {searchState === 'searching' && (
        <View style={styles.searchCard}>
          {/* Simple Search Icon */}
          <View style={styles.animationContainer}>
            <View style={styles.searchCenter}>
              <Ionicons name="search" size={16} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.searchStatus}>
            <Text style={styles.searchText}>Finding players nearby...</Text>
            <Text style={styles.searchTime}>{formatTime(searchTime)}</Text>
          </View>

          {/* Players Found */}
          {nearbyPlayers.length > 0 && (
            <View style={styles.playersFound}>
              <Text style={styles.playersFoundText}>
                {nearbyPlayers.length} players found within {searchRequest?.radius || 5}km
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Bottom Sheet with Players List */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />

        {nearbyPlayers.length > 0 ? (
          <>
            <Text style={styles.bottomSheetTitle}>Nearby Players</Text>
            {nearbyPlayers.slice(0, 3).map((player) => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerCard}
                onPress={() => {
                  // Navigate to player profile or send request
                  console.log('Player selected:', player);
                }}
              >
                <Image
                  source={{ uri: player.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(player.name) }}
                  style={styles.playerImage}
                />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
                  <View style={styles.playerDetails}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.playerSkill} numberOfLines={1}>{player.skill}</Text>
                    <Text style={styles.playerDot}>•</Text>
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text style={styles.playerDistance} numberOfLines={1}>{player.distance} km</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.inviteButton}
                  onPress={() => {
                    // Send invitation to player
                    console.log('Inviting player:', player.name);
                  }}
                >
                  <Text style={styles.inviteButtonText}>Invite</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.noPlayersContainer}>
            <Ionicons name="people-outline" size={48} color="#9CA3AF" />
            <Text style={styles.noPlayersText}>No players found nearby</Text>
            <Text style={styles.noPlayersSubtext}>Try expanding your search radius</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const playerMarkerStyles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#10B981',
    marginTop: -2,
  },
  skillBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F59E0B',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  skillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
});

const userMarkerStyles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  markerRing: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: '#0EA5E9',
    opacity: 0.3,
    zIndex: 1,
  },
  marker: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 2,
  },
  markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#0EA5E9',
    marginTop: -3,
    zIndex: 1,
  },
  markerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0EA5E9',
    opacity: 0.2,
    zIndex: 0,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  map: {
    width: width,
    height: MAP_HEIGHT,
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(46, 125, 50, 0.9)', // Semi-transparent green
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 60,
    zIndex: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerAddress: {
    fontSize: 12,
    color: '#E8F5E9',
    marginLeft: 4,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  recenterButton: {
    position: 'absolute',
    right: 16,
    top: 65,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 50,
  },
  searchCard: {
    position: 'absolute',
    top: 60,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 40,
  },
  searchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  animationContainer: {
    height: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  // searchPulseContainer style removed as animations are disabled,
  // searchRing style removed as animations are disabled,
  searchCenter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1ED760',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Animation styles removed as all animations are disabled
  searchText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 6,
  },
  searchTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891B2',
  },
  playersFound: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  playersFoundText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '400',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: height * 0.35,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    zIndex: 30,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  playerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  playerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  playerSkill: {
    fontSize: 12,
    color: '#F59E0B',
    marginLeft: 4,
    fontWeight: '600',
  },
  playerDot: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 6,
  },
  playerDistance: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  inviteButton: {
    backgroundColor: '#1ED760',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#1ED760',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  noPlayersContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noPlayersText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  noPlayersSubtext: {
    fontSize: 15,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  mapPlaceholder: {
    width: width,
    height: height,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  loadingOverlayText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  mapFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  mapFallbackText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  mapPreview: {
    width: width,
    height: height * 0.5,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPreviewText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  mapPreviewSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  // Animation styles removed as all animations are disabled
});

export default LiveMapScreen;
