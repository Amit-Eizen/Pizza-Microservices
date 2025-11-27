// Order Controller - handles orders display logic
const axios = require('axios');

// Order Service URL (will be replaced by API Gateway later)
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003/api/orders';

// Display orders page
exports.getOrdersPage = async (req, res) => {
  try {
    // Check if user is logged in
    const isLoggedIn = !!req.cookies.token;

    // Get userId from session/cookie (for now using mock user ID)
    // TODO: Replace with actual user ID from JWT token
    const userId = '673ff91969b37a4d62f21db9';

    // Fetch orders from Order Service
    const response = await axios.get(`${ORDER_SERVICE_URL}/user/${userId}`);

    let orders = [];

    if (response.data.success && response.data.data) {
      // Map MongoDB data to match frontend expectations
      orders = response.data.data.map(order => {
        // Get first item's pizza name (simplified for display)
        const firstItem = order.items[0];
        const pizzaName = firstItem ? firstItem.pizzaName : 'Unknown';
        const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

        // Format date properly (DD/MM/YYYY)
        let formattedDate = 'Invalid Date';
        try {
          const dateObj = new Date(order.createdAt);
          if (!isNaN(dateObj.getTime())) {
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            formattedDate = `${day}/${month}/${year}`;
          }
        } catch (err) {
          console.error('Date parsing error:', err);
        }

        return {
          id: order._id,
          pizzaName: pizzaName,
          quantity: quantity,
          totalPrice: order.totalAmount,
          status: order.status,
          createdAt: formattedDate,
          items: order.items,
          deliveryAddress: order.deliveryAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus
        };
      });
    }

    res.render('orders', {
      title: 'My Orders',
      orders: orders,
      pageCSS: 'orders',
      currentPage: 'orders',
      isLoggedIn: isLoggedIn
    });

  } catch (error) {
    console.error('Error fetching orders:', error.message);

    // Check if user is logged in
    const isLoggedIn = !!req.cookies.token;

    // Fallback to empty array if Order Service is down
    res.render('orders', {
      title: 'My Orders',
      orders: [],
      pageCSS: 'orders',
      currentPage: 'orders',
      isLoggedIn: isLoggedIn,
      error: 'Unable to load orders. Please try again later.'
    });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    // Get userId from session/cookie (for now using mock user ID)
    // TODO: Replace with actual user ID from JWT token
    const userId = '673ff91969b37a4d62f21db9';

    // Create order via Order Service
    const response = await axios.post(ORDER_SERVICE_URL, {
      userId,
      items,
      deliveryAddress,
      paymentMethod
    });

    if (response.data.success) {
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: response.data.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.message || 'Failed to create order'
      });
    }

  } catch (error) {
    console.error('Error creating order:', error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to create order. Please try again later.'
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Cancel order via Order Service
    const response = await axios.delete(`${ORDER_SERVICE_URL}/${orderId}`);

    if (response.data.success) {
      res.status(200).json({
        success: true,
        message: response.data.message || 'Order cancelled successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.message || 'Failed to cancel order'
      });
    }

  } catch (error) {
    console.error('Error cancelling order:', error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to cancel order. Please try again later.'
    });
  }
};
