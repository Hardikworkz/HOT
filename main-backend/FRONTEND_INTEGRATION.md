/**
 * Frontend Integration Guide
 * 
 * This file shows how to connect your React frontend (House of Thrill)
 * to the modular backend for bookings and admin features.
 */

import supabase from '@/lib/supabase'; // Your Supabase client

const API_BASE = 'http://localhost:5000/api';

// ============================================================
// BOOKING API FUNCTIONS
// ============================================================

/**
 * Create a new booking for the current user
 */
export async function createBooking(visitDate, visitTime, notes = '') {
  try {
    // Get the current user's session to extract the access token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      throw new Error('User not authenticated');
    }

    const accessToken = sessionData.session.access_token;

    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        visitDate,
        visitTime,
        notes,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

/**
 * Fetch all bookings for the current user
 */
export async function getUserBookings() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User not authenticated');
    }

    const accessToken = sessionData.session.access_token;

    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

/**
 * Fetch a specific booking by ID
 */
export async function getBookingById(bookingId) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User not authenticated');
    }

    const accessToken = sessionData.session.access_token;

    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
}

/**
 * Cancel a booking (user can only cancel their own)
 */
export async function cancelBooking(bookingId) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User not authenticated');
    }

    const accessToken = sessionData.session.access_token;

    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
}

// ============================================================
// ADMIN API FUNCTIONS
// ============================================================

/**
 * Fetch all bookings (admin only)
 */
export async function getAllBookingsAdmin() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User not authenticated');
    }

    const accessToken = sessionData.session.access_token;

    const response = await fetch(`${API_BASE}/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    throw error;
  }
}

/**
 * Get booking statistics (admin only)
 */
export async function getBookingStats() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User not authenticated');
    }

    const accessToken = sessionData.session.access_token;

    const response = await fetch(`${API_BASE}/admin/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    throw error;
  }
}

/**
 * Update booking status (admin only)
 */
export async function updateBookingStatusAdmin(bookingId, status) {
  try {
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User not authenticated');
    }

    const accessToken = sessionData.session.access_token;

    const response = await fetch(`${API_BASE}/admin/booking/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

/**
 * Delete booking (admin override)
 */
export async function deleteBookingAdmin(bookingId) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User not authenticated');
    }

    const accessToken = sessionData.session.access_token;

    const response = await fetch(`${API_BASE}/admin/booking/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

// ============================================================
// EXAMPLE USAGE IN REACT COMPONENTS
// ============================================================

/**
 * Example: Booking form component
 */
export function BookingFormExample() {
  const handleBooking = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      const result = await createBooking(
        formData.get('visitDate'),
        formData.get('visitTime'),
        formData.get('notes')
      );
      
      alert('Booking confirmed!');
      console.log(result);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleBooking}>
      <input type="date" name="visitDate" required />
      <input type="time" name="visitTime" required />
      <textarea name="notes" placeholder="Additional notes"></textarea>
      <button type="submit">Book Now</button>
    </form>
  );
}

/**
 * Example: User bookings list component
 */
export function BookingsListExample() {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getUserBookings();
        setBookings(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.map((booking) => (
        <div key={booking.id}>
          <p>Date: {booking.visit_date} at {booking.visit_time}</p>
          <p>Status: {booking.status}</p>
          <button onClick={() => cancelBooking(booking.id)}>Cancel</button>
        </div>
      ))}
    </div>
  );
}

/**
 * Example: Admin dashboard component
 */
export function AdminDashboardExample() {
  const [bookings, setBookings] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsResult, statsResult] = await Promise.all([
          getAllBookingsAdmin(),
          getBookingStats(),
        ]);
        
        setBookings(bookingsResult.data || []);
        setStats(statsResult.stats || {});
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      {stats && (
        <div>
          <p>Total: {stats.total}</p>
          <p>Pending: {stats.pending}</p>
          <p>Confirmed: {stats.confirmed}</p>
          <p>Cancelled: {stats.cancelled}</p>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.profiles?.email}</td>
              <td>{booking.visit_date}</td>
              <td>{booking.visit_time}</td>
              <td>{booking.status}</td>
              <td>
                <button onClick={() => updateBookingStatusAdmin(booking.id, 'confirmed')}>
                  Confirm
                </button>
                <button onClick={() => deleteBookingAdmin(booking.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
