import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useLazyQuery } from '@apollo/client';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { VERIFY_FIREBASE_TOKEN, FIREBASE_LOGIN, FIREBASE_REGISTER } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';

// Type alias for compatibility
type FirebaseUser = FirebaseAuthTypes.User;

interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  firebaseUid: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithPhone: (phoneNumber: string) => Promise<any>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<any>;
  resendEmailVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // GraphQL mutations and queries
  const [verifyFirebaseToken] = useMutation(VERIFY_FIREBASE_TOKEN);
  const [firebaseLogin] = useMutation(FIREBASE_LOGIN);
  const [firebaseRegister] = useMutation(FIREBASE_REGISTER);

  const [getMe] = useLazyQuery(GET_ME);

  const isAuthenticated = !!firebaseUser && !!user;

  // Listen to Firebase auth state changes
  useEffect(() => {
    console.log('🔥 AuthContext: Setting up Firebase auth state listener');
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      console.log('🔥 AuthContext: Firebase auth state changed', {
        hasUser: !!firebaseUser,
        uid: firebaseUser?.uid,
        email: firebaseUser?.email,
        emailVerified: firebaseUser?.emailVerified
      });
      
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        try {
          console.log('🔑 AuthContext: Getting Firebase ID token...');
          // Get Firebase ID token and store it
          const idToken = await firebaseUser.getIdToken();
          console.log('🔑 AuthContext: Firebase ID token obtained, storing in AsyncStorage');
          await AsyncStorage.setItem('firebaseToken', idToken);
          
          console.log('🌐 AuthContext: Calling backend getMe query...');
          // Try to get current user from backend
          const { data } = await getMe();
          console.log('🌐 AuthContext: Backend getMe response:', { hasData: !!data, hasMe: !!data?.me });
          
          if (data?.me) {
            console.log('✅ AuthContext: User found in backend, setting user state');
            setUser(data.me);
          } else {
            console.log('❌ AuthContext: User not found in backend, might need registration');
            // User might need to be registered in backend
            setUser(null);
          }
        } catch (error) {
          console.error('❌ AuthContext: Error handling Firebase auth state change:', error);
          setUser(null);
        }
      } else {
        console.log('🚪 AuthContext: No Firebase user, clearing state');
        setUser(null);
        await AsyncStorage.removeItem('firebaseToken');
      }
      console.log('✅ AuthContext: Setting isLoading to false');
      setIsLoading(false);
    });

    return unsubscribe;
  }, [getMe]);

  // Refresh Firebase token
  const refreshToken = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      const idToken = await currentUser.getIdToken(true); // Force refresh
      await AsyncStorage.setItem('firebaseToken', idToken);

      return { success: true, token: idToken };
    } catch (error: unknown) {
      console.error('Token refresh error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Token refresh failed' };
    }
  };



  const signIn = async (email: string, password: string) => {
    try {
      console.log('🚀 AuthContext.signIn: Starting sign-in process for:', email);
      setIsLoading(true);
      
      console.log('🔥 AuthContext.signIn: Step 1 - Authenticating with Firebase...');
      // 1. Authenticate with Firebase
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('✅ AuthContext.signIn: Firebase authentication successful', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified
      });
      
      console.log('📧 AuthContext.signIn: Step 2 - Checking email verification...');
      // 2. Check if email is verified
      if (!userCredential.user.emailVerified) {
        console.log('❌ AuthContext.signIn: Email not verified');
        throw new Error('Please verify your email before signing in');
      }
      console.log('✅ AuthContext.signIn: Email is verified');
      
      console.log('🔑 AuthContext.signIn: Step 3 - Getting Firebase ID token...');
      // 3. Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      console.log('✅ AuthContext.signIn: Firebase ID token obtained');
      
      console.log('💾 AuthContext.signIn: Step 4 - Storing Firebase token in AsyncStorage...');
      // 4. Store Firebase token
      await AsyncStorage.setItem('firebaseToken', idToken);
      console.log('✅ AuthContext.signIn: Firebase token stored');
      
      console.log('🌐 AuthContext.signIn: Step 5 - Calling verifyFirebaseToken backend mutation...');
      // 5. Verify token and get user info
      const verifyResult = await verifyFirebaseToken({
        variables: { input: { idToken } },
      });
      console.log('🌐 AuthContext.signIn: verifyFirebaseToken response received:', {
        success: verifyResult.data?.verifyFirebaseToken?.success,
        hasDatabaseUser: !!verifyResult.data?.verifyFirebaseToken?.databaseUser,
        hasFirebaseUser: !!verifyResult.data?.verifyFirebaseToken?.firebaseUser
      });
      
      const { success, databaseUser, firebaseUser: fbUser, message } = verifyResult.data.verifyFirebaseToken;
      
      if (success && databaseUser) {
        console.log('✅ AuthContext.signIn: User exists in database, proceeding with firebaseLogin...');
        // User exists in database, login with Firebase UID
        const loginResult = await firebaseLogin({
          variables: { 
            input: { 
              firebaseUid: userCredential.user.uid,
              email: userCredential.user.email,
              phoneNumber: userCredential.user.phoneNumber
            }
          },
        });
        console.log('🌐 AuthContext.signIn: firebaseLogin response received:', {
          success: loginResult.data?.firebaseLogin?.success,
          hasUser: !!loginResult.data?.firebaseLogin?.user,
          hasToken: !!loginResult.data?.firebaseLogin?.token
        });
        
        const loginData = loginResult.data.firebaseLogin;
        if (loginData.success && loginData.user) {
          console.log('💾 AuthContext.signIn: Storing session token and setting user state...');
          await AsyncStorage.setItem('sessionToken', loginData.token);
          setUser(loginData.user);
          console.log('🎉 AuthContext.signIn: User successfully authenticated and logged in!');
          return { success: true, user: loginData.user };
        } else {
          console.log('❌ AuthContext.signIn: firebaseLogin failed:', loginData.message);
          throw new Error(loginData.message || 'Login failed');
        }
      } else if (success && fbUser && !databaseUser) {
        // User exists in Firebase but not in database - needs registration
        console.log('⚠️ AuthContext.signIn: User requires registration in backend');
        return { 
          success: false, 
          requiresRegistration: true,
          firebaseUser: userCredential.user,
          error: 'User not registered. Please complete registration.' 
        };
      } else {
        console.log('❌ AuthContext.signIn: Authentication failed:', message);
        throw new Error(message || 'Authentication failed. Please check your credentials.');
      }
    } catch (error: unknown) {
      console.error('❌ AuthContext.signIn: Error during sign-in process:', error);
      
      let errorMessage = 'An error occurred during sign in';
      
      // Provide user-friendly error messages
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        console.log('🔥 AuthContext.signIn: Firebase error code:', firebaseError.code);
        if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email address. Please sign up first.';
        } else if (firebaseError.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address format.';
        } else if (firebaseError.code === 'auth/user-disabled') {
          errorMessage = 'This account has been disabled. Please contact support.';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed attempts. Please try again later.';
        } else if (firebaseError.message) {
          errorMessage = firebaseError.message;
        } else {
          console.log('🔥 AuthContext.signIn: Other Firebase error:', firebaseError.message);
          errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        }
      } else {
        console.log('❌ AuthContext.signIn: Non-Firebase error:', error);
        errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      }
      
      console.log('❌ AuthContext.signIn: Returning error result:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      console.log('🏁 AuthContext.signIn: Setting isLoading to false');
      setIsLoading(false);
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

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) => {
    try {
      setIsLoading(true);
      
      // 1. Create Firebase user
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // 2. Send email verification
      await userCredential.user.sendEmailVerification();
      
      // 3. Update Firebase user profile
      await userCredential.user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });
      
      // 4. Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // 5. Store Firebase token
      await AsyncStorage.setItem('firebaseToken', idToken);
      
      // 6. Register with backend
      const result = await firebaseRegister({
        variables: {
          input: {
            firebaseUid: userCredential.user.uid,
            firstName,
            lastName,
            email,
            phoneNumber
          }
        }
      });
      
      const { success, user, token, message, error } = result.data.firebaseRegister;
      
      if (success && user) {
        await AsyncStorage.setItem('sessionToken', token);
        setUser(user);
        console.log('User successfully registered and verification email sent');
        return { 
          success: true, 
          message: 'Account created successfully! Please check your email to verify your account before signing in.',
          user 
        };
      } else {
        // If backend registration fails, delete the Firebase user
        await userCredential.user.delete();
        throw new Error(error || message || 'Registration failed. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error signing up:', error);
      
      let errorMessage = 'An error occurred during registration';
      
      // Provide user-friendly error messages
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (firebaseError.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address format.';
        } else if (firebaseError.code === 'auth/operation-not-allowed') {
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
        } else if (firebaseError.message) {
          errorMessage = firebaseError.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear stored tokens
      await AsyncStorage.removeItem('firebaseToken');
      
      // Sign out from Firebase
      await auth().signOut();
      
      // Clear user state
      setUser(null);
      
      console.log('User successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resendEmailVerification = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      if (currentUser.emailVerified) {
        throw new Error('Email is already verified');
      }
      
      await currentUser.sendEmailVerification();
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
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
    refreshToken,
    resendEmailVerification,
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