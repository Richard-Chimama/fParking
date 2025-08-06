// Navigation types
export type RootTabParamList = {
  Home: undefined;
  Map: undefined;
  Bookings: undefined;
  Profile: undefined;
};

// Parking related types
export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  isAvailable: boolean;
  totalSpots: number;
  availableSpots: number;
  features: ParkingFeature[];
  images: string[];
  rating: number;
  reviews: Review[];
}

export interface ParkingFeature {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  parkingSpotId: string;
  parkingSpot: ParkingSpot;
  userId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Enhanced Booking Types
export interface VehicleInfo {
  licensePlate: string;
  vehicleType: string;
  color: string;
  make: string;
  model: string;
}

export interface EnhancedBooking {
  id: string;
  userId: string;
  parkingId: string;
  spaceId: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentId?: string;
  bookingReference: string;
  specialRequests?: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration: number;
  isActive: boolean;
  canCheckIn: boolean;
  canCheckOut: boolean;
  createdAt: string;
  updatedAt: string;
  vehicleInfo?: VehicleInfo;
  payment?: { id: string };
}

// Payment Types
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  transactionId: string;
  providerTransactionId?: string;
  status: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  booking?: EnhancedBooking;
  user?: EnhancedUser;
}

// Waitlist Types
export interface WaitlistEntry {
  id: string;
  userId: string;
  parkingId: string;
  status: string;
  position: number;
  desiredStartTime: string;
  desiredEndTime: string;
  requiredSpaces: number;
  vehicleInfo?: any;
  specialRequests?: string;
  notifiedAt?: string;
  expiresAt?: string;
  convertedAt?: string;
  convertedBookingId?: string;
  notificationHistory?: any;
  createdAt: string;
  updatedAt: string;
}

// Recurring Booking Types
export interface RecurringBooking {
  id: string;
  userId: string;
  parkingId: string;
  pattern: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: number;
  startDate: string;
  endDate: string;
  nextBookingDate?: string;
  maxOccurrences?: number;
  completedOccurrences: number;
  specialRequests?: string;
  basePrice: number;
  currency: string;
  autoPayment: boolean;
  lastBookingCreated?: string;
  pausedAt?: string;
  pauseReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringBookingHistoryItem {
  id: string;
  userId: string;
  parkingId: string;
  spaceId: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentId?: string;
  bookingReference: string;
  specialRequests?: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration: number;
  isActive: boolean;
  canCheckIn: boolean;
  canCheckOut: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  status: string;
  channel: string;
  title: string;
  message: string;
  data?: any;
  imageUrl?: string;
  actionUrl?: string;
  actionText?: string;
  scheduledFor?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  expiresAt?: string;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
  bookingReminders: boolean;
  payment: boolean;
  waitlist: boolean;
  marketing: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

// Enhanced User Types
export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface EnhancedUser {
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
  address?: UserAddress;
  preferences?: UserPreferences;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  isDefault: boolean;
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationWithAddress extends Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

// New Parking Schema Types
export interface ParkingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Parking {
  id: string;
  name: string;
  description: string;
  totalSpaces: number;
  availableSpaces: number;
  coordinates: string | number[]; // Could be "lat,lng" format, GeoJSON, or [lat, lng] array
  address: ParkingAddress;
}

// Enhanced Parking Types
export interface EnhancedParking {
  id: string;
  name: string;
  description: string;
  fullAddress: string;
  totalSpaces: number;
  availableSpaces: number;
  coordinates: string | number[];
  availableSpaceIds: string[];
  hourlyRate: number;
  dailyRate: number;
  currency: string;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  address: ParkingAddress;
}

// Parking Availability Types
export interface ParkingSpace {
  spaceId: string;
  isAvailable: boolean;
  bookedUntil?: string;
  nextAvailableTime?: string;
}

export interface ParkingAvailability {
  parkingId: string;
  totalSpaces: number;
  availableSpaces: number;
  hasAvailability: boolean;
  spaces: ParkingSpace[];
}

export interface AvailabilityCheck {
  isAvailable: boolean;
  availableSpaces: number;
  totalSpaces: number;
  availableCount: number;
  message: string;
}

export interface PricingCalculation {
  baseAmount: number;
  totalAmount: number;
  duration: number;
  currency: string;
}

// Query response types for the new parking schema
export interface ParkingsQueryResponse {
  parkings: Parking[];
  parking: Parking | null;
  nearbyParkings: Parking[];
  parkingsByCity: Parking[];
  availableParkings: EnhancedParking[];
}

// Enhanced Query Response Types
export interface UserQueryResponse {
  me: EnhancedUser;
  user: EnhancedUser;
}

export interface BookingQueryResponse {
  myBookings: EnhancedBooking[];
  booking: EnhancedBooking;
  userBookings: Booking[];
}

export interface PaymentQueryResponse {
  myPayments: Payment[];
  payment: Payment;
}

export interface WaitlistQueryResponse {
  myWaitlistEntries: WaitlistEntry[];
  waitlistHistory: WaitlistEntry[];
  getWaitlistPosition: number;
}

export interface RecurringBookingQueryResponse {
  myRecurringBookings: RecurringBooking[];
  recurringBookingHistory: RecurringBooking[];
  getRecurringBooking: RecurringBooking;
  getRecurringBookingHistory: RecurringBookingHistoryItem[];
  getNextBookingDate: string;
}

export interface NotificationQueryResponse {
  getNotifications: Notification[];
  getNotificationsByType: Notification[];
  getNotification: Notification;
  getNotificationPreferences: NotificationPreferences;
}

export interface AvailabilityQueryResponse {
  checkParkingAvailability?: ParkingAvailability;
  checkAvailability?: AvailabilityCheck;
  calculatePricing?: PricingCalculation;
}

// OTP Verification Types
export interface VerifyOTPInput {
  phoneNumber: string;
  otpCode: string;
}

export interface ResendOTPInput {
  phoneNumber: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  token?: string;
}

// Payment Input Types
export interface CreatePaymentInput {
  bookingId?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
}

export interface VerifyPaymentInput {
  transactionId: string;
  providerTransactionId: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  paymentUrl?: string;
  qrCode?: string;
  payment?: Payment;
}

// Enhanced Booking Input Types
export interface CreateBookingEnhancedInput {
  parkingId: string;
  startTime: string;
  spaceId: string;
  endTime: string;
  vehicleInfo: {
    licensePlate: string;
    vehicleType: string;
    color: string;
    make: string;
    model: string;
  };
  specialRequests?: string;
  paymentMethod?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking?: EnhancedBooking;
}

export interface CancelBookingResponse {
  success: boolean;
  message: string;
}

// Booking Check-in/Check-out Types
export interface CheckInCheckOutResponse {
  success: boolean;
  message: string;
}

export interface ExtendBookingInput {
  bookingId: string;
  newEndTime: string;
  additionalHours?: number;
}

// Waitlist Types
export interface VehicleInfoInput {
  licensePlate: string;
  vehicleType: string;
  color: string;
  make: string;
  model: string;
}

export interface WaitlistResponse {
  id: string;
  userId: string;
  parkingId: string;
  status: string;
  position: number;
  desiredStartTime: string;
  desiredEndTime: string;
  requiredSpaces: number;
  vehicleInfo: VehicleInfoInput;
  specialRequests?: string;
  notifiedAt?: string;
  expiresAt?: string;
  convertedAt?: string;
  convertedBookingId?: string;
  notificationHistory?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistMutationResponse {
  success: boolean;
  message: string;
}

// Recurring Booking Input Types
export interface CreateRecurringBookingInput {
  parkingId: string;
  recurrencePattern: string;
  startTime: string;
  endTime: string;
  duration: number;
  startDate: string;
  endDate?: string;
  maxOccurrences?: number;
  vehicleInfo: VehicleInfoInput;
  specialRequests?: string;
  paymentMethodId?: string;
  autoPayment?: boolean;
}

export interface UpdateRecurringBookingInput {
  recurringBookingId: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  endDate?: string;
  maxOccurrences?: number;
  vehicleInfo?: VehicleInfoInput;
  specialRequests?: string;
  paymentMethodId?: string;
  autoPayment?: boolean;
}

export interface RecurringBookingMutationResponse {
  id: string;
  userId: string;
  parkingId: string;
  pattern: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: number;
  startDate: string;
  endDate?: string;
  nextBookingDate?: string;
  maxOccurrences?: number;
  completedOccurrences: number;
  specialRequests?: string;
  basePrice: number;
  currency: string;
  autoPayment: boolean;
  lastBookingCreated?: string;
  pausedAt?: string;
  pauseReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringBookingActionResponse {
  success: boolean;
  message: string;
}

// Notification Mutation Types
export interface NotificationMutationResponse {
  success: boolean;
  message: string;
}

export interface UpdateNotificationPreferencesInput {
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  bookingReminders?: boolean;
  paymentNotifications?: boolean;
  waitlistNotifications?: boolean;
  marketingNotifications?: boolean;
}

// Input Types
export interface CheckAvailabilityInput {
  parkingId?: string;
  startTime?: string;
  endTime?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}