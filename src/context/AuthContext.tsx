import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useLazyQuery } from '@apollo/client';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FIREBASE_REGISTER, VERIFY_FIREBASE_TOKEN, SYNC_FIREBASE_USER, FIREBASE_LOGIN, LINK_FIREBASE_ACCOUNT } from '../graphql/mutations';
import { GET_FIREBASE_USER_INFO } from '../graphql/queries';

// Type alias for compatibility
type FirebaseUser = FirebaseAuthTypes.User;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  profilePicture?: string;
  dateOfBirth?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (emailOrPhone: string, password: string) => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<any>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // GraphQL mutations
  const [firebaseRegisterUser] = useMutation(FIREBASE_REGISTER);
  const [verifyFirebaseToken] = useMutation(VERIFY_FIREBASE_TOKEN);
  const [syncFirebaseUser] = useMutation(SYNC_FIREBASE_USER);
  const [firebaseLoginUser] = useMutation(FIREBASE_LOGIN);
  const [linkFirebaseAccount] = useMutation(LINK_FIREBASE_ACCOUNT);
  const [getFirebaseUserInfo] = useLazyQuery(GET_FIREBASE_USER_INFO);

  const isAuthenticated = !!firebaseUser;

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        // Load or create user profile data
        await loadUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const storedUser = await AsyncStorage.getItem(`user_${firebaseUser.uid}`);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Create a basic user profile from Firebase user data
        const basicUser: User = {
          id: firebaseUser.uid,
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ')[1] || '',
          email: firebaseUser.email || '',
          phoneNumber: firebaseUser.phoneNumber || '',
          role: 'user',
          isVerified: firebaseUser.emailVerified,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(basicUser);
        await AsyncStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(basicUser));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string) => {
    // Basic phone number validation (starts with + and contains only digits)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      // 1. Firebase auth
      if (isValidEmail(identifier)) {
        // Email authentication
        await auth().signInWithEmailAndPassword(identifier, password);
      } else if (isValidPhoneNumber(identifier)) {
        // For phone number login, we need to construct the Firebase email
        const firebaseEmail = `${identifier.replace(/[^0-9]/g, '')}@placeholder.com`;
        await auth().signInWithEmailAndPassword(firebaseEmail, password);
      } else {
        throw new Error('Invalid email or phone number format');
      }
      
      const firebaseUser = auth().currentUser;
      if (!firebaseUser) {
        throw new Error('Firebase authentication failed');
      }
      
      // 2. Get ID token
      const idToken = await firebaseUser.getIdToken();
      
      // 3. Verify with backend
      try {
        const verifyResult = await verifyFirebaseToken({ 
          variables: { 
            input: { idToken } 
          } 
        });
        
        if (verifyResult.data?.verifyFirebaseToken?.success) {
          console.log('Firebase token verified successfully');
          
          // 4. Try to login with Firebase credentials
          const loginResult = await firebaseLoginUser({
            variables: {
              input: {
                firebaseUid: firebaseUser.uid,
                email: isValidEmail(identifier) ? identifier : null,
                phoneNumber: isValidPhoneNumber(identifier) ? identifier : null
              }
            }
          });
          
          if (loginResult.data?.firebaseLogin?.success) {
            // Store the backend auth token
            if (loginResult.data.firebaseLogin.token) {
              await AsyncStorage.setItem('authToken', loginResult.data.firebaseLogin.token);
            }
            
            // 5. Get user info from Firebase Admin
            const userInfoResult = await getFirebaseUserInfo({
              variables: { firebaseUid: firebaseUser.uid }
            });
            
            if (userInfoResult?.data?.getFirebaseUserInfo) {
              const firebaseUserData = userInfoResult.data.getFirebaseUserInfo;
              const userData: User = {
                id: firebaseUserData.uid,
                firstName: firebaseUserData.displayName?.split(' ')[0] || '',
                lastName: firebaseUserData.displayName?.split(' ')[1] || '',
                email: firebaseUserData.email || '',
                phoneNumber: firebaseUserData.phoneNumber || '',
                role: 'user',
                isVerified: firebaseUserData.emailVerified,
                isActive: !firebaseUserData.disabled,
                createdAt: firebaseUserData.creationTime || new Date().toISOString(),
                updatedAt: firebaseUserData.lastSignInTime || new Date().toISOString(),
              };
              setUser(userData);
              await AsyncStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
            }
            
            console.log('User successfully authenticated with backend');
          } else {
            console.warn('Backend login failed:', loginResult.data?.firebaseLogin?.message);
            // If login fails, try to sync the user
            await syncFirebaseUser({ variables: { firebaseUid: firebaseUser.uid } });
          }
        } else {
          console.warn('Backend token verification failed:', verifyResult.data?.verifyFirebaseToken?.message);
        }
      } catch (backendError) {
        console.error('Backend authentication error:', backendError);
        // Continue with Firebase-only authentication if backend fails
      }
      
      // User state will be updated automatically via onAuthStateChanged
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    try {
      // React Native Firebase phone authentication
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      return confirmation;
    } catch (error) {
      console.error('Error signing in with phone:', error);
      throw error;
    }
  };

  const signUp = async (identifier: string, password: string, firstName: string, lastName: string) => {
    try {
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      const email = isEmail ? identifier : '';
      const phoneNumber = !isEmail ? identifier : '';
      
      // 1. Firebase auth - Create Firebase user with email (required for Firebase)
      // If phone number is provided, we'll use a placeholder email for Firebase
      const firebaseEmail = email || `${phoneNumber.replace(/[^0-9]/g, '')}@placeholder.com`;
      const userCredential = await auth().createUserWithEmailAndPassword(firebaseEmail, password);
      
      // Update the user's display name
      await userCredential.user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });
      
      // 2. Get ID token
      const idToken = await userCredential.user.getIdToken();
      
      // 3. Register user with backend (this creates the user in database)
      try {
        const { data } = await firebaseRegisterUser({
          variables: {
            input: {
              firebaseUid: userCredential.user.uid,
              firstName,
              lastName,
              email: email || null,
              phoneNumber: phoneNumber || null
            }
          }
        });
        
        if (data?.firebaseRegister?.success) {
          // Store the backend auth token if provided
          if (data.firebaseRegister.token) {
            await AsyncStorage.setItem('authToken', data.firebaseRegister.token);
          }
          
          // Create user object from registration data
          const userData: User = {
            id: userCredential.user.uid,
            firstName,
            lastName,
            email: email || '',
            phoneNumber: phoneNumber || '',
            role: 'user',
            isVerified: userCredential.user.emailVerified,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(userData);
          await AsyncStorage.setItem(`user_${userCredential.user.uid}`, JSON.stringify(userData));
          
          console.log('User successfully registered with backend:', data.firebaseRegister.message);
        } else {
          console.warn('Backend registration failed:', data?.firebaseRegister?.message);
        }
      } catch (backendError) {
        console.error('Backend registration error:', backendError);
        // Continue with Firebase-only registration if backend fails
      }
      
      // User state will be updated automatically via onAuthStateChanged
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      // User state will be updated automatically via onAuthStateChanged
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUser = async (userData: User) => {
    setUser(userData);
    // Update AsyncStorage
    if (firebaseUser) {
      try {
        await AsyncStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
    signIn,
    signInWithPhone,
    signUp,
    signOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;