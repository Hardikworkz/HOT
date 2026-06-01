import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import {
  deleteBooking,
  getAllBookings,
  getBookingStats,
  updateBookingStatus,
} from "../../lib/api";
import { signOut } from "../../lib/auth";
import "./admin.css";

const EMPTY_STATS = {
  total: 0,
  pending: 0,
  confirmed: 0,
  cancelled: 0,
  completed: 0,
};

export function AdminDashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [bookingsResponse, statsResponse] = await Promise.all([
        getAllBookings(),
        getBookingStats(),
      ]);

      const bookingRows = Array.isArray(bookingsResponse)
        ? bookingsResponse
        : Array.isArray(bookingsResponse?.data)
          ? bookingsResponse.data
          : Array.isArray(bookingsResponse?.bookings)
            ? bookingsResponse.bookings
            : [];

      const bookingStats = statsResponse?.stats
        ?? statsResponse?.data?.stats
        ?? statsResponse?.data
        ?? EMPTY_STATS;

      setBookings(Array.isArray(bookingRows) ? bookingRows : []);
      setStats({
        total: Number(bookingStats.total ?? bookingRows.length ?? 0),
        pending: Number(bookingStats.pending ?? 0),
        confirmed: Number(bookingStats.confirmed ?? 0),
        cancelled: Number(bookingStats.cancelled ?? 0),
        completed: Number(bookingStats.completed ?? 0),
      });
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (role === null) {
      if (!cancelled) {
        setLoading(false);
      }
      return () => {
        cancelled = true;
      };
    }

    if (role !== "admin") {
      setLoading(false);
      navigate("/access-restricted", { replace: true });
      return () => {
        cancelled = true;
      };
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [role, navigate, loadDashboard]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const result = await updateBookingStatus(bookingId, newStatus);
      if (!result) throw new Error('Failed to update booking status');

      await loadDashboard();
      setEditingId(null);
      setEditStatus('');
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const result = await deleteBooking(bookingId);
      if (!result) throw new Error('Failed to delete booking');

      await loadDashboard();
    } catch (err) {
      alert("Failed to delete booking: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const getIndianDateString = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);

    return parts
      .filter((part) => part.type !== 'literal')
      .reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});
  };

  const indianTodayParts = useMemo(() => getIndianDateString(), []);
  const todayStr = `${indianTodayParts.year}-${indianTodayParts.month}-${indianTodayParts.day}`;

  const todaysBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const bDate = booking.visit_date || booking.date || '';
      return bDate === todayStr;
    });
  }, [bookings, todayStr]);

  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return bookings.filter((booking) => {
      const name = (booking.user_name || booking.user_roles?.email || booking.profiles?.email || booking.user_email || booking.email || '').toLowerCase();
      const phone = (booking.user_phone || booking.phone || booking.userDetails?.phone || '').toLowerCase();
      const date = (booking.visit_date || booking.date || '').toLowerCase();
      const status = (booking.status || '').toLowerCase();
      const activityName = (booking.activity_name || booking.activity?.name || '').toLowerCase();
      const activityType = (booking.activity_type || booking.activity?.type || '').toLowerCase();

      return name.includes(normalizedSearch)
        || phone.includes(normalizedSearch)
        || date.includes(normalizedSearch)
        || status.includes(normalizedSearch)
        || activityName.includes(normalizedSearch)
        || activityType.includes(normalizedSearch);
    });
  }, [bookings, searchTerm]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>Admin Bookings</h1>
          <p className="subtitle">Manage all bookings and schedules</p>
        </div>
        <div className="header-right">
          <a 
            href="https://calendar.google.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="calendar-link-btn"
          >
            <span className="icon">📅</span> View Calendar Extension
          </a>
          <div className="user-info">
            <span className="email">{user?.email}</span>
            <span className="admin-badge">ADMIN</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
        <div className="stat-card confirmed">
          <h3>Confirmed</h3>
          <p className="stat-number">{stats.confirmed}</p>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
        <div className="stat-card cancelled">
          <h3>Cancelled</h3>
          <p className="stat-number">{stats.cancelled}</p>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          {error}
          <button onClick={loadDashboard} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Today's Bookings Highlight Section */}
      <div className="admin-section todays-section">
        <div className="section-header">
          <h2>Today's Bookings</h2>
          <span className="today-badge">{todayStr}</span>
        </div>
        {todaysBookings.length === 0 ? (
          <div className="no-bookings-compact">
            <p>No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="todays-grid">
            {todaysBookings.map((booking) => (
              <div key={booking.id} className={`today-card status-${booking.status?.toLowerCase()}`}>
                <div className="today-card-header">
                  <span className="today-card-time">{booking.visit_time || booking.time || 'N/A'}</span>
                  <span className={`status-badge-mini ${booking.status?.toLowerCase()}`}>
                    {booking.status || 'pending'}
                  </span>
                </div>
                <p className="today-card-name">
                  <strong>Name:</strong> {booking.user_name || booking.user_roles?.email || booking.profiles?.email || booking.user_email || booking.email || 'N/A'}
                </p>
                <p className="today-card-phone">
                  <strong>Phone:</strong> {booking.user_phone || booking.phone || booking.userDetails?.phone || 'N/A'}
                </p>
                <p className="today-card-activity">
                  <strong>Activity:</strong> {booking.activity_name || booking.activity?.name || 'N/A'}
                </p>
                <p className="today-card-theme">
                  <strong>Theme:</strong> {booking.activity_type || booking.activity?.type || 'N/A'}
                </p>
               
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Bookings Management Table */}
      <div className="admin-section">
        <div className="table-controls-header">
          <h2>All Bookings</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by Name, Phone, Date, Activity, Theme or Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="clear-search">
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="bookings-table-container">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <p>{bookings.length === 0 ? "No bookings yet" : "No results match your search criteria"}</p>
            </div>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Visit Date</th>
                  <th>Visit Time</th>
                  <th>Activity Name</th>
                  <th>Theme</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className={`booking-row status-${booking.status?.toLowerCase()}`}>
                    <td className="id-cell">{booking.user_name || booking.user_roles?.email || booking.profiles?.email || booking.user_email || booking.email || 'N/A'}</td>
                    <td>{booking.user_phone || booking.phone || booking.userDetails?.phone || 'N/A'}</td>
                    <td>{booking.visit_date || booking.date || 'N/A'}</td>
                    <td>{booking.visit_time || booking.time || 'N/A'}</td>
                    <td>{booking.activity_name || booking.activity?.name || 'N/A'}</td>
                    <td>{booking.activity_type || booking.activity?.type || 'N/A'}</td>
                    <td>
                      {editingId === booking.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="status-select"
                          autoFocus
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                          {booking.status || 'pending'}
                        </span>
                      )}
                    </td>
                    <td className="actions-cell">
                      {editingId === booking.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, editStatus)}
                            className="action-btn save-btn"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="action-btn cancel-btn"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(booking.id);
                              setEditStatus(booking.status || 'pending');
                            }}
                            className="action-btn edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="action-btn delete-btn"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer Summary Info */}
      <div className="admin-footer">
        <p>
          Showing <strong>{filteredBookings.length}</strong> of <strong>{stats.total || bookings.length}</strong> Bookings
        </p>
        <p>
          Last Sync: <strong>{new Date().toLocaleTimeString()}</strong>
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;