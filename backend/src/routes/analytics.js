const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/performance', analyticsController.getEmployeePerformance);
router.get('/calls', analyticsController.getCallVolumeStats);
router.get('/pipeline', analyticsController.getPipelineStats);

module.exports = router;
