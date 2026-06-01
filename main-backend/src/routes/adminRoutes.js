const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Every single route here requires the client to be authenticated AND have admin role
router.use(requireAuth, requireAdmin);

/**
 * GET /api/admin/dashboard
 * Fetch all bookings across the platform with user details
 */
router.get('/dashboard', adminController.getAllBookings);

/**
 * GET /api/admin/stats
 * Get booking statistics (counts by status)
 */
router.get('/stats', adminController.getBookingStats);

/**
 * PATCH /api/admin/booking/:bookingId
 * Update the status of any booking
 * Body: { status: 'pending' | 'confirmed' | 'cancelled' | 'completed' }
 */
router.patch('/booking/:bookingId', adminController.updateBookingStatus);

/**
 * DELETE /api/admin/booking/:bookingId
 * Delete a booking entirely (admin override)
 */
router.delete('/booking/:bookingId', adminController.deleteBooking);

module.exports = router;
