import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme/colors';
import FitnessService from '../services/FitnessService';

const { width } = Dimensions.get('window');

interface FitnessStatsProps {
  userId?: string;
}

const FitnessStats = ({ userId }: FitnessStatsProps) => {
  const [fitnessData, setFitnessData] = useState({
    steps: 0,
    calories: 0,
    sleepHours: 0,
    workoutMinutes: 0,
    waterIntake: 0,
    heartRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFitnessData();
  }, []);

  const loadFitnessData = async () => {
    try {
      setLoading(true);
      const fitnessService = FitnessService;
      
      // Get data from service
      const [steps, calories, sleepHours, workoutMinutes, waterIntake, heartRateData] = await Promise.all([
        fitnessService.getTodaySteps(),
        fitnessService.getCaloriesBurned(),
        fitnessService.getSleepHours(),
        fitnessService.getWorkoutMinutes(),
        fitnessService.getWaterIntake(),
        fitnessService.getHeartRateData()
      ]);

      const avgHeartRate = heartRateData.length > 0 
        ? Math.round(heartRateData.reduce((a, b) => a + b, 0) / heartRateData.length)
        : 72;

      setFitnessData({
        steps,
        calories,
        sleepHours: Math.round(sleepHours * 10) / 10,
        workoutMinutes: Math.round(workoutMinutes),
        waterIntake: Math.round(waterIntake * 10) / 10,
        heartRate: avgHeartRate
      });
    } catch (error) {
      console.error('Error loading fitness data:', error);
      // Use mock data on error
      setFitnessData({
        steps: 8547,
        calories: 420,
        sleepHours: 7.5,
        workoutMinutes: 45,
        waterIntake: 1.8,
        heartRate: 72
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      label: 'Steps', 
      value: fitnessData.steps.toLocaleString(), 
      unit: '', 
      color: '#4CAF50',
      icon: ' footsteps'
    },
    { 
      label: 'Calories', 
      value: fitnessData.calories.toString(), 
      unit: 'kcal', 
      color: '#FF9800',
      icon: 'flame'
    },
    { 
      label: 'Heart Rate', 
      value: fitnessData.heartRate.toString(), 
      unit: 'bpm', 
      color: '#F44336',
      icon: 'heart'
    },
    { 
      label: 'Sleep', 
      value: fitnessData.sleepHours.toString(), 
      unit: 'hrs', 
      color: '#2196F3',
      icon: 'moon'
    },
    { 
      label: 'Workout', 
      value: fitnessData.workoutMinutes.toString(), 
      unit: 'min', 
      color: '#9C27B0',
      icon: 'fitness'
    },
    { 
      label: 'Water', 
      value: fitnessData.waterIntake.toString(), 
      unit: 'L', 
      color: '#00BCD4',
      icon: 'water'
    }
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fitness Statistics</Text>
        <Text style={styles.loadingText}>Loading fitness data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Statistics</Text>
      
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
              <Text style={[styles.statIconText, { color: stat.color }]}>
                {stat.icon}
              </Text>
            </View>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
              <Text style={styles.statUnit}>{stat.unit}</Text>
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Weekly Progress Bar Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>This Week's Activity</Text>
        <View style={styles.chartContainer}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            // Mock data for the week
            const heights = [60, 85, 40, 75, 90, 30, 65];
            const height = heights[index];
            return (
              <View key={day} style={styles.chartColumn}>
                <View style={styles.chartLabelContainer}>
                  <Text style={styles.chartValue}>{Math.round(height * 0.85)}%</Text>
                </View>
                <View 
                  style={[
                    styles.chartBar, 
                    { 
                      height: `${height}%`,
                      backgroundColor: '#4CAF50'
                    }
                  ]} 
                />
                <Text style={styles.chartDay}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#558B2F',
    fontSize: 14,
    marginTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '30%',
    backgroundColor: '#F8FAF8',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  statLabel: {
    fontSize: 12,
    color: '#558B2F',
    fontWeight: '500',
  },
  chartSection: {
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  chartColumn: {
    alignItems: 'center',
    width: '12%',
  },
  chartLabelContainer: {
    marginBottom: 5,
  },
  chartValue: {
    fontSize: 10,
    color: '#558B2F',
    fontWeight: '500',
  },
  chartBar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  chartDay: {
    fontSize: 10,
    color: '#558B2F',
    fontWeight: '500',
  },
});

export default FitnessStats;