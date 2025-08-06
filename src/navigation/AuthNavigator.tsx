import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import { useTheme } from '../theme/ThemeProvider';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  OTPVerification: {
    phoneNumber: string;
    otpId?: string;
    fromSignup?: boolean;
  };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
          fontSize: theme.typography.sizes.lg,
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen} 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{
          title: 'Create Account',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="OTPVerification" 
        component={OTPVerificationScreen} 
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;