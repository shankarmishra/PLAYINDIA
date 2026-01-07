import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from '../../utils/LinearGradientSafe';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const TournamentDetailScreen = ({ route }: any) => {
  // Get tournamentId from route params
  const { tournamentId } = route?.params || {};
  
  // Mock tournament data - in a real app, this would come from an API
  const tournament = {
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#0B1C2D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tournament</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-outline" size={24} color="#0B1C2D" />
        </TouchableOpacity>
      </View>

      {/* Tournament Banner */}
      <Image source={{ uri: tournament.banner }} style={styles.bannerImage} />
      
      {/* Tournament Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.tournamentTitle}>{tournament.title}</Text>
        <Text style={styles.tournamentDescription}>{tournament.description}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="calendar-outline" size={20} color="#1ED760" />
            <Text style={styles.infoText}>{formatDate(tournament.date)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="location-outline" size={20} color="#FF6A00" />
            <Text style={styles.infoText}>{tournament.location}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="trophy-outline" size={20} color="#1ED760" />
            <Text style={styles.infoText}>{tournament.prize}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="people-outline" size={20} color="#FF6A00" />
            <Text style={styles.infoText}>{tournament.slotsLeft} slots left</Text>
          </View>
        </View>
      </View>

      {/* Registration Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registration</Text>
        <View style={styles.registrationCard}>
          <View style={styles.registrationInfo}>
            <Text style={styles.registrationFee}>Registration Fee: {tournament.registrationFee}</Text>
            <Text style={styles.slotsInfo}>{tournament.slotsLeft}/{tournament.maxPlayers} slots filled</Text>
          </View>
          <TouchableOpacity style={styles.registerButton}>
            <LinearGradient
              colors={['#1ED760', '#10B981']}
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
          {tournament.rules.map((rule, index) => (
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
          {tournament.schedule.map((event, index) => (
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
          {tournament.leaderboard.map((player, index) => (
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
          <Text style={styles.organizerName}>{tournament.organizer}</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Organizer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const getRankColor = (rank: number) => {
  if (rank === 1) return '#FCD34D'; // Gold
  if (rank === 2) return '#E5E7EB'; // Silver
  if (rank === 3) return '#FDB022'; // Bronze
  return '#9CA3AF'; // Default
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1C2D',
  },
  shareButton: {
    padding: 8,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tournamentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B1C2D',
    marginBottom: 8,
  },
  tournamentDescription: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
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
  },
  infoText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1C2D',
    marginBottom: 12,
  },
  registrationCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  registrationInfo: {
    flex: 1,
  },
  registrationFee: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1C2D',
  },
  slotsInfo: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 4,
  },
  registerButton: {
    marginLeft: 16,
  },
  registerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  rulesContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
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
    backgroundColor: '#1ED760',
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
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scheduleItemLast: {
    borderBottomWidth: 0,
  },
  scheduleDateContainer: {
    alignItems: 'flex-start',
  },
  scheduleDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B1C2D',
  },
  scheduleTime: {
    fontSize: 12,
    color: '#4A5568',
  },
  scheduleRound: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1ED760',
  },
  leaderboardContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    color: '#0B1C2D',
    flex: 1,
  },
  playerPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1ED760',
  },
  organizerContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1C2D',
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#0B1C2D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TournamentDetailScreen;