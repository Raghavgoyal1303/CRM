const express = require('express');
const router = express.Router();
const blacklistController = require('../controllers/blacklistController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', blacklistController.getBlacklist);
router.post('/', blacklistController.addToBlacklist);
router.delete('/:id', blacklistController.removeFromBlacklist);

module.exports = router;
