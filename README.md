# fParking - Car Parking Mobile App

A modern React Native mobile application built with Expo and TypeScript for finding and booking parking spots.

## Features

- 🚗 **Find Parking Spots**: Search and discover nearby parking locations
- 📍 **Interactive Map**: View parking spots on an interactive map with real-time availability
- 📅 **Booking Management**: Book, extend, and cancel parking reservations
- 👤 **User Profile**: Manage personal information and vehicles
- 💳 **Payment Integration**: Secure payment processing (ready for integration)
- ⭐ **Reviews & Ratings**: Rate and review parking experiences
- 🔔 **Notifications**: Get updates about bookings and availability

## Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript
- **State Management**: Apollo Client for GraphQL
- **Navigation**: React Navigation 6
- **Maps**: React Native Maps
- **UI Components**: Custom components with modern design
- **Icons**: Expo Vector Icons
- **Gradients**: Expo Linear Gradient

## Project Structure

```
src/
├── apollo/          # Apollo Client configuration
├── components/      # Reusable UI components
├── graphql/         # GraphQL queries and mutations
├── hooks/           # Custom React hooks
├── navigation/      # Navigation configuration
├── screens/         # Screen components
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fParking
```

2. Install dependencies:
```bash
npm install
```

3. Configure API keys and secrets:
   - Copy `config.sample.json` to `config.json`
   - Edit `config.json` with your actual API keys:
     - GraphQL endpoint URL
     - Google Maps API key
     - Stripe publishable key
     - OneSignal App ID
     - Sentry DSN
     - Amplitude API key

4. Start the development server:
```bash
npm start
```

5. Use Expo Go app to scan the QR code and run the app on your device, or use the iOS/Android simulators.

## Theme System

The fParking app uses a comprehensive theme system built with React Context for consistent styling across the application.

### Color Palette

The app uses a carefully selected color palette:
- **Primary**: `rgb(51, 52, 70)` - Dark blue-gray for main UI elements
- **Secondary**: `rgb(127, 140, 170)` - Medium blue-gray for accents
- **Accent**: `rgb(184, 207, 206)` - Light blue-green for highlights
- **Background**: `rgb(234, 239, 239)` - Very light gray for backgrounds

### Using the Theme

1. **Import the theme hook**:
```typescript
import { useTheme } from '../theme/ThemeProvider';
```

2. **Use in components**:
```typescript
const MyComponent = () => {
  const theme = useTheme();
  
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
});
```

### Theme Structure

- **Colors**: Primary, secondary, accent, background, surface, text variations, status colors
- **Typography**: Font sizes, weights, and line heights
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, xxl)
- **Border Radius**: Predefined radius values for consistent rounded corners
- **Shadows**: Platform-specific shadow configurations
- **Components**: Pre-styled component configurations for buttons, cards, inputs
- **Layout**: Common layout values and breakpoints
- **Animation**: Consistent animation durations

### Customization

To modify the theme, edit the values in `src/theme/index.ts`. The theme system automatically propagates changes throughout the app.

### Configuration

1. **GraphQL Endpoint**: Update the GraphQL endpoint in `src/apollo/client.ts`
   ```typescript
   const httpLink = createHttpLink({
     uri: 'https://your-graphql-endpoint.com/graphql',
   });
   ```

2. **Maps Configuration**: Add your Google Maps API key for production use

3. **Environment Variables**: Create a `.env` file for sensitive configuration

## Screens

### Home Screen
- Dashboard with quick actions
- Recent bookings overview
- User statistics
- Quick access to main features

### Map Screen
- Interactive map with parking spot markers
- Search functionality
- Real-time availability updates
- Spot details and booking options

### Bookings Screen
- Upcoming and past bookings
- Booking management (extend, cancel)
- Booking status tracking
- Payment history

### Profile Screen
- User profile management
- Vehicle management
- App settings
- Help and support

## GraphQL Integration

The app uses Apollo Client for GraphQL integration with the following features:

- **Queries**: Fetch parking spots, bookings, user data
- **Mutations**: Create/update/delete operations
- **Caching**: Intelligent caching for better performance
- **Error Handling**: Comprehensive error management
- **Optimistic Updates**: Immediate UI updates

### Example Usage

```typescript
import { useBookings } from '../hooks/useBookings';

const BookingsScreen = () => {
  const { bookings, loading, createBooking } = useBookings('user-id');
  
  const handleBooking = async (spotId: string) => {
    try {
      await createBooking({
        parkingSpotId: spotId,
        startTime: '2024-01-15T14:00:00Z',
        endTime: '2024-01-15T16:00:00Z',
      });
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };
  
  // Component JSX...
};
```

## Development

### Code Style

- ESLint and Prettier for code formatting
- TypeScript for type safety
- Consistent naming conventions
- Component-based architecture

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using React Native and Expo**