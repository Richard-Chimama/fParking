import React, { forwardRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Vehicle } from '../types';

interface VehicleDetailsBottomSheetProps {
  vehicle: Vehicle | null;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onSetDefault: (vehicle: Vehicle) => void;
  onClose: () => void;
  loading?: boolean;
}

const VehicleDetailsBottomSheet = forwardRef<
  BottomSheet,
  VehicleDetailsBottomSheetProps
>(({ vehicle, onEdit, onDelete, onSetDefault, onClose, loading = false }, ref) => {
  const theme = useTheme();
  const snapPoints = useMemo(() => ['40%'], []);

  const handleDelete = () => {
    if (!vehicle) return;
    
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.year} ${vehicle.make} ${vehicle.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(vehicle),
        },
      ]
    );
  };

  const handleSetDefault = () => {
    if (!vehicle) return;
    
    if (vehicle.isDefault) {
      Alert.alert('Info', 'This vehicle is already set as default.');
      return;
    }
    
    Alert.alert(
      'Set as Default',
      `Set ${vehicle.year} ${vehicle.make} ${vehicle.model} as your default vehicle?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set Default',
          onPress: () => onSetDefault(vehicle),
        },
      ]
    );
  };

  const styles = createStyles(theme);

  if (!vehicle) return null;

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={[styles.bottomSheetBackground]}
      handleIndicatorStyle={[styles.handleIndicator]}
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.vehicleIcon}>
            <Ionicons name="car" size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.vehicleTitle}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            <Text style={styles.vehicleSubtitle}>
              {vehicle.color} • {vehicle.licensePlate}
            </Text>
            {vehicle.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default Vehicle</Text>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(vehicle)}
            disabled={loading}
          >
            <Ionicons name="pencil" size={20} color={theme.colors.primary} />
            <Text style={[styles.actionText, styles.editText]}>Edit Vehicle</Text>
          </TouchableOpacity>

          {!vehicle.isDefault && (
            <TouchableOpacity
              style={[styles.actionButton, styles.defaultButton]}
              onPress={handleSetDefault}
              disabled={loading}
            >
              <Ionicons name="star" size={20} color={theme.colors.warning} />
              <Text style={[styles.actionText, styles.defaultActionText]}>
                Set as Default
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Ionicons name="trash" size={20} color={theme.colors.error} />
            <Text style={[styles.actionText, styles.deleteText]}>Delete Vehicle</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const createStyles = (theme: any) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
      width: 40,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    vehicleIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    headerInfo: {
      flex: 1,
    },
    vehicleTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    vehicleSubtitle: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    defaultBadge: {
      backgroundColor: theme.colors.success + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      alignSelf: 'flex-start',
    },
    defaultText: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.success,
    },
    actionsContainer: {
      gap: theme.spacing.md,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
    },
    editButton: {
      backgroundColor: theme.colors.primary + '10',
      borderColor: theme.colors.primary + '30',
    },
    defaultButton: {
      backgroundColor: theme.colors.warning + '10',
      borderColor: theme.colors.warning + '30',
    },
    deleteButton: {
      backgroundColor: theme.colors.error + '10',
      borderColor: theme.colors.error + '30',
    },
    actionText: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semiBold,
      marginLeft: theme.spacing.sm,
    },
    editText: {
      color: theme.colors.primary,
    },
    defaultActionText: {
      color: theme.colors.warning,
    },
    deleteText: {
      color: theme.colors.error,
    },
  });

VehicleDetailsBottomSheet.displayName = 'VehicleDetailsBottomSheet';

export default VehicleDetailsBottomSheet;