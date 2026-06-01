import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { createBooking, getUserBookings } from "../../lib/api";
import "./booking-form.css";

export function BookingForm() {
  const { isAuthenticated, role, user, loading } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Get minimum date (today + 1 day)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get maximum date (1 year from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!visitDate || !visitTime) {
      setError('Please select a date and time');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await createBooking(visitDate, visitTime, notes);

      // Handle both response formats
      const bookingData = result?.data || result;
      if (bookingData?.id) {
        setSuccessMessage('Booking created successfully! 🎉');
        setVisitDate('');
        setVisitTime('');
        setNotes('');
        setTimeout(() => {
          setSuccessMessage(null);
          setShowMyBookings(true);
          loadUserBookings();
        }, 2000);
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadUserBookings = async () => {
    try {
      setLoadingBookings(true);
      const results = await getUserBookings();
      // Handle response format from backend
      const bookingsData = results?.data || results;
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      setError('Failed to load bookings: ' + err.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handlePayOnline = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!visitDate || !visitTime) {
      setError('Please select a date and time');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/bookings/payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          amount: calculatePrice(visitDate, visitTime),
          visitDate,
          visitTime,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate payment link');
      }

      const { paymentLink } = await response.json();
      window.location.href = paymentLink;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="booking-loading">Loading booking system...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="booking-not-authenticated">
        <div className="booking-auth-card">
          <h3>Sign In to Book</h3>
          <p>You need to be logged in to make a booking.</p>
          <div className="booking-auth-buttons">
            <button 
              className="booking-btn primary" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button 
              className="booking-btn secondary" 
              onClick={() => navigate('/signup')}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      {/* User Info Header */}
      <div className="booking-user-info">
        <div className="booking-user-badge">
          <span className="booking-user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </span>
          <div className="booking-user-details">
            <p className="booking-user-email">{user?.email}</p>
            <span className={`booking-role-badge ${role}`}>
              {role?.toUpperCase() || 'USER'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="booking-tabs">
        <button 
          className={`booking-tab ${!showMyBookings ? 'active' : ''}`}
          onClick={() => setShowMyBookings(false)}
        >
          📅 New Booking
        </button>
        <button 
          className={`booking-tab ${showMyBookings ? 'active' : ''}`}
          onClick={() => {
            setShowMyBookings(true);
            loadUserBookings();
          }}
        >
          📋 My Bookings
        </button>
      </div>

      {/* New Booking Form */}
      {!showMyBookings && (
        <form onSubmit={handleSubmit} className="booking-form">
          <h3>Book Your Visit</h3>

          {error && <div className="booking-error">{error}</div>}
          {successMessage && <div className="booking-success">{successMessage}</div>}

          <div className="booking-form-group">
            <label htmlFor="visitDate">Select Date *</label>
            <input
              type="date"
              id="visitDate"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              required
              className="booking-input"
            />
            <small>Minimum 1 day in advance</small>
          </div>

          <div className="booking-form-group">
            <label htmlFor="visitTime">Select Time *</label>
            <select
              id="visitTime"
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
              required
              className="booking-input"
            >
              <option value="">-- Choose a time --</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
            </select>
          </div>

          <div className="booking-form-group">
            <label htmlFor="notes">Special Requests (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Birthday party, group event, dietary requirements, etc."
              rows="4"
              className="booking-input booking-textarea"
            />
          </div>

          <div className="booking-info-box">
            <p className="booking-info-label">📌 Important:</p>
            <ul className="booking-info-list">
              <li>Bookings must be confirmed by admin</li>
              <li>You'll receive confirmation email</li>
              <li>Cancellations available 24 hours before</li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="booking-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Booking...' : 'Complete Booking'}
          </button>
          <button
            type="button"
            className="pay-online-button"
            onClick={handlePayOnline}
            disabled={isSubmitting}
          >
            Pay Online Now
          </button>
        </form>
      )}

      {/* My Bookings */}
      {showMyBookings && (
        <div className="booking-my-bookings">
          <h3>My Bookings</h3>

          {loadingBookings ? (
            <div className="booking-loading">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="booking-empty">
              <p>You haven't made any bookings yet.</p>
              <button 
                className="booking-btn primary"
                onClick={() => setShowMyBookings(false)}
              >
                Make Your First Booking
              </button>
            </div>
          ) : (
            <div className="booking-list">
              {bookings.map((booking) => (
                <div key={booking.id} className={`booking-card ${booking.status}`}>
                  <div className="booking-card-header">
                    <div>
                      <h4 className="booking-card-date">
                        📅 {booking.visit_date} at {booking.visit_time}
                      </h4>
                      <p className="booking-card-id">ID: {booking.id.slice(0, 8)}...</p>
                    </div>
                    <span className={`booking-status-badge ${booking.status}`}>
                      {booking.status?.toUpperCase()}
                    </span>
                  </div>

                  {booking.notes && (
                    <div className="booking-card-notes">
                      <p className="booking-notes-label">📝 Notes:</p>
                      <p>{booking.notes}</p>
                    </div>
                  )}

                  <div className="booking-card-meta">
                    <span className="booking-meta-item">
                      Created: {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="booking-card-info">
                      ⏳ Awaiting admin confirmation
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingForm;

function calculatePrice(visitDate, visitTime) {
  // Example calculation: $50 per hour
  const hours = Math.floor((new Date(visitDate).getTime() - new Date().getTime()) / (1000 * 60 * 60));
  return 50 * hours;
}
