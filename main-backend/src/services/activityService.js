const { pool } = require('../config/db');

const mapRowToActivity = (row) => ({
  id: row.id,
  name: row.name,
  type: row.type,
  slotConfig: {
    duration: Number(row.duration),
    buffer: Number(row.buffer),
    openTime: row.open_time,
    closeTime: row.close_time,
  },
  pricing: row.pricing || {},
});

async function findAllActivities() {
  const { rows } = await pool.query('SELECT * FROM activities ORDER BY id ASC');
  return rows.map(mapRowToActivity);
}

async function findActivityById(id) {
  const { rows } = await pool.query('SELECT * FROM activities WHERE id = $1 LIMIT 1', [id]);
  if (!rows.length) return null;
  return mapRowToActivity(rows[0]);
}

module.exports = { findAllActivities, findActivityById };
