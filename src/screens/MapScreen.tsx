import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useTheme } from '../theme/ThemeProvider';
import { ParkingSpot, Parking } from '../types';
import ParkingMap from '../components/ParkingMap';
import SearchDrawer from '../components/SearchDrawer';
import CompassIndicator from '../components/CompassIndicator';

const { width, height } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('Välj område');
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);
  
  // Bottom sheet animation values
  const bottomSheetHeight = useRef(new Animated.Value(height * 0.4)).current;
  const minHeight = height * 0.2;
  const maxHeight = height * 0.75;
  const defaultHeight = height * 0.4;
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
      // First check if permissions are already granted
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(existingStatus);
      
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        // Request permission if not already granted
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
        setLocationPermission(status);
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to show your position on the map and help you find nearby parking spots. Please enable location permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // On iOS, this will open the app settings
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  // On Android, open app info page
                  Linking.openSettings();
                }
              }
            }
          ]
        );
        return;
      }

      // Get current location with high accuracy
       const currentLocation = await Location.getCurrentPositionAsync({
         accuracy: Location.Accuracy.High,
         timeInterval: 60000, // Cache for 1 minute
       });
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please make sure location services are enabled and try again.',
        [
          { text: 'OK', style: 'default' },
          { text: 'Retry', onPress: getCurrentLocation }
        ]
      );
    }
  };

  const handleBottomSheetGesture = Animated.event(
    [{ nativeEvent: { translationY: bottomSheetHeight } }],
    { useNativeDriver: false }
  );

  const onGestureStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      const currentHeight = defaultHeight - translationY;
      
      let targetHeight = defaultHeight;
      
      if (velocityY > 500 || currentHeight < minHeight + 50) {
        // Close the sheet
        targetHeight = 0;
        setShowBottomSheet(false);
        setShowLocationSheet(true);
      } else if (velocityY < -500 || currentHeight > maxHeight - 50) {
        // Expand to max
        targetHeight = maxHeight;
      } else if (currentHeight < (minHeight + defaultHeight) / 2) {
        // Snap to min
        targetHeight = minHeight;
      } else if (currentHeight > (defaultHeight + maxHeight) / 2) {
        // Snap to max
        targetHeight = maxHeight;
      }
      
      Animated.spring(bottomSheetHeight, {
        toValue: targetHeight,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  };

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowBottomSheet(false);
      setShowLocationSheet(true);
    });
  };

  const requestLocationPermission = async () => {
    await getCurrentLocation();
  };

  const zoomToUserLocation = () => {
    if (location) {
      // This would typically call a method on the ParkingMap component
      // to zoom to the user's location
      getCurrentLocation();
      Alert.alert('Zooming', 'Zooming to your current location...');
    } else {
      // If no location, request permission
      requestLocationPermission();
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

  const handleSelectParking = (parking: Parking) => {
    // Parse coordinates string (assuming "lat,lng" format)
    const [lat, lng] = parking.coordinates.split(',').map(coord => parseFloat(coord.trim()));
    
    // Convert Parking to ParkingSpot format for map compatibility
    const parkingSpot: ParkingSpot = {
      id: parking.id,
      name: parking.name,
      address: `${parking.address.street}, ${parking.address.city}`,
      latitude: lat,
      longitude: lng,
      pricePerHour: 0, // Default value since Parking doesn't have this field
      totalSpots: parking.totalSpaces,
      availableSpots: parking.availableSpaces,
      features: [], // Default empty array
      isAvailable: parking.availableSpaces > 0,
      images: [], // Default empty array
      rating: 0, // Default rating
      reviews: [], // Default empty reviews
    };
    
    // Focus on the selected parking spot on the map
    handleMarkerPress(parkingSpot);
    setShowSearchDrawer(false);
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
    compassContainer: {
      position: 'absolute',
      top: 190,
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
    mapLocationButton: {
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
    locationSheet: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 10,
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    locationButtonText: {
      color: 'white',
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      marginLeft: 8,
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
      <TouchableOpacity style={styles.findButton} onPress={() => {
        if (!showBottomSheet) {
          setShowBottomSheet(true);
          setShowLocationSheet(false);
          Animated.spring(bottomSheetHeight, {
            toValue: defaultHeight,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start();
        }
      }}>
        <Ionicons name="location" size={20} color="white" />
        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold', marginTop: 2 }}>FIND</Text>
      </TouchableOpacity>

      {/* Compass Indicator */}
      <View style={styles.compassContainer}>
        <CompassIndicator size={50} rotation={0} />
      </View>

      {/* Location Button */}
      <TouchableOpacity style={styles.mapLocationButton} onPress={getCurrentLocation}>
        <Ionicons name="navigate" size={24} color={theme.colors.error} />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      {showBottomSheet && (
        <PanGestureHandler
          onGestureEvent={handleBottomSheetGesture}
          onHandlerStateChange={onGestureStateChange}
        >
          <Animated.View style={[styles.bottomSheet, { height: bottomSheetHeight }]}>
       
            <View style={styles.handle} />
            
            <Text style={styles.bottomSheetTitle}>Välj område</Text>
            
            <View style={styles.bottomSheetSubtitle}>
              <Text>Din GPS-position kan vara osäker </Text>
              <Ionicons name="help-circle-outline" size={16} color={theme.colors.textSecondary} style={{ marginLeft: 4 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
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
          </Animated.View>
        </PanGestureHandler>
      )}

      {/* Location Bottom Sheet */}
      {showLocationSheet && (
        <View style={styles.locationSheet}>
          <TouchableOpacity style={styles.locationButton} onPress={zoomToUserLocation}>
            <Ionicons name="navigate" size={20} color="white" />
            <Text style={styles.locationButtonText}>Zoom to My Location</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Drawer */}
       <SearchDrawer
         visible={showSearchDrawer}
         onClose={() => setShowSearchDrawer(false)}
         onSelectParking={handleSelectParking}
       />
    </View>
  );
};



export default MapScreen;