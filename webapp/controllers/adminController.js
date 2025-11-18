// Admin Controller - manages admin operations
const axios = require('axios');

// Display admin dashboard with all orders
exports.getAdminDashboard = async (req, res) => {
  try {
    // Fetch all orders from Order Service
    const response = await axios.get(`${process.env.ORDER_SERVICE_URL}`, {
      headers: {
        Authorization: `Bearer ${req.cookies.token}`
      }
    });

    res.render('admin', {
      title: 'Admin Dashboard',
      orders: response.data.data || [],
      user: req.user
    });
  } catch (error) {
    console.error('Admin dashboard error:', error.message);
    res.render('admin', {
      title: 'Admin Dashboard',
      orders: [],
      user: req.user,
      error: 'Failed to load orders'
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await axios.patch(
      `${process.env.ORDER_SERVICE_URL}/${orderId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${req.cookies.token}`
        }
      }
    );

    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error('Update status error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

// Display admin menu management page
exports.getMenuManagement = async (req, res) => {
  try {
    // Fetch all pizzas from Menu Service
    const response = await axios.get(`${process.env.MENU_SERVICE_URL}`, {
      headers: {
        Authorization: `Bearer ${req.cookies.token}`
      }
    });

    res.render('admin-menu', {
      title: 'Menu Management',
      pizzas: response.data.data || [],
      user: req.user
    });
  } catch (error) {
    console.error('Menu management error:', error.message);
    res.render('admin-menu', {
      title: 'Menu Management',
      pizzas: [],
      user: req.user,
      error: 'Failed to load menu'
    });
  }
};

// Create new pizza
exports.createPizza = async (req, res) => {
  try {
    const pizzaData = req.body;

    const response = await axios.post(
      `${process.env.MENU_SERVICE_URL}`,
      pizzaData,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.token}`
        }
      }
    );

    res.json({ success: true, message: 'Pizza created successfully', data: response.data.data });
  } catch (error) {
    console.error('Create pizza error:', error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to create pizza'
    });
  }
};

// Update pizza
exports.updatePizza = async (req, res) => {
  try {
    const { pizzaId } = req.params;
    const pizzaData = req.body;

    const response = await axios.put(
      `${process.env.MENU_SERVICE_URL}/${pizzaId}`,
      pizzaData,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.token}`
        }
      }
    );

    res.json({ success: true, message: 'Pizza updated successfully', data: response.data.data });
  } catch (error) {
    console.error('Update pizza error:', error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to update pizza'
    });
  }
};

// Delete pizza
exports.deletePizza = async (req, res) => {
  try {
    const { pizzaId } = req.params;

    await axios.delete(
      `${process.env.MENU_SERVICE_URL}/${pizzaId}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.token}`
        }
      }
    );

    res.json({ success: true, message: 'Pizza deleted successfully' });
  } catch (error) {
    console.error('Delete pizza error:', error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to delete pizza'
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    await axios.delete(
      `${process.env.ORDER_SERVICE_URL}/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.token}`
        }
      }
    );

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to delete order'
    });
  }
};
