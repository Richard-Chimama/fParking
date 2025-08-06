import { gql } from '@apollo/client';

// User Queries
export const GET_ME = gql`
  query GetMe {
    me {
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
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      id
      email
      firstName
      lastName
      phone
      avatar
      createdAt
    }
  }
`;

// Main Parking Queries (New Schema)
export const GET_ALL_PARKINGS = gql`
  query GetAllParkings {
    parkings {
      id
      name
      description
      totalSpaces
      availableSpaces
      coordinates
      address {
        street
        city
        state
        zipCode
        country
      }
    }
  }
`;

export const GET_PARKING_BY_ID = gql`
  query GetParkingById($id: ID!) {
    parking(id: $id) {
      id
      name
      description
      totalSpaces
      availableSpaces
      coordinates
      address {
        street
        city
        state
        zipCode
        country
      }
    }
  }
`;

export const GET_AVAILABLE_PARKINGS = gql`
  query GetAvailableParkings(
    $maxDistance: Float
    $endTime: String
    $startTime: String
    $longitude: Float
    $latitude: Float
  ) {
    availableParkings(
      maxDistance: $maxDistance
      endTime: $endTime
      startTime: $startTime
      longitude: $longitude
      latitude: $latitude
    ) {
      id
      name
      description
      fullAddress
      totalSpaces
      availableSpaces
      coordinates
      availableSpaceIds
      hourlyRate
      dailyRate
      currency
      isActive
      isVerified
      rating
      totalReviews
      createdAt
      updatedAt
      address {
        street
        city
        state
        zipCode
        country
      }
    }
  }
`;

export const GET_NEARBY_PARKINGS = gql`
  query GetNearbyParkings($maxDistance: Float!, $longitude: Float!, $latitude: Float!) {
    nearbyParkings(maxDistance: $maxDistance, longitude: $longitude, latitude: $latitude) {
      id
      name
      description
      totalSpaces
      availableSpaces
      coordinates
      address {
        street
        city
        state
        zipCode
        country
      }
    }
  }
`;

export const GET_PARKINGS_BY_CITY = gql`
  query GetParkingsByCity($city: String!) {
    parkingsByCity(city: $city) {
      id
      name
      description
      totalSpaces
      availableSpaces
      coordinates
      address {
        street
        city
        state
        zipCode
        country
      }
    }
  }
`;

// Legacy Booking Queries (kept for backward compatibility)
export const GET_USER_BOOKINGS = gql`
  query GetUserBookings($userId: ID!, $status: BookingStatus) {
    userBookings(userId: $userId, status: $status) {
      id
      parkingSpotId
      parkingSpot {
        id
        name
        address
        latitude
        longitude
        pricePerHour
      }
      startTime
      endTime
      totalPrice
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_BOOKING_DETAILS = gql`
  query GetBookingDetails($bookingId: ID!) {
    booking(id: $bookingId) {
      id
      parkingSpotId
      parkingSpot {
        id
        name
        address
        latitude
        longitude
        pricePerHour
        features {
          id
          name
          icon
        }
      }
      userId
      startTime
      endTime
      totalPrice
      status
      createdAt
      updatedAt
    }
  }
`;

// Vehicle Queries
export const GET_USER_VEHICLES = gql`
  query GetUserVehicles($userId: ID!) {
    userVehicles(userId: $userId) {
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

// Search Queries (Updated for new schema)
export const SEARCH_PARKINGS = gql`
  query SearchParkings(
    $query: String!
    $latitude: Float
    $longitude: Float
    $city: String
  ) {
    parkings {
      id
      name
      description
      totalSpaces
      availableSpaces
      coordinates
      address {
        street
        city
        state
        zipCode
        country
      }
    }
  }
`;

// Parking Availability Queries
export const CHECK_PARKING_AVAILABILITY = gql`
  query CheckParkingAvailability($input: CheckAvailabilityInput) {
    checkParkingAvailability(input: $input) {
      parkingId
      totalSpaces
      availableSpaces
      hasAvailability
      spaces {
        spaceId
        isAvailable
        bookedUntil
        nextAvailableTime
      }
    }
  }
`;

export const CHECK_AVAILABILITY = gql`
  query CheckAvailability(
    $endTime: String
    $startTime: String
    $parkingId: ID
  ) {
    checkAvailability(
      endTime: $endTime
      startTime: $startTime
      parkingId: $parkingId
    ) {
      isAvailable
      availableSpaces
      totalSpaces
      availableCount
      message
    }
  }
`;

export const CALCULATE_PRICING = gql`
  query CalculatePricing(
    $endTime: String
    $startTime: String
    $parkingId: ID
  ) {
    calculatePricing(
      endTime: $endTime
      startTime: $startTime
      parkingId: $parkingId
    ) {
      baseAmount
      totalAmount
      duration
      currency
    }
  }
`;

// Enhanced Booking Queries
export const GET_MY_BOOKINGS = gql`
  query GetMyBookings($offset: Int, $limit: Int) {
    myBookings(offset: $offset, limit: $limit) {
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
      vehicleInfo {
        licensePlate
        vehicleType
        color
        make
        model
      }
    }
  }
`;

export const GET_BOOKING = gql`
  query GetBooking($reference: String, $id: ID) {
    booking(reference: $reference, id: $id) {
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
`;

// Payment Queries
export const GET_MY_PAYMENTS = gql`
  query GetMyPayments($offset: Int, $limit: Int) {
    myPayments(offset: $offset, limit: $limit) {
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
        vehicleInfo {
          licensePlate
          vehicleType
          color
          make
          model
        }
        payment {
          id
        }
      }
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

export const GET_PAYMENT = gql`
  query GetPayment($transactionId: String) {
    payment(transactionId: $transactionId) {
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
`;

// Waitlist Queries
export const GET_MY_WAITLIST_ENTRIES = gql`
  query GetMyWaitlistEntries {
    myWaitlistEntries {
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

export const GET_WAITLIST_HISTORY = gql`
  query GetWaitlistHistory {
    waitlistHistory {
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

export const GET_WAITLIST_POSITION = gql`
  query GetWaitlistPosition($waitlistId: ID) {
    getWaitlistPosition(waitlistId: $waitlistId)
  }
`;

// Recurring Bookings Queries
export const GET_MY_RECURRING_BOOKINGS = gql`
  query GetMyRecurringBookings {
    myRecurringBookings {
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

export const GET_RECURRING_BOOKING_HISTORY = gql`
  query GetRecurringBookingHistory {
    recurringBookingHistory {
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

export const GET_RECURRING_BOOKING = gql`
  query GetRecurringBooking($recurringBookingId: ID) {
    getRecurringBooking(recurringBookingId: $recurringBookingId) {
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

export const GET_RECURRING_BOOKING_HISTORY_BY_ID = gql`
  query GetRecurringBookingHistoryById($recurringBookingId: ID) {
    getRecurringBookingHistory(recurringBookingId: $recurringBookingId) {
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
`;

export const GET_NEXT_BOOKING_DATE = gql`
  query GetNextBookingDate($recurringBookingId: ID) {
    getNextBookingDate(recurringBookingId: $recurringBookingId)
  }
`;

// Notification Queries
export const GET_NOTIFICATIONS = gql`
  query GetNotifications($unreadOnly: Boolean, $offset: Int, $limit: Int) {
    getNotifications(unreadOnly: $unreadOnly, offset: $offset, limit: $limit) {
      id
      userId
      type
      status
      channel
      title
      message
      data
      imageUrl
      actionUrl
      actionText
      scheduledFor
      sentAt
      deliveredAt
      readAt
      expiresAt
      retryCount
      maxRetries
      nextRetryAt
      failureReason
      createdAt
      updatedAt
    }
  }
`;

export const GET_NOTIFICATIONS_BY_TYPE = gql`
  query GetNotificationsByType($offset: Int, $limit: Int, $type: String) {
    getNotificationsByType(offset: $offset, limit: $limit, type: $type) {
      id
      userId
      type
      status
      channel
      title
      message
      data
      imageUrl
      actionUrl
      actionText
      scheduledFor
      sentAt
      deliveredAt
      readAt
      expiresAt
      retryCount
      maxRetries
      nextRetryAt
      failureReason
      createdAt
      updatedAt
    }
  }
`;

export const GET_NOTIFICATION = gql`
  query GetNotification($notificationId: ID) {
    getNotification(notificationId: $notificationId) {
      id
      userId
      type
      status
      channel
      title
      message
      data
      imageUrl
      actionUrl
      actionText
      scheduledFor
      sentAt
      deliveredAt
      readAt
      expiresAt
      retryCount
      maxRetries
      nextRetryAt
      failureReason
      createdAt
      updatedAt
    }
  }
`;

export const GET_NOTIFICATION_PREFERENCES = gql`
  query GetNotificationPreferences {
    getNotificationPreferences {
      notifications
      emailNotifications
      smsNotifications
      push
      email
      sms
      bookingReminders
      payment
      waitlist
      marketing
    }
  }
`;