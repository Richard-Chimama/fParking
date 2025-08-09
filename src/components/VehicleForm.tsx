import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Vehicle } from '../types';

interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
}

interface VehicleFormProps {
  visible: boolean;
  editingVehicle: Vehicle | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleFormData) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  visible,
  editingVehicle,
  loading,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<VehicleFormData>({
    make: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
  });

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        make: editingVehicle.make,
        model: editingVehicle.model,
        year: editingVehicle.year.toString(),
        color: editingVehicle.color,
        licensePlate: editingVehicle.licensePlate,
      });
    } else {
      resetForm();
    }
  }, [editingVehicle, visible]);

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: '',
      color: '',
      licensePlate: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.make || !formData.model || !formData.year || !formData.color || !formData.licensePlate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const yearNum = parseInt(formData.year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert('Error', 'Please enter a valid year');
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.modalCancelButton, { color: theme.colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
          </Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={[styles.modalSaveButton, { color: theme.colors.primary }]}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Make *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={formData.make}
              onChangeText={(text) => setFormData({ ...formData, make: text })}
              placeholder="e.g., Toyota, Honda, Tesla"
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Model *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={formData.model}
              onChangeText={(text) => setFormData({ ...formData, model: text })}
              placeholder="e.g., Camry, Civic, Model 3"
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Year *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={formData.year}
              onChangeText={(text) => setFormData({ ...formData, year: text })}
              placeholder="e.g., 2023"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Color *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
              placeholder="e.g., White, Black, Red"
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>License Plate *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={formData.licensePlate}
              onChangeText={(text) => setFormData({ ...formData, licensePlate: text.toUpperCase() })}
              placeholder="e.g., ABC123"
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.formNote}>
            <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
              * Required fields
            </Text>
            {!editingVehicle && (
              <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
                Your first vehicle will be set as default automatically.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    fontSize: 16,
  },
  modalSaveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  formNote: {
    marginTop: 20,
    paddingTop: 20,
    gap: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default VehicleForm;
export type { VehicleFormData };