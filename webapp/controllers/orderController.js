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
      createdAt: '2024-11-01'
    },
    {
      id: 2,
      pizzaName: 'Pepperoni',
      quantity: 1,
      totalPrice: 55,
      status: 'Preparing',
      createdAt: '2024-11-03'
    }
  ];

  res.render('orders', {
    title: 'My Orders',
    orders: orders
  });
};
