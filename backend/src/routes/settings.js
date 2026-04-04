const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect, roleGuard } = require('../middleware/auth');

router.use(protect, roleGuard(['admin']));

router.get('/', settingsController.getCompanySettings);
router.patch('/', settingsController.updateCompanySettings);
router.patch('/password', settingsController.updateAdminPassword);

module.exports = router;
