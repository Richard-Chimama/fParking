import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Color palette
export const colors = {
  // Primary colors from the provided palette
  primary: 'rgb(51, 52, 70)',        // Dark blue-gray
  secondary: 'rgb(127, 140, 170)',    // Medium blue-gray
  accent: 'rgb(184, 207, 206)',       // Light blue-green
  background: 'rgb(234, 239, 239)',   // Very light gray
  
  // Semantic colors
  surface: '#FFFFFF',
  text: 'rgb(51, 52, 70)',
  textSecondary: 'rgb(127, 140, 170)',
  textTertiary: '#8E8E93',
  textLight: '#FFFFFF',
  
  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Functional colors
  border: 'rgba(127, 140, 170, 0.2)',
  shadow: 'rgba(51, 52, 70, 0.1)',
  overlay: 'rgba(51, 52, 70, 0.5)',
  
  // Gradient colors
  gradient: {
    primary: ['rgb(51, 52, 70)', 'rgb(127, 140, 170)'],
    accent: ['rgb(184, 207, 206)', 'rgb(234, 239, 239)'],
    card: ['#FFFFFF', 'rgb(234, 239, 239)'],
  },
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
};

// Component styles
export const components = {
  button: {
    primary: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      ...shadows.medium,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      ...shadows.small,
    },
    accent: {
      backgroundColor: colors.accent,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      ...shadows.small,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
  },
  card: {
    default: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows.medium,
    },
    elevated: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows.large,
    },
  },
  input: {
    default: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: typography.sizes.md,
      color: colors.text,
    },
    focused: {
      borderColor: colors.primary,
      ...shadows.small,
    },
  },
};

// Layout
export const layout = {
  screenWidth,
  screenHeight,
  container: {
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
};

// Animation durations
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Theme type definition
export interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  components: typeof components;
  layout: typeof layout;
  animation: typeof animation;
}

// Complete theme object
export const theme: Theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  layout,
  animation,
};

export default theme;