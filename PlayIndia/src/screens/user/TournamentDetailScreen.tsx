import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from '../../utils/LinearGradientSafe';
import Icon from 'react-native-vector-icons/Ionicons';
import ApiService from '../../services/ApiService';

const { width } = Dimensions.get('window');

const TournamentDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { tournamentId } = route?.params || {};
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState<any>(null);

  // Fetch tournament data from API
  const fetchTournamentDetail = async () => {
    try {
      setLoading(true);
      const response = await ApiService.tournaments.getById(tournamentId);

      if (response.data && response.data.success && response.data.data) {
        setTournament(response.data.data);
      } else {
        // Use mock data
        setTournament(getMockTournament());
      }
    } catch (error) {
      console.log('Error fetching tournament:', error);
      setTournament(getMockTournament());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentDetail();
    }
  }, [tournamentId]);

  // Mock tournament data
  const getMockTournament = () => ({
    _id: tournamentId || '1',
    title: 'Summer Cricket League',
    description: 'Join the most prestigious cricket tournament of the year. Open to all skill levels with amazing prizes for winners.',
    location: 'Delhi Cricket Stadium',
    date: '2024-06-15T10:00:00.000Z',
    banner: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    sportType: 'Cricket',
    skillLevel: 'Beginner to Intermediate',
    prize: '₹50,000',
    registrationFee: '₹500',
    slotsLeft: 8,
    maxPlayers: 32,
    organizer: 'National Cricket Association',
    rules: [
      'Each team consists of 11 players',
      'Match duration: 50 overs per side',
      'Toss will be conducted 30 minutes before match',
      'Players must carry valid ID'
    ],
    schedule: [
      { round: 'Quarter Finals', date: '2024-06-15', time: '10:00 AM' },
      { round: 'Semi Finals', date: '2024-06-16', time: '10:00 AM' },
      { round: 'Finals', date: '2024-06-17', time: '2:00 PM' }
    ],
    leaderboard: [
      { player: 'Rahul Sharma', rank: 1, points: 120 },
      { player: 'Amit Patel', rank: 2, points: 110 },
      { player: 'Vikram Singh', rank: 3, points: 100 },
      { player: 'Suresh Kumar', rank: 4, points: 90 },
      { player: 'Rajesh Mehta', rank: 5, points: 80 },
    ]
  });

  const handleRegister = () => {
    Alert.alert('Register', 'Registration feature coming soon!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading tournament...</Text>
      </View>
    );
  }

  const t = tournament || getMockTournament();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tournament Details</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Tournament Banner */}
        <Image source={{ uri: t.banner }} style={styles.bannerImage} />

        {/* Tournament Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.tournamentTitle}>{t.title}</Text>
          <Text style={styles.tournamentDescription}>{t.description}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="calendar-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoText}>{formatDate(t.date)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="location-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoText}>{t.location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="trophy-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoText}>{t.prize}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="people-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoText}>{t.slotsLeft} slots left</Text>
            </View>
          </View>
        </View>

        {/* Registration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registration</Text>
          <View style={styles.registrationCard}>
            <View style={styles.registrationInfo}>
              <Text style={styles.registrationFee}>Registration Fee: {t.registrationFee}</Text>
              <Text style={styles.slotsInfo}>{t.slotsLeft}/{t.maxPlayers} slots filled</Text>
            </View>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <LinearGradient
                colors={['#2E7D32', '#1B5E20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.registerGradient}
              >
                <Text style={styles.registerButtonText}>Register Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rules Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tournament Rules</Text>
          <View style={styles.rulesContainer}>
            {t.rules.map((rule: string, index: number) => (
              <View key={index} style={styles.ruleItem}>
                <View style={styles.ruleBullet} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Schedule Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tournament Schedule</Text>
          <View style={styles.scheduleContainer}>
            {t.schedule.map((event: any, index: number) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.scheduleDateContainer}>
                  <Text style={styles.scheduleDate}>{event.date}</Text>
                  <Text style={styles.scheduleTime}>{event.time}</Text>
                </View>
                <Text style={styles.scheduleRound}>{event.round}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Leaderboard Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          <View style={styles.leaderboardContainer}>
            {t.leaderboard.map((player: any, index: number) => (
              <View key={index} style={styles.leaderboardItem}>
                <View style={[styles.rankContainer, { backgroundColor: getRankColor(player.rank) }]}>
                  <Text style={styles.rankText}>{player.rank}</Text>
                </View>
                <Text style={styles.playerName}>{player.player}</Text>
                <Text style={styles.playerPoints}>{player.points} pts</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Organizer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organized By</Text>
          <View style={styles.organizerContainer}>
            <Text style={styles.organizerName}>{t.organizer}</Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Organizer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getRankColor = (rank: number) => {
  if (rank === 1) return '#FFD700'; // Gold
  if (rank === 2) return '#C0C0C0'; // Silver
  if (rank === 3) return '#CD7F32'; // Bronze
  return '#1B5E20'; // Default
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#2E7D32',
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
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  shareButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
  },
  bannerImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tournamentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  tournamentDescription: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: '#4A5568',
    marginLeft: 8,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#E8F5E9',
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 12,
  },
  registrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  registrationInfo: {
    flex: 1,
  },
  registrationFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  slotsInfo: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 4,
    fontWeight: '500',
  },
  registerButton: {
    marginLeft: 16,
  },
  registerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  rulesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
    marginTop: 8,
    marginRight: 12,
  },
  ruleText: {
    fontSize: 14,
    color: '#4A5568',
    flex: 1,
    lineHeight: 20,
  },
  scheduleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  scheduleItemLast: {
    borderBottomWidth: 0,
  },
  scheduleDateContainer: {
    alignItems: 'flex-start',
  },
  scheduleDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  scheduleTime: {
    fontSize: 12,
    color: '#4A5568',
  },
  scheduleRound: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  leaderboardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  leaderboardItemLast: {
    borderBottomWidth: 0,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
    flex: 1,
  },
  playerPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  organizerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 20,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TournamentDetailScreen;