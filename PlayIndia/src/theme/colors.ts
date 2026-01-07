// Define color palette
export const colors = {
  // Primary Colors
  primary: {
    navy: '#0B1C2D',    // Dark Navy / Sports Blue
    blue: '#0B1C2D',
  },
  // Accent Colors
  accent: {
    neonGreen: '#1ED760',  // Neon Green
    orange: '#FF6A00',     // Orange
  },
  // Background Colors
  background: {
    primary: '#FFFFFF',    // White
    secondary: '#F5F7FA',  // Off-white
    tertiary: '#E5E7EB',   // Light Grey
    card: '#FFFFFF',
    tab: '#FFFFFF',
  },
  // Text Colors
  text: {
    primary: '#1F2937',    // Dark Grey
    secondary: '#6B7280',  // Medium Grey
    disabled: '#9CA3AF',   // Light Grey
    inverted: '#FFFFFF',   // White
  },
  // Status Colors
  status: {
    success: '#10B981',    // Green
    warning: '#F59E0B',    // Yellow/Amber
    error: '#EF4444',      // Red
    info: '#3B82F6',       // Blue
  },
  // UI Elements
  ui: {
    border: '#E5E7EB',
    divider: '#E5E7EB',
  }
};

// Define spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Define border radius scale
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
};

// Define shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

// Export theme object combining all
export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
};

export default theme;