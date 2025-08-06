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
import { useMutation } from '@apollo/client';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { VERIFY_OTP, RESEND_OTP } from '../graphql/mutations';
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
  const theme = useTheme();
  const { signIn } = useAuth();
  const { phoneNumber, otpId, fromSignup = false } = route.params;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [verifyOTPMutation] = useMutation(VERIFY_OTP, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.verifyOTP.success) {
        if (fromSignup) {
          Alert.alert(
            'Success',
            'Phone number verified successfully! You can now sign in.',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('SignIn'),
              },
            ]
          );
        } else {
          // Login the user if this is for login verification
          if (data.verifyOTP.token && data.verifyOTP.user) {
            signIn(data.verifyOTP.token, data.verifyOTP.user);
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          }
        }
      } else {
        Alert.alert('Error', data.verifyOTP.message || 'OTP verification failed');
      }
    },
    onError: (error) => {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'OTP verification failed');
    },
  });

  const [resendOTPMutation] = useMutation(RESEND_OTP, {
    onCompleted: (data) => {
      setIsResending(false);
      if (data.resendOTP.success) {
        Alert.alert('Success', 'OTP has been resent to your phone number');
        setTimer(60);
        setCanResend(false);
      } else {
        Alert.alert('Error', data.resendOTP.message || 'Failed to resend OTP');
      }
    },
    onError: (error) => {
      setIsResending(false);
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

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

    setIsLoading(true);
    try {
      await verifyOTPMutation({
        variables: {
          input: {
            phoneNumber,
            otp: otpToVerify,
            otpId: otpId || null,
          },
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.error('OTP verification error:', error);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsResending(true);
    try {
      await resendOTPMutation({
        variables: {
          input: {
            phoneNumber,
            otpId: otpId || null,
          },
        },
      });
    } catch (error) {
      setIsResending(false);
      console.error('Resend OTP error:', error);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display (e.g., +1234567890 -> +123 *** **90)
    if (phone.length > 6) {
      return phone.slice(0, 4) + '***' + phone.slice(-2);
    }
    return phone;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="shield-checkmark" size={32} color={theme.colors.textLight} />
          </View>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>Verify OTP</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
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
                  borderColor: digit ? theme.colors.primary : theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
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
            { backgroundColor: theme.colors.primary },
            (isLoading || otp.join('').length !== 6) && styles.disabledButton,
          ]}
          onPress={() => handleVerifyOTP()}
          disabled={isLoading || otp.join('').length !== 6}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.textLight} />
          ) : (
            <Text style={[styles.verifyButtonText, { color: theme.colors.textLight }]}>
              Verify OTP
            </Text>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOTP} disabled={isResending}>
              <Text style={[styles.resendText, { color: theme.colors.primary }]}>
                {isResending ? 'Resending...' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.timerText, { color: theme.colors.textSecondary }]}>
              Resend OTP in {timer}s
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