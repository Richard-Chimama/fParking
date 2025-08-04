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