import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onSetDefault: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const theme = useTheme();

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

  return (
    <View style={[styles.vehicleCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleInfo}>
          <View style={[styles.vehicleIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
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
            <Ionicons name="star" size={12} color={theme.colors.surface} />
            <Text style={[styles.defaultBadgeText, { color: theme.colors.surface }]}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.vehicleActions}>
        {!vehicle.isDefault && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
            onPress={() => onSetDefault(vehicle)}
            testID="set-default-button"
          >
            <Ionicons name="star-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
          onPress={() => onEdit(vehicle)}
          testID="edit-button"
        >
          <Ionicons name="pencil" size={16} color={theme.colors.text} />
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
          onPress={() => onDelete(vehicle)}
          testID="delete-button"
        >
          <Ionicons name="trash" size={16} color={theme.colors.error} />
          <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    letterSpacing: 1,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
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
});

export default VehicleCard;