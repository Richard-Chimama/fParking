import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

interface CompassIndicatorProps {
  size?: number;
  rotation?: number;
  onPress?: () => void;
}

const CompassIndicator: React.FC<CompassIndicatorProps> = ({ 
  size = 50, 
  rotation = 0,
  onPress 
}) => {
  const theme = useTheme();
  const center = size / 2;
  const radius = size / 2 - 2;
  const innerRadius = radius * 0.7;
  
  const CompassContent = () => (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg 
        width={size} 
        height={size} 
        style={{ transform: [{ rotate: `${rotation}deg` }] }}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Outer circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill={theme.colors.surface || '#FFFFFF'}
          stroke={theme.colors.primary || '#333446'}
          strokeWidth={2}
        />
        
        {/* Inner circle */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill={theme.colors.background || '#EAEFEF'}
          stroke={theme.colors.secondary || '#7F8CAA'}
          strokeWidth={1}
        />
        
        {/* North arrow (red) */}
        <Path
          d={`M ${center} ${center - innerRadius} L ${center - 6} ${center - 4} L ${center} ${center - 8} L ${center + 6} ${center - 4} Z`}
          fill={theme.colors.error || '#FF3B30'}
        />
        
        {/* South arrow (white with border) */}
        <Path
          d={`M ${center} ${center + innerRadius} L ${center - 6} ${center + 4} L ${center} ${center + 8} L ${center + 6} ${center + 4} Z`}
          fill={theme.colors.surface || '#FFFFFF'}
          stroke={theme.colors.primary || '#333446'}
          strokeWidth={1}
        />
        
        {/* East and West markers */}
        <Circle cx={center + innerRadius * 0.8} cy={center} r={2} fill={theme.colors.secondary || '#7F8CAA'} />
        <Circle cx={center - innerRadius * 0.8} cy={center} r={2} fill={theme.colors.secondary || '#7F8CAA'} />
        
        {/* North indicator text */}
        <SvgText
          x={center}
          y={center - innerRadius + 16}
          textAnchor="middle"
          fontSize={10}
          fontWeight="bold"
          fill={theme.colors.primary || '#333446'}
        >
          N
        </SvgText>
        
        {/* Center dot */}
        <Circle
          cx={center}
          cy={center}
          r={3}
          fill={theme.colors.accent || '#B8CFCE'}
          stroke={theme.colors.primary || '#333446'}
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
  
  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <CompassContent />
    </TouchableOpacity>
  ) : (
    <CompassContent />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CompassIndicator;