const { pool } = require("../../config/db");

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DMY_DATE_RE = /^\d{2}-\d{2}-\d{4}$/;

const formatDateOnly = (value) => {
  if (typeof value === "string") {
    if (ISO_DATE_RE.test(value)) {
      const [year, month, day] = value.split("-");
      return `${day}-${month}-${year}`;
    }
    if (DMY_DATE_RE.test(value)) {
      return value;
    }
    return value;
  }
  if (!(value instanceof Date)) return value;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

const mapRowToBooking = (row) => ({
  id: row.id,
  activityId: row.activity_id,
  date: formatDateOnly(row.booking_date),
  timeSlot: row.time_slot,
  userDetails: {
    name: row.user_name,
    phone: row.user_phone
  },
  totalPrice: Number(row.total_price),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const findByActivityAndDate = async (activityId, date) => {
  const result = await pool.query(
    "SELECT * FROM bookings WHERE activity_id = $1 AND booking_date = $2 ORDER BY time_slot ASC",
    [activityId, date]
  );
  return result.rows.map(mapRowToBooking);
};

const findOneBySlot = async (activityId, date, timeSlot) => {
  const result = await pool.query(
    "SELECT * FROM bookings WHERE activity_id = $1 AND booking_date = $2 AND time_slot = $3 LIMIT 1",
    [activityId, date, timeSlot]
  );
  if (!result.rows.length) return null;
  return mapRowToBooking(result.rows[0]);
};

const create = async ({ activityId, date, timeSlot, userDetails, totalPrice, userId = null }) => {
  const result = await pool.query(
    `INSERT INTO bookings (activity_id, user_id, booking_date, time_slot, user_name, user_phone, total_price)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [activityId, userId, date, timeSlot, userDetails.name, userDetails.phone, totalPrice]
  );
  return mapRowToBooking(result.rows[0]);
};

const findAllWithActivity = async () => {
  const result = await pool.query(`
    SELECT
      b.*,
      a.name AS activity_name,
      a.type AS activity_type
    FROM bookings b
    JOIN activities a ON a.id = b.activity_id
    ORDER BY b.created_at DESC
  `);

  return result.rows.map((row) => ({
    ...mapRowToBooking(row),
    activity: {
      id: row.activity_id,
      name: row.activity_name,
      type: row.activity_type
    }
  }));
};

const findByUserId = async (userId) => {
  const result = await pool.query(`
    SELECT
      b.*,
      a.name AS activity_name,
      a.type AS activity_type
    FROM bookings b
    JOIN activities a ON a.id = b.activity_id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC
  `, [userId]);

  return result.rows.map((row) => ({
    ...mapRowToBooking(row),
    activity: {
      id: row.activity_id,
      name: row.activity_name,
      type: row.activity_type
    }
  }));
};

module.exports = {
  findByActivityAndDate,
  findOneBySlot,
  create,
  findAllWithActivity,
  findByUserId
};
