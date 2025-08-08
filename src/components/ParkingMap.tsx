import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { GoogleMaps } from 'expo-maps';
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
  useDatabase?: boolean;
  carMarkerCoordinate?: {
    latitude: number;
    longitude: number;
  };
  highlightedParkingId?: string | null;
}

export interface ParkingMapRef {
  animateToRegion: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  }) => void;
  fitToCoordinates: (points: Array<{ latitude: number; longitude: number }>) => void;
}

const ParkingMap = forwardRef<ParkingMapRef, ParkingMapProps>((
  {
    initialRegion,
    parkingSpots: propParkingSpots,
    onMarkerPress,
    showUserLocation = true,
    carMarkerCoordinate,
    highlightedParkingId,
  },
  ref
) => {
  const theme = useTheme();
  const { parkings, loading, error } = useParkings();
  const [processedParkings, setProcessedParkings] = useState<ParkingSpot[]>([]);
  const [cameraPosition, setCameraPosition] = useState(() => {
    const region = initialRegion || {
      latitude: -14.8932, // Center of Zambia based on parking data
      longitude: 27.8877,
      latitudeDelta: 6.0,
      longitudeDelta: 6.0,
    };
    return {
      center: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      zoom: 6,
    };
  });
  
  const [mapKey, setMapKey] = useState(0);
  
  useEffect(() => {
    console.log('Camera position changed:', cameraPosition);
    console.log('Map key:', mapKey);
  }, [cameraPosition, mapKey]);

  // Default region for Zambia
  const zambiaRegion = {
    latitude: -14.8932,
    longitude: 27.8877,
    latitudeDelta: 6.0,
    longitudeDelta: 6.0,
  };

  const currentRegion = initialRegion || zambiaRegion;
  const currentParkingSpots = (propParkingSpots && propParkingSpots.length > 0)
    ? propParkingSpots
    : processedParkings;

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    animateToRegion: (region: {
      latitude: number;
      longitude: number;
      latitudeDelta?: number;
      longitudeDelta?: number;
    }) => {
      setCameraPosition({
        center: {
          latitude: region.latitude,
          longitude: region.longitude,
        },
        zoom: region.latitudeDelta ? Math.max(1, 10 - region.latitudeDelta) : 10,
      });
      setMapKey(prev => prev + 1);
    },
    fitToCoordinates: (points: Array<{ latitude: number; longitude: number }>) => {
      if (points.length === 0) return;
      
      if (points.length === 1) {
        setCameraPosition({
          center: {
            latitude: points[0].latitude,
            longitude: points[0].longitude,
          },
          zoom: 12,
        });
        setMapKey(prev => prev + 1);
        return;
      }
      
      // Calculate bounds
      const latitudes = points.map(p => p.latitude);
      const longitudes = points.map(p => p.longitude);
      
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      
      const latDelta = Math.abs(maxLat - minLat) * 1.2; // Add 20% padding
      const lngDelta = Math.abs(maxLng - minLng) * 1.2;
      
      const maxDelta = Math.max(latDelta, lngDelta);
      const zoom = Math.max(1, Math.min(15, 10 - Math.log2(maxDelta)));
      
      setCameraPosition({
        center: {
          latitude: centerLat,
          longitude: centerLng,
        },
        zoom: zoom,
      });
      setMapKey(prev => prev + 1);
    },
  }), []);

  // Process parkings from database
  useEffect(() => {
    if (!parkings || parkings.length === 0) {
      console.log('No parkings data available');
      return;
    }

    console.log(`Processing ${parkings.length} parking entries`);
    
    const processed = parkings.map((parking): ParkingSpot => {
      const coords = parseCoordinates(parking.coordinates);
      
      return {
        id: parking.id,
        name: parking.name,
        latitude: coords?.latitude || -15.3875,
        longitude: coords?.longitude || 28.3228,
        pricePerHour: 0,
        isAvailable: parking.availableSpaces > 0,
        totalSpots: parking.totalSpaces || 0,
        availableSpots: parking.availableSpaces || 0,
        features: [],
        images: [],
        address: `${parking.address.street}, ${parking.address.city}`,
        rating: 0,
        reviews: [],
      };
    });

    setProcessedParkings(processed);
    console.log(`Created ${processed.length} processed parking spots`);
  }, [parkings]);

  // Auto-center map on parking spots when user is outside Zambia
  useEffect(() => {
    if (!carMarkerCoordinate || processedParkings.length === 0) {
      return;
    }

    // Check if user is in Zambia (rough bounds)
    const isInZambia = carMarkerCoordinate.latitude >= -18.5 && 
                      carMarkerCoordinate.latitude <= -8.0 &&
                      carMarkerCoordinate.longitude >= 21.0 && 
                      carMarkerCoordinate.longitude <= 34.0;

    if (!isInZambia && !initialRegion) {
      console.log('User outside Zambia, centering on parking spots');
      
      // Calculate average position of all parking spots
      const avgLat = processedParkings.reduce((sum, spot) => sum + spot.latitude, 0) / processedParkings.length;
      const avgLng = processedParkings.reduce((sum, spot) => sum + spot.longitude, 0) / processedParkings.length;
      
      console.log(`Setting camera to average position: ${avgLat}, ${avgLng}`);
      setCameraPosition({
        center: {
          latitude: avgLat,
          longitude: avgLng,
        },
        zoom: 6,
      });
      setMapKey(prev => prev + 1);
    }
  }, [carMarkerCoordinate, processedParkings, initialRegion]);

  if (loading) {
    return (
      <View style={[styles.map, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading parking spots...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.map, styles.errorContainer]}>
        <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load parking data
        </Text>
        <Text style={[styles.errorSubText, { color: theme.colors.textSecondary }]}>
          Please check your internet connection
        </Text>
      </View>
    );
  }

  // Create markers from current parking spots
  const createMarkers = () => {
    const spots = currentParkingSpots;
    if (!spots || spots.length === 0) {
      console.log('No parking spots to create markers for');
      return [];
    }

    console.log(`Creating markers for ${spots.length} parking spots`);
    return spots.map((spot) => ({
      id: spot.id,
      coordinate: {
        latitude: spot.latitude,
        longitude: spot.longitude,
      },
      title: spot.name,
      description: `Available: ${spot.isAvailable ? 'Yes' : 'No'}`,
      color: highlightedParkingId === spot.id ? '#FF6B6B' : '#4ECDC4',
    }));
  };

  // Adjust coordinates for overlapping markers
  const adjustCoordinatesForOverlap = (spots: ParkingSpot[]) => {
    const threshold = 0.001; // Minimum distance between markers
    const groups = new Map<string, ParkingSpot[]>();
    
    // Group nearby spots
    spots.forEach(spot => {
      const key = `${Math.round(spot.latitude / threshold)}_${Math.round(spot.longitude / threshold)}`;
      const arr = groups.get(key) || [];
      arr.push(spot);
      groups.set(key, arr);
    });
    
    const adjusted = new Map<string, { latitude: number; longitude: number }>();
    
    groups.forEach((group, key) => {
      if (group.length === 1) {
        adjusted.set(group[0].id, { latitude: group[0].latitude, longitude: group[0].longitude });
      } else {
        // Spread overlapping markers in a small circle
        const baseLat = group[0].latitude;
        const baseLng = group[0].longitude;
        const radius = threshold * 2;
        
        group.forEach((spot, index) => {
          const angle = (2 * Math.PI * index) / group.length;
          const offsetLat = Math.cos(angle) * radius;
          const offsetLng = Math.sin(angle) * radius;
          
          adjusted.set(spot.id, {
            latitude: baseLat + offsetLat,
            longitude: baseLng + offsetLng,
          });
        });
      }
    });
    
    return adjusted;
  };

  const adjustedCoordinates = adjustCoordinatesForOverlap(currentParkingSpots);
  const parkingMarkers = currentParkingSpots.map((spot) => {
    const adjustedCoord = adjustedCoordinates.get(spot.id) || {
      latitude: spot.latitude,
      longitude: spot.longitude,
    };
    
    return {
      id: spot.id,
      coordinate: adjustedCoord,
      title: spot.name,
      description: `Available: ${spot.isAvailable ? 'Yes' : 'No'}`,
      color: highlightedParkingId === spot.id ? '#FF6B6B' : '#4ECDC4',
    };
  });

 const googleMapsMarkers = [
  ...(carMarkerCoordinate ? [{
    id: 'user-car',
    coordinates: carMarkerCoordinate,
    title: 'Your Car',
    snippet: 'Current location',
    icon: require('../assets/pins/car-pin.svg'), // custom car pin
    // Optional (if supported in your SDK version)
    // anchor: { x: 0.5, y: 1 }, // bottom-center anchor
    // zIndex: 2,
  }] : []),

  ...currentParkingSpots.map(spot => {
    const coord = adjustedCoordinates.get(spot.id) ?? {
      latitude: spot.latitude,
      longitude: spot.longitude,
    };
    const isHighlighted = highlightedParkingId === spot.id;
    const isAvailable = spot.isAvailable;

    return {
      id: spot.id,
      coordinates: coord,
      title: spot.name,
      snippet: `Available: ${isAvailable ? 'Yes' : 'No'}`,
      icon: isHighlighted
        ? require('../assets/pins/parking-pin-highlighted.svg')
        : isAvailable
          ? require('../assets/pins/parking-pin-available.svg')
          : require('../assets/pins/parking-pin-unavailable.svg'),
      // anchor: { x: 0.5, y: 1 },
      // zIndex: isHighlighted ? 3 : 1,
    };
  }),
];


  const handleMarkerClick = (markerId: string) => {
    if (markerId === 'user-car') return;
    
    const spot = currentParkingSpots.find(s => s.id === markerId);
    if (spot && onMarkerPress) {
      onMarkerPress(spot);
    }
  };

  return (
    <GoogleMaps.View
      key={mapKey}
      style={styles.map}
      cameraPosition={{
        coordinates: {
          latitude: cameraPosition.center.latitude,
          longitude: cameraPosition.center.longitude,
        },
        zoom: cameraPosition.zoom,
      }}
      markers={googleMapsMarkers}
      properties={{
        isMyLocationEnabled: showUserLocation,
      }}
      onMarkerClick={(marker) => handleMarkerClick(marker.id || '')}
    />
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ParkingMap;