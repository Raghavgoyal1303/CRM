const express = require('express');
const router = express.Router();
const liveCallController = require('../controllers/liveCallController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, liveCallController.listLiveCalls);

module.exports = router;
