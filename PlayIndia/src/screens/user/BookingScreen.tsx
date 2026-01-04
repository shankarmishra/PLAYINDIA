import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import axios from 'axios';
import Geolocation from '../../utils/GeolocationSafe';
import AsyncStorage from '../../utils/AsyncStorageSafe';
import { API_ENDPOINTS } from '../../config/constants';
import BrandLogo from '../../components/BrandLogo';

const allGames = [
  'Badminton',
  'Football',
  'Cricket',
  'Volleyball',
  'Tennis',
  'Basketball',
  'Table Tennis',
  'Baseball',
  'Hockey',
  'Rugby',
];

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const { PermissionsAndroid } = require('react-native');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to find nearby players.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const BookingScreen = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
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

  const handleFindPlayers = async () => {
    if (!selectedGame || !selectedTime || !location.trim()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    setIsLoading(true);

    Geolocation.getCurrentPosition(
      async (position: any) => {
        const { latitude, longitude } = position.coords;
        const token = await AsyncStorage.getItem('userToken');

        if (!token) {
          setIsLoading(false);
          Alert.alert(
            'Error',
            'Authentication token is missing. Please log in again.',
          );
          return;
        }

        try {
          const response = await axios.post(
            API_ENDPOINTS.NEARBY_PLAYERS.NOTIFY,
            {
              location: { latitude, longitude },
              game: selectedGame,
              time: selectedTime,
              address: location,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setIsLoading(false);
          Alert.alert(
            'Players Found',
            `Found ${response.data.players?.length || 0} players for ${selectedGame} at ${location}.`,
          );
        } catch (error) {
          setIsLoading(false);
          const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : 'An error occurred while finding players.';
          Alert.alert('Error', errorMessage);
        }
      },
      (error: any) => {
        setIsLoading(false);
        Alert.alert(
          'Error',
          'Failed to get your location. Please enable location services.',
        );
        console.error('Geolocation Error:', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    );
  };

  const filteredGames = allGames.filter(game =>
    game.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.brandingHeader, { opacity: fadeAnim }]}>
        <BrandLogo size={45} style={styles.logoStyle} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Find Players 🎯</Text>
          <Text style={styles.headerSubtitle}>Seek teammates in your area</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[
          styles.section,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>🎮 MATCH DETAILS</Text>
            {selectedGame && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>{selectedGame}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>SELECT GAME</Text>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search games..."
                placeholderTextColor="#A0AEC0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamesScroll}>
              {filteredGames.map(game => (
                <TouchableOpacity
                  key={game}
                  style={[
                    styles.gameChip,
                    selectedGame === game && styles.gameChipActive,
                  ]}
                  onPress={() => setSelectedGame(game)}
                >
                  <Text style={[
                    styles.gameChipText,
                    selectedGame === game && styles.gameChipTextActive,
                  ]}>
                    {game}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>⏰ MEETING TIME</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputEmoji}>⏰</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 5:00 PM"
                placeholderTextColor="#A0AEC0"
                value={selectedTime}
                onChangeText={setSelectedTime}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>📍 LOCATION / VENUE</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputEmoji}>📍</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter address or venue"
                placeholderTextColor="#A0AEC0"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.findButton, isLoading && styles.disabledButton]}
            onPress={handleFindPlayers}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.findButtonText}>Notify Nearby Players</Text>
                <Text style={styles.findButtonEmoji}>🚀</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.noticeBox, { opacity: fadeAnim }]}>
          <Text style={styles.noticeIcon}>💡</Text>
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>How it works</Text>
            <Text style={styles.noticeText}>
              When you tap notify, we'll send a ping to other players who enjoy {selectedGame || 'the same sports'} in your area. You'll receive notifications when players respond!
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  brandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
  },
  logoStyle: {
    padding: 0,
    marginRight: 10,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D1B1E',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 5,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00B8D4',
    letterSpacing: 1.5,
  },
  selectedBadge: {
    backgroundColor: '#E6FBFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#00B8D4',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#718096',
    marginBottom: 8,
    letterSpacing: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0D1B1E',
  },
  gamesScroll: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  gameChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gameChipActive: {
    backgroundColor: '#E6FBFF',
    borderColor: '#00B8D4',
  },
  gameChipText: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '600',
  },
  gameChipTextActive: {
    color: '#00B8D4',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    fontSize: 15,
    color: '#0D1B1E',
  },
  findButton: {
    flexDirection: 'row',
    backgroundColor: '#00B8D4',
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#00B8D4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  findButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  findButtonEmoji: {
    fontSize: 18,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  noticeBox: {
    flexDirection: 'row',
    marginTop: 30,
    backgroundColor: '#0D1B1E',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 4,
  },
  noticeIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#00B8D4',
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 22,
  },
});

export default BookingScreen;
