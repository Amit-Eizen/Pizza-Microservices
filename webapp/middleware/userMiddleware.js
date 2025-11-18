// User Middleware - fetches user info for all requests
const axios = require('axios');

// Middleware to fetch and attach user info to req.user
// This makes user data available in all views
exports.fetchUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      // No token - user not logged in
      req.user = null;
      res.locals.user = null;
      res.locals.isLoggedIn = false;
      return next();
    }

    // Fetch user profile from Auth Service
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success && response.data.user) {
      // Attach user to request and locals for views
      req.user = response.data.user;
      res.locals.user = response.data.user;
      res.locals.isLoggedIn = true;
    } else {
      req.user = null;
      res.locals.user = null;
      res.locals.isLoggedIn = false;
    }

    next();
  } catch (error) {
    // If token is invalid or expired, clear it
    if (error.response && error.response.status === 401) {
      res.clearCookie('token');
    }

    // Continue without user info
    req.user = null;
    res.locals.user = null;
    res.locals.isLoggedIn = false;
    next();
  }
};
