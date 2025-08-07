import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

interface OTPVerificationScreenProps {
  navigation: OTPVerificationScreenNavigationProp;
  route: OTPVerificationScreenRouteProp;
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { signIn, signUp, signInWithPhone } = useAuth();
  const { phoneNumber, confirmation: initialConfirmation, otpId, fromSignup } = route.params;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [confirmation, setConfirmation] = useState(initialConfirmation);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const verifyOTP = async () => {
    try {
      setIsLoading(true);
      const otpCode = otp.join('');
      
      if (confirmation) {
        // Use Firebase confirmation to verify OTP
        const result = await confirmation.confirm(otpCode);
        
        if (fromSignup) {
          try {
            // Retrieve stored signup details
            const storedDetails = await AsyncStorage.getItem('pendingSignupDetails');
            if (storedDetails) {
              const userDetails = JSON.parse(storedDetails);
              
              // Complete the signup process
              await signUp(
                userDetails.phoneNumber, // Use phone number as identifier
                userDetails.password,
                userDetails.firstName,
                userDetails.lastName
              );
              
              // Clear stored details
              await AsyncStorage.removeItem('pendingSignupDetails');
              
              Alert.alert(
                'Success',
                'Account created successfully! You can now sign in with your phone number.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('SignIn'),
                  },
                ]
              );
            } else {
              Alert.alert('Error', 'Signup details not found. Please try again.');
              navigation.navigate('SignUp');
            }
          } catch (error) {
            console.error('Error completing signup:', error);
            Alert.alert('Error', 'Failed to complete signup. Please try again.');
          }
        } else {
          // User is already signed in via Firebase, navigate to main app
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        }
      } else {
        Alert.alert('Error', 'No confirmation object available');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setIsResending(true);
      
      // Use Firebase to resend OTP
      const newConfirmation = await signInWithPhone(phoneNumber);
      
      // Update the confirmation object in state
      setConfirmation(newConfirmation);
      
      setResendTimer(60);
      setCanResend(false);
      Alert.alert('Success', 'Verification code has been resent to your phone.');
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join('');
    
    if (otpToVerify.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    await verifyOTP();
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    await resendOTP();
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display (e.g., +1234567890 -> +123 *** **90)
    if (phone.length > 6) {
      return phone.slice(0, 4) + '***' + phone.slice(-2);
    }
    return phone;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="shield-checkmark" size={32} color={colors.textLight} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>Verify OTP</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We've sent a 6-digit code to{' \n'}
            <Text style={{ fontWeight: '600' }}>{formatPhoneNumber(phoneNumber)}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
              style={[
                styles.otpInput,
                {
                  borderColor: digit ? colors.primary : colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text,
                },
              ]}
              value={digit}
              onChangeText={(value) => handleOTPChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { backgroundColor: colors.primary },
            (isLoading || otp.join('').length !== 6) && styles.disabledButton,
          ]}
          onPress={() => handleVerifyOTP()}
          disabled={isLoading || otp.join('').length !== 6}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textLight} />
          ) : (
            <Text style={[styles.verifyButtonText, { color: colors.textLight }]}>
              Verify OTP
            </Text>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOTP} disabled={isResending}>
              <Text style={[styles.resendText, { color: colors.primary }]}>
                {isResending ? 'Resending...' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.timerText, { color: colors.textSecondary }]}>
              Resend OTP in {resendTimer}s
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
  },
  verifyButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 16,
  },
});

export default OTPVerificationScreen;