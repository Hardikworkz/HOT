const { findAllActivities, findActivityById } = require('../services/activityService');

exports.listActivities = async (_req, res) => {
  try {
    const activities = await findAllActivities();
    return res.json(activities);
  } catch (err) {
    console.error('listActivities:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const numeric = Number(req.params.id);
    if (!Number.isInteger(numeric) || numeric <= 0) {
      return res.status(400).json({ error: 'Invalid activity id' });
    }
    const activity = await findActivityById(numeric);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    return res.json(activity);
  } catch (err) {
    console.error('getActivityById:', err);
    return res.status(500).json({ error: err.message });
  }
};
