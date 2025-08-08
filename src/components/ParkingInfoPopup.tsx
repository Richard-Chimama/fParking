import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ParkingSpot, Parking } from '../types';
import { useTheme } from '../theme/ThemeProvider';

interface ParkingInfoPopupProps {
  visible: boolean;
  parking: ParkingSpot | Parking | null;
  onClose: () => void;
  onBook?: (parking: ParkingSpot | Parking) => void;
  onNavigate?: (parking: ParkingSpot | Parking) => void;
}

const { width, height } = Dimensions.get('window');

const ParkingInfoPopup: React.FC<ParkingInfoPopupProps> = ({
  visible,
  parking,
  onClose,
  onBook,
  onNavigate,
}) => {
  const theme = useTheme();

  if (!parking) return null;

  // Helper function to get availability status
  const getAvailabilityStatus = () => {
    const availableSpots = 'availableSpots' in parking ? parking.availableSpots : parking.availableSpaces;
    const totalSpots = 'totalSpots' in parking ? parking.totalSpots : parking.totalSpaces;
    
    if (availableSpots === 0) {
      return { text: 'Full', color: '#FF4444', icon: 'close-circle' };
    } else if (availableSpots === 1) {
      return { text: '1 spot available', color: '#FF8C00', icon: 'warning' };
    } else if (availableSpots <= totalSpots * 0.3) {
      return { text: `${availableSpots} spots available`, color: '#FFD700', icon: 'alert-circle' };
    } else {
      return { text: `${availableSpots} spots available`, color: '#4CAF50', icon: 'checkmark-circle' };
    }
  };

  // Helper function to get address
  const getAddress = () => {
    if ('address' in parking && typeof parking.address === 'object') {
      return `${parking.address.street}, ${parking.address.city}, ${parking.address.state}`;
    }
    return 'address' in parking ? parking.address : 'Address not available';
  };

  const formatAddress = (address: string | any): string => {
    if (typeof address === 'string') {
      return address;
    }
    if (address && typeof address === 'object') {
      return `${address.street}, ${address.city}, ${address.state} ${address.zipCode || ''}`;
    }
    return 'Address not available';
  };

  // Helper function to get price
  const getPrice = () => {
    if ('pricePerHour' in parking) {
      return parking.pricePerHour > 0 ? `$${parking.pricePerHour}/hour` : 'Free';
    }
    return 'Price not available';
  };

  const availabilityStatus = getAvailabilityStatus();
  const totalSpots = 'totalSpots' in parking ? parking.totalSpots : parking.totalSpaces;
  const availableSpots = 'availableSpots' in parking ? parking.availableSpots : parking.availableSpaces;

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: height * 0.7,
      paddingTop: 8,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 16,
    },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 20,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
      paddingRight: 40,
    },
    address: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    statusText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
    },
    content: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    infoLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingBottom: 32,
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    primaryButtonText: {
      color: '#FFFFFF',
    },
    secondaryButtonText: {
      color: theme.colors.text,
    },
  });

  const occupancyRate = (totalSpots - availableSpots) / totalSpots;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.container}>
            <View style={styles.handle} />
            
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={20} color={theme.colors.text} />
              </TouchableOpacity>
              
              <Text style={styles.title}>{parking.name}</Text>
              <Text style={styles.address}>{formatAddress(parking.address)}</Text>
              
              <View style={styles.statusContainer}>
                <Ionicons 
                  name={availabilityStatus.icon as any} 
                  size={16} 
                  color={availabilityStatus.color} 
                />
                <Text style={[styles.statusText, { color: availabilityStatus.color }]}>
                  {availabilityStatus.text}
                </Text>
              </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Price</Text>
                <Text style={styles.infoValue}>{getPrice()}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Spaces</Text>
                <Text style={styles.infoValue}>{totalSpots}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Available</Text>
                <Text style={styles.infoValue}>{availableSpots}</Text>
              </View>
              
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>Occupancy</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${occupancyRate * 100}%`,
                        backgroundColor: availabilityStatus.color
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(occupancyRate * 100)}% occupied
                </Text>
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              {onNavigate && (
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]} 
                  onPress={() => onNavigate(parking)}
                >
                  <Ionicons name="navigate" size={20} color={theme.colors.text} />
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Navigate</Text>
                </TouchableOpacity>
              )}
              
              {onBook && availableSpots > 0 && (
                <TouchableOpacity 
                  style={[styles.button, styles.primaryButton]} 
                  onPress={() => onBook(parking)}
                >
                  <Ionicons name="calendar" size={20} color="#FFFFFF" />
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>Book Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default ParkingInfoPopup;