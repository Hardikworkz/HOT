const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/role', authController.getCurrentUserRole);

module.exports = router;
