import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

interface FloatingActionButtonProps {
  icon: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  icon, 
  onPress,
  style 
}) => {
  return (
    <TouchableOpacity style={[styles.fab, style]} onPress={onPress}>
      <Ionicons name={icon as any} size={24} color={theme.colors.text.inverted} />
    </TouchableOpacity>
  );
};

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
  style 
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.buttonSecondary, style];
      case 'outline':
        return [styles.button, styles.buttonOutline, style];
      default:
        return [styles.button, styles.buttonPrimary, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.buttonText, styles.buttonTextSecondary];
      case 'outline':
        return [styles.buttonText, styles.buttonTextOutline];
      default:
        return [styles.buttonText, styles.buttonTextPrimary];
    }
  };

  return (
    <TouchableOpacity 
      style={getButtonStyle()} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

interface ChipProps {
  title: string;
  selected?: boolean;
  onPress: () => void;
}

export const Chip: React.FC<ChipProps> = ({ 
  title, 
  selected = false, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.chip, 
        selected ? styles.chipSelected : styles.chipUnselected
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.chipText, 
        selected ? styles.chipTextSelected : styles.chipTextUnselected
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent.neonGreen,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 16,
    right: 16,
    ...theme.shadows.medium,
  },
  button: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.accent.neonGreen,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.accent.orange,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.accent.neonGreen,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: theme.colors.text.inverted,
  },
  buttonTextSecondary: {
    color: theme.colors.text.inverted,
  },
  buttonTextOutline: {
    color: theme.colors.accent.neonGreen,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  chipSelected: {
    backgroundColor: theme.colors.accent.neonGreen,
  },
  chipUnselected: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: theme.colors.text.inverted,
  },
  chipTextUnselected: {
    color: theme.colors.text.primary,
  },
});

export default {
  Card,
  FloatingActionButton,
  Button,
  Chip,
};