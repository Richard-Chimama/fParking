import React, { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from './index';

// Create theme context
const ThemeContext = createContext<Theme | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<Theme>;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  customTheme 
}) => {
  const mergedTheme = customTheme ? { ...theme, ...customTheme } : theme;
  
  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Hook for accessing colors specifically
export const useColors = () => {
  const theme = useTheme();
  return theme.colors;
};

// Hook for accessing typography specifically
export const useTypography = () => {
  const theme = useTheme();
  return theme.typography;
};

// Hook for accessing spacing specifically
export const useSpacing = () => {
  const theme = useTheme();
  return theme.spacing;
};

// Hook for accessing component styles specifically
export const useComponents = () => {
  const theme = useTheme();
  return theme.components;
};

export default ThemeProvider;