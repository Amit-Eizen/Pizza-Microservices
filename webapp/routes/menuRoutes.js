const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { requireAuth } = require('../middleware/authMiddleware');

// Display menu page - requires authentication
router.get('/', requireAuth, menuController.getMenuPage);

module.exports = router;
