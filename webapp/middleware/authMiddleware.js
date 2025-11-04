// Authentication Middleware
// Protects routes from unauthorized access

exports.requireAuth = (req, res, next) => {
  // Check if user has token cookie
  const token = req.cookies.token;

  if (!token) {
    // User not logged in - redirect to login page
    return res.redirect('/login');
  }

  // User is logged in - continue to the route
  next();
};

exports.redirectIfLoggedIn = (req, res, next) => {
  // Check if user has token cookie
  const token = req.cookies.token;

  if (token) {
    // User already logged in - redirect to menu
    return res.redirect('/menu');
  }

  // User not logged in - continue to login page
  next();
};
