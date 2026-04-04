const express = require('express');
const router = express.Router();
const outboundLeadController = require('../controllers/outboundLeadController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', outboundLeadController.getOutboundLeads);
router.patch('/:id', outboundLeadController.updateOutboundLead);
router.post('/:id/convert', outboundLeadController.convertToLead);
router.post('/:id/reminder', outboundLeadController.setReminder);

module.exports = router;
