import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Parking } from '../types';

interface ParkingState {
  // Data
  parkings: Parking[];
  selectedParking: Parking | null;
  nearbyParkings: Parking[];
  searchResults: Parking[];
  favoriteIds: string[];
  recentSearches: string[];
  
  // UI State
  isSearchDrawerVisible: boolean;
  searchQuery: string;
  selectedCity: string;
  userLocation: { latitude: number; longitude: number } | null;
  
  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  
  // Actions
  setParkings: (parkings: Parking[]) => void;
  setSelectedParking: (parking: Parking | null) => void;
  setNearbyParkings: (parkings: Parking[]) => void;
  setSearchResults: (results: Parking[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCity: (city: string) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  
  // Search actions
  searchParkings: (query: string) => void;
  clearSearch: () => void;
  addRecentSearch: (query: string) => void;
  
  // Favorites
  toggleFavorite: (parkingId: string) => void;
  isFavorite: (parkingId: string) => boolean;
  getFavorites: () => Parking[];
  
  // UI actions
  setSearchDrawerVisible: (visible: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSearching: (searching: boolean) => void;
  
  // Cache management
  clearCache: () => void;
  refreshData: () => void;
}

export const useParkingStore = create<ParkingState>()(
  persist(
    (set, get) => ({
      // Initial state
      parkings: [],
      selectedParking: null,
      nearbyParkings: [],
      searchResults: [],
      favoriteIds: [],
      recentSearches: [],
      
      isSearchDrawerVisible: false,
      searchQuery: '',
      selectedCity: '',
      userLocation: null,
      
      isLoading: false,
      isSearching: false,
      
      // Data actions
      setParkings: (parkings) => set({ parkings }),
      setSelectedParking: (parking) => set({ selectedParking: parking }),
      setNearbyParkings: (parkings) => set({ nearbyParkings: parkings }),
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCity: (city) => set({ selectedCity: city }),
      setUserLocation: (location) => set({ userLocation: location }),
      
      // Search actions
      searchParkings: (query) => {
        const { parkings } = get();
        if (!query.trim()) {
          set({ searchResults: [], searchQuery: query });
          return;
        }
        
        const results = parkings.filter((parking) => {
          const searchTerm = query.toLowerCase();
          return (
            parking.name.toLowerCase().includes(searchTerm) ||
            parking.description?.toLowerCase().includes(searchTerm) ||
            parking.address.street.toLowerCase().includes(searchTerm) ||
            parking.address.city.toLowerCase().includes(searchTerm) ||
            parking.address.state.toLowerCase().includes(searchTerm)
          );
        });
        
        set({ searchResults: results, searchQuery: query });
        
        // Add to recent searches if not empty and not already present
        if (query.trim() && !get().recentSearches.includes(query)) {
          get().addRecentSearch(query);
        }
      },
      
      clearSearch: () => set({ searchResults: [], searchQuery: '' }),
      
      addRecentSearch: (query) => {
        const { recentSearches } = get();
        const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
        set({ recentSearches: updatedSearches });
      },
      
      // Favorites
      toggleFavorite: (parkingId) => {
        const { favoriteIds } = get();
        const isFav = favoriteIds.includes(parkingId);
        const updatedFavorites = isFav
          ? favoriteIds.filter(id => id !== parkingId)
          : [...favoriteIds, parkingId];
        set({ favoriteIds: updatedFavorites });
      },
      
      isFavorite: (parkingId) => get().favoriteIds.includes(parkingId),
      
      getFavorites: () => {
        const { parkings, favoriteIds } = get();
        return parkings.filter(parking => favoriteIds.includes(parking.id));
      },
      
      // UI actions
      setSearchDrawerVisible: (visible) => set({ isSearchDrawerVisible: visible }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSearching: (searching) => set({ isSearching: searching }),
      
      // Cache management
      clearCache: () => set({
        parkings: [],
        selectedParking: null,
        nearbyParkings: [],
        searchResults: [],
        searchQuery: '',
      }),
      
      refreshData: () => {
        // This will be called to trigger data refresh
        set({ isLoading: true });
      },
    }),
    {
      name: 'parking-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user preferences and favorites, not temporary data
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
        recentSearches: state.recentSearches,
        selectedCity: state.selectedCity,
        userLocation: state.userLocation,
      }),
    }
  )
);

// Selectors for better performance
export const useParkingData = () => useParkingStore((state) => ({
  parkings: state.parkings,
  selectedParking: state.selectedParking,
  nearbyParkings: state.nearbyParkings,
  searchResults: state.searchResults,
}));

export const useSearchState = () => useParkingStore((state) => ({
  searchQuery: state.searchQuery,
  isSearchDrawerVisible: state.isSearchDrawerVisible,
  isSearching: state.isSearching,
  recentSearches: state.recentSearches,
}));

export const useFavorites = () => useParkingStore((state) => ({
  favoriteIds: state.favoriteIds,
  isFavorite: state.isFavorite,
  toggleFavorite: state.toggleFavorite,
  getFavorites: state.getFavorites,
}));

export const useLocationState = () => useParkingStore((state) => ({
  userLocation: state.userLocation,
  selectedCity: state.selectedCity,
  setUserLocation: state.setUserLocation,
  setSelectedCity: state.setSelectedCity,
}));