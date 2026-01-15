import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './UIComponents';
import { theme } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change 
}) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.changeContainer}>
        <Ionicons name="trending-up" size={14} color={theme.colors.status.success} />
        <Text style={styles.change}>{change}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  title: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.5,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  change: {
    fontSize: 12,
    color: theme.colors.status.success,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default StatCard;