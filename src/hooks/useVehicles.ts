import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from 'react-native';
import { GET_USER_VEHICLES } from '../graphql/queries';
import {
  ADD_VEHICLE,
  UPDATE_VEHICLE,
  DELETE_VEHICLE,
  SET_DEFAULT_VEHICLE,
} from '../graphql/mutations';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';

interface CreateVehicleInput {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vehicleType: string;
  isDefault?: boolean;
}

interface UpdateVehicleInput {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  vehicleType?: string;
  isDefault?: boolean;
}

interface UseVehiclesReturn {
  vehicles: Vehicle[];
  loading: boolean;
  error: any;
  refetch: () => void;
  addVehicle: (input: CreateVehicleInput) => Promise<void>;
  updateVehicle: (vehicleId: string, input: UpdateVehicleInput) => Promise<void>;
  deleteVehicle: (vehicleId: string) => Promise<void>;
  setDefaultVehicle: (vehicleId: string) => Promise<void>;
  addingVehicle: boolean;
  updatingVehicle: boolean;
  deletingVehicle: boolean;
  settingDefault: boolean;
}

export const useVehicles = (): UseVehiclesReturn => {
  const { user } = useAuth();
  
  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_USER_VEHICLES, {
    variables: { userId: user?.id },
    skip: !user?.id,
    errorPolicy: 'all',
  });

  const [addVehicleMutation, { loading: addingVehicle }] = useMutation(ADD_VEHICLE, {
    errorPolicy: 'all',
    onCompleted: () => {
      refetch();
    },
  });

  const [updateVehicleMutation, { loading: updatingVehicle }] = useMutation(UPDATE_VEHICLE, {
    errorPolicy: 'all',
    onCompleted: () => {
      refetch();
    },
  });

  const [deleteVehicleMutation, { loading: deletingVehicle }] = useMutation(DELETE_VEHICLE, {
    errorPolicy: 'all',
    onCompleted: () => {
      refetch();
    },
  });

  const [setDefaultVehicleMutation, { loading: settingDefault }] = useMutation(SET_DEFAULT_VEHICLE, {
    errorPolicy: 'all',
    onCompleted: () => {
      refetch();
    },
  });

  const vehicles: Vehicle[] = data?.userVehicles || [];

  const addVehicle = async (input: CreateVehicleInput): Promise<void> => {
    console.log('🔄 useVehicles: Starting addVehicle with input:', input);
    try {
      const result = await addVehicleMutation({
        variables: { input },
      });
      console.log('✅ useVehicles: addVehicle mutation completed:', result);
    } catch (error: any) {
      console.error('❌ useVehicles: addVehicle mutation failed:', error);
      console.error('❌ useVehicles: GraphQL errors:', error.graphQLErrors);
      console.error('❌ useVehicles: Network error:', error.networkError);
      throw new Error(error.message || 'Failed to add vehicle');
    }
  };

  const updateVehicle = async (vehicleId: string, input: UpdateVehicleInput): Promise<void> => {
    console.log('🔄 useVehicles: Starting updateVehicle with:', { vehicleId, input });
    try {
      const result = await updateVehicleMutation({
        variables: {
          vehicleId,
          input,
        },
      });
      console.log('✅ useVehicles: updateVehicle mutation completed:', result);
    } catch (error: any) {
      console.error('❌ useVehicles: updateVehicle mutation failed:', error);
      console.error('❌ useVehicles: GraphQL errors:', error.graphQLErrors);
      console.error('❌ useVehicles: Network error:', error.networkError);
      throw new Error(error.message || 'Failed to update vehicle');
    }
  };

  const deleteVehicle = async (vehicleId: string): Promise<void> => {
    try {
      await deleteVehicleMutation({
        variables: { vehicleId },
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete vehicle');
    }
  };

  const setDefaultVehicle = async (vehicleId: string): Promise<void> => {
    try {
      await setDefaultVehicleMutation({
        variables: { vehicleId },
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to set default vehicle');
    }
  };

  return {
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
    settingDefault,
  };
};

export default useVehicles;