const supabaseAdmin = require('../config/supabase');
const { findUserRoleRecord } = require('../services/userRoleService');

/**
 * Sign up a new user with email and password
 * POST /api/auth/signup
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Create user via Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: fullName || '',
      },
      email_confirm: true, // Auto-confirm email
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Create default user record in user_roles table
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert([
        {
          user_id: data.user.id,
          email: email,
          role: 'user', // Default role
        },
      ]);

    if (roleError) {
      console.error('Error creating user role record:', roleError);
    }

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Sign in user with email and password
 * POST /api/auth/signin
 */
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authenticate via Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.session || !data?.user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Signed in successfully',
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get current user's role and info (requires authentication)
 * GET /api/auth/role
 */
exports.getCurrentUserRole = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { record, error } = await findUserRoleRecord({
      userId: req.user.id,
      email: req.user.email,
    });

    if (error) {
      return res.status(500).json({ error: 'Failed to resolve user role' });
    }

    return res.status(200).json({
      user_id: req.user.id,
      email: req.user.email,
      role: record?.role || 'user',
      source: record ? 'user_roles' : 'default',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Set/update current user's role (after OAuth login)
 * POST /api/auth/set-role
 * Body: { role: 'admin' | 'user' }
 */
exports.setUserRole = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { role } = req.body;
    
    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).json({ error: 'Invalid role. Must be "admin" or "user".' });
    }

    const userId = req.user.id || req.user.sub;
    const email = req.user.email;

    // Try to find existing record
    const { data: existing } = await supabaseAdmin
      .from('user_roles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    let result;
    if (existing) {
      // Update existing record
      result = await supabaseAdmin
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId)
        .select('user_id, email, role')
        .maybeSingle();
    } else {
      // Create new record
      result = await supabaseAdmin
        .from('user_roles')
        .insert([
          {
            user_id: userId,
            email: email,
            role: role,
          },
        ])
        .select('user_id, email, role')
        .maybeSingle();
    }

    if (result.error) {
      console.error('Error setting user role:', result.error);
      return res.status(500).json({ error: 'Failed to set user role' });
    }

    return res.status(200).json({
      message: 'Role set successfully',
      user_id: userId,
      email: email,
      role: role,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Logout user (frontend should clear tokens)
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  try {
    if (req.accessToken) {
      const { error } = await supabaseAdmin.auth.admin.signOut(req.accessToken);
      if (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
