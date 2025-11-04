// Order Controller - handles orders display logic

// Display orders page
exports.getOrdersPage = (req, res) => {
  // TODO: Fetch orders from Order Service via API Gateway

  // Mock data for now
  const orders = [
    {
      id: 1,
      pizzaName: 'Margherita',
      quantity: 2,
      totalPrice: 90,
      status: 'Delivered',
      createdAt: '2025-11-01'
    },
    {
      id: 2,
      pizzaName: 'Pepperoni',
      quantity: 1,
      totalPrice: 55,
      status: 'Preparing',
      createdAt: '2025-11-03'
    },
    {
      id: 3,
      pizzaName: 'Vegetarian',
      quantity: 3,
      totalPrice: 150,
      status: 'Pending',
      createdAt: '2025-11-04'
    }
  ];

  res.render('orders', {
    title: 'My Orders',
    orders: orders,
    pageCSS: 'orders',
    currentPage: 'orders'
  });
};
