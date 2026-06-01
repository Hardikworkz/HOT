import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { signOut } from "../../lib/auth";
import "./user-profile.css";

export function UserProfileHeader() {
  const { user, role, isAdmin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setShowDropdown(false);
    navigate('/');
  };

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
    setShowDropdown(false);
  };

  if (loading) {
    return <div className="user-profile-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="user-profile-auth-buttons">
        <button className="auth-nav-btn login" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="auth-nav-btn signup" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-info" onClick={() => setShowDropdown(!showDropdown)}>
        <div className="user-avatar">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <p className="user-email">{user?.email}</p>
          <p className="user-role">
            <span className={`role-badge ${role}`}>{role?.toUpperCase() || 'USER'}</span>
          </p>
        </div>
      </div>

      {showDropdown && (
        <div className="user-dropdown-menu">
          <div className="dropdown-header">
            <p className="dropdown-email">{user?.email}</p>
            <span className={`dropdown-role-badge ${role}`}>{role?.toUpperCase() || 'USER'}</span>
          </div>

          <div className="dropdown-divider"></div>

          <button className="dropdown-item profile">
            <span className="icon">👤</span>
            <span>My Profile</span>
          </button>

          <button className="dropdown-item bookings">
            <span className="icon">📅</span>
            <span>My Bookings</span>
          </button>

          {isAdmin && (
            <>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item admin" onClick={handleAdminDashboard}>
                <span className="icon">⚙️</span>
                <span>Admin Dashboard</span>
              </button>
            </>
          )}

          <div className="dropdown-divider"></div>

          <button className="dropdown-item logout" onClick={handleLogout}>
            <span className="icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfileHeader;
