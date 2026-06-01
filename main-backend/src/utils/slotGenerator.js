const { toMinutes, toTimeString, isPastTime } = require('./time');

const generateSlots = (activity, date, existingBookings = [], options = {}) => {
  const slots = [];
  const { includePast = false } = options;

  const { openTime, closeTime, duration, buffer } = activity.slotConfig;
  const durationMinutes = Number(duration);
  const bufferMinutes = Number(buffer);
  const start = toMinutes(openTime);
  const end = toMinutes(closeTime);
  const interval = durationMinutes + bufferMinutes;
  if (interval <= 0) {
    throw new Error('Invalid slot interval. duration + buffer must be greater than 0.');
  }

  for (let time = start; time + durationMinutes <= end; time += interval) {
    const slot = toTimeString(time);
    const isBooked = existingBookings.includes(slot);
    const past = isPastTime(date, slot);

    if (!isBooked && (includePast || !past)) {
      slots.push(slot);
    }
  }

  return slots;
};

module.exports = generateSlots;

