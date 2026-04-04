const express = require('express');
const router = express.Router();
const { apiKeyAuth, requirePermission } = require('../middleware/apiKeyAuth');
const leadController = require('../controllers/leadController');
const employeeController = require('../controllers/employeeController');
const callLogController = require('../controllers/callLogController');
const analyticsController = require('../controllers/analyticsController');

router.use(apiKeyAuth);

// PUBLIC LEADS API
router.get('/leads', requirePermission('leads', 'read'), leadController.getLeads);
router.post('/leads', requirePermission('leads', 'write'), leadController.createLead);
router.get('/leads/:id', requirePermission('leads', 'read'), leadController.getLeadById);
router.patch('/leads/:id/status', requirePermission('leads', 'write'), leadController.updateLeadStatus);
router.post('/leads/:id/notes', requirePermission('leads', 'write'), leadController.addNote);

// EMPLOYEES
router.get('/employees', requirePermission('employees', 'read'), employeeController.getEmployees);

// CALL LOGS
router.post('/call-logs', requirePermission('call_logs', 'write'), callLogController.logCall);

// ANALYTICS
router.get('/analytics/summary', requirePermission('analytics', 'read'), analyticsController.getDashboardStats);

module.exports = router;
