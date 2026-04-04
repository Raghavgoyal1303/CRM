const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const liveCallController = require('../controllers/liveCallController');
const { apiKeyAuth, requirePermission } = require('../middleware/apiKeyAuth');

/**
 * Generic IVR/External Lead Ingestion (Secured by API Key)
 * 
 * Usage: POST /api/webhook/ivr
 * Header: X-API-Key: YOUR_KEY
 * Body: { phone: "...", name: "...", source: "ivr", notes: "..." }
 */
router.post('/ivr', apiKeyAuth, requirePermission('leads', 'create'), webhookController.handleIvrLead);

// Legacy/Public Exotel endpoints (Company ID based)
router.post('/exotel/live-start/:company_id', liveCallController.startCall);
router.post('/exotel/live-end/:company_id', liveCallController.endCall);
router.post('/exotel/:companyId', webhookController.handleExotelWebhook);
router.get('/exotel/:companyId', webhookController.handleExotelWebhook);

module.exports = router;
