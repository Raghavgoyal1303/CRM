const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const leadLockController = require('../controllers/leadLockController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', leadController.getLeads);
router.post('/', leadController.createLead);
router.get('/:id', leadController.getLeadById);
router.patch('/:id/status', leadController.updateLeadStatus);
router.delete('/:id', leadController.deleteLead);
router.post('/:id/notes', leadController.addNote);

// Lead Locking (Phase 3)
router.post('/:id/lock', leadLockController.lockLead);
router.delete('/:id/lock', leadLockController.releaseLock);
router.get('/:id/lock', leadLockController.checkLock);

module.exports = router;
