const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/**
 * PUBLIC ENDPOINTS (no authentication required)
 */

/**
 * POST /api/auth/signup
 * Create a new user account
 * Body: { email, password, fullName? }
 */
router.post('/signup', authController.signup);

/**
 * POST /api/auth/signin
 * Sign in and get access token
 * Body: { email, password }
 */
router.post('/signin', authController.signin);

/**
 * PROTECTED ENDPOINTS (authentication required)
 */
router.use(requireAuth);

/**
 * GET /api/auth/role
 * Get current user's role and info
 */
router.get('/role', authController.getCurrentUserRole);

/**
 * POST /api/auth/set-role
 * Set/update a user's role (admin only)
 * Body: { role: 'admin' | 'user', userId?: string }
 */
router.post('/set-role', requireAdmin, authController.setUserRole);

/**
 * POST /api/auth/logout
 * Sign out the current user
 */
router.post('/logout', authController.logout);

module.exports = router;
