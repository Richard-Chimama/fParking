import { gql } from '@apollo/client';

// Authentication Mutations
export const LOGIN_USER = gql`
  mutation Login {
    login(input: { phoneNumber: "+260977123456", password: "password123" }) {
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

export const REGISTER_USER = gql`
  mutation Register {
    register(
      input: {
        firstName: null
        lastName: null
        phoneNumber: null
        email: null
        password: null
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