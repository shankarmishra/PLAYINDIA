import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface QuickActionCardProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  title, 
  icon, 
  color, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={32} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingVertical: 20,
    backgroundColor: theme.colors.background.card,
    borderRadius: 20,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
});

export default QuickActionCard;