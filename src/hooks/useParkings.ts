import { useQuery, useLazyQuery, useApolloClient } from '@apollo/client';
import {
  GET_ALL_PARKINGS,
  GET_PARKING_BY_ID,
  GET_NEARBY_PARKINGS,
  GET_PARKINGS_BY_CITY,
} from '../graphql/queries';
import { Parking } from '../types';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const NEARBY_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for location-based queries

// Hook for getting all parkings
export const useParkings = () => {
  const { data, loading, error, refetch } = useQuery<{ parkings: Parking[] }>(
    GET_ALL_PARKINGS,
    {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      context: {
        headers: {
          'Cache-Control': `max-age=${CACHE_DURATION / 1000}`,
        },
      },
    }
  );

  return {
    parkings: data?.parkings || [],
    loading,
    error,
    refetch,
  };
};

// Hook for getting a specific parking by ID with caching
export const useParkingById = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{ parking: Parking }>(
    GET_PARKING_BY_ID,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
      context: {
        headers: {
          'Cache-Control': `max-age=${CACHE_DURATION / 1000}`,
        },
      },
    }
  );

  return {
    parking: data?.parking,
    loading,
    error,
    refetch,
  };
};

// Hook for getting nearby parkings with enhanced caching
export const useNearbyParkings = () => {
  const client = useApolloClient();
  const [getNearbyParkings, { data, loading, error }] = useLazyQuery<{
    nearbyParkings: Parking[];
  }>(GET_NEARBY_PARKINGS, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    context: {
      headers: {
        'Cache-Control': `max-age=${NEARBY_CACHE_DURATION / 1000}`,
      },
    },
  });

  const fetchNearbyParkings = (
    latitude: number,
    longitude: number,
    maxDistance: number = 5000 // Default 5km radius
  ) => {    
    // Check if we have recent cached data
    const cachedData = client.cache.readQuery({
      query: GET_NEARBY_PARKINGS,
      variables: { latitude, longitude, maxDistance },
    });

    if (cachedData) {
      console.log('Using cached nearby parkings data');
    }

    getNearbyParkings({
      variables: {
        latitude,
        longitude,
        maxDistance,
      },
    });
  };

  return {
    nearbyParkings: data?.nearbyParkings || [],
    loading,
    error,
    fetchNearbyParkings,
  };
};

// Hook for getting parkings by city with caching
export const useParkingsByCity = () => {
  const client = useApolloClient();
  const [getParkingsByCity, { data, loading, error }] = useLazyQuery<{
    parkingsByCity: Parking[];
  }>(GET_PARKINGS_BY_CITY, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    context: {
      headers: {
        'Cache-Control': `max-age=${CACHE_DURATION / 1000}`,
      },
    },
  });

  const fetchParkingsByCity = (city: string) => {
    // Check cache first
    const cachedData = client.cache.readQuery({
      query: GET_PARKINGS_BY_CITY,
      variables: { city },
    });

    if (cachedData) {
      console.log(`Using cached data for city: ${city}`);
    }

    getParkingsByCity({
      variables: { city },
    });
  };

  return {
    parkingsByCity: data?.parkingsByCity || [],
    loading,
    error,
    fetchParkingsByCity,
  };
};

// Cache management utilities
export const useParkingCache = () => {
  const client = useApolloClient();

  const clearParkingCache = () => {
    client.cache.evict({ fieldName: 'parkings' });
    client.cache.evict({ fieldName: 'nearbyParkings' });
    client.cache.evict({ fieldName: 'parkingsByCity' });
    client.cache.gc();
    console.log('Parking cache cleared');
  };

  const refreshParkingData = async () => {
    try {
      await client.refetchQueries({
        include: [GET_ALL_PARKINGS],
      });
      console.log('Parking data refreshed');
    } catch (error) {
      console.error('Error refreshing parking data:', error);
    }
  };

  const getCacheSize = () => {
    const cache = client.cache.extract();
    return JSON.stringify(cache).length;
  };

  const preloadNearbyParkings = async (
    latitude: number,
    longitude: number,
    maxDistance: number = 5000
  ) => {
    try {
      await client.query({
        query: GET_NEARBY_PARKINGS,
        variables: { latitude, longitude, maxDistance },
        fetchPolicy: 'cache-first',
      });
      console.log('Nearby parkings preloaded');
    } catch (error) {
      console.error('Error preloading nearby parkings:', error);
    }
  };

  return {
    clearParkingCache,
    refreshParkingData,
    getCacheSize,
    preloadNearbyParkings,
  };
};

// Utility function to parse coordinates string to lat/lng
export const parseCoordinates = (coordinates: string | number[] | undefined): { latitude: number; longitude: number } | null => {
  try {
    if (!coordinates) {
      console.warn('Coordinates are undefined or null');
      return null;
    }

    let lat: number, lng: number;

    if (Array.isArray(coordinates)) {
      // Handle number array format [lng, lat] - GeoJSON standard
      [lng, lat] = coordinates;
    } else if (typeof coordinates === 'string') {
      // Handle string format "lng,lat" - GeoJSON standard
      [lng, lat] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
    } else {
      console.warn('Invalid coordinates format:', coordinates);
      return null;
    }
    
    if (isNaN(lat) || isNaN(lng)) {
      console.warn('Invalid coordinates values:', { lat, lng });
      return null;
    }
    
    return {
      latitude: lat,
      longitude: lng,
    };
  } catch (error) {
    console.error('Error parsing coordinates:', error);
    return null;
  }
};

// Utility function to format address object to string
export const formatAddress = (address: Parking['address']): string => {
  const { street, city, state, zipCode, country } = address;
  return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
};