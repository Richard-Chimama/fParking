import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_BOOKINGS } from '../graphql/queries';
import { CREATE_BOOKING, CANCEL_BOOKING, EXTEND_BOOKING } from '../graphql/mutations';
import { Booking, BookingStatus } from '../types';

interface UseBookingsResult {
  bookings: Booking[];
  loading: boolean;
  error: any;
  refetch: () => void;
  createBooking: (input: CreateBookingInput) => Promise<any>;
  cancelBooking: (bookingId: string) => Promise<any>;
  extendBooking: (bookingId: string, newEndTime: string) => Promise<any>;
  creatingBooking: boolean;
  cancellingBooking: boolean;
  extendingBooking: boolean;
}

interface CreateBookingInput {
  parkingSpotId: string;
  startTime: string;
  endTime: string;
  vehicleId?: string;
}

export const useBookings = (userId: string, status?: BookingStatus): UseBookingsResult => {
  // Query for fetching bookings
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_USER_BOOKINGS, {
    variables: { userId, status },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  // Mutation for creating a booking
  const [createBookingMutation, { loading: creatingBooking }] = useMutation(CREATE_BOOKING, {
    refetchQueries: [{ query: GET_USER_BOOKINGS, variables: { userId } }],
    awaitRefetchQueries: true,
  });

  // Mutation for cancelling a booking
  const [cancelBookingMutation, { loading: cancellingBooking }] = useMutation(CANCEL_BOOKING, {
    refetchQueries: [{ query: GET_USER_BOOKINGS, variables: { userId } }],
    awaitRefetchQueries: true,
  });

  // Mutation for extending a booking
  const [extendBookingMutation, { loading: extendingBooking }] = useMutation(EXTEND_BOOKING, {
    refetchQueries: [{ query: GET_USER_BOOKINGS, variables: { userId } }],
    awaitRefetchQueries: true,
  });

  const createBooking = async (input: CreateBookingInput) => {
    try {
      const result = await createBookingMutation({
        variables: { input },
      });
      return result.data.createBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const result = await cancelBookingMutation({
        variables: { bookingId },
      });
      return result.data.cancelBooking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  };

  const extendBooking = async (bookingId: string, newEndTime: string) => {
    try {
      const result = await extendBookingMutation({
        variables: { bookingId, newEndTime },
      });
      return result.data.extendBooking;
    } catch (error) {
      console.error('Error extending booking:', error);
      throw error;
    }
  };

  return {
    bookings: data?.userBookings || [],
    loading,
    error,
    refetch,
    createBooking,
    cancelBooking,
    extendBooking,
    creatingBooking,
    cancellingBooking,
    extendingBooking,
  };
};