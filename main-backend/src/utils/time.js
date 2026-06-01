const DATE_RE = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD (ISO format)
const DMY_DATE_RE = /^\d{2}-\d{2}-\d{4}$/; // DD-MM-YYYY format
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

const parseDateParts = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
};

const parseDatePartsFromDMY = (date) => {
  const [day, month, year] = date.split('-').map(Number);
  return { day, month, year };
};

const isValidDateString = (date) => {
  // Support both YYYY-MM-DD and DD-MM-YYYY formats
  if (DATE_RE.test(date)) {
    const { year, month, day } = parseDateParts(date);
    const d = new Date(year, month - 1, day);
    return (
      !Number.isNaN(d.getTime()) &&
      d.getFullYear() === year &&
      d.getMonth() === month - 1 &&
      d.getDate() === day
    );
  }
  if (DMY_DATE_RE.test(date)) {
    const { day, month, year } = parseDatePartsFromDMY(date);
    const d = new Date(year, month - 1, day);
    return (
      !Number.isNaN(d.getTime()) &&
      d.getFullYear() === year &&
      d.getMonth() === month - 1 &&
      d.getDate() === day
    );
  }
  return false;
};

const normalizeDate = (date) => {
  if (!isValidDateString(date)) {
    throw new Error(`Invalid date format: ${date}`);
  }
  if (DMY_DATE_RE.test(date)) {
    const { day, month, year } = parseDatePartsFromDMY(date);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return date; // Already in YYYY-MM-DD format
};

const isValidTimeString = (time) => TIME_RE.test(time);

const toMinutes = (time) => {
  if (!isValidTimeString(time)) {
    throw new Error(`Invalid time format: ${time}`);
  }
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const toTimeString = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const toDateTime = (date, time) => {
  if (!isValidDateString(date)) {
    throw new Error(`Invalid date format: ${date}`);
  }
  if (!isValidTimeString(time)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  let year, month, day;
  if (DMY_DATE_RE.test(date)) {
    const parts = parseDatePartsFromDMY(date);
    year = parts.year;
    month = parts.month;
    day = parts.day;
  } else {
    const parts = parseDateParts(date);
    year = parts.year;
    month = parts.month;
    day = parts.day;
  }

  const [hours, minutes] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
};

const isPastTime = (date, time) => toDateTime(date, time) < new Date();

const isPastDate = (date) => {
  if (!isValidDateString(date)) return true;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let year, month, day;
  if (DMY_DATE_RE.test(date)) {
    const parts = parseDatePartsFromDMY(date);
    year = parts.year;
    month = parts.month;
    day = parts.day;
  } else {
    const parts = parseDateParts(date);
    year = parts.year;
    month = parts.month;
    day = parts.day;
  }
  
  const bookingDate = new Date(year, month - 1, day);
  return bookingDate < today;
};

const isWithinAdvanceWindow = (date, time, minAdvanceMinutes = 30) => {
  const slotTime = toDateTime(date, time);
  const diffMs = slotTime.getTime() - Date.now();
  return diffMs >= minAdvanceMinutes * 60 * 1000;
};

const isWeekend = (date) => {
  if (!isValidDateString(date)) return false;
  
  let year, month, day;
  if (DMY_DATE_RE.test(date)) {
    const parts = parseDatePartsFromDMY(date);
    year = parts.year;
    month = parts.month;
    day = parts.day;
  } else {
    const parts = parseDateParts(date);
    year = parts.year;
    month = parts.month;
    day = parts.day;
  }
  
  const d = new Date(year, month - 1, day);
  const dayIndex = d.getDay();
  return dayIndex === 5 || dayIndex === 6 || dayIndex === 0;
};

module.exports = {
  toMinutes,
  toTimeString,
  toDateTime,
  isValidDateString,
  isValidTimeString,
  isPastTime,
  isPastDate,
  isWithinAdvanceWindow,
  isWeekend,
  normalizeDate,
};
