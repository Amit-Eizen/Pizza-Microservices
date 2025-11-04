// Auth Controller - handles authentication logic
const axios = require('axios');

// Auth Service URL (will be replaced by API Gateway later)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001/api/auth';

// Display auth page (both login and register in one page)
exports.getAuthPage = (req, res) => {
  res.render('login', {
    title: 'Authentication',
    error: null
  });
};

// Handle login - calls Auth Service
exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call Auth Service login endpoint
    const response = await axios.post(`${AUTH_SERVICE_URL}/login`, {
      email,
      password
    });

    // If successful, set JWT token in HTTP-only cookie
    if (response.data.success && response.data.token) {
      res.cookie('token', response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Store user info in session (optional, or send to frontend)
      console.log('User logged in:', response.data.user.email);

      res.redirect('/menu');
    } else {
      throw new Error('Invalid response from Auth Service');
    }

  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);

    const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';

    res.render('login', {
      title: 'Authentication',
      error: errorMessage
    });
  }
};

// Handle register - calls Auth Service
exports.handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Call Auth Service register endpoint
    const response = await axios.post(`${AUTH_SERVICE_URL}/register`, {
      name,
      email,
      password
    });

    // If successful, set JWT token in HTTP-only cookie
    if (response.data.success && response.data.token) {
      res.cookie('token', response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      console.log('User registered:', response.data.user.email);

      // Redirect to menu after successful registration
      res.redirect('/menu');
    } else {
      throw new Error('Invalid response from Auth Service');
    }

  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);

    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';

    res.render('login', {
      title: 'Authentication',
      error: errorMessage
    });
  }
};

// Handle logout
exports.handleLogout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
