// Menu Controller - handles menu display logic
const axios = require('axios');

// Menu Service URL (will be replaced by API Gateway later)
const MENU_SERVICE_URL = process.env.MENU_SERVICE_URL || 'http://localhost:3002/api/menu';

// Display menu page
exports.getMenuPage = async (req, res) => {
  try {
    // Check if user is logged in
    const isLoggedIn = !!req.cookies.token;

    // Fetch pizzas from Menu Service
    const response = await axios.get(MENU_SERVICE_URL);

    let pizzas = [];

    if (response.data.success && response.data.data) {
      // Map MongoDB data to match frontend expectations
      pizzas = response.data.data.map(pizza => ({
        id: pizza._id,
        name: pizza.name,
        description: pizza.description,
        price: pizza.price,
        image: pizza.image,
        category: pizza.category,
        ingredients: pizza.ingredients,
        available: pizza.available
      }));
    }

    res.render('menu', {
      title: 'Menu',
      pizzas: pizzas,
      pageCSS: 'menu',
      currentPage: 'menu',
      isLoggedIn: isLoggedIn
    });

  } catch (error) {
    console.error('Error fetching menu:', error.message);

    // Check if user is logged in
    const isLoggedIn = !!req.cookies.token;

    // Fallback to empty array if Menu Service is down
    res.render('menu', {
      title: 'Menu',
      pizzas: [],
      pageCSS: 'menu',
      currentPage: 'menu',
      isLoggedIn: isLoggedIn,
      error: 'Unable to load menu. Please try again later.'
    });
  }
};
