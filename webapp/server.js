const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/', authRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', orderRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    pageCSS: 'home',
    currentPage: 'home'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('partials/404', { title: 'Page Not Found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍕 Frontend server running on http://localhost:${PORT}`);
});
