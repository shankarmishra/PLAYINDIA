import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatCard from '../StatCard';

interface FitnessStatsProps {
  stats: {
    title: string;
    value: string;
    change: string;
  }[];
}

const FitnessStats: React.FC<FitnessStatsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fitness Summary</Text>
      </View>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} change={stat.change} />
        ))}
      </View>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});

export default FitnessStats;
