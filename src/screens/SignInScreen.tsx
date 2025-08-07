import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface SignInScreenProps {
  navigation: any;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { signIn, signInWithPhone } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string) => {
    // Basic phone number validation (starts with + and contains only digits)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const getInputType = (input: string) => {
    if (isValidEmail(input)) return 'email';
    if (isValidPhoneNumber(input)) return 'phone';
    return 'unknown';
  };

  const handleSignIn = async () => {
    if (!emailOrPhone.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const inputType = getInputType(emailOrPhone.trim());
    
    if (inputType === 'unknown') {
      Alert.alert('Error', 'Please enter a valid email address or phone number (format: +1234567890)');
      return;
    }

    setIsLoading(true);
    try {
      if (inputType === 'phone') {
        // Handle phone authentication
        try {
          const confirmation = await signInWithPhone(emailOrPhone.trim());
          setConfirmResult(confirmation);
          setIsPhoneAuth(true);
          Alert.alert('Verification Code Sent', 'Please enter the verification code sent to your phone');
        } catch (phoneError: any) {
          if (phoneError.message.includes('additional setup')) {
            Alert.alert('Feature Not Available', 'Phone authentication is not yet fully implemented. Please use email authentication.');
          } else {
            Alert.alert('Error', 'Failed to send verification code. Please try again.');
          }
        }
      } else {
        // Handle email authentication
        await signIn(emailOrPhone.trim(), password);
        Alert.alert('Success', 'Login successful!');
        // Navigation will be handled automatically by the AuthContext
      }
    } catch (error: any) {
      let errorMessage = 'Login failed';
      if (error.message === 'PHONE_AUTH_REQUIRED') {
        // This shouldn't happen now, but keeping for safety
        Alert.alert('Info', 'Phone authentication detected. Please use the phone verification flow.');
        return;
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (error.message.includes('Invalid email or phone number format')) {
        errorMessage = 'Please enter a valid email or phone number';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (!confirmResult) {
      Alert.alert('Error', 'No verification in progress');
      return;
    }

    setIsLoading(true);
    try {
      await confirmResult.confirm(verificationCode.trim());
      Alert.alert('Success', 'Phone verification successful!');
      // Reset state
      setIsPhoneAuth(false);
      setConfirmResult(null);
      setVerificationCode('');
    } catch (error: any) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmailOrPhone('demo@example.com');
    setPassword('password123');
  };

  const handleBackToLogin = () => {
    setIsPhoneAuth(false);
    setConfirmResult(null);
    setVerificationCode('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo and Title */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="car" size={32} color={theme.colors.textLight} />
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>ParkEasy</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Find and book parking spots instantly
            </Text>
          </View>

          {/* Sign In Form */}
          <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.formTitle, { color: theme.colors.text }]}>Sign In</Text>

            {/* Email or Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email or Phone</Text>
              <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                <Ionicons
                  name={getInputType(emailOrPhone) === 'phone' ? 'call-outline' : 'mail-outline'}
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  placeholder="Enter your email or phone (+1234567890)"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={emailOrPhone}
                  onChangeText={setEmailOrPhone}
                  keyboardType={getInputType(emailOrPhone) === 'phone' ? 'phone-pad' : 'email-address'}
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            {!isPhoneAuth && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Password</Text>
                <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: theme.colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Verification Code Input */}
            {isPhoneAuth && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Verification Code</Text>
                <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                  <Ionicons
                    name="keypad-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: theme.colors.text }]}
                    placeholder="Enter verification code"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    maxLength={6}
                    editable={!isLoading}
                  />
                </View>
              </View>
            )}

            {/* Sign In Button */}
            {!isPhoneAuth ? (
              <TouchableOpacity
                style={[
                  styles.signInButton,
                  { backgroundColor: theme.colors.primary },
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                <Text style={[styles.signInButtonText, { color: theme.colors.textLight }]}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.signInButton,
                    { backgroundColor: theme.colors.primary },
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={handleVerifyCode}
                  disabled={isLoading}
                >
                  <Text style={[styles.signInButtonText, { color: theme.colors.textLight }]}>
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.signInButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary, marginTop: 12 }]}
                  onPress={handleBackToLogin}
                  disabled={isLoading}
                >
                  <Text style={[styles.signInButtonText, { color: theme.colors.primary }]}>Back to Login</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Demo Credentials */}
            <TouchableOpacity onPress={handleDemoLogin} style={styles.demoContainer}>
              <Text style={[styles.demoText, { color: theme.colors.textSecondary }]}>
                Demo credentials: demo@example.com / password123
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, { color: theme.colors.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={[styles.signUpLink, { color: theme.colors.primary }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F8F9FA',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  eyeIcon: {
    padding: 4,
  },
  signInButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  demoContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 14,
    textAlign: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 16,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignInScreen;