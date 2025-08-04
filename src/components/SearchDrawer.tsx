import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Parking } from '../types';
import { useParkings } from '../hooks/useParkings';

const { width } = Dimensions.get('window');

interface SearchDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSelectParking: (parking: Parking) => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = React.memo(({
  visible,
  onClose,
  onSelectParking,
}) => {
  const theme = useTheme();
  const { parkings, loading: parkingsLoading, error: parkingsError } = useParkings();
  
  // Local state for search functionality
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [slideAnim] = useState(new Animated.Value(-width * 0.8));
  
  // Animation effect
  useEffect(() => {
    if (visible) {
      setLocalSearchQuery(''); // Reset search when drawer opens
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // Filter parkings based on search query
  const filteredParkings = useMemo(() => {
    if (!localSearchQuery.trim() || !parkings) {
      return parkings || [];
    }
    
    const query = localSearchQuery.toLowerCase();
    return parkings.filter(parking => 
      parking.name.toLowerCase().includes(query) ||
      parking.address.street.toLowerCase().includes(query) ||
      parking.address.city.toLowerCase().includes(query)
    );
  }, [parkings, localSearchQuery]);

  const handleSearchChange = useCallback((text: string) => {
    setLocalSearchQuery(text);
  }, []);

  const handleClearSearch = useCallback(() => {
    setLocalSearchQuery('');
  }, []);

  const handleSelectParking = useCallback((parking: Parking) => {
    onSelectParking(parking);
  }, [onSelectParking]);

  const styles = createStyles(theme);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Search Parking</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or address..."
              placeholderTextColor={theme.colors.textSecondary}
              value={localSearchQuery}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {localSearchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Results */}
          <ScrollView style={styles.resultsContainer}>
            {parkingsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading parking spots...</Text>
              </View>
            ) : parkingsError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color={theme.colors.error || '#ff4444'} />
                <Text style={styles.errorText}>Failed to load parking spots</Text>
                <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
              </View>
            ) : filteredParkings.length === 0 ? (
              <View style={styles.noResults}>
                <Ionicons name="search" size={48} color={theme.colors.textSecondary} />
                <Text style={styles.noResultsText}>
                  {localSearchQuery ? 'No parking spots found' : 'Start typing to search'}
                </Text>
                <Text style={styles.noResultsSubtext}>
                  {localSearchQuery ? 'Try a different search term' : 'Search by name or address'}
                </Text>
              </View>
            ) : (
              filteredParkings.map((parking) => (
                <TouchableOpacity
                  key={parking.id}
                  style={styles.spotItem}
                  onPress={() => handleSelectParking(parking)}
                >
                  <View style={styles.spotIcon}>
                    <Ionicons name="car" size={20} color="white" />
                  </View>
                  <View style={styles.spotInfo}>
                    <Text style={styles.spotName}>{parking.name}</Text>
                    <Text style={styles.spotAddress}>
                      {parking.address.street}, {parking.address.city}
                    </Text>
                    <View style={styles.spotDetails}>
                      <Text style={styles.spotSpaces}>
                        {parking.availableSpaces}/{parking.totalSpaces} spots available
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
});

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      flexDirection: 'row',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: width * 0.8,
      backgroundColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
      paddingVertical: theme.spacing.xs,
    },
    clearButton: {
      padding: theme.spacing.xs,
    },
    resultsContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    spotItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    spotIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    spotInfo: {
      flex: 1,
    },
    spotName: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    spotAddress: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    noResults: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl * 2,
    },
    noResultsText: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    noResultsSubtext: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
      opacity: 0.7,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl * 2,
    },
    loadingText: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    errorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl * 2,
    },
    errorText: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.error || '#ff4444',
      marginTop: theme.spacing.md,
      textAlign: 'center',
      fontWeight: theme.typography.weights.semibold,
    },
    errorSubtext: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    spotDetails: {
      flexDirection: 'column',
    },
    spotSpaces: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
  });

export default SearchDrawer;