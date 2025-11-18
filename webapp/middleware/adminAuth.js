// Admin authentication middleware
const jwt = require('jsonwebtoken');
const axios = require('axios');

const adminAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/login');
    }

    // Verify token and get user info
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Check if user is admin
    if (response.data.user.role !== 'admin') {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to access this page.'
      });
    }

    // User is admin, proceed
    req.user = response.data.user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    res.redirect('/login');
  }
};

module.exports = adminAuth;
