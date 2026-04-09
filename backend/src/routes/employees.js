const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, roleGuard } = require('../middleware/auth');

router.use(protect, roleGuard(['admin']));

router.get('/', employeeController.getEmployees);
router.post('/', employeeController.createEmployee);
router.patch('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.patch('/:id/reset-password', employeeController.resetPassword);

module.exports = router;
