const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', campaignController.getCampaigns);
router.post('/', campaignController.createCampaign);
router.get('/:id', campaignController.getCampaignById);
router.patch('/:id/status', campaignController.updateCampaignStatus);
router.post('/:id/upload', campaignController.uploadCampaignNumbers);

module.exports = router;
