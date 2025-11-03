// Auth Controller - handles authentication logic

// Display auth page (both login and register in one page)
exports.getAuthPage = (req, res) => {
  res.render('auth/login', {
    title: 'Authentication',
    error: null
  });
};

// Handle login (will connect to Auth Service API later)
exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO: Call Auth Service API via API Gateway
    // For now, just redirect to menu
    console.log('Login attempt:', email);

    // Temporary: set a mock token in cookie
    res.cookie('token', 'mock-jwt-token', { httpOnly: true });
    res.redirect('/menu');

  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      title: 'Login',
      error: 'Login failed. Please try again.'
    });
  }
};

// Handle register (will connect to Auth Service API later)
exports.handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // TODO: Call Auth Service API via API Gateway
    console.log('Register attempt:', name, email);

    // Temporary: redirect to login
    res.redirect('/login');

  } catch (error) {
    console.error('Register error:', error);
    res.render('auth/register', {
      title: 'Register',
      error: 'Registration failed. Please try again.'
    });
  }
};

// Handle logout
exports.handleLogout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
