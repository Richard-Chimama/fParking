import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking, BookingStatus } from '../types';

const BookingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      parkingSpotId: '1',
      parkingSpot: {
        id: '1',
        name: 'Downtown Mall',
        address: '123 Main St',
        latitude: 37.7749,
        longitude: -122.4194,
        pricePerHour: 5.50,
        isAvailable: true,
        totalSpots: 50,
        availableSpots: 12,
        features: [],
        images: [],
        rating: 4.5,
        reviews: [],
      },
      userId: 'user1',
      startTime: '2024-01-15T14:00:00Z',
      endTime: '2024-01-15T16:00:00Z',
      totalPrice: 11.00,
      status: BookingStatus.ACTIVE,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      parkingSpotId: '2',
      parkingSpot: {
        id: '2',
        name: 'City Center Garage',
        address: '456 Oak Ave',
        latitude: 37.7849,
        longitude: -122.4094,
        pricePerHour: 8.00,
        isAvailable: true,
        totalSpots: 100,
        availableSpots: 25,
        features: [],
        images: [],
        rating: 4.2,
        reviews: [],
      },
      userId: 'user1',
      startTime: '2024-01-14T10:00:00Z',
      endTime: '2024-01-14T12:00:00Z',
      totalPrice: 16.00,
      status: BookingStatus.COMPLETED,
      createdAt: '2024-01-14T08:00:00Z',
      updatedAt: '2024-01-14T12:00:00Z',
    },
    {
      id: '3',
      parkingSpotId: '1',
      parkingSpot: {
        id: '1',
        name: 'Downtown Mall',
        address: '123 Main St',
        latitude: 37.7749,
        longitude: -122.4194,
        pricePerHour: 5.50,
        isAvailable: true,
        totalSpots: 50,
        availableSpots: 12,
        features: [],
        images: [],
        rating: 4.5,
        reviews: [],
      },
      userId: 'user1',
      startTime: '2024-01-16T09:00:00Z',
      endTime: '2024-01-16T11:00:00Z',
      totalPrice: 11.00,
      status: BookingStatus.CONFIRMED,
      createdAt: '2024-01-15T15:00:00Z',
      updatedAt: '2024-01-15T15:00:00Z',
    },
  ]);

  const upcomingBookings = bookings.filter(
    booking => booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.ACTIVE
  );
  
  const pastBookings = bookings.filter(
    booking => booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACTIVE:
        return '#34C759';
      case BookingStatus.CONFIRMED:
        return '#007AFF';
      case BookingStatus.COMPLETED:
        return '#666';
      case BookingStatus.CANCELLED:
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => console.log('Cancel booking:', bookingId),
        },
      ]
    );
  };

  const handleExtendBooking = (bookingId: string) => {
    console.log('Extend booking:', bookingId);
  };

  const renderBookingCard = (booking: Booking) => (
    <View key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{booking.parkingSpot.name}</Text>
          <Text style={styles.locationAddress}>{booking.parkingSpot.address}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.timeInfo}>
          <View style={styles.timeItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.timeLabel}>Date</Text>
            <Text style={styles.timeValue}>{formatDate(booking.startTime)}</Text>
          </View>
          <View style={styles.timeItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.timeLabel}>Time</Text>
            <Text style={styles.timeValue}>
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </Text>
          </View>
          <View style={styles.timeItem}>
            <Ionicons name="card-outline" size={16} color="#666" />
            <Text style={styles.timeLabel}>Total</Text>
            <Text style={styles.priceValue}>${booking.totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      
      {booking.status === BookingStatus.ACTIVE && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.extendButton]}
            onPress={() => handleExtendBooking(booking.id)}
          >
            <Ionicons name="add-circle-outline" size={16} color="#007AFF" />
            <Text style={styles.extendButtonText}>Extend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelBooking(booking.id)}
          >
            <Ionicons name="close-circle-outline" size={16} color="#FF3B30" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {booking.status === BookingStatus.CONFIRMED && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelBooking(booking.id)}
          >
            <Ionicons name="close-circle-outline" size={16} color="#FF3B30" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'upcoming' ? (
          upcomingBookings.length > 0 ? (
            upcomingBookings.map(renderBookingCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#CCC" />
              <Text style={styles.emptyTitle}>No Upcoming Bookings</Text>
              <Text style={styles.emptySubtitle}>Book a parking spot to see it here</Text>
            </View>
          )
        ) : (
          pastBookings.length > 0 ? (
            pastBookings.map(renderBookingCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={64} color="#CCC" />
              <Text style={styles.emptyTitle}>No Past Bookings</Text>
              <Text style={styles.emptySubtitle}>Your booking history will appear here</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  bookingDetails: {
    marginBottom: 16,
  },
  timeInfo: {
    gap: 12,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    minWidth: 40,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  extendButton: {
    backgroundColor: '#F0F8FF',
  },
  extendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FFF0F0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default BookingsScreen;