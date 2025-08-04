import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthNavigator from './AuthNavigator';

const Drawer = createDrawerNavigator();

const AppNavigator: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : (
        <Drawer.Navigator
          initialRouteName="Map"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              fontWeight: theme.typography.weights.bold,
              fontSize: theme.typography.sizes.lg,
            },
            drawerPosition: 'right',
            drawerStyle: {
              backgroundColor: theme.colors.surface,
              width: 280,
            },
            drawerActiveTintColor: theme.colors.primary,
            drawerInactiveTintColor: theme.colors.textSecondary,
            drawerLabelStyle: {
              fontSize: theme.typography.sizes.md,
              fontWeight: theme.typography.weights.medium,
            },
          }}
        >
          <Drawer.Screen 
            name="Map" 
            component={MapScreen} 
            options={{
              title: 'Find Parking',
              headerShown: false,
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons 
                  name={focused ? 'map' : 'map-outline'} 
                  size={size} 
                  color={color} 
                />
              ),
            }}
          />
          <Drawer.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
              title: 'Dashboard',
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons 
                  name={focused ? 'home' : 'home-outline'} 
                  size={size} 
                  color={color} 
                />
              ),
            }}
          />
          <Drawer.Screen 
            name="Bookings" 
            component={BookingsScreen} 
            options={{
              title: 'My Bookings',
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons 
                  name={focused ? 'calendar' : 'calendar-outline'} 
                  size={size} 
                  color={color} 
                />
              ),
            }}
          />
          <Drawer.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{
              title: 'Profile',
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons 
                  name={focused ? 'person' : 'person-outline'} 
                  size={size} 
                  color={color} 
                />
              ),
            }}
          />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;