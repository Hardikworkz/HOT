import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function AccessRestrictedPage() {
  const navigate = useNavigate();

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
        <div className="auth-restricted-badge">Access Restricted</div>
        <div className="auth-header">
          <h1 className="auth-title">Admin Access Blocked</h1>
          <p className="auth-subtitle">
            Your login was successful, but this account is not authorized for the admin channel.
          </p>
        </div>
 

        <div className="auth-options">
          <button className="auth-btn" onClick={() => navigate("/login")}>
            Back to Login
          </button>
          <button className="auth-link" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AccessRestrictedPage;
