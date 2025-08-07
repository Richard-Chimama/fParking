import { gql } from '@apollo/client';

export const LOGIN_WITH_VARIABLES = gql`
  mutation LoginWithVariables($phoneNumber: String!, $password: String!) {
    login(input: { phoneNumber: $phoneNumber, password: $password }) {
      success
      message
      token
      user {
        id
        firstName
        lastName
        email
        phoneNumber
        role
        isVerified
        isActive
        profilePicture
        dateOfBirth
        lastLoginAt
        createdAt
        updatedAt
        address {
          street
          city
          state
          zipCode
          country
        }
        preferences {
          notifications
          emailNotifications
          smsNotifications
        }
      }
    }
  }
`;

// New Firebase-based authentication mutations following the updated flow
export const VERIFY_FIREBASE_TOKEN = gql`
  mutation VerifyFirebaseToken($input: VerifyFirebaseTokenInput!) {
    verifyFirebaseToken(input: $input) {
      success
      message
    }
  }
`;

export const FIREBASE_LOGIN = gql`
  mutation FirebaseLogin($input: FirebaseLoginInput!) {
    firebaseLogin(input: $input) {
      success
      message
      token
    }
  }
`;

export const SYNC_FIREBASE_USER = gql`
  mutation SyncFirebaseUser($firebaseUid: String!) {
    syncFirebaseUser(firebaseUid: $firebaseUid) {
      success
      message
      token
    }
  }
`;

export const LINK_FIREBASE_ACCOUNT = gql`
  mutation LinkFirebaseAccount($input: LinkFirebaseAccountInput!) {
    linkFirebaseAccount(input: $input) {
      success
      message
      token
    }
  }
`;

// Note: GET_FIREBASE_USER_INFO is moved to queries.ts as it should be a query, not a mutation

export const REGISTER_WITH_VARIABLES = gql`
  mutation RegisterWithVariables($firstName: String!, $lastName: String!, $phoneNumber: String!, $email: String!, $password: String!) {
    register(
      input: {
        firstName: $firstName
        lastName: $lastName
        phoneNumber: $phoneNumber
        email: $email
        password: $password
      }
    ) {
      success
      message
      token
      user {
        id
        firstName
        lastName
        email
        phoneNumber
        role
        isVerified
        isActive
        profilePicture
        dateOfBirth
        lastLoginAt
        createdAt
        updatedAt
      }
    }
  }
`;

// Keep FIREBASE_REGISTER for initial user creation during sign up
export const FIREBASE_REGISTER = gql`
  mutation FirebaseRegister($input: FirebaseRegisterInput!) {
    firebaseRegister(input: $input) {
      success
      message
      token
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logout {
      success
      message
    }
  }
`;

// User Profile Mutations
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($userId: ID!, $input: UpdateUserInput!) {
    updateUser(id: $userId, input: $input) {
      id
      email
      firstName
      lastName
      phone
      avatar
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($userId: ID!, $file: Upload!) {
    uploadAvatar(userId: $userId, file: $file) {
      id
      avatar
    }
  }
`;

// Booking Mutations
export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      parkingSpotId
      parkingSpot {
        id
        name
        address
        pricePerHour
      }
      userId
      startTime
      endTime
      totalPrice
      status
      createdAt
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingId: ID!) {
    cancelBooking(id: $bookingId) {
      id
      status
      updatedAt
    }
  }
`;

export const EXTEND_BOOKING = gql`
  mutation ExtendBooking($bookingId: ID!, $newEndTime: DateTime!) {
    extendBooking(id: $bookingId, newEndTime: $newEndTime) {
      id
      endTime
      totalPrice
      updatedAt
    }
  }
`;

export const COMPLETE_BOOKING = gql`
  mutation CompleteBooking($bookingId: ID!) {
    completeBooking(id: $bookingId) {
      id
      status
      updatedAt
    }
  }
`;

// Vehicle Mutations
export const ADD_VEHICLE = gql`
  mutation AddVehicle($input: AddVehicleInput!) {
    addVehicle(input: $input) {
      id
      userId
      make
      model
      year
      color
      licensePlate
      isDefault
    }
  }
`;

export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle($vehicleId: ID!, $input: UpdateVehicleInput!) {
    updateVehicle(id: $vehicleId, input: $input) {
      id
      make
      model
      year
      color
      licensePlate
      isDefault
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($vehicleId: ID!) {
    deleteVehicle(id: $vehicleId) {
      success
      message
    }
  }
`;

export const SET_DEFAULT_VEHICLE = gql`
  mutation SetDefaultVehicle($vehicleId: ID!) {
    setDefaultVehicle(id: $vehicleId) {
      id
      isDefault
    }
  }
`;

// Review Mutations
export const ADD_REVIEW = gql`
  mutation AddReview($input: AddReviewInput!) {
    addReview(input: $input) {
      id
      userId
      userName
      parkingSpotId
      rating
      comment
      createdAt
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: ID!, $input: UpdateReviewInput!) {
    updateReview(id: $reviewId, input: $input) {
      id
      rating
      comment
      updatedAt
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(id: $reviewId) {
      success
      message
    }
  }
`;

// Favorite Mutations
export const ADD_FAVORITE = gql`
  mutation AddFavorite($userId: ID!, $parkingSpotId: ID!) {
    addFavorite(userId: $userId, parkingSpotId: $parkingSpotId) {
      id
      userId
      parkingSpotId
      createdAt
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($userId: ID!, $parkingSpotId: ID!) {
    removeFavorite(userId: $userId, parkingSpotId: $parkingSpotId) {
      success
      message
    }
  }
`;

// OTP Verification Mutations
export const SEND_OTP = gql`
  mutation SendOTP($phoneNumber: String!) {
    sendOTP(input: { phoneNumber: $phoneNumber }) {
      success
      message
      token
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOTP($input: VerifyOTPInput!) {
    verifyOTP(input: $input) {
      success
      message
      token
      user {
        id
        firstName
        lastName
        email
        phoneNumber
        role
        isVerified
        isActive
      }
    }
  }
`;

export const RESEND_OTP = gql`
  mutation ResendOTP($input: ResendOTPInput!) {
    resendOTP(input: $input) {
      success
      message
      token
    }
  }
`;

// Payment Mutations
export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      success
      message
      transactionId
      paymentUrl
      qrCode
      payment {
        id
        bookingId
        userId
        amount
        currency
        transactionId
        providerTransactionId
        status
        paidAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($input: VerifyPaymentInput!) {
    verifyPayment(input: $input) {
      success
      message
      transactionId
      paymentUrl
      qrCode
    }
  }
`;

export const RETRY_PAYMENT = gql`
  mutation RetryPayment($transactionId: String!) {
    retryPayment(transactionId: $transactionId) {
      success
      message
      transactionId
      paymentUrl
      qrCode
    }
  }
`;

// Enhanced Booking Mutations
export const CREATE_BOOKING_ENHANCED = gql`
  mutation CreateBookingEnhanced($input: CreateBookingEnhancedInput!) {
    createBooking(input: $input) {
      success
      message
      booking {
        id
        userId
        parkingId
        spaceId
        startTime
        endTime
        status
        totalAmount
        paymentStatus
        paymentId
        bookingReference
        specialRequests
        checkInTime
        checkOutTime
        duration
        isActive
        canCheckIn
        canCheckOut
        createdAt
        updatedAt
      }
    }
  }
`;

export const CANCEL_BOOKING_ENHANCED = gql`
  mutation CancelBookingEnhanced($bookingId: ID!, $reason: String) {
    cancelBooking(bookingId: $bookingId, reason: $reason) {
      success
      message
    }
  }
`;

// Booking Check-in/Check-out Mutations
export const CHECK_IN_BOOKING = gql`
  mutation CheckInBooking($bookingId: ID!) {
    checkInBooking(bookingId: $bookingId) {
      success
      message
    }
  }
`;

export const CHECK_OUT_BOOKING = gql`
  mutation CheckOutBooking($bookingId: ID!) {
    checkOutBooking(bookingId: $bookingId) {
      success
      message
    }
  }
`;

export const EXTEND_BOOKING_ENHANCED = gql`
  mutation ExtendBookingEnhanced($input: ExtendBookingInput!) {
    extendBooking(input: $input) {
      success
      message
    }
  }
`;

// Waitlist Mutations
export const JOIN_WAITLIST = gql`
  mutation JoinWaitlist(
    $parkingId: ID!
    $desiredStartTime: DateTime!
    $desiredEndTime: DateTime!
    $requiredSpaces: Int!
    $vehicleInfo: VehicleInfoInput!
    $specialRequests: String
  ) {
    joinWaitlist(
      parkingId: $parkingId
      desiredStartTime: $desiredStartTime
      desiredEndTime: $desiredEndTime
      requiredSpaces: $requiredSpaces
      vehicleInfo: $vehicleInfo
      specialRequests: $specialRequests
    ) {
      id
      userId
      parkingId
      status
      position
      desiredStartTime
      desiredEndTime
      requiredSpaces
      vehicleInfo
      specialRequests
      notifiedAt
      expiresAt
      convertedAt
      convertedBookingId
      notificationHistory
      createdAt
      updatedAt
    }
  }
`;

export const LEAVE_WAITLIST = gql`
  mutation LeaveWaitlist($waitlistId: ID!) {
    leaveWaitlist(waitlistId: $waitlistId) {
      success
      message
    }
  }
`;

export const CONVERT_WAITLIST_TO_BOOKING = gql`
  mutation ConvertWaitlistToBooking($waitlistId: ID!) {
    convertWaitlistToBooking(waitlistId: $waitlistId) {
      success
      message
    }
  }
`;

// Recurring Booking Mutations
export const CREATE_RECURRING_BOOKING = gql`
  mutation CreateRecurringBooking(
    $parkingId: ID!
    $recurrencePattern: String!
    $startTime: String!
    $endTime: String!
    $duration: Int!
    $startDate: Date!
    $endDate: Date
    $maxOccurrences: Int
    $vehicleInfo: VehicleInfoInput!
    $specialRequests: String
    $paymentMethodId: String
    $autoPayment: Boolean
  ) {
    createRecurringBooking(
      parkingId: $parkingId
      recurrencePattern: $recurrencePattern
      startTime: $startTime
      endTime: $endTime
      duration: $duration
      startDate: $startDate
      endDate: $endDate
      maxOccurrences: $maxOccurrences
      vehicleInfo: $vehicleInfo
      specialRequests: $specialRequests
      paymentMethodId: $paymentMethodId
      autoPayment: $autoPayment
    ) {
      id
      userId
      parkingId
      pattern
      status
      startTime
      endTime
      duration
      startDate
      endDate
      nextBookingDate
      maxOccurrences
      completedOccurrences
      specialRequests
      basePrice
      currency
      autoPayment
      lastBookingCreated
      pausedAt
      pauseReason
      createdAt
      updatedAt
    }
  }
`;

export const PAUSE_RECURRING_BOOKING = gql`
  mutation PauseRecurringBooking($recurringBookingId: ID!) {
    pauseRecurringBooking(recurringBookingId: $recurringBookingId) {
      success
      message
    }
  }
`;

export const RESUME_RECURRING_BOOKING = gql`
  mutation ResumeRecurringBooking($recurringBookingId: ID!) {
    resumeRecurringBooking(recurringBookingId: $recurringBookingId) {
      success
      message
    }
  }
`;

export const CANCEL_RECURRING_BOOKING = gql`
  mutation CancelRecurringBooking($recurringBookingId: ID!) {
    cancelRecurringBooking(recurringBookingId: $recurringBookingId) {
      success
      message
    }
  }
`;

export const UPDATE_RECURRING_BOOKING = gql`
  mutation UpdateRecurringBooking(
    $recurringBookingId: ID!
    $startTime: String
    $endTime: String
    $duration: Int
    $endDate: Date
    $maxOccurrences: Int
    $vehicleInfo: VehicleInfoInput
    $specialRequests: String
    $paymentMethodId: String
    $autoPayment: Boolean
  ) {
    updateRecurringBooking(
      recurringBookingId: $recurringBookingId
      startTime: $startTime
      endTime: $endTime
      duration: $duration
      endDate: $endDate
      maxOccurrences: $maxOccurrences
      vehicleInfo: $vehicleInfo
      specialRequests: $specialRequests
      paymentMethodId: $paymentMethodId
      autoPayment: $autoPayment
    ) {
      id
      userId
      parkingId
      pattern
      status
      startTime
      endTime
      duration
      startDate
      endDate
      nextBookingDate
      maxOccurrences
      completedOccurrences
      specialRequests
      basePrice
      currency
      autoPayment
      lastBookingCreated
      pausedAt
      pauseReason
      createdAt
      updatedAt
    }
  }
`;

// Notification Mutations
export const UPDATE_FCM_TOKEN = gql`
  mutation UpdateFCMToken($fcmToken: String!) {
    updateFCMToken(fcmToken: $fcmToken) {
      success
      message
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      success
      message
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      success
      message
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId) {
      success
      message
    }
  }
`;

export const CLEAR_ALL_NOTIFICATIONS = gql`
  mutation ClearAllNotifications {
    clearAllNotifications {
      success
      message
    }
  }
`;

export const UPDATE_NOTIFICATION_PREFERENCES = gql`
  mutation UpdateNotificationPreferences(
    $pushNotifications: Boolean
    $emailNotifications: Boolean
    $smsNotifications: Boolean
    $bookingReminders: Boolean
    $paymentNotifications: Boolean
    $waitlistNotifications: Boolean
    $marketingNotifications: Boolean
  ) {
    updateNotificationPreferences(
      pushNotifications: $pushNotifications
      emailNotifications: $emailNotifications
      smsNotifications: $smsNotifications
      bookingReminders: $bookingReminders
      paymentNotifications: $paymentNotifications
      waitlistNotifications: $waitlistNotifications
      marketingNotifications: $marketingNotifications
    ) {
      success
      message
    }
  }
`;