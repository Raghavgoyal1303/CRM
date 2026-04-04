const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developerController');
const { authenticateToken } = require('../middleware/auth');

router.get('/ping', developerController.ping);

router.use(authenticateToken);

router.get('/keys', developerController.listKeys);
router.post('/keys', developerController.generateKey);
router.delete('/keys/:id', developerController.revokeKey);
router.get('/keys/:id/logs', developerController.getUsageLogs);

module.exports = router;
