// Menu Controller - handles menu display logic

// Display menu page
exports.getMenuPage = (req, res) => {
  // TODO: Fetch pizzas from Menu Service via API Gateway

  // Mock data for now
  const pizzas = [
    {
      id: 1,
      name: 'Margherita',
      description: 'Classic tomato sauce, mozzarella, and basil',
      price: 45,
      image: '/images/margherita.jpg'
    },
    {
      id: 2,
      name: 'Pepperoni',
      description: 'Tomato sauce, mozzarella, and pepperoni',
      price: 55,
      image: '/images/pepperoni.jpg'
    },
    {
      id: 3,
      name: 'Vegetarian',
      description: 'Tomato sauce, mozzarella, peppers, mushrooms, olives',
      price: 50,
      image: '/images/vegetarian.jpg'
    }
  ];

  res.render('menu', {
    title: 'Menu',
    pizzas: pizzas,
    pageCSS: 'menu',
    currentPage: 'menu'
  });
};
