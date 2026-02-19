import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';

interface SearchRequest {
  game: string;
  date: string;
  time: string;
  skill: string;
  radius: number;
  playersNeeded: number;
  message: string;
  ageMin: number;
  ageMax: number;
}

interface Game {
  id: string;
  name: string;
  icon: string;
}

interface SkillLevel {
  id: string;
  label: string;
}

const FindPlayersFormScreen = () => {
  const navigation = useNavigation<any>();

  const [games, setGames] = useState<Game[]>([]);
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [gameSearchQuery, setGameSearchQuery] = useState<string>('');

  const [searchRequest, setSearchRequest] = useState<SearchRequest>({
    game: '',
    date: '',
    time: '',
    skill: '',
    radius: 5,
    playersNeeded: 1,
    message: '',
    ageMin: 18,
    ageMax: 50,
  });

  const getDynamicDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    return [
      { id: 'today', label: 'Today', date: formatDate(today) },
      { id: 'tomorrow', label: 'Tomorrow', date: formatDate(tomorrow) },
    ];
  };

  const fetchGames = async () => {
    setGames(getDefaultGames());
  };

  const fetchUserLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setUserAddress('New Delhi, India'); // Placeholder
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getDefaultGames = (): Game[] => [
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal-circle' },
    { id: 'badminton', name: 'Badminton', icon: 'tennisball' },
    { id: 'cricket', name: 'Cricket', icon: 'baseball' },
    { id: 'football', name: 'Football', icon: 'football' },
    { id: 'tennis', name: 'Tennis', icon: 'tennisball' },
    { id: 'basketball', name: 'Basketball', icon: 'basketball' },
    { id: 'volleyball', name: 'Volleyball', icon: 'fitness' },
    { id: 'table-tennis', name: 'Table Tennis', icon: 'tennisball' },
    { id: 'yoga', name: 'Yoga', icon: 'fitness' },
    { id: 'gym', name: 'Gym', icon: 'barbell' },
    { id: 'running', name: 'Running', icon: 'walk' },
    { id: 'cycling', name: 'Cycling', icon: 'bicycle' },
    { id: 'swimming', name: 'Swimming', icon: 'water' },
    { id: 'squash', name: 'Squash', icon: 'fitness' },
    { id: 'hockey', name: 'Hockey', icon: 'flag' },
  ];

  const getDefaultSkillLevels = (): SkillLevel[] => [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'professional', label: 'Professional' },
  ];

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchGames(), fetchUserLocation()]);
      setSkillLevels(getDefaultSkillLevels());
      setLoading(false);
    };
    initializeData();
  }, []);

  const updateRequest = (field: keyof SearchRequest, value: string | number) => {
    setSearchRequest(prev => ({ ...prev, [field]: value }));
  };

  const getTimeIcon = (slot: string) => {
    switch (slot) {
      case 'Morning': return 'sunny-outline';
      case 'Afternoon': return 'partly-sunny-outline';
      case 'Evening': return 'cloudy-night-outline';
      case 'Night': return 'moon-outline';
      default: return 'time-outline';
    }
  };

  const handleFindPlayers = () => {
    if (!searchRequest.game || !searchRequest.date) {
      Alert.alert('Required', 'Please select a sport and date');
      return;
    }
    // Navigate to LiveSearchMap (the search/pulsing animation screen)
    navigation.navigate('LiveSearchMap', { searchRequest, userLocation: currentLocation });
  };

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Players</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Sport</Text>

            {searchRequest.game === 'other' && (
              <View style={styles.infoNote}>
                <Ionicons name="information-circle" size={18} color="#15803D" />
                <Text style={styles.infoNoteText}>Please provide game name in bio</Text>
              </View>
            )}

            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search all sports..."
                placeholderTextColor="#94A3B8"
                value={gameSearchQuery}
                onChangeText={setGameSearchQuery}
              />
            </View>

            <View style={styles.gamesRow}>
              {filteredGames.slice(0, 15).map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={[
                    styles.gameCard,
                    searchRequest.game === game.id && styles.gameCardActive
                  ]}
                  onPress={() => updateRequest('game', game.id)}
                >
                  <View style={[styles.gameIconContainer, searchRequest.game === game.id && styles.gameIconActive]}>
                    <Ionicons name={game.icon as any} size={24} color={searchRequest.game === game.id ? '#FFFFFF' : '#2E7D32'} />
                  </View>
                  <Text style={[styles.gameName, searchRequest.game === game.id && styles.gameNameActive]} numberOfLines={1}>{game.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Schedule</Text>

            <Text style={styles.subLabel}>Select Date</Text>
            <View style={styles.radiusRow}>
              {getDynamicDates().map(d => (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.radiusPill, searchRequest.date === d.date && styles.radiusPillActive]}
                  onPress={() => updateRequest('date', d.date)}
                >
                  <Text style={[styles.radiusText, searchRequest.date === d.date && styles.radiusTextActive]}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.subLabel}>Select Time</Text>
            <View style={styles.optionsRow}>
              {['Morning', 'Afternoon', 'Evening', 'Night'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.optionBtn, searchRequest.time === t && styles.optionBtnActive]}
                  onPress={() => updateRequest('time', t)}
                >
                  <Ionicons
                    name={getTimeIcon(t)}
                    size={18}
                    color={searchRequest.time === t ? '#FFFFFF' : '#475569'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.optionText, searchRequest.time === t && styles.optionTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <Text style={styles.subLabel}>Skill Level</Text>
            <View style={styles.optionsRow}>
              {skillLevels.map(skill => (
                <TouchableOpacity
                  key={skill.id}
                  style={[styles.optionBtn, searchRequest.skill === skill.id && styles.optionBtnActive]}
                  onPress={() => updateRequest('skill', skill.id)}
                >
                  <Text style={[styles.optionText, searchRequest.skill === skill.id && styles.optionTextActive]}>{skill.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.subLabel}>Players Needed</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => updateRequest('playersNeeded', Math.max(1, searchRequest.playersNeeded - 1))}
              >
                <Ionicons name="remove" size={24} color="#2E7D32" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{searchRequest.playersNeeded}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => updateRequest('playersNeeded', Math.min(10, searchRequest.playersNeeded + 1))}
              >
                <Ionicons name="add" size={24} color="#2E7D32" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subLabel}>Search Radius (km)</Text>
            <View style={styles.radiusRow}>
              {[2, 5, 10, 15].map(km => (
                <TouchableOpacity
                  key={km}
                  style={[styles.radiusPill, searchRequest.radius === km && styles.radiusPillActive]}
                  onPress={() => updateRequest('radius', km)}
                >
                  <Text style={[styles.radiusText, searchRequest.radius === km && styles.radiusTextActive]}>{km} km</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Any Message?</Text>
            <TextInput
              style={styles.messageBox}
              placeholder="Ex: Looking for an intermediate partner for a fun game!"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={searchRequest.message}
              onChangeText={(text) => updateRequest('message', text)}
            />
          </View>

          <TouchableOpacity style={styles.findBtn} onPress={handleFindPlayers}>
            <Text style={styles.findBtnText}>Find Players Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Increased to prevent button clipping
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 16,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  infoNoteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
    marginLeft: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  gamesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gameCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gameCardActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameIconActive: {
    backgroundColor: '#2E7D32',
  },
  gameName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    paddingHorizontal: 4,
  },
  gameNameActive: {
    color: '#1B5E20',
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginTop: 16,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
    justifyContent: 'center',
  },
  optionBtnActive: {
    backgroundColor: '#2E7D32',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 10,
  },
  radiusPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  radiusPillActive: {
    backgroundColor: '#1B5E20',
  },
  radiusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  radiusTextActive: {
    color: '#FFFFFF',
  },
  messageBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  findBtn: {
    backgroundColor: '#2E7D32',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    elevation: 4,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  findBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default FindPlayersFormScreen;
