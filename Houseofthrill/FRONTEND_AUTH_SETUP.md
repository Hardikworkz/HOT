# Frontend Authentication Setup Guide

This guide explains how to set up and use the Supabase authentication system with the House of Thrill frontend.

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env` file in the `main/` directory (copy from `.env.example`):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_BACKEND_URL=http://localhost:5000
```

### 2. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a project
2. Navigate to **Settings → API Keys**
3. Copy **Project URL** and **Anon Public Key**
4. Paste them in your `.env` file

### 3. Configure OAuth Providers

#### Google OAuth Setup

1. Go to your Supabase Dashboard → **Authentication → Providers**
2. Click **Google**
3. Follow the setup instructions to create a Google OAuth 2.0 credential
4. Add authorized redirect URI: `https://your-supabase-url.supabase.co/auth/v1/callback`

#### Apple OAuth Setup

1. In Supabase Dashboard → **Authentication → Providers**
2. Click **Apple**
3. Follow instructions for Apple sign-in configuration
4. Add redirect URI to your Apple Developer account

### 4. Enable Custom User Data

In Supabase, create a `profiles` table to store user information:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create trigger to auto-insert profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.user_metadata->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 📁 File Structure

```
src/
├── lib/
│   ├── supabase.js          # Supabase client initialization
│   └── auth.js              # Auth functions (Google, Apple sign-in)
├── context/
│   └── AuthContext.jsx      # Auth state management
├── hooks/
│   └── useElementScrollProgress.js
└── components/
    └── auth/
        ├── LoginPage.jsx    # Login UI
        ├── SignupPage.jsx   # Signup UI
        └── auth.css         # Styling
```

## 🔐 Authentication Flow

### 1. User Visits Login/Signup

```
LoginPage.jsx / SignupPage.jsx
      ↓
User clicks "Continue with Google" or "Continue with Apple"
      ↓
```

### 2. OAuth Redirect

```
Frontend sends OAuth request → Supabase OAuth provider
      ↓
User authenticates with Google/Apple
      ↓
Redirect back to your app with session
```

### 3. Session Stored

```
Supabase stores session in localStorage
      ↓
AuthContext listens to auth changes
      ↓
User state updated globally
```

### 4. Access Granted

```
JWT token available in session
      ↓
Send token with API requests to backend
      ↓
Backend validates token and grants access
```

## 🪝 Using the Auth Context

### Get Current User

```javascript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, session, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.email}!</div>;
}
```

### Sign Out

```javascript
import { signOut } from '@/lib/auth';

async function handleLogout() {
  const result = await signOut();
  
  if (result.success) {
    // Redirect to login or home
  } else {
    console.error('Logout failed:', result.error);
  }
}
```

## 🔗 Using the Backend API

Once authenticated, you can call the backend API with the JWT token:

```javascript
import { useAuth } from '@/context/AuthContext';

function BookingForm() {
  const { session } = useAuth();

  const handleCreateBooking = async () => {
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        visitDate: '2026-06-15',
        visitTime: '14:00',
        notes: 'Birthday party',
      }),
    });

    const result = await response.json();
    console.log('Booking created:', result);
  };

  return <button onClick={handleCreateBooking}>Book Now</button>;
}
```

## 🎨 Styling Error Messages

Error messages are styled with a red background. Update `src/components/auth/auth.css` if needed:

```css
.auth-error {
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #fca5a5;
  font-size: 0.9rem;
  text-align: center;
}
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

**Problem:** `.env` file not configured

**Solution:** 
1. Create `.env` file from `.env.example`
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### OAuth redirect not working

**Problem:** After login, stuck on redirect

**Solution:**
1. Check redirect URI in Supabase matches your app URL
2. Ensure OAuth provider is properly configured
3. Check browser console for errors

### Token invalid when calling backend

**Problem:** Backend rejects requests with 401 error

**Solution:**
1. Ensure token is sent in `Authorization: Bearer <token>` header
2. Verify backend `.env` has correct Supabase credentials
3. Check token hasn't expired (re-login if needed)

### User profile not created

**Problem:** After signup, profile table empty

**Solution:**
1. Ensure the trigger is created in Supabase
2. Check SQL execution in Supabase SQL Editor
3. Manually create profile row if needed

## 📱 Responsive Design

The login/signup pages are fully responsive:
- Mobile: Stack layout, optimized touch targets
- Tablet: Medium spacing and text sizes
- Desktop: Full width with centered content

## 🔒 Security Best Practices

✅ **Enabled:**
- JWT token verification on backend
- Role-based access control
- CORS configuration
- Password via OAuth (no manual passwords stored)

⚠️ **Remember:**
- Never expose service role key on frontend
- Use anon key for frontend
- Validate all user input on backend
- Use HTTPS in production

## 🚀 Next Steps

1. **Set up bookings pages** - Create UI for users to book visits
2. **Add admin dashboard** - Create page for admins to manage bookings
3. **Deploy backend** - Use Heroku, Railway, or Vercel
4. **Deploy frontend** - Use Vercel, Netlify, or your hosting
5. **Monitor auth events** - Set up logging for authentication issues

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [OAuth with Google](https://supabase.com/docs/guides/auth/oauth/google)
- [OAuth with Apple](https://supabase.com/docs/guides/auth/oauth/apple)

## 💡 Tips

- Use `useAuth()` hook to access user state anywhere
- Always wrap app with `<AuthProvider>`
- Check `loading` state before rendering auth-dependent content
- Send JWT token with all API requests to backend
- Store JWT tokens securely (Supabase handles this)

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Status:** Production Ready ✅
