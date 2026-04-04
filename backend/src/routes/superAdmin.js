const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { protect, roleGuard } = require('../middleware/auth');

router.use(protect, roleGuard(['super_admin']));

router.get('/stats', superAdminController.getGlobalStats);
router.get('/companies', superAdminController.getCompanies);
router.post('/companies', superAdminController.createCompany);
router.delete('/companies/:id', superAdminController.deleteCompany);
router.patch('/companies/:id/suspend', superAdminController.toggleSuspension);
router.get('/activity', superAdminController.getGlobalActivity);
router.get('/activity/export', superAdminController.exportActivityReport);
router.patch('/password', superAdminController.updatePassword);

module.exports = router;
