import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { User, Vehicle } from '../types';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../hooks/useVehicles';
import VehicleDetailsBottomSheet from '../components/VehicleDetailsBottomSheet';
import VehicleFormBottomSheet, { VehicleFormData } from '../components/VehicleFormBottomSheet';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const {
    vehicles,
    loading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setDefaultVehicle,
    addingVehicle,
    updatingVehicle,
    deletingVehicle,
    settingDefault,
  } = useVehicles();
  
  // Bottom sheet refs
  const vehicleDetailsBottomSheetRef = useRef<BottomSheet>(null);
  const vehicleFormBottomSheetRef = useRef<BottomSheet>(null);
  
  // State for bottom sheets
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  // Fallback user data if not available from context
  const displayUser = user || {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1 (555) 123-4567',
    createdAt: '2024-01-01T00:00:00Z',
  };

  const menuItems = [
    {
      id: '1',
      title: 'Payment Methods',
      subtitle: 'Manage cards and payment options',
      icon: 'card-outline',
      onPress: () => console.log('Payment Methods'),
    },
    {
      id: '2',
      title: 'Notifications',
      subtitle: 'Customize your notification preferences',
      icon: 'notifications-outline',
      onPress: () => console.log('Notifications'),
    },
    {
      id: '3',
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: 'shield-outline',
      onPress: () => console.log('Privacy & Security'),
    },
    {
      id: '4',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle-outline',
      onPress: () => console.log('Help & Support'),
    },
    {
      id: '5',
      title: 'About',
      subtitle: 'App version and legal information',
      icon: 'information-circle-outline',
      onPress: () => console.log('About'),
    },
  ];

  const handleEditProfile = () => {
    console.log('Edit Profile');
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    vehicleFormBottomSheetRef.current?.expand();
  };

  const handleVehiclePress = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    vehicleDetailsBottomSheetRef.current?.expand();
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    vehicleDetailsBottomSheetRef.current?.close();
    setEditingVehicle(vehicle);
    setTimeout(() => {
      vehicleFormBottomSheetRef.current?.expand();
    }, 300);
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    try {
      await deleteVehicle(vehicle.id);
      vehicleDetailsBottomSheetRef.current?.close();
      Alert.alert('Success', 'Vehicle deleted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete vehicle');
    }
  };

  const handleSetDefaultVehicle = async (vehicle: Vehicle) => {
    try {
      await setDefaultVehicle(vehicle.id);
      vehicleDetailsBottomSheetRef.current?.close();
      Alert.alert('Success', 'Default vehicle updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to set default vehicle');
    }
  };

  const handleVehicleFormSubmit = async (formData: VehicleFormData) => {
    console.log('🚗 Vehicle form submitted with data:', formData);
    
    try {
      const vehicleData = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        color: formData.color,
        licensePlate: formData.licensePlate,
        vehicleType: formData.vehicleType,
        isDefault: vehicles.length === 0, // Set as default if it's the first vehicle
      };
      
      console.log('🔧 Processed vehicle data:', vehicleData);
      console.log('📊 Current vehicles count:', vehicles.length);

      if (editingVehicle) {
        console.log('✏️ Updating existing vehicle:', editingVehicle.id);
        await updateVehicle(editingVehicle.id, vehicleData);
        console.log('✅ Vehicle updated successfully');
        Alert.alert('Success', 'Vehicle updated successfully');
      } else {
        console.log('➕ Adding new vehicle');
        const result = await addVehicle(vehicleData);
        console.log('✅ Vehicle added successfully:', result);
        Alert.alert('Success', 'Vehicle added successfully');
      }
      
      vehicleFormBottomSheetRef.current?.close();
      setEditingVehicle(null);
    } catch (error: any) {
      console.error('❌ Vehicle save error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        stack: error.stack
      });
      Alert.alert('Error', error.message || 'Failed to save vehicle');
    }
  };

  const handleCloseVehicleDetails = () => {
    setSelectedVehicle(null);
  };

  const handleCloseVehicleForm = () => {
    setEditingVehicle(null);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
            source={{
              uri: 'https://via.placeholder.com/100x100/007AFF/FFFFFF?text=JD',
            }}
            style={styles.avatar}
          />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{displayUser.firstName} {displayUser.lastName}</Text>
          <Text style={styles.userEmail}>{displayUser.email}</Text>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>$248</Text>
            <Text style={styles.statLabel}>Money Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Vehicles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity onPress={handleAddVehicle} disabled={addingVehicle}>
              <Ionicons 
                name={addingVehicle ? "hourglass-outline" : "add-circle-outline"} 
                size={24} 
                color={addingVehicle ? "#CCC" : "#007AFF"} 
              />
            </TouchableOpacity>
          </View>
          {loading && vehicles.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading vehicles...</Text>
            </View>
          ) : (
            vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={styles.vehicleCard}
                onPress={() => handleVehiclePress(vehicle)}
              >
                <View style={styles.vehicleIcon}>
                  <Ionicons name="car" size={24} color="#007AFF" />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </Text>
                  <Text style={styles.vehicleDetails}>
                    {vehicle.color} • {vehicle.licensePlate}
                  </Text>
                </View>
                {vehicle.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            ))
          )}
          {!loading && vehicles.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No vehicles added yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add your first vehicle</Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={24} color="#666" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Bottom Sheets */}
      <VehicleDetailsBottomSheet
        ref={vehicleDetailsBottomSheetRef}
        vehicle={selectedVehicle}
        onEdit={handleEditVehicle}
        onDelete={handleDeleteVehicle}
        onSetDefault={handleSetDefaultVehicle}
        onClose={handleCloseVehicleDetails}
        loading={deletingVehicle || settingDefault}
      />

      <VehicleFormBottomSheet
        ref={vehicleFormBottomSheetRef}
        vehicle={editingVehicle}
        onSubmit={handleVehicleFormSubmit}
        onClose={handleCloseVehicleForm}
        loading={addingVehicle || updatingVehicle}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  userName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  editProfileButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  editProfileText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.lg,
    marginTop: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  section: {
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  vehicleDetails: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  defaultBadge: {
    backgroundColor: theme.colors.success + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
  },
  defaultText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.success,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  menuSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  signOutText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  versionText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textTertiary,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProfileScreen;