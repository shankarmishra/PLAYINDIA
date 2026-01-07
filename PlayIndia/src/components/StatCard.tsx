import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './UIComponents';
import { theme } from '../theme/colors';

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
      <Text style={styles.change}>{change}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginVertical: theme.spacing.xs,
  },
  change: {
    fontSize: 12,
    color: theme.colors.status.success,
    textAlign: 'center',
  },
});

export default StatCard;