// controllers/bookingController.js

const Booking = require("../modules/booking/booking.model");
const { findActivityById } = require("../services/activityService");
const generateSlots = require("../utils/slotGenerator");
const calculatePrice = require("../utils/pricing");
const {
  isValidDateString,
  isValidTimeString,
  isPastDate,
  isWithinAdvanceWindow,
  normalizeDate
} = require("../utils/time");
const axios = require('axios');

const MIN_ADVANCE_MINUTES = 30;

const errorResponse = (res, status, message) => res.status(status).json({ message });

const resolveUserDetails = (body) => {
  if (body?.userDetails && typeof body.userDetails === "object") {
    return {
      name: body.userDetails.name,
      phone: body.userDetails.phone
    };
  }

  if (body?.contact && typeof body.contact === "object") {
    return {
      name: body.contact.name,
      phone: body.contact.phone
    };
  }

  return null;
};

// 🔹 GET SLOTS
exports.getSlots = async (req, res) => {
  try {
    const { activityId, date } = req.query;
    if (!activityId || !date) {
      return res.status(400).json({ message: "activityId and date are required" });
    }

    const normalizedActivityId = Number(activityId);
    if (!Number.isInteger(normalizedActivityId) || normalizedActivityId <= 0) {
      return errorResponse(res, 400, "activityId must be a positive integer");
    }
    if (!isValidDateString(date)) {
      return errorResponse(res, 400, "date must be in DD-MM-YYYY or YYYY-MM-DD format");
    }
    if (isPastDate(date)) {
      return errorResponse(res, 400, "Cannot fetch slots for past date");
    }

    const normalizedDate = normalizeDate(date);
    const activity = await findActivityById(normalizedActivityId);
    if (!activity) {
      return errorResponse(res, 404, "Activity not found");
    }

    const bookings = await Booking.findByActivityAndDate(normalizedActivityId, normalizedDate);
    const bookedSlots = bookings.map((b) => b.timeSlot);
    const slots = generateSlots(activity, normalizedDate, bookedSlots).filter((slot) =>
      isWithinAdvanceWindow(normalizedDate, slot, MIN_ADVANCE_MINUTES)
    );

    return res.json(slots);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 🔹 CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { activityId, date, timeSlot, userDetails, groupSize, packageType } = req.body;
    const userId = req.user ? (req.user.id || req.user.sub) : null; // Get from authenticated user
    
    if (!activityId || !date || !timeSlot || !userDetails) {
      return errorResponse(res, 400, "activityId, date, timeSlot, userDetails are required");
    }
    if (!userDetails.name || !userDetails.phone) {
      return errorResponse(res, 400, "userDetails.name and userDetails.phone are required");
    }
    if (!isValidDateString(date)) {
      return errorResponse(res, 400, "date must be in DD-MM-YYYY or YYYY-MM-DD format");
    }
    if (!isValidTimeString(timeSlot)) {
      return errorResponse(res, 400, "timeSlot must be in HH:mm format");
    }
    if (isPastDate(date)) {
      return errorResponse(res, 400, "Cannot book past date");
    }
    if (!isWithinAdvanceWindow(date, timeSlot, MIN_ADVANCE_MINUTES)) {
      return errorResponse(res, 400, `Slot must be booked at least ${MIN_ADVANCE_MINUTES} minutes in advance`);
    }

    const normalizedActivityId = Number(activityId);
    if (!Number.isInteger(normalizedActivityId) || normalizedActivityId <= 0) {
      return errorResponse(res, 400, "activityId must be a positive integer");
    }
    const activity = await findActivityById(normalizedActivityId);
    if (!activity) {
      return errorResponse(res, 404, "Activity not found");
    }

    const normalizedDate = normalizeDate(date);
    const existingBookings = await Booking.findByActivityAndDate(normalizedActivityId, normalizedDate);
    const bookedSlots = existingBookings.map((b) => b.timeSlot);
    const validSlots = generateSlots(activity, normalizedDate, bookedSlots).filter((slot) =>
      isWithinAdvanceWindow(normalizedDate, slot, MIN_ADVANCE_MINUTES)
    );
    if (!validSlots.includes(timeSlot)) {
      return errorResponse(res, 400, "Invalid or unavailable timeSlot");
    }

    if (activity.name === "Escape Rooms" && !groupSize) {
      return errorResponse(res, 400, "groupSize is required for Escape Rooms");
    }
    if (
      (activity.name === "VR Gaming" ||
        activity.name === "Axe Throwing" ||
        activity.name === "Remote Control Construction") &&
      !packageType
    ) {
      return errorResponse(res, 400, "packageType is required for selected activity");
    }

    const totalPrice = calculatePrice({
      activity,
      date: normalizedDate,
      groupSize,
      packageType
    });

    const booking = await Booking.create({
      activityId: normalizedActivityId,
      date: normalizedDate,
      timeSlot,
      userDetails,
      totalPrice,
      userId // Pass authenticated user ID
    });

    return res.status(201).json(booking);

  } catch (err) {
    if (err.code === "23505" || err.code === 11000) {
      return errorResponse(res, 409, "Slot already booked");
    }
    if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
      return errorResponse(res, err.statusCode, err.message);
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.createBookingWithActivity = async (req, res) => {
  try {
    const userDetails = resolveUserDetails(req.body);
    if (!userDetails || !userDetails.name || !userDetails.phone) {
      return errorResponse(res, 400, "userDetails.name and userDetails.phone are required");
    }

    req.body.userDetails = userDetails;
    return exports.createBooking(req, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 🔹 GET ALL BOOKINGS
exports.getBookings = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user.sub) : null;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const bookings = await Booking.findByUserId(userId);
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 🔹 GENERATE PAYMENT LINK
exports.generatePaymentLink = async (req, res) => {
  try {
    const { name, email, amount, visitDate, visitTime, notes } = req.body;

    if (!name || !email || !amount || !visitDate || !visitTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Call Calendly API to generate payment link
    const calendlyResponse = await axios.post('https://api.calendly.com/scheduled_events', {
      name,
      email,
      amount,
      visitDate,
      visitTime,
      notes,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const paymentLink = calendlyResponse.data.payment_link;

    res.status(200).json({ paymentLink });
  } catch (error) {
    console.error('Error generating payment link:', error);
    res.status(500).json({ message: 'Failed to generate payment link' });
  }
};

// 🔹 UPDATE BOOKING AFTER PAYMENT
exports.updateBookingAfterPayment = async (req, res) => {
  try {
    const { paymentId, bookingDetails } = req.body;

    if (!paymentId || !bookingDetails) {
      return res.status(400).json({ message: 'Missing payment ID or booking details' });
    }

    // Verify payment status with Calendly API
    const paymentStatusResponse = await axios.get(`https://api.calendly.com/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`,
      },
    });

    if (paymentStatusResponse.data.status !== 'paid') {
      return res.status(400).json({ message: 'Payment not confirmed' });
    }

    // Update booking details in Calendly
    const updateResponse = await axios.post('https://api.calendly.com/scheduled_events', {
      ...bookingDetails,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json({ message: 'Booking updated successfully', event: updateResponse.data });
  } catch (error) {
    console.error('Error updating booking after payment:', error);
    res.status(500).json({ message: 'Failed to update booking after payment' });
  }
};
