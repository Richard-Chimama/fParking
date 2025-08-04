import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import {
  useParkings,
  useParkingById,
  useNearbyParkings,
  useParkingsByCity,
  useParkingCache,
  parseCoordinates,
  formatAddress,
} from '../hooks/useParkings';
import { Parking } from '../types';

const ParkingExample: React.FC = () => {
  const [selectedParkingId, setSelectedParkingId] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cacheInfo, setCacheInfo] = useState<string>('');
  const userLatitude = 59.3293; // Default to Stockholm
  const userLongitude = 18.0686;

  const theme = useTheme();
  const styles = createStyles(theme);

  // Use the parking hooks
  const { parkings, loading: parkingsLoading, error: parkingsError, refetch: refetchParkings } = useParkings();
  const { parking: selectedParking, loading: parkingLoading, error: parkingError } = useParkingById(selectedParkingId);
  const { nearbyParkings, loading: nearbyLoading, error: nearbyError, fetchNearbyParkings } = useNearbyParkings();
  const { parkingsByCity, loading: cityLoading, error: cityError, fetchParkingsByCity } = useParkingsByCity();
  const { clearParkingCache, refreshParkingData, getCacheSize, preloadNearbyParkings } = useParkingCache();

  // Fetch nearby parkings on component mount
  useEffect(() => {
    fetchNearbyParkings(userLatitude, userLongitude, 5000); // 5km radius
    fetchParkingsByCity('Stockholm');
    updateCacheInfo();
  }, []);

  // Cache management functions
  const updateCacheInfo = () => {
    const size = getCacheSize();
    setCacheInfo(`Cache size: ${(size / 1024).toFixed(2)} KB`);
  };

  const handleClearCache = () => {
    clearParkingCache();
    updateCacheInfo();
    Alert.alert('Cache Cleared', 'All parking cache has been cleared.');
  };

  const handleRefreshData = async () => {
    await refreshParkingData();
    updateCacheInfo();
    Alert.alert('Data Refreshed', 'Parking data has been refreshed from server.');
  };

  const handlePreloadNearby = async () => {
    await preloadNearbyParkings(userLatitude, userLongitude, 10000);
    updateCacheInfo();
    Alert.alert('Preload Complete', 'Nearby parkings have been preloaded.');
  };

  const handleSelectParking = (parkingId: string) => {
    setSelectedParkingId(parkingId);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    fetchParkingsByCity(city);
  };

  const handleCitySearch = () => {
    fetchParkingsByCity('Stockholm');
  };

  const handleNearbySearch = () => {
    fetchNearbyParkings(userLatitude, userLongitude, 3000); // 3km radius
  };

  const renderParkingItem = (parking: Parking, index: number) => {
    const coordinates = parseCoordinates(parking.coordinates);
    const addressString = formatAddress(parking.address);

    return (
      <View key={parking.id} style={styles.parkingItem}>
        <Text style={styles.parkingName}>{parking.name}</Text>
        <Text style={styles.parkingDescription}>{parking.description}</Text>
        <Text style={styles.parkingAddress}>{addressString}</Text>
        <View style={styles.parkingStats}>
          <Text style={styles.statText}>
            Available: {parking.availableSpaces}/{parking.totalSpaces}
          </Text>
          {coordinates && (
            <Text style={styles.statText}>
              Coords: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (parkingsError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading parkings: {parkingsError.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Parking Queries Demo with Caching</Text>

      {/* Cache Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cache Management</Text>
        <Text style={styles.cacheInfo}>{cacheInfo}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cacheButton} onPress={handleClearCache}>
            <Text style={styles.buttonText}>Clear Cache</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cacheButton} onPress={handleRefreshData}>
            <Text style={styles.buttonText}>Refresh Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cacheButton} onPress={handlePreloadNearby}>
            <Text style={styles.buttonText}>Preload Nearby</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* All Parkings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Parkings (Cached for 5 min)</Text>
        {parkingsLoading ? (
          <Text style={styles.loadingText}>Loading parkings...</Text>
        ) : (
          parkings.slice(0, 3).map((parking, index) => (
            <TouchableOpacity 
              key={parking.id} 
              onPress={() => handleSelectParking(parking.id)}
            >
              {renderParkingItem(parking, index)}
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Selected Parking Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selected Parking Details</Text>
        {selectedParkingId ? (
          parkingLoading ? (
            <Text style={styles.loadingText}>Loading parking details...</Text>
          ) : selectedParking ? (
            renderParkingItem(selectedParking, 0)
          ) : (
            <Text style={styles.noDataText}>No parking found with ID: {selectedParkingId}</Text>
          )
        ) : (
          <Text style={styles.noDataText}>Select a parking from the list above</Text>
        )}
      </View>

      {/* Nearby Parkings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Parkings (Cached for 2 min)</Text>
        <TouchableOpacity style={styles.button} onPress={handleNearbySearch}>
          <Text style={styles.buttonText}>Search Nearby (3km)</Text>
        </TouchableOpacity>
        {nearbyLoading ? (
          <Text style={styles.loadingText}>Loading nearby parkings...</Text>
        ) : nearbyError ? (
          <Text style={styles.errorText}>Error: {nearbyError.message}</Text>
        ) : nearbyParkings.length > 0 ? (
          nearbyParkings.slice(0, 2).map(renderParkingItem)
        ) : (
          <Text style={styles.noDataText}>No nearby parkings found</Text>
        )}
      </View>

      {/* City Parkings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parkings by City (Cached for 5 min)</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cacheButton} onPress={() => handleSelectCity('Stockholm')}>
            <Text style={styles.buttonText}>Stockholm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cacheButton} onPress={() => handleSelectCity('Gothenburg')}>
            <Text style={styles.buttonText}>Gothenburg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cacheButton} onPress={() => handleSelectCity('Malmö')}>
            <Text style={styles.buttonText}>Malmö</Text>
          </TouchableOpacity>
        </View>
        {selectedCity && (
          <Text style={styles.cacheInfo}>Selected: {selectedCity}</Text>
        )}
        {cityLoading ? (
          <Text style={styles.loadingText}>Loading city parkings...</Text>
        ) : cityError ? (
          <Text style={styles.errorText}>Error: {cityError.message}</Text>
        ) : parkingsByCity.length > 0 ? (
          parkingsByCity.slice(0, 2).map(renderParkingItem)
        ) : (
          selectedCity && <Text style={styles.noDataText}>No parkings found in {selectedCity}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    parkingItem: {
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    parkingName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    parkingDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    parkingAddress: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    parkingStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    loadingText: {
       fontSize: 14,
       color: theme.colors.textSecondary,
       fontStyle: 'italic',
       textAlign: 'center',
       marginVertical: 8,
     },
     errorText: {
       fontSize: 14,
       color: theme.colors.error || '#ff4444',
       textAlign: 'center',
       marginVertical: 8,
     },
     noDataText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
      },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    cacheInfo: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 12,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    },
    cacheButton: {
      backgroundColor: theme.colors.primary,
      padding: 8,
      borderRadius: 6,
      marginHorizontal: 4,
      marginVertical: 4,
      minWidth: 80,
    },
  });

export default ParkingExample;