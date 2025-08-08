import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface ParkingLegendProps {
  isVisible: boolean;
  onToggle: () => void;
}

const ParkingLegend: React.FC<ParkingLegendProps> = ({ isVisible, onToggle }) => {
  const theme = useTheme();

  const legendItems = [
    {
      color: '#4CAF50',
      label: 'Available',
      description: 'Plenty of spaces'
    },
    {
      color: '#FFD700',
      label: 'Limited',
      description: 'Half full'
    },
    {
      color: '#FF8C00',
      label: 'Nearly Full',
      description: 'Few spaces left'
    },
    {
      color: '#FF4444',
      label: 'Full',
      description: 'No spaces available'
    },
    {
      color: '#2196F3',
      label: 'Your Car',
      description: 'Current location'
    }
  ];

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 250,
      right: 16,
      zIndex: 1000,
    },
    toggleButton: {
      backgroundColor: theme.colors.background,
      borderRadius: 25,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    legendPanel: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
      minWidth: 200,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    legendTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    colorIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 12,
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    labelContainer: {
      flex: 1,
    },
    labelText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    descriptionText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={onToggle}>
        <Ionicons 
          name={isVisible ? 'close' : 'information-circle-outline'} 
          size={24} 
          color={theme.colors.text} 
        />
      </TouchableOpacity>
      
      {isVisible && (
        <View style={styles.legendPanel}>
          <Text style={styles.legendTitle}>Parking Legend</Text>
          {legendItems.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View 
                style={[
                  styles.colorIndicator, 
                  { backgroundColor: item.color }
                ]} 
              />
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{item.label}</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ParkingLegend;