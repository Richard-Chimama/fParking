import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

interface CompassIndicatorProps {
  size?: number;
  rotation?: number;
}

const CompassIndicator: React.FC<CompassIndicatorProps> = ({ 
  size = 50, 
  rotation = 0 
}) => {
  const theme = useTheme();
  const center = size / 2;
  const radius = size / 2 - 2;
  const innerRadius = radius * 0.7;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: `${rotation}deg` }] }}>
        {/* Outer circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill={theme.colors.surface}
          stroke={theme.colors.primary}
          strokeWidth="2"
        />
        
        {/* Inner circle */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill={theme.colors.background}
          stroke={theme.colors.secondary}
          strokeWidth="1"
        />
        
        {/* North arrow (red) */}
        <Path
          d={`M ${center} ${center - innerRadius} L ${center - 6} ${center - 4} L ${center} ${center - 8} L ${center + 6} ${center - 4} Z`}
          fill={theme.colors.error}
        />
        
        {/* South arrow (white with border) */}
        <Path
          d={`M ${center} ${center + innerRadius} L ${center - 6} ${center + 4} L ${center} ${center + 8} L ${center + 6} ${center + 4} Z`}
          fill={theme.colors.surface}
          stroke={theme.colors.primary}
          strokeWidth="1"
        />
        
        {/* East and West markers */}
        <Circle cx={center + innerRadius * 0.8} cy={center} r="2" fill={theme.colors.secondary} />
        <Circle cx={center - innerRadius * 0.8} cy={center} r="2" fill={theme.colors.secondary} />
        

        
        {/* Center dot */}
        <Circle
          cx={center}
          cy={center}
          r="3"
          fill={theme.colors.accent}
          stroke={theme.colors.primary}
          strokeWidth="1"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CompassIndicator;