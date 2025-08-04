import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '../theme/ThemeProvider';
import { ParkingSpot } from '../types';
import ParkingMap from '../components/ParkingMap';
import SearchDrawer from '../components/SearchDrawer';

const { width, height } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string>('Välj område');
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);
  const [parkingSpots] = useState<ParkingSpot[]>([
    {
      id: '186',
      name: 'Hagholmen',
      address: 'Markparkering • Stockholms Stads Parkering',
      latitude: 59.3293,
      longitude: 18.0686,
      pricePerHour: 25.00,
      isAvailable: true,
      totalSpots: 50,
      availableSpots: 12,
      features: [],
      images: [],
      rating: 4.5,
      reviews: [],
    },
    {
      id: '188',
      name: 'Eldholmen',
      address: 'Markparkering • Stockholms Stads Parkering',
      latitude: 59.3193,
      longitude: 18.0586,
      pricePerHour: 30.00,
      isAvailable: true,
      totalSpots: 100,
      availableSpots: 25,
      features: [],
      images: [],
      rating: 4.2,
      reviews: [],
    },
  ]);

  const parkingAreas = [
    { id: '186', name: 'Hagholmen', spots: 186 },
    { id: '188', name: 'Eldholmen', spots: 188 },
    { id: '150', name: 'Portholmsgången', spots: 150 },
    { id: '120', name: 'Värbergsgången', spots: 120 },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your position on the map.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your current location.');
    }
  };

  const handleMarkerPress = (spot: ParkingSpot) => {
    Alert.alert(
      spot.name,
      `${spot.address}\n$${spot.pricePerHour}/hour\n${spot.availableSpots} spots available`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => console.log('Book spot:', spot.id) },
      ]
    );
  };

  const handleSelectSpot = (spot: ParkingSpot) => {
    // Focus on the selected parking spot on the map
    handleMarkerPress(spot);
  };

  const initialRegion = {
    latitude: location?.coords.latitude || 59.3293,
    longitude: location?.coords.longitude || 18.0686,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const createStyles = (theme: any) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchButton: {
      position: 'absolute',
      top: 60,
      left: 20,
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    menuButton: {
      position: 'absolute',
      top: 60,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    findButton: {
      position: 'absolute',
      top: 130,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    locationButton: {
      position: 'absolute',
      bottom: 320,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    bottomSheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 8,
      paddingHorizontal: 20,
      paddingBottom: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 10,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
    },
    bottomSheetTitle: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: 8,
    },
    bottomSheetSubtitle: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    parkingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    parkingIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    parkingInfo: {
      flex: 1,
    },
    parkingNumber: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    parkingName: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      marginBottom: 4,
    },
    parkingAddress: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    infoButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Map */}
      <ParkingMap
        initialRegion={initialRegion}
        parkingSpots={parkingSpots}
        onMarkerPress={handleMarkerPress}
        showUserLocation={true}
        carMarkerCoordinate={{
          latitude: 59.3243,
          longitude: 18.0636,
        }}
      />

      {/* Search Button */}
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => setShowSearchDrawer(true)}
      >
        <Ionicons name="search" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Menu Button */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Find Button */}
      <TouchableOpacity style={styles.findButton}>
        <Ionicons name="location" size={20} color="white" />
        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold', marginTop: 2 }}>FIND</Text>
      </TouchableOpacity>

      {/* Location Button */}
      <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
        <Ionicons name="navigate" size={24} color={theme.colors.error} />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      {showBottomSheet && (
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />
          
          <Text style={styles.bottomSheetTitle}>Välj område</Text>
          
          <View style={styles.bottomSheetSubtitle}>
            <Text>Din GPS-position kan vara osäker </Text>
            <Ionicons name="help-circle-outline" size={16} color={theme.colors.textSecondary} style={{ marginLeft: 4 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {parkingAreas.map((area) => (
              <TouchableOpacity key={area.id} style={styles.parkingItem}>
                <View style={styles.parkingIcon}>
                  <Text style={styles.parkingNumber}>{area.spots}</Text>
                </View>
                
                <View style={styles.parkingInfo}>
                  <Text style={styles.parkingName}>{area.name}</Text>
                  <Text style={styles.parkingAddress}>Markparkering • Stockholms Stads Parkering</Text>
                </View>
                
                <TouchableOpacity style={styles.infoButton}>
                  <Ionicons name="information" size={12} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Search Drawer */}
       <SearchDrawer
         visible={showSearchDrawer}
         onClose={() => setShowSearchDrawer(false)}
         parkingSpots={parkingSpots}
         onSelectSpot={handleSelectSpot}
       />
    </View>
  );
};



export default MapScreen;