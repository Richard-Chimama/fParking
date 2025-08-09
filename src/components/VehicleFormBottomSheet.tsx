import React, { forwardRef, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Vehicle } from '../types';

interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vehicleType: string;
}

interface VehicleFormBottomSheetProps {
  vehicle?: Vehicle | null;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const VehicleFormBottomSheet = forwardRef<
  BottomSheet,
  VehicleFormBottomSheetProps
>(({ vehicle, onSubmit, onClose, loading = false }, ref) => {
  const theme = useTheme();
  const snapPoints = useMemo(() => ['85%'], []);
  const isEditing = !!vehicle;

  const [formData, setFormData] = useState<VehicleFormData>({
    make: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    vehicleType: 'car',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year.toString(),
        color: vehicle.color,
        licensePlate: vehicle.licensePlate,
        vehicleType: vehicle.vehicleType || 'car',
      });
    }
  }, [vehicle]);

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: '',
      color: '',
      licensePlate: '',
      vehicleType: 'car',
    });
  };

  const handleSubmit = async () => {
    if (!formData.make || !formData.model || !formData.year || !formData.color || !formData.licensePlate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const yearNum = parseInt(formData.year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert('Error', 'Please enter a valid year');
      return;
    }

    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateFormData = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const styles = createStyles(theme);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleClose}
      backgroundStyle={[styles.bottomSheetBackground]}
      handleIndicatorStyle={[styles.handleIndicator]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={loading}>
            <Text style={[styles.cancelButton, loading && styles.disabledText]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
          </Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={styles.saveButton}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form */}
        <BottomSheetScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            {/* Make */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Make *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border }]}
                value={formData.make}
                onChangeText={(value) => updateFormData('make', value)}
                placeholder="e.g., Toyota, Honda, BMW"
                placeholderTextColor={theme.colors.textTertiary}
                editable={!loading}
                autoCapitalize="words"
              />
            </View>

            {/* Model */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Model *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border }]}
                value={formData.model}
                onChangeText={(value) => updateFormData('model', value)}
                placeholder="e.g., Camry, Civic, X3"
                placeholderTextColor={theme.colors.textTertiary}
                editable={!loading}
                autoCapitalize="words"
              />
            </View>

            {/* Year */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Year *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border }]}
                value={formData.year}
                onChangeText={(value) => updateFormData('year', value)}
                placeholder="e.g., 2022"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="numeric"
                maxLength={4}
                editable={!loading}
              />
            </View>

            {/* Color */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Color *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border }]}
                value={formData.color}
                onChangeText={(value) => updateFormData('color', value)}
                placeholder="e.g., Silver, Blue, Black"
                placeholderTextColor={theme.colors.textTertiary}
                editable={!loading}
                autoCapitalize="words"
              />
            </View>

            {/* License Plate */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>License Plate *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border }]}
                value={formData.licensePlate}
                onChangeText={(value) => updateFormData('licensePlate', value.toUpperCase())}
                placeholder="e.g., ABC123"
                placeholderTextColor={theme.colors.textTertiary}
                editable={!loading}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {/* Form Notes */}
            <View style={styles.formNote}>
              <View style={styles.noteItem}>
                <Ionicons name="information-circle" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
                  All fields are required to add your vehicle
                </Text>
              </View>
              <View style={styles.noteItem}>
                <Ionicons name="shield-checkmark" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
                  Your vehicle information is kept secure and private
                </Text>
              </View>
              {!isEditing && (
                <View style={styles.noteItem}>
                  <Ionicons name="star" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
                    Your first vehicle will be set as default automatically
                  </Text>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </BottomSheetScrollView>
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
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    cancelButton: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
    },
    saveButton: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.primary,
    },
    disabledText: {
      opacity: 0.5,
    },
    scrollView: {
      flex: 1,
    },
    formContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    formGroup: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.sizes.md,
      borderWidth: 1,
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
    },
    formNote: {
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    noteItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
    },
    noteText: {
      fontSize: theme.typography.sizes.sm,
      lineHeight: 20,
      flex: 1,
    },
  });

VehicleFormBottomSheet.displayName = 'VehicleFormBottomSheet';

export default VehicleFormBottomSheet;
export type { VehicleFormData };