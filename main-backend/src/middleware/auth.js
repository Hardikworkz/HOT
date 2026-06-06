const supabaseAdmin = require('../config/supabase');

/**
 * Middleware to verify JWT token and extract user info.
 * Populates req.user for downstream handlers.
 */
exports.requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.slice(7);
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = data.user;
    req.accessToken = token;
    // Ensure user ID is accessible - Supabase returns 'id', some SDKs use 'sub'
    req.user.id = data.user.id || data.user.sub;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authentication failed: ' + error.message });
  }
};

/**
 * Middleware to ensure the authenticated user is an admin.
 * Must run after requireAuth.
 */
exports.requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id || req.user.sub;
    const { data: profile, error } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions. Admin access required.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authorization check failed: ' + error.message });
  }
};
