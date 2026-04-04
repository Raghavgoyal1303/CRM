const express = require('express');
const router = express.Router();
const callLogController = require('../controllers/callLogController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', callLogController.getCallLogs);
router.post('/', callLogController.logCall);

module.exports = router;
