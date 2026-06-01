# House of Thrill Backend

A modular, production-ready backend for managing user bookings and admin overrides using Supabase.

## Architecture

```
main-backend/
├── src/
│   ├── config/
│   │   └── supabase.js              # Supabase client initialization
│   ├── middleware/
│   │   └── auth.js                  # JWT verification & role checks
│   ├── controllers/
│   │   ├── bookingController.js     # User booking logic
│   │   └── adminController.js       # Admin override logic
│   ├── routes/
│   │   ├── bookingRoutes.js         # User booking endpoints
│   │   └── adminRoutes.js           # Admin endpoints
│   └── server.js                    # Express app entry point
├── .env                             # Environment variables
└── package.json                     # Dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
```

### 3. Set Up Supabase Tables

Create the following tables in your Supabase project:

#### `profiles` table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `bookings` table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Start the Server

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### User Bookings (`/api/bookings`)

All endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

#### Create Booking
```
POST /api/bookings
Body: {
  "visitDate": "2026-06-15",
  "visitTime": "14:00",
  "notes": "Optional notes"
}
```

#### Get User's Bookings
```
GET /api/bookings
```

#### Get Specific Booking
```
GET /api/bookings/:bookingId
```

#### Cancel Booking
```
DELETE /api/bookings/:bookingId
```

### Admin Endpoints (`/api/admin`)

All endpoints require **admin authentication** (both user JWT + admin role).

#### Get All Bookings
```
GET /api/admin/dashboard
```

#### Get Booking Statistics
```
GET /api/admin/stats
```

#### Update Booking Status
```
PATCH /api/admin/booking/:bookingId
Body: {
  "status": "confirmed" | "pending" | "cancelled" | "completed"
}
```

#### Delete Booking (Admin Override)
```
DELETE /api/admin/booking/:bookingId
```

## Frontend Integration

Send the Supabase access token with each request:

```javascript
// Example: Creating a booking from React
const { data: session } = await supabase.auth.getSession();

const response = await fetch('http://localhost:5000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.session.access_token}`
  },
  body: JSON.stringify({
    visitDate: '2026-06-15',
    visitTime: '14:00',
    notes: 'Birthday party'
  })
});

const result = await response.json();
console.log(result);
```

## Security Features

✅ **JWT Verification** - All requests validated against Supabase tokens  
✅ **Role-Based Access Control** - Admin routes protected by role middleware  
✅ **User Isolation** - Users can only see/modify their own bookings  
✅ **Admin Overrides** - Designated admin account has full control  
✅ **CORS Enabled** - Configured for frontend requests

## Error Handling

All endpoints return structured error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Server Error

## Health Check

```
GET /health
```

Returns:
```json
{
  "status": "ok",
  "message": "House of Thrill Backend is running"
}
```

## Troubleshooting

**Missing environment variables?**
- Ensure `.env` file exists with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

**Authentication errors?**
- Verify the JWT token is valid and not expired
- Check that the `Authorization` header is formatted as `Bearer <token>`

**Admin access denied?**
- Verify the user's profile has `role` set to `'admin'` in Supabase
- Ensure the user is authenticated first (JWT token valid)

## License

ISC
