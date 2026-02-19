import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Sport {
  id: string;
  name: string;
  icon: string;
  players: string;
  color: string;
}

interface TrendingSportsProps {
  sports: Sport[];
  onSportPress?: (sport: Sport) => void;
}

const TrendingSports: React.FC<TrendingSportsProps> = ({ sports, onSportPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Sports</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingSportsContainer}
      >
        {sports.map((sport) => (
          <TouchableOpacity
            key={sport.id}
            style={[styles.trendingSportCard, { borderLeftColor: sport.color }]}
            activeOpacity={0.7}
            onPress={() => onSportPress?.(sport)}
          >
            <View style={[styles.trendingSportIcon, { backgroundColor: `${sport.color}20` }]}>
              <Ionicons name={sport.icon as any} size={28} color={sport.color} />
            </View>
            <Text style={styles.trendingSportName}>{sport.name}</Text>
            <Text style={styles.trendingSportPlayers}>{sport.players} players</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891B2',
  },
  trendingSportsContainer: {
    paddingHorizontal: 20,
  },
  trendingSportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 130,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trendingSportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingSportName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  trendingSportPlayers: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default TrendingSports;
