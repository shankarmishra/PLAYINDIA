import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '../theme/colors';
import { useFitness } from '../contexts/FitnessContext';
import CircularProgress from './CircularProgress';
import FitnessCard from './FitnessCard';

const { width } = Dimensions.get('window');

interface FitnessDashboardProps {
  onPermissionRequest?: () => void;
}

const FitnessDashboard: React.FC<FitnessDashboardProps> = ({ onPermissionRequest }) => {
  const { fitnessData, loading, error, hasPermissions, requestPermissions } = useFitness();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading fitness data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!hasPermissions) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Fitness Tracking</Text>
        <Text style={styles.permissionText}>
          Connect your smartwatch to track steps, heart rate, sleep, and more!
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={onPermissionRequest || requestPermissions}
        >
          <Text style={styles.permissionButtonText}>Connect Smartwatch</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!fitnessData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No fitness data available</Text>
      </View>
    );
  }

  // Calculate progress percentages (using realistic goals)
  const stepsProgress = Math.min(100, ((fitnessData?.steps || 0) / 10000) * 100);
  const caloriesProgress = Math.min(100, ((fitnessData?.calories || 0) / 500) * 100);
  const waterProgress = Math.min(100, ((fitnessData?.waterIntake || 0) / 2) * 100);
  const workoutProgress = Math.min(100, ((fitnessData?.workoutMinutes || 0) / 60) * 100);

  const maxWeeklySteps = Math.max(...(fitnessData?.weeklySteps?.map(s => s.steps) || [10000]));
  const maxHeartRate = Math.max(...(fitnessData?.hourlyHeartRate?.map(h => h.rate) || [120]));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Analysis</Text>

      {/* Overview Cards */}
      <View style={styles.statsGrid}>
        <FitnessCard
          title="Steps"
          value={(fitnessData?.steps || 0).toLocaleString()}
          unit=""
          progress={stepsProgress}
          icon="walk"
          color={theme.colors.accent.neonGreen}
        />
        <FitnessCard
          title="Calories"
          value={(fitnessData?.calories || 0).toString()}
          unit="kcal"
          progress={caloriesProgress}
          icon="flame"
          color="#FF5252"
        />
        <FitnessCard
          title="Workout"
          value={(fitnessData?.workoutMinutes || 0).toString()}
          unit="min"
          progress={workoutProgress}
          icon="fitness"
          color="#7C4DFF"
        />
        <FitnessCard
          title="Water"
          value={(fitnessData?.waterIntake || 0).toFixed(1)}
          unit="L"
          progress={waterProgress}
          icon="water"
          color="#03A9F4"
        />
      </View>

      {/* Weekly Activity Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <Text style={styles.chartSub}>Steps over last 7 days</Text>
        </View>
        <View style={styles.barChartContainer}>
          {fitnessData?.weeklySteps?.map((item, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${(item.steps / maxWeeklySteps) * 100}%`,
                      backgroundColor: item.day === 'Sun' ? theme.colors.accent.neonGreen : '#C8E6C9'
                    }
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.day}</Text>
            </View>
          )) || <Text style={styles.emptyText}>No weekly data</Text>}
        </View>
      </View>

      {/* Heart Rate Analysis */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Heart Rate Trend</Text>
          <Text style={styles.chartSub}>BPM variation throughout the day</Text>
        </View>
        <View style={styles.lineChartContainer}>
          <View style={styles.lineGrid}>
            {[120, 90, 60].map(val => (
              <View key={val} style={styles.gridLine}>
                <Text style={styles.gridLabel}>{val}</Text>
                <View style={styles.line} />
              </View>
            ))}
          </View>
          <View style={styles.pointsContainer}>
            {fitnessData?.hourlyHeartRate?.map((item, index) => (
              <View key={index} style={styles.dataPoint}>
                <View
                  style={[
                    styles.point,
                    { bottom: `${(item.rate / 150) * 100}%` }
                  ]}
                />
                <Text style={styles.pointLabel}>{item.hour}</Text>
              </View>
            )) || <Text style={styles.emptyText}>No heart rate data</Text>}
          </View>
        </View>
      </View>

      {/* Sleep Section - Compact */}
      <View style={styles.healthRow}>
        <View style={styles.healthCard}>
          <Ionicons name="moon" size={20} color="#7C4DFF" />
          <View style={styles.healthInfo}>
            <Text style={styles.healthVal}>{(fitnessData?.sleepHours || 0).toFixed(1)} hrs</Text>
            <Text style={styles.healthLabel}>Sleep</Text>
          </View>
        </View>
        <View style={styles.healthCard}>
          <Ionicons name="heart" size={20} color="#EF4444" />
          <View style={styles.healthInfo}>
            <Text style={styles.healthVal}>{fitnessData?.heartRateAvg || 0} BPM</Text>
            <Text style={styles.healthLabel}>Avg Heart</Text>
          </View>
        </View>
      </View>

      {/* Sync Status */}
      <View style={styles.syncContainer}>
        <Ionicons name="sync" size={14} color="#64748B" />
        <Text style={styles.syncText}>Data last synced at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  chartSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  chartHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  chartSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barBg: {
    width: 12,
    height: 80,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '600',
  },
  lineChartContainer: {
    height: 140,
    justifyContent: 'center',
  },
  lineGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  gridLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 9,
    color: '#94A3B8',
    width: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingLeft: 24,
  },
  dataPoint: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: 30,
  },
  point: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    position: 'absolute',
  },
  pointLabel: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 4,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  healthCard: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  healthInfo: {
    marginLeft: 10,
  },
  healthVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  healthLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  syncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingBottom: 20,
  },
  syncText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 6,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  permissionContainer: {
    padding: 24,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: '#166534',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
  },
  permissionButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});

export default FitnessDashboard;