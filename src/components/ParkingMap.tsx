import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { ParkingSpot } from '../types';

interface ParkingMapProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  parkingSpots: ParkingSpot[];
  onMarkerPress: (spot: ParkingSpot) => void;
  showUserLocation?: boolean;
  carMarkerCoordinate?: {
    latitude: number;
    longitude: number;
  };
}

const ParkingMap: React.FC<ParkingMapProps> = ({
  initialRegion,
  parkingSpots,
  onMarkerPress,
  showUserLocation = true,
  carMarkerCoordinate,
}) => {
  const theme = useTheme();

  const createStyles = (theme: any) => StyleSheet.create({
    map: {
      flex: 1,
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
      width: 30,
      height: 30,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const styles = createStyles(theme);

  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
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
      {parkingSpots.map((spot) => (
        <Marker
          key={spot.id}
          coordinate={{
            latitude: spot.latitude,
            longitude: spot.longitude,
          }}
          onPress={() => onMarkerPress(spot)}
        >
          <View style={styles.parkingMarker}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>P</Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

export default ParkingMap;