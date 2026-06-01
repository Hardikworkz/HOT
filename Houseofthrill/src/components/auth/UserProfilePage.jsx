import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { signOut } from "../../lib/auth";
import "./user-profile-page.css";

export function UserProfilePage() {
  const { user, role, isAdmin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-not-auth">
        <h2>Please Log In</h2>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <h1>{user?.email}</h1>
          <span className={`profile-role-badge-large ${role}`}>
            {role?.toUpperCase() || 'USER'}
          </span>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          {isAdmin && (
            <button 
              className={`profile-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              🛡️ Admin
            </button>
          )}
        </div>

        {/* Content */}
        <div className="profile-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              
              <div className="profile-field">
                <label>Email Address</label>
                <p className="profile-value">{user?.email}</p>
              </div>

              <div className="profile-field">
                <label>User Role</label>
                <p className="profile-value">
                  <span className={`role-badge ${role}`}>{role?.toUpperCase() || 'USER'}</span>
                </p>
              </div>

              <div className="profile-field">
                <label>Account Status</label>
                <p className="profile-value">
                  <span className="status-badge active">✓ Active</span>
                </p>
              </div>

              <div className="profile-permissions">
                <h3>Your Permissions</h3>
                <ul className="permissions-list">
                  <li>
                    <span className="check">✓</span>
                    <span>Create Bookings</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>View My Bookings</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>Cancel Bookings (24hrs before)</span>
                  </li>
                  {isAdmin && (
                    <>
                      <li>
                        <span className="check admin">✓</span>
                        <span>View All Bookings</span>
                      </li>
                      <li>
                        <span className="check admin">✓</span>
                        <span>Manage Booking Status</span>
                      </li>
                      <li>
                        <span className="check admin">✓</span>
                        <span>View Statistics</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="profile-section">
              <h2>Account Settings</h2>

              <div className="settings-group">
                <h3>Notifications</h3>
                <label className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <span>Email notifications for bookings</span>
                </label>
                <label className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <span>Email notifications for updates</span>
                </label>
              </div>

              <div className="settings-group">
                <h3>Privacy</h3>
                <p className="setting-description">
                  Your data is protected and only visible to authorized personnel.
                </p>
              </div>

              <div className="settings-group">
                <h3>Danger Zone</h3>
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          )}

          {/* Admin Tab */}
          {isAdmin && activeTab === 'admin' && (
            <div className="profile-section">
              <h2>Admin Controls</h2>

              <div className="admin-card">
                <h3>📊 Admin Dashboard</h3>
                <p>Access the full admin dashboard to manage bookings and view statistics.</p>
                <button 
                  className="admin-link-btn"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Open Admin Dashboard
                </button>
              </div>

              <div className="admin-info">
                <h3>Admin Capabilities</h3>
                <ul>
                  <li>View all customer bookings</li>
                  <li>Update booking statuses</li>
                  <li>View booking statistics</li>
                  <li>Delete bookings if needed</li>
                  <li>Manage user roles (future)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
