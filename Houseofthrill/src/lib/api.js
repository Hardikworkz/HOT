import { getCurrentSession } from './auth';
import { bookingApiBase } from './bookingData';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api';
 
/**
 * Make authenticated API requests to the backend
 * Automatically includes JWT token in Authorization header
 */
export async function apiCall(endpoint, options = {}) {
  try {
    const { session } = await getCurrentSession();
    
    if (!session) {
      throw new Error('Not authenticated. Please sign in first.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    };

    const response = await fetch(
      `${BACKEND_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// ============================================================
// BOOKING API METHODS
// ============================================================

/**
 * Create a new booking
 */
export async function createBooking(visitDate, visitTime, notes = '') {
  return apiCall('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      visitDate,
      visitTime,
      notes,
    }),
  });
}

/**
 * Get user's bookings
 */
export async function getUserBookings() {
  return apiCall('/api/bookings', {
    method: 'GET',
  });
}

/**
 * Get specific booking
 */
export async function getBooking(bookingId) {
  return apiCall(`/api/bookings/${bookingId}`, {
    method: 'GET',
  });
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId) {
  return apiCall(`/api/bookings/${bookingId}`, {
    method: 'DELETE',
  });
}

// ============================================================
// ADMIN API METHODS
// ============================================================

/**
 * Get all bookings (admin only)
 */
export async function getAllBookings() {
  return apiCall('/api/admin/dashboard', {
    method: 'GET',
  });
}

/**
 * Get booking stats (admin only)
 */
export async function getBookingStats() {
  return apiCall('/api/admin/stats', {
    method: 'GET',
  });
}

/**
 * Update booking status (admin only)
 */
export async function updateBookingStatus(bookingId, status) {
  return apiCall(`/api/admin/booking/${bookingId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Delete booking (admin only)
 */
export async function deleteBooking(bookingId) {
  return apiCall(`/api/admin/booking/${bookingId}`, {
    method: 'DELETE',
  });
}

// ============================================================
// EXAMPLE USAGE
// ============================================================

/**
 * Example: Create and fetch bookings
 */
export async function exampleUsage() {
  try {
    // Create booking
    const booking = await createBooking(
      '2026-06-15',
      '14:00',
      'Birthday party for 8 people'
    );
    console.log('Booking created:', booking);

    // Get all bookings
    const bookings = await getUserBookings();
    console.log('My bookings:', bookings);

    // Cancel booking
    const cancelled = await cancelBooking(booking.data.id);
    console.log('Booking cancelled:', cancelled);
  } catch (error) {
    console.error('Error:', error);
  }
}

// ------------------------------------------------------------
// Booking flow API (public slots & activities + authenticated create)
// ------------------------------------------------------------
export { getActivities as fetchActivities, getSlots as fetchSlots, prefetchBookingPageData } from './bookingData';

export async function createBookingWithActivity(payload) {
  // payload: { activityId, date, timeSlot, contact, groupSize?, packageType?, notes? }
  const { session } = await getCurrentSession();
  if (!session) {
    const err = new Error('Sign in to confirm your booking');
    err.code = 'AUTH_REQUIRED';
    throw err;
  }

  const bookingPayload = {
    ...payload,
    userDetails: {
      name: payload?.contact?.name || payload?.userDetails?.name || '',
      phone: payload?.contact?.phone || payload?.userDetails?.phone || '',
    },
  };

  const res = await fetch(`${bookingApiBase()}/api/bookings/full`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(bookingPayload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Booking failed');
  }
  return res.json();
}
