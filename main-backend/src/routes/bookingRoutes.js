const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Public: fetch available slots for an activity/date
router.get('/slots', bookingController.getSlots);

// Advanced booking that accepts activityId/date/timeSlot
router.post('/full', bookingController.createBookingWithActivity);

// Create booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getBookings);

// Generate payment link for booking
router.post('/payment-link', bookingController.generatePaymentLink);

// Update booking after payment confirmation
router.post('/update-booking', bookingController.updateBookingAfterPayment);

module.exports = router;
