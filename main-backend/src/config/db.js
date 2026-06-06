const { Pool } = require('pg');
const defaultActivities = require('../data/defaultActivities');

const sslEnabled =
  process.env.PG_SSL === 'true' ||
  process.env.NODE_ENV === 'production' ||
  (process.env.DATABASE_URL || '').includes('render.com');

const pgFieldConfig = process.env.PG_HOST && process.env.PG_USER && process.env.PG_DATABASE
  ? {
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT || 5432),
      user: process.env.PG_USER,
      ...(process.env.PG_PASSWORD != null && process.env.PG_PASSWORD !== ''
        ? { password: process.env.PG_PASSWORD }
        : {}),
      database: process.env.PG_DATABASE,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    }
  : null;

const connectionConfig = pgFieldConfig
  || (process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      }
    : {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        database: 'house_of_thrill',
        ssl: false,
      });

const pool = new Pool(connectionConfig);

const seedDefaultActivities = async () => {
  const { rows } = await pool.query('SELECT name FROM activities');
  const existingNames = new Set(rows.map((row) => row.name));
  let insertedCount = 0;

  for (const activity of defaultActivities) {
    if (existingNames.has(activity.name)) continue;

    const { duration, buffer, openTime, closeTime } = activity.slotConfig;
    await pool.query(
      `INSERT INTO activities (name, type, duration, buffer, open_time, close_time, pricing)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
      [
        activity.name,
        activity.type,
        duration,
        buffer,
        openTime,
        closeTime,
        JSON.stringify(activity.pricing),
      ],
    );
    insertedCount += 1;
  }

  if (insertedCount > 0) {
    console.log(`Seeded ${insertedCount} missing default activities`);
  }
};

const initSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      type VARCHAR(50) NOT NULL,
      duration INTEGER NOT NULL DEFAULT 60,
      buffer INTEGER NOT NULL DEFAULT 0,
      open_time VARCHAR(5) NOT NULL DEFAULT '11:00',
      close_time VARCHAR(5) NOT NULL DEFAULT '22:00',
      pricing JSONB NOT NULL DEFAULT '{}'::jsonb
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
      user_id UUID,
      booking_date DATE NOT NULL,
      time_slot VARCHAR(5) NOT NULL,
      user_name VARCHAR(120) NOT NULL,
      user_phone VARCHAR(30) NOT NULL,
      total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS user_id UUID
  `);
};

const connectDB = async () => {
  await pool.query('SELECT 1');
  await initSchema();
  await seedDefaultActivities();
  console.log('PostgreSQL connected');
};

module.exports = { pool, connectDB };
