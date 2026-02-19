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
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const PlayerPerformanceScreen = () => {
  const navigation = useNavigation();

  const players = [
    {
      id: '1',
      name: 'John Doe',
      position: 'Forward',
      matches: 15,
      goals: 12,
      assists: 8,
      rating: 4.5,
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '2',
      name: 'Mike Smith',
      position: 'Midfielder',
      matches: 18,
      goals: 6,
      assists: 10,
      rating: 4.2,
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '3',
      name: 'David Johnson',
      position: 'Defender',
      matches: 20,
      goals: 2,
      assists: 3,
      rating: 4.0,
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: '4',
      name: 'Chris Williams',
      position: 'Goalkeeper',
      matches: 16,
      goals: 0,
      assists: 1,
      rating: 4.3,
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      id: '5',
      name: 'Tom Brown',
      position: 'Forward',
      matches: 12,
      goals: 9,
      assists: 4,
      rating: 4.1,
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
  ];

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Forward':
        return '#FF6B6B';
      case 'Midfielder':
        return '#4ECDC4';
      case 'Defender':
        return '#45B7D1';
      case 'Goalkeeper':
        return '#96CEB4';
      default:
        return '#95A5A6';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#10B981';
    if (rating >= 4.0) return '#22C55E';
    if (rating >= 3.5) return '#F59E0B';
    return '#EF4444';
  };

  const renderPlayerCard = (player: any) => (
    <View key={player.id} style={styles.playerCard}>
      <View style={styles.playerHeader}>
        <Image source={{ uri: player.image }} style={styles.playerImage} />
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <View style={[styles.positionBadge, { backgroundColor: getPositionColor(player.position) + '20' }]}>
            <Text style={[styles.positionText, { color: getPositionColor(player.position) }]}>
              {player.position}
            </Text>
          </View>
        </View>
        <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(player.rating) + '20' }]}>
          <Ionicons name="star" size={14} color={getRatingColor(player.rating)} />
          <Text style={[styles.ratingText, { color: getRatingColor(player.rating) }]}>
            {player.rating}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{player.matches}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{player.goals}</Text>
          <Text style={styles.statLabel}>Goals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{player.assists}</Text>
          <Text style={styles.statLabel}>Assists</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Goal Efficiency</Text>
          <Text style={styles.progressValue}>{((player.goals / player.matches) * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min((player.goals / 20) * 100, 100)}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Player Performance</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="people" size={28} color="#1ED760" />
          <Text style={styles.summaryValue}>{players.length}</Text>
          <Text style={styles.summaryLabel}>Total Players</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="football" size={28} color="#1ED760" />
          <Text style={styles.summaryValue}>{players.reduce((sum, p) => sum + p.goals, 0)}</Text>
          <Text style={styles.summaryLabel}>Total Goals</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="trending-up" size={28} color="#1ED760" />
          <Text style={styles.summaryValue}>
            {(players.reduce((sum, p) => sum + p.rating, 0) / players.length).toFixed(1)}
          </Text>
          <Text style={styles.summaryLabel}>Avg Rating</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Player Statistics</Text>
        {players.map(renderPlayerCard)}
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1A1A2E',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1A1A2E',
  },
  summaryCard: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  positionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  positionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#666666',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1ED760',
    borderRadius: 3,
  },
});

export default PlayerPerformanceScreen;
