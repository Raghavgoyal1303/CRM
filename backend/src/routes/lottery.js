const express = require('express');
const router = express.Router();
const lotteryController = require('../controllers/lotteryController');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(authenticateToken);

router.get('/campaigns', lotteryController.listCampaigns);
router.post('/campaigns', lotteryController.createCampaign);
router.get('/campaigns/:id', lotteryController.getCampaign);
router.get('/campaigns/:id/participants', lotteryController.listParticipants);
router.post('/campaigns/:id/participants', lotteryController.addParticipant);
router.post('/campaigns/:id/import', upload.single('file'), lotteryController.importExcel);

module.exports = router;
