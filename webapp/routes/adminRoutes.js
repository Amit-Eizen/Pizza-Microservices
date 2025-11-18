const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

// Display admin dashboard
router.get('/', adminController.getAdminDashboard);

// Order management routes
router.post('/update-status', adminController.updateOrderStatus);
router.delete('/delete-order/:orderId', adminController.deleteOrder);

// Menu management routes
router.get('/menu', adminController.getMenuManagement);
router.post('/menu', adminController.createPizza);
router.put('/menu/:pizzaId', adminController.updatePizza);
router.delete('/menu/:pizzaId', adminController.deletePizza);

module.exports = router;
