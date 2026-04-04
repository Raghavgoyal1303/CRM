const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', communicationController.getCommunications);
router.get('/lead/:leadId', communicationController.getLeadCommunications);
router.post('/send-sms', communicationController.sendManualSMS);
router.post('/send-whatsapp', communicationController.sendManualWhatsApp);

module.exports = router;
