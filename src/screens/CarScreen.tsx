import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useVehicles } from '../hooks/useVehicles';
import VehicleCard from '../components/VehicleCard';
import VehicleForm, { VehicleFormData } from '../components/VehicleForm';
import { Vehicle } from '../types';



const CarScreen: React.FC = () => {
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const {
    vehicles,
    loading,
    error,
    refetch,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setDefaultVehicle,
    addingVehicle,
    updatingVehicle,
    deletingVehicle,
  } = useVehicles();

  const openAddModal = () => {
    setEditingVehicle(null);
    setShowModal(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleSubmit = async (data: VehicleFormData) => {
    const vehicleData = {
      make: data.make,
      model: data.model,
      year: parseInt(data.year),
      color: data.color,
      licensePlate: data.licensePlate,
    };

    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        await addVehicle(vehicleData);
      }
      setShowModal(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleDelete = (vehicle: Vehicle) => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVehicle(vehicle.id);
              Alert.alert('Success', 'Vehicle deleted successfully!');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (vehicle: Vehicle) => {
    if (vehicle.isDefault) return;
    try {
      await setDefaultVehicle(vehicle.id);
      Alert.alert('Success', 'Default vehicle updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const getVehicleIcon = (make: string) => {
    const lowerMake = make.toLowerCase();
    if (lowerMake.includes('tesla') || lowerMake.includes('electric')) {
      return 'flash';
    }
    if (lowerMake.includes('truck') || lowerMake.includes('pickup')) {
      return 'car-sport';
    }
    return 'car';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading vehicles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>Failed to load vehicles</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => refetch()}
        >
          <Text style={[styles.retryButtonText, { color: theme.colors.surface }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>My Vehicles</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Manage your registered vehicles</Text>
        </View>

        {vehicles.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Vehicles Added</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Add your first vehicle to get started with parking bookings
            </Text>
          </View>
        ) : (
          <View style={styles.vehiclesList}>
            {vehicles.map((vehicle) => (
              <View key={vehicle.id} style={[styles.vehicleCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.vehicleHeader}>
                  <View style={styles.vehicleInfo}>
                    <View style={styles.vehicleIconContainer}>
                      <Ionicons
                        name={getVehicleIcon(vehicle.make)}
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.vehicleDetails}>
                      <Text style={[styles.vehicleName, { color: theme.colors.text }]}>
                        {vehicle.make} {vehicle.model}
                      </Text>
                      <Text style={[styles.vehicleYear, { color: theme.colors.textSecondary }]}>
                        {vehicle.year} • {vehicle.color}
                      </Text>
                      <Text style={[styles.licensePlate, { color: theme.colors.primary }]}>
                        {vehicle.licensePlate}
                      </Text>
                    </View>
                  </View>
                  {vehicle.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: theme.colors.primary }]}>
                      <Text style={[styles.defaultBadgeText, { color: theme.colors.surface }]}>Default</Text>
                    </View>
                  )}
                </View>

                <View style={styles.vehicleActions}>
                  {!vehicle.isDefault && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
                      onPress={() => handleSetDefault(vehicle)}
                    >
                      <Ionicons name="star-outline" size={16} color={theme.colors.primary} />
                      <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
                    onPress={() => openEditModal(vehicle)}
                  >
                    <Ionicons name="pencil" size={16} color={theme.colors.text} />
                    <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
                    onPress={() => handleDelete(vehicle)}
                  >
                    <Ionicons name="trash" size={16} color={theme.colors.error} />
                    <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={openAddModal}
      >
        <Ionicons name="add" size={24} color={theme.colors.surface} />
      </TouchableOpacity>

      <VehicleForm
        visible={showModal}
        editingVehicle={editingVehicle}
        loading={loading}
        onClose={() => {
          setShowModal(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  vehiclesList: {
    padding: 20,
    paddingTop: 10,
  },
  vehicleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  vehicleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleYear: {
    fontSize: 14,
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

});

export default CarScreen;