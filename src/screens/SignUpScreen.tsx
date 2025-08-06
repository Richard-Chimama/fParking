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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@apollo/client';
import { REGISTER_WITH_VARIABLES, SEND_OTP } from '../graphql/mutations';
import { useTheme } from '../theme/ThemeProvider';

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [registerMutation] = useMutation(REGISTER_WITH_VARIABLES, {
    onCompleted: (data) => {
      if (data.register.success) {
        // After successful registration, send OTP
        sendOTPMutation({
          variables: {
            input: {
              phoneNumber: phoneNumber.trim(),
              purpose: 'PHONE_VERIFICATION',
            },
          },
        });
      } else {
        setIsLoading(false);
        Alert.alert('Error', data.register.message || 'Registration failed');
      }
    },
    onError: (error) => {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Registration failed');
    },
  });

  const [sendOTPMutation] = useMutation(SEND_OTP, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.sendOTP.success) {
        Alert.alert(
          'Account Created!',
          'Please verify your phone number to complete registration.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('OTPVerification', {
                phoneNumber: phoneNumber.trim(),
                otpId: data.sendOTP.otpId,
                fromSignup: true,
              }),
            },
          ]
        );
      } else {
        Alert.alert('Error', data.sendOTP.message || 'Failed to send OTP');
      }
    },
    onError: (error) => {
       setIsLoading(false);
       Alert.alert('Error', error.message || 'Failed to send OTP');
     },
   });

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await registerMutation({
        variables: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: phoneNumber.trim(),
          password: password.trim(),
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Logo and Title */}
            <View style={styles.header}>
              <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="car" size={32} color={theme.colors.textLight} />
              </View>
              <Text style={[styles.title, { color: theme.colors.text }]}>ParkEasy</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Create your account to get started
              </Text>
            </View>

            {/* Sign Up Form */}
            <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.formTitle, { color: theme.colors.text }]}>Sign Up</Text>

              {/* Name Inputs */}
              <View style={styles.nameRow}>
                <View style={[styles.inputGroup, styles.nameInput]}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>First Name</Text>
                  <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.textInput, { color: theme.colors.text }]}
                      placeholder="John"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, styles.nameInput]}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Last Name</Text>
                  <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.textInput, { color: theme.colors.text }]}
                      placeholder="Doe"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email</Text>
                <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: theme.colors.text }]}
                    placeholder="john.doe@example.com"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Phone Number</Text>
                <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: theme.colors.text }]}
                    placeholder="+1 (555) 123-4567"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
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

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Confirm Password</Text>
                <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: theme.colors.text }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  { backgroundColor: theme.colors.primary },
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={[styles.signUpButtonText, { color: theme.colors.textLight }]}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={[styles.signInText, { color: theme.colors.textSecondary }]}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                  <Text style={[styles.signInLink, { color: theme.colors.primary }]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 4,
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
  signUpButton: {
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
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 16,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpScreen;