const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Display auth page (login/register in one page)
router.get('/login', authController.getAuthPage);
router.get('/register', authController.getAuthPage); // Same page, JS toggles

// Handle login (will connect to API later)
router.post('/login', authController.handleLogin);

// Handle register (will connect to API later)
router.post('/register', authController.handleRegister);

// Handle logout
router.get('/logout', authController.handleLogout);

module.exports = router;
