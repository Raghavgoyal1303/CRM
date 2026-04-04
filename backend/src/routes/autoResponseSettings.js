const express = require('express');
const router = express.Router();
const autoResponseSettingsController = require('../controllers/autoResponseSettingsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', autoResponseSettingsController.getSettings);
router.post('/', autoResponseSettingsController.updateSettings);

module.exports = router;
