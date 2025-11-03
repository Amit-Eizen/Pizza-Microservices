const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Display orders page
router.get('/', orderController.getOrdersPage);

module.exports = router;
