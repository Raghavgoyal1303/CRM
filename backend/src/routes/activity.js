const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', activityController.getActivityLogs);
router.post('/', activityController.logActivity);

module.exports = router;
