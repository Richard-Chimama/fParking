import { gql } from '@apollo/client';

// User Queries
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

// Parking Spot Queries
export const GET_PARKING_SPOTS = gql`
  query GetParkingSpots($latitude: Float!, $longitude: Float!, $radius: Float!) {
    parkingSpots(latitude: $latitude, longitude: $longitude, radius: $radius) {
      id
      name
      address
      latitude
      longitude
      pricePerHour
      isAvailable
      totalSpots
      availableSpots
      rating
      features {
        id
        name
        icon
      }
      images
    }
  }
`;

export const GET_PARKING_SPOT_DETAILS = gql`
  query GetParkingSpotDetails($spotId: ID!) {
    parkingSpot(id: $spotId) {
      id
      name
      address
      latitude
      longitude
      pricePerHour
      isAvailable
      totalSpots
      availableSpots
      rating
      features {
        id
        name
        icon
      }
      images
      reviews {
        id
        userId
        userName
        rating
        comment
        createdAt
      }
    }
  }
`;

// Booking Queries
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

// Search Queries
export const SEARCH_PARKING_SPOTS = gql`
  query SearchParkingSpots(
    $query: String!
    $latitude: Float
    $longitude: Float
    $maxPrice: Float
    $features: [String!]
  ) {
    searchParkingSpots(
      query: $query
      latitude: $latitude
      longitude: $longitude
      maxPrice: $maxPrice
      features: $features
    ) {
      id
      name
      address
      latitude
      longitude
      pricePerHour
      isAvailable
      totalSpots
      availableSpots
      rating
      features {
        id
        name
        icon
      }
      images
    }
  }
`;