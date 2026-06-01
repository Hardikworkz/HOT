const { pool } = require('../config/db');

const formatIndianDate = (value) => {
  if (!(value instanceof Date)) return value;

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value);
};

const mapBookingRow = (row) => ({
  id: String(row.id),
  user_id: row.user_id ?? null,
  visit_date: row.booking_date ? formatIndianDate(row.booking_date) : null,
  visit_time: row.time_slot,
  notes: row.notes ?? '',
  status: row.status || 'pending',
  created_at: row.created_at,
  updated_at: row.updated_at,
  user_roles: row.user_name ? { email: row.user_name } : null,
  profiles: row.user_name ? { email: row.user_name } : null,
  user_name: row.user_name,
  user_phone: row.user_phone,
  total_price: row.total_price,
  activity_name: row.activity_name || null,
  activity_type: row.activity_type || null,
});

exports.getAllBookings = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        b.id,
        b.activity_id,
        b.booking_date,
        b.time_slot,
        b.user_name,
        b.user_phone,
        b.total_price,
        b.status,
        b.created_at,
        b.updated_at,
        a.name AS activity_name,
        a.type AS activity_type
      FROM bookings b
      LEFT JOIN activities a ON a.id = b.activity_id
      ORDER BY b.booking_date DESC, b.id DESC
    `);

    const data = rows.map(mapBookingRow);

    return res.status(200).json({
      total: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE bookings b
       SET status = $1, updated_at = NOW()
       FROM activities a
       WHERE b.id = $2
         AND a.id = b.activity_id
       RETURNING
         b.id,
         b.activity_id,
         b.booking_date,
         b.time_slot,
         b.user_name,
         b.user_phone,
         b.total_price,
         b.status,
         b.created_at,
         b.updated_at,
         a.name AS activity_name,
         a.type AS activity_type`,
      [status, bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.status(200).json({
      message: 'Booking updated by admin',
      data: mapBookingRow(rows[0]),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM bookings WHERE id = $1',
      [bookingId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.status(200).json({
      message: 'Booking deleted by admin',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getBookingStats = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT status, COUNT(*)::int AS count
       FROM bookings
       GROUP BY status`
    );

    const stats = {
      total: rows.reduce((sum, row) => sum + Number(row.count || 0), 0),
      pending: Number(rows.find((row) => row.status === 'pending')?.count || 0),
      confirmed: Number(rows.find((row) => row.status === 'confirmed')?.count || 0),
      cancelled: Number(rows.find((row) => row.status === 'cancelled')?.count || 0),
      completed: Number(rows.find((row) => row.status === 'completed')?.count || 0),
    };

    return res.status(200).json({ stats });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
