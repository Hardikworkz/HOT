const { findUserRoleRecord } = require('../services/userRoleService');

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
