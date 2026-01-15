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
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
        <Ionicons name={icon as any} size={22} color={statusColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
});

export default ActivityItem;