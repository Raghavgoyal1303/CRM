const express = require('express');
const router = express.Router();
const retryController = require('../controllers/retryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', retryController.getRetryQueue);
router.post('/:id/retry', retryController.processManualRetry);

module.exports = router;
