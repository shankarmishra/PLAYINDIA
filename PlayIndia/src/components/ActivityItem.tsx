import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ActivityItemProps {
  icon: string;
  title: string;
  subtitle: string;
  time: string;
  statusColor: string;
  onPress?: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  time, 
  statusColor,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: `${statusColor}20` }]}>
        <Ionicons name={icon as any} size={24} color={statusColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginVertical: theme.spacing.xs,
  },
  time: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
});

export default ActivityItem;