const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUpController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', followUpController.getFollowUps);
router.post('/', followUpController.createFollowUp);
router.patch('/:id/status', followUpController.updateFollowUpStatus);
router.delete('/:id', followUpController.deleteFollowUp);

module.exports = router;
