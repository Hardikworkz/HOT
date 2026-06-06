import { useState } from "react";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { clearPostLoginDestination, getPostLoginDestination } from "../../lib/auth";
import "./auth.css";

function LoginSuccessPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const storedDestination = getPostLoginDestination();
  const destination = (storedDestination && !(!isAdmin && storedDestination.startsWith("/admin")))
    ? storedDestination
    : isAdmin
    ? "/admin/dashboard"
    : "/";

  if (!user && !isAuthenticated && !loading) {
    return <Navigate to="/login" replace />;
  }

  if (!user && loading) {
    return <div className="auth-spinner">Loading...</div>;
  }

  const handleContinue = () => {
    clearPostLoginDestination();
    navigate(destination, { replace: true });
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");
    clearPostLoginDestination();

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setLogoutError(err?.message || "Could not log out. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <div className="auth-container bg-[#121110]">
      <div className="auth-bg-blur auth-bg-blur-1"></div>
      <div className="auth-bg-blur auth-bg-blur-2"></div>

      <motion.div
        className="auth-content auth-restricted-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-success-badge">Login Successful</div>
        <div className="auth-header">
          <h1 className="auth-title">{isAdmin ? "Welcome, Admin" : "Welcome"}</h1>
          <p className="auth-subtitle">
            {isAdmin
              ? "Your admin access has been verified successfully."
              : "Your user login is complete and ready to continue."}
          </p>
        </div>

        <div className="auth-restricted-card">
          <p>
            Signed in as <strong>{user?.email}</strong>
          </p>
          <p>
            Access level: <strong>{isAdmin ? "ADMIN" : "USER"}</strong>
          </p>
        </div>

        {logoutError && <p className="auth-error">{logoutError}</p>}

        <div className="auth-options">
          <button type="button" className="auth-btn" onClick={handleContinue} disabled={loggingOut}>
            {isAdmin ? "Open Admin Dashboard" : "Enter Website"}
          </button>
          <button
            type="button"
            className="auth-btn auth-btn-secondary"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginSuccessPage;
