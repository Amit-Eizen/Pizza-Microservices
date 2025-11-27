const Order = require('../models/Order');
const axios = require('axios');

const MENU_SERVICE_URL = process.env.MENU_SERVICE_URL || 'http://localhost:3002/api/menu';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (requires authentication)
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, deliveryAddress, paymentMethod } = req.body;

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      // Fetch pizza details from Menu Service
      const pizzaResponse = await axios.get(`${MENU_SERVICE_URL}/${item.pizzaId}`);

      if (!pizzaResponse.data.success) {
        return res.status(404).json({
          success: false,
          message: `Pizza with ID ${item.pizzaId} not found`
        });
      }

      const pizza = pizzaResponse.data.data;

      // Check if pizza is available
      if (!pizza.available) {
        return res.status(400).json({
          success: false,
          message: `${pizza.name} is currently unavailable`
        });
      }

      // Calculate item total
      const itemTotal = pizza.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        pizzaId: pizza._id,
        pizzaName: pizza.name,
        quantity: item.quantity,
        price: pizza.price
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'Pending'
    });

    res.status(201).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get orders by user ID
// @route   GET /api/orders/user/:userId
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow cancellation if order is still pending
    if (order.status !== 'pending' && order.status !== 'preparing') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that is already being prepared or delivered'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete order (admin only - permanent deletion)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
