const express = require('express');
const router = express.Router();
const telephonyController = require('../controllers/telephonyController');
const { protect } = require('../middleware/auth');

/**
 * Click-to-Call Trigger
 * POST /api/telephony/acefone/call
 */
router.post('/acefone/call', protect, telephonyController.handleAcefoneCall);

module.exports = router;
