// ========================================
// PLAYINDIA APP THEME
// Centralized colors, animations, and styling
// ========================================

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ========================================
// COLORS
// ========================================
export const colors = {
  // Primary Colors
  primary: {
    navy: '#1B5E20',      // Dark Green
    blue: '#2E7D32',      // Premium Green
    lightBlue: '#E8F5E9', // Lightest Green
    darkNavy: '#0D2D10',  // Very Dark Green
  },
  // Accent Colors
  accent: {
    neonGreen: '#2E7D32',
    green: '#1B5E20',
    orange: '#C62828',    // Muted Red for accents
    yellow: '#F9A825',
  },
  // Background Colors
  background: {
    primary: '#FFFFFF',
    neonGreen: '#2E7D32',
    softGreen: '#E8F5E9',
    mutedGreen: '#2E7D32',
    card: '#FFFFFF',
    tab: '#FFFFFF',
    tertiary: '#F3F4F6',
    overlay: 'rgba(27, 94, 32, 0.95)',
  },
  // Text Colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverted: '#FFFFFF',
    light: '#94A3B8',
  },
  // Status Colors
  status: {
    success: '#2E7D32',
    warning: '#F9A825',
    error: '#C62828',
    info: '#1565C0',
  },
  // UI Elements
  ui: {
    border: '#C8E6C9',
    divider: '#E8F5E9',
    inputBg: '#FFFFFF',
    buttonPrimary: '#2E7D32',
  }
};

// ========================================
// SPACING
// ========================================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ========================================
// BORDER RADIUS
// ========================================
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 9999,
};

// ========================================
// SHADOWS
// ========================================
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.29,
    shadowRadius: 3.84,
    elevation: 5,
  },
  glow: {
    shadowColor: colors.accent.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
};

// ========================================
// ANIMATIONS
// ========================================
const animationDuration = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

export const animations = {
  // Timing
  duration: animationDuration,
  // Spring configs
  spring: {
    gentle: { tension: 40, friction: 7 },
    normal: { tension: 100, friction: 10 },
    bouncy: { tension: 200, friction: 10 },
  },
  // Fade configurations
  fade: {
    in: {
      toValue: 1,
      duration: animationDuration.verySlow,
      useNativeDriver: true,
    },
    out: {
      toValue: 0,
      duration: animationDuration.slow,
      useNativeDriver: true,
    },
  },
  // Slide configurations
  slide: {
    up: {
      toValue: 0,
      duration: animationDuration.normal,
      useNativeDriver: true,
    },
    down: {
      toValue: 100,
      duration: animationDuration.normal,
      useNativeDriver: true,
    },
  },
};

// ========================================
// TYPOGRAPHY
// ========================================
export const typography = {
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    title: 28,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ========================================
// DIMENSIONS
// ========================================
export const dimensions = {
  screenWidth: width,
  screenHeight: height,
  inputHeight: 50,
  buttonHeight: 50,
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  logoSize: {
    sm: 40,
    md: 60,
    lg: 80,
    xl: 100,
  },
};

// ========================================
// EXPORT COMPLETE THEME
// ========================================
export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  animations,
  typography,
  dimensions,
};

export default theme;