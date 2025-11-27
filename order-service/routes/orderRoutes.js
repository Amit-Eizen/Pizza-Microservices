const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  deleteOrder
} = require('../controllers/orderController');

// Create new order
router.post('/', createOrder);

// Get all orders (Admin)
router.get('/', getAllOrders);

// Get orders by user ID
router.get('/user/:userId', getUserOrders);

// Get single order by ID
router.get('/:id', getOrderById);

// Update order status (Admin)
router.put('/:id/status', updateOrderStatus);
router.patch('/:id/status', updateOrderStatus);

// Cancel order (for users)
router.post('/:id/cancel', cancelOrder);

// Delete order (admin only - permanent deletion)
router.delete('/:id', deleteOrder);

module.exports = router;
