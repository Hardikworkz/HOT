// modules/booking/booking.controller.js

const Booking = require("./booking.model");
const { findActivityById } = require("../../services/activityService");
const generateSlots = require("../../utils/slotGenerator");
const calculatePrice = require("../../utils/pricing");
const {
  isValidDateString,
  isValidTimeString,
  isPastDate,
  isWithinAdvanceWindow,
  normalizeDate
} = require("../../utils/time");

const MIN_ADVANCE_MINUTES = 30;
const AXE_THROWING_LANE_CAPACITY = 4;

const errorResponse = (res, status, message) => res.status(status).json({ message });

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
    const bookedSlotCounts = bookings.reduce((counts, booking) => {
      counts[booking.timeSlot] = (counts[booking.timeSlot] || 0) + 1;
      return counts;
    }, {});

    const slots = generateSlots(activity, normalizedDate, activity.name === 'Axe Throwing' ? [] : bookings.map((b) => b.timeSlot))
      .filter((slot) =>
        isWithinAdvanceWindow(normalizedDate, slot, MIN_ADVANCE_MINUTES) &&
        (activity.name !== 'Axe Throwing' ? true : (bookedSlotCounts[slot] || 0) < 4)
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
    const bookedSlotCounts = existingBookings.reduce((counts, booking) => {
      counts[booking.timeSlot] = (counts[booking.timeSlot] || 0) + 1;
      return counts;
    }, {});

    const isSlotValid = (() => {
      if (activity.name === 'Axe Throwing') {
        const slots = generateSlots(activity, normalizedDate, []).filter((slot) =>
          isWithinAdvanceWindow(normalizedDate, slot, MIN_ADVANCE_MINUTES)
        );
        return slots.includes(timeSlot) && (bookedSlotCounts[timeSlot] || 0) < AXE_THROWING_LANE_CAPACITY;
      }

      const bookedSlots = existingBookings.map((b) => b.timeSlot);
      const validSlots = generateSlots(activity, normalizedDate, bookedSlots).filter((slot) =>
        isWithinAdvanceWindow(normalizedDate, slot, MIN_ADVANCE_MINUTES)
      );
      return validSlots.includes(timeSlot);
    })();

    if (!isSlotValid) {
      if (activity.name === 'Axe Throwing' && (bookedSlotCounts[timeSlot] || 0) >= AXE_THROWING_LANE_CAPACITY) {
        return errorResponse(res, 400, `Slot fully booked for ${AXE_THROWING_LANE_CAPACITY} lanes`);
      }
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
      totalPrice
    });

    return res.status(201).json(booking);

  } catch (err) {
    if (err.code === "23505" || err.code === 11000) {
      return errorResponse(res, 409, "Slot already booked");
    }
    if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
      return errorResponse(res, err.statusCode, err.message);
    }
    res.status(500).json({ error: err.message });
  }
};

// 🔹 GET ALL BOOKINGS
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAllWithActivity();
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
