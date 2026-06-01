import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { signUpWithGoogle, signUpWithApple, getCurrentSession } from "../../lib/auth";
import "./auth.css";

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.12-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.905-.08 1.77-.67 2.96-.72 1.99-.1 3.5.87 4.37 2.75.82 1.66.4 4.59-1.41 6.14ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
  </svg>
);

function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { session } = await getCurrentSession();
      if (session) {
        navigate("/welcome", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signUpWithGoogle();
      if (!result.success) {
        setError(result.error || 'Google sign-up failed');
      }
      // Note: Supabase will handle the redirect after successful authentication
    } catch (err) {
      setError(err.message || 'An error occurred during Google sign-up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signUpWithApple();
      if (!result.success) {
        setError(result.error || 'Apple sign-up failed');
      }
      // Note: Supabase will handle the redirect after successful authentication
    } catch (err) {
      setError(err.message || 'An error occurred during Apple sign-up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container bg-[#121110]">
      {/* Background Elements */}
      <div className="auth-bg-blur auth-bg-blur-1"></div>
      <div className="auth-bg-blur auth-bg-blur-2"></div>

      {/* Content */}
      <motion.div
        className="auth-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="auth-header" variants={itemVariants}>
          <h1 className="auth-title">Join the Thrill</h1>
          <p className="auth-subtitle">Start your exciting journey with House of Thrill</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className="auth-error"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Signup Options */}
        <motion.div className="auth-options" variants={itemVariants}>
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="auth-btn auth-btn-google"
          >
            <GoogleIcon />
            <span>{isLoading ? 'Signing up...' : 'Sign up with Google'}</span>
          </button>

          <button
            onClick={handleAppleSignup}
            disabled={isLoading}
            className="auth-btn auth-btn-apple"
          >
            <AppleIcon />
            <span>{isLoading ? 'Signing up...' : 'Sign up with Apple'}</span>
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div className="auth-divider" variants={itemVariants}>
          <span></span>
          <p>Already have an account?</p>
          <span></span>
        </motion.div>

        {/* Login Link */}
        <motion.div className="auth-footer" variants={itemVariants}>
          <button
            onClick={() => navigate("/login")}
            className="auth-link"
            disabled={isLoading}
          >
            Sign In Instead
          </button>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="auth-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="auth-spinner"></div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default SignupPage;
