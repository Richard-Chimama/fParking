import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform } from 'react-native';
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
}

export interface ParkingMapRef {
  animateToRegion: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  }) => void;
}

const ParkingMap = forwardRef<ParkingMapRef, ParkingMapProps>((
  {
    initialRegion,
    parkingSpots: propParkingSpots,
    onMarkerPress,
    showUserLocation = true,
    carMarkerCoordinate,
    useDatabase = true,
  },
  ref
) => {
  const theme = useTheme();
  const { parkings, loading, error } = useParkings();
  const [processedParkings, setProcessedParkings] = useState<ParkingSpot[]>([]);
  const [cameraPosition, setCameraPosition] = useState(() => {
    const region = initialRegion || {
      latitude: -15.3875,
      longitude: 28.3228,
      latitudeDelta: 8.0,
      longitudeDelta: 8.0,
    };
    return {
      coordinates: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      zoom: 15,
      bearing: 0,
      tilt: 0
    };
  });

  // Zambia coordinates - centered on Lusaka
  const zambiaRegion = {
    latitude: -15.3875,
    longitude: 28.3228,
    latitudeDelta: 8.0,
    longitudeDelta: 8.0,
  };

  const currentRegion = initialRegion || zambiaRegion;
  const currentParkingSpots = useDatabase ? processedParkings : (propParkingSpots || []);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    animateToRegion: (region: {
      latitude: number;
      longitude: number;
      latitudeDelta?: number;
      longitudeDelta?: number;
    }) => {
      setCameraPosition({
        coordinates: {
          latitude: region.latitude,
          longitude: region.longitude,
        },
        zoom: region.latitudeDelta ? Math.max(1, 20 - region.latitudeDelta * 2) : 15,
        bearing: 0,
        tilt: 0
      });
    },
  }), []);

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

  // Create markers array for expo-maps
  const markers = [
    ...(carMarkerCoordinate ? [{
      id: 'car-marker',
      coordinate: carMarkerCoordinate,
      title: 'Your Car',
      description: 'Car location'
    }] : []),
    ...currentParkingSpots.map((spot) => ({
      id: spot.id,
      coordinate: {
        latitude: spot.latitude,
        longitude: spot.longitude,
      },
      title: spot.name || 'Parking Spot',
      description: spot.isAvailable ? 'Available' : 'Occupied'
    }))
  ];



  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        style={styles.map}
        cameraPosition={cameraPosition}
        markers={markers}
        onMarkerClick={(marker) => {
          const spot = currentParkingSpots.find(s => s.id === marker.id);
          if (spot && onMarkerPress) {
            onMarkerPress(spot);
          }
        }}
      />
    );
  } else if (Platform.OS === 'android') {
    return (
      <GoogleMaps.View
        style={styles.map}
        cameraPosition={cameraPosition}
        markers={markers}
        onMarkerClick={(marker) => {
          const spot = currentParkingSpots.find(s => s.id === marker.id);
          if (spot && onMarkerPress) {
            onMarkerPress(spot);
          }
        }}
      />
    );
  } else {
    return (
      <View style={styles.map}>
        <Text>Maps are only available on Android and iOS</Text>
      </View>
    );
  }
});

export default ParkingMap;