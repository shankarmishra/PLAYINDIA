import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, Circle } from 'react-native-maps';
import ApiService from '../../services/ApiService';
import { useLocation } from '../../context/LocationContext';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCYcfLYKpRtW-bQiVL1K85ZQTlag0bPwHM';
const { width, height } = Dimensions.get('window');

// Map height for the interactive view
const MAP_OVERLAY_HEIGHT = height * 0.55;

interface NearbyPlayer {
  id: string;
  name: string;
  distance: string;
  skill: string;
  image: string;
  lat: number;
  lng: number;
  status: 'available' | 'pending' | 'matched';
}

type SearchState = 'searching' | 'waiting' | 'matched' | 'cancelled' | 'timeout';

const LiveSearchMapScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { searchRequest, userLocation, userAddress: passedAddress } = route.params || {};

  const [searchState, setSearchState] = useState<SearchState>('searching');
  const [searchTime, setSearchTime] = useState(0);
  const [nearbyPlayers, setNearbyPlayers] = useState<NearbyPlayer[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<MapView>(null);

  const { currentLocation, currentAddress, isInitialized: contextInitialized } = useLocation();

  const [userLat, setUserLat] = useState<number>(userLocation?.latitude || userLocation?.lat || currentLocation?.latitude || 19.0760);
  const [userLng, setUserLng] = useState<number>(userLocation?.longitude || userLocation?.lng || currentLocation?.longitude || 72.8777);
  const [userAddress, setUserAddress] = useState<string>(passedAddress || currentAddress || 'Current Location');
  const [locationInitialized, setLocationInitialized] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const searchIconAnim = useRef(new Animated.Value(0)).current;

  // Sync location
  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      setUserLat(userLocation.latitude);
      setUserLng(userLocation.longitude);
      setLocationInitialized(true);
    } else if (currentLocation) {
      setUserLat(currentLocation.latitude);
      setUserLng(currentLocation.longitude);
      setLocationInitialized(true);
      if (currentAddress) setUserAddress(currentAddress);
    } else if (userLocation?.lat && userLocation?.lng) {
      setUserLat(userLocation.lat);
      setUserLng(userLocation.lng);
      setLocationInitialized(true);
    }
  }, [currentLocation, userLocation, currentAddress]);

  // Initial fetch
  useEffect(() => {
    if (locationInitialized) {
      fetchNearbyPlayers(userLat, userLng);
    }
  }, [locationInitialized]);

  // Update map region when location changes
  useEffect(() => {
    if (locationInitialized && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLat,
        longitude: userLng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 1000);
    }
  }, [userLat, userLng, locationInitialized]);

  // Animations
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.timing(scanAnim, { toValue: 1, duration: 2500, useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(searchIconAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(searchIconAnim, { toValue: 0, duration: 500, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (searchState === 'searching' || searchState === 'waiting') {
        setSearchTime(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [searchState]);

  const fetchNearbyPlayers = async (lat: number, lng: number) => {
    // Sync location to backend
    try {
      await ApiService.users.updateProfile({
        location: {
          type: 'Point',
          coordinates: [lng, lat],
          address: userAddress || 'Current Location'
        }
      });
    } catch (error: any) {
      console.log('Location sync error:', error.message);
    }

    try {
      const response = await ApiService.users.getNearby({
        lat,
        lng,
        distance: searchRequest?.radius || 5,
        game: searchRequest?.game,
        time: searchRequest?.time,
      });

      if (response.data?.success && response.data?.data) {
        setNearbyPlayers(response.data.data.map((p: any) => ({
          id: p._id || p.id,
          name: p.name || 'Player',
          distance: p.distance ? parseFloat(p.distance).toFixed(1) : '0.1',
          skill: p.preferences?.skillLevel || 'Intermediate',
          image: p.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'P')}&background=1ED760&color=fff`,
          lat: p.location?.coordinates ? p.location.coordinates[1] : lat + (Math.random() - 0.5) * 0.01,
          lng: p.location?.coordinates ? p.location.coordinates[0] : lng + (Math.random() - 0.5) * 0.01,
          status: 'available' as const,
        })));
      }
    } catch (error) {
      console.log('Search Error:', error);
    }
  };

  const handleCancel = () => {
    setSearchState('cancelled');
    setTimeout(() => navigation.goBack(), 500);
  };

  const handleAccept = async (player: NearbyPlayer) => {
    try {
      setSearchState('waiting');
      await ApiService.users.notifyPlayer({
        playerId: player.id,
        game: searchRequest?.game,
        time: searchRequest?.time,
      });
      setSearchState('matched');
      setTimeout(() => navigation.replace('Chat'), 1500);
    } catch (error) {
      Alert.alert('Error', 'Could not send request.');
      setSearchState('searching');
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: userLat,
            longitude: userLng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          showsPointsOfInterest={false}
          showsBuildings={true}
          onMapReady={() => setMapReady(true)}
        >
          {/* User Marker */}
          <Marker
            coordinate={{ latitude: userLat, longitude: userLng }}
            title="Searching from here"
          >
            <View style={styles.userMarkerContainer}>
              <View style={styles.userMarkerDot} />
              <Animated.View
                style={[
                  styles.userMarkerPulse,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.2],
                      outputRange: [0.6, 0]
                    })
                  }
                ]}
              />
            </View>
          </Marker>

          {/* Search Radius Circle */}
          <Circle
            center={{ latitude: userLat, longitude: userLng }}
            radius={(searchRequest?.radius || 5) * 1000}
            fillColor="rgba(30, 215, 96, 0.1)"
            strokeColor="rgba(30, 215, 96, 0.3)"
            strokeWidth={2}
          />

          {/* Nearby Players Markers */}
          {nearbyPlayers.map((player) => (
            <Marker
              key={player.id}
              coordinate={{ latitude: player.lat, longitude: player.lng }}
              title={player.name}
            >
              <View style={styles.playerMarkerContainer}>
                <Ionicons name="person" size={14} color="#FFFFFF" />
              </View>
            </Marker>
          ))}
        </MapView>

        {!mapReady && (
          <View style={styles.mapLoadingOverlay}>
            <ActivityIndicator size="large" color="#1ED760" />
            <Text style={styles.mapLoadingText}>Initializing Map...</Text>
          </View>
        )}

        {/* Scanning Effect Overlay */}
        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [{
                translateY: scanAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, MAP_OVERLAY_HEIGHT]
                })
              }],
              opacity: scanAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.5, 0]
              })
            }
          ]}
        />
      </View>

      {/* Overlays */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={handleCancel} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={18} color="#1A1A2E" />
          <Text style={styles.timerText}>{formatTime(searchTime)}</Text>
        </View>
        <TouchableOpacity onPress={() => fetchNearbyPlayers(userLat, userLng)} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={22} color="#1A1A2E" />
        </TouchableOpacity>
      </View>

      <View style={styles.locationBanner}>
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={18} color="#1ED760" />
          <Text style={styles.locationAddress} numberOfLines={1}>{userAddress}</Text>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomCard}>
        <View style={styles.searchHeader}>
          <Animated.View style={{ transform: [{ scale: searchIconAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }}>
            <View style={[styles.searchIconContainer, searchState === 'matched' && { backgroundColor: '#10B981' }]}>
              <Ionicons name={searchState === 'matched' ? 'checkmark' : 'search'} size={24} color="#FFFFFF" />
            </View>
          </Animated.View>
          <View style={styles.searchInfo}>
            <Text style={styles.searchTitle}>
              {searchState === 'matched' ? 'Found a Match!' : searchState === 'waiting' ? 'Waiting...' : 'Searching...'}
            </Text>
            <Text style={styles.searchSubtitleText}>
              {searchRequest?.game} • {searchRequest?.time} • {searchRequest?.radius}km
            </Text>
          </View>
        </View>

        {nearbyPlayers.length > 0 && searchState === 'searching' ? (
          <View style={styles.playersList}>
            <Text style={styles.playersListTitle}>Nearby Players ({nearbyPlayers.length})</Text>
            {nearbyPlayers.slice(0, 3).map(player => (
              <TouchableOpacity key={player.id} style={styles.playerCard} onPress={() => handleAccept(player)}>
                <View style={[styles.playerStatusDot, { backgroundColor: '#10B981' }]} />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerSkill}>{player.skill} • {player.distance}km</Text>
                </View>
                <View style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Invite</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : searchState === 'searching' && (
          <View style={styles.noPlayersNearby}>
            <Ionicons name="people-outline" size={32} color="#94A3B8" />
            <Text style={styles.noPlayersTextDetail}>No players found yet. Try expanding your search.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  mapContainer: { flex: 1, backgroundColor: '#E8F5E9', overflow: 'hidden' },
  mapLoadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  mapLoadingText: { marginTop: 8, fontWeight: '600', color: '#2E7D32' },
  scanLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#1ED760', zIndex: 5 },
  topHeader: { position: 'absolute', top: 50, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  timerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4, elevation: 3 },
  timerText: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  refreshBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  locationBanner: { position: 'absolute', top: 100, left: 16, right: 16, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, elevation: 3, zIndex: 9 },
  locationInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationAddress: { flex: 1, fontSize: 13, color: '#1A1A2E' },
  bottomCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, elevation: 10 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  searchIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center' },
  searchInfo: { flex: 1, marginLeft: 12 },
  searchTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  searchSubtitleText: { fontSize: 13, color: '#6B7280' },
  playersList: { marginBottom: 20 },
  playersListTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 12 },
  playerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, gap: 10, marginBottom: 8 },
  playerStatusDot: { width: 8, height: 8, borderRadius: 4 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  playerSkill: { fontSize: 12, color: '#6B7280' },
  acceptButton: { backgroundColor: '#1ED760', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  acceptButtonText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  noPlayersNearby: { padding: 20, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 20 },
  noPlayersTextDetail: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 8 },
  cancelButton: { backgroundColor: '#FEE2E2', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButtonText: { fontSize: 15, fontWeight: '600', color: '#DC2626' },
  userMarkerContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1ED760',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 2,
  },
  userMarkerPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1ED760',
    zIndex: 1,
  },
  playerMarkerContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default LiveSearchMapScreen;
