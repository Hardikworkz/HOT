const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

// Public: fetch available slots for an activity/date
router.get('/slots', bookingController.getSlots);

// Advanced booking that accepts activityId/date/timeSlot
router.post('/full', requireAuth, bookingController.createBookingWithActivity);

// Create booking
router.post('/', requireAuth, bookingController.createBooking);

// Get all bookings
router.get('/', requireAuth, bookingController.getBookings);

// Generate payment link for booking
router.post('/payment-link', requireAuth, bookingController.generatePaymentLink);

// Update booking after payment confirmation
router.post('/update-booking', requireAuth, bookingController.updateBookingAfterPayment);

module.exports = router;
