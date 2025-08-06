import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { ParkingSpot, Parking } from '../types';
import { useParkings, parseCoordinates } from '../hooks/useParkings';

interface ParkingMapProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  parkingSpots?: ParkingSpot[];
  onMarkerPress?: (spot: ParkingSpot | Parking) => void;
  showUserLocation?: boolean;
  carMarkerCoordinate?: {
    latitude: number;
    longitude: number;
  };
  useDatabase?: boolean;
  mapRef?: React.RefObject<any>;
}

const ParkingMap: React.FC<ParkingMapProps> = ({
  initialRegion,
  parkingSpots: propParkingSpots,
  onMarkerPress,
  showUserLocation = true,
  carMarkerCoordinate,
  useDatabase = true,
  mapRef,
}) => {
  const theme = useTheme();
  const { parkings, loading, error } = useParkings();
  const [processedParkings, setProcessedParkings] = useState<ParkingSpot[]>([]);

  // Zambia coordinates - centered on Lusaka
  const zambiaRegion = {
    latitude: -15.3875,
    longitude: 28.3228,
    latitudeDelta: 8.0,
    longitudeDelta: 8.0,
  };

  const currentRegion = initialRegion || zambiaRegion;
  const currentParkingSpots = useDatabase ? processedParkings : (propParkingSpots || []);

  // Convert database parkings to ParkingSpot format
  useEffect(() => {
    if (useDatabase && parkings.length > 0) {
      const converted = parkings.map((parking: Parking): ParkingSpot => {
        const coords = parseCoordinates(parking.coordinates);
        return {
          id: parking.id,
          name: parking.name,
          address: `${parking.address.street}, ${parking.address.city}, ${parking.address.state}`,
          latitude: coords?.latitude || -15.3875,
          longitude: coords?.longitude || 28.3228,
          pricePerHour: 0, // Default value, can be enhanced later
          isAvailable: parking.availableSpaces > 0,
          totalSpots: parking.totalSpaces,
          availableSpots: parking.availableSpaces,
          features: [],
          images: [],
          rating: 0,
          reviews: [],
        };
      });
      setProcessedParkings(converted);
    }
  }, [parkings, useDatabase]);

  const createStyles = (theme: any) => StyleSheet.create({
    map: {
      flex: 1,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      fontWeight: '500',
    },
    errorContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    errorText: {
      marginTop: 16,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    errorSubText: {
      marginTop: 8,
      fontSize: 14,
      textAlign: 'center',
    },
    marker: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.colors.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    parkingMarker: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
    },
  });

  const styles = createStyles(theme);

  if (useDatabase && loading) {
    return (
      <View style={[styles.map, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading parking data...
        </Text>
      </View>
    );
  }

  if (useDatabase && error) {
    return (
      <View style={[styles.map, styles.errorContainer]}>
        <Ionicons name="warning" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load parking data
        </Text>
        <Text style={[styles.errorSubText, { color: theme.colors.textSecondary }]}>
          Please check your connection and try again
        </Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={currentRegion}
      showsUserLocation={showUserLocation}
      showsMyLocationButton={false}
      showsCompass={false}
    >
      {/* Car marker */}
      {carMarkerCoordinate && (
        <Marker coordinate={carMarkerCoordinate}>
          <View style={styles.marker}>
            <Ionicons name="car" size={20} color={theme.colors.primary} />
          </View>
        </Marker>
      )}

      {/* Parking spots */}
      {currentParkingSpots.map((spot) => (
        <Marker
          key={spot.id}
          coordinate={{
            latitude: spot.latitude,
            longitude: spot.longitude,
          }}
          onPress={() => onMarkerPress && onMarkerPress(spot)}
        >
          <View style={[
            styles.parkingMarker,
            { backgroundColor: spot.isAvailable ? theme.colors.primary : theme.colors.error }
          ]}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              P
            </Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

export default ParkingMap;