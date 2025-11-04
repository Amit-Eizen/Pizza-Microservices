const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/authMiddleware');

// Display orders page - requires authentication
router.get('/', requireAuth, orderController.getOrdersPage);

// API Routes - require authentication
// Create new order
router.post('/api/create', requireAuth, orderController.createOrder);

// Cancel order
router.delete('/api/:orderId', requireAuth, orderController.cancelOrder);

module.exports = router;
