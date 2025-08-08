import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ParkingSpot } from '../types';
import { useTheme } from '../theme/ThemeProvider';

interface ParkingMarkerProps {
  spot: ParkingSpot;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const ParkingMarker: React.FC<ParkingMarkerProps> = ({ 
  spot, 
  size = 'medium', 
  showLabel = false 
}) => {
  const theme = useTheme();

  // Calculate occupancy rate
  const occupancyRate = (spot.totalSpots - spot.availableSpots) / spot.totalSpots;
  
  // Get marker color based on availability
  const getMarkerColor = () => {
    if (spot.availableSpots === 0) {
      return '#FF4444'; // Red for full
    } else if (occupancyRate > 0.8) {
      return '#FF8C00'; // Orange for nearly full
    } else if (occupancyRate > 0.5) {
      return '#FFD700'; // Yellow for half full
    } else {
      return '#4CAF50'; // Green for available
    }
  };

  // Get icon based on availability
  const getIcon = () => {
    if (spot.availableSpots === 0) {
      return 'car-outline';
    } else if (occupancyRate > 0.7) {
      return 'car-sport-outline';
    } else {
      return 'car-outline';
    }
  };

  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 24, height: 24, iconSize: 16 };
      case 'large':
        return { width: 48, height: 48, iconSize: 32 };
      default:
        return { width: 36, height: 36, iconSize: 24 };
    }
  };

  const dimensions = getSizeDimensions();
  const markerColor = getMarkerColor();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    marker: {
      width: dimensions.width,
      height: dimensions.height,
      borderRadius: dimensions.width / 2,
      backgroundColor: markerColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    availabilityBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: markerColor,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: markerColor,
    },
    label: {
      marginTop: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      maxWidth: 120,
    },
    labelText: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.marker}>
        <Ionicons 
          name={getIcon()} 
          size={dimensions.iconSize} 
          color="#FFFFFF" 
        />
        {spot.availableSpots > 0 && (
          <View style={styles.availabilityBadge}>
            <Text style={styles.badgeText}>
              {spot.availableSpots > 9 ? '9+' : spot.availableSpots}
            </Text>
          </View>
        )}
      </View>
      {showLabel && (
        <View style={styles.label}>
          <Text style={styles.labelText} numberOfLines={1}>
            {spot.name}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ParkingMarker;