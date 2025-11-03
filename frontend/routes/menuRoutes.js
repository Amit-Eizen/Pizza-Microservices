const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Display menu page
router.get('/', menuController.getMenuPage);

module.exports = router;
