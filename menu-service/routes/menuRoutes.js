const express = require('express');
const router = express.Router();
const {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
} = require('../controllers/menuController');

// GET all pizzas & POST new pizza
router.route('/')
  .get(getAllPizzas)
  .post(createPizza);

// GET, UPDATE, DELETE single pizza by ID
router.route('/:id')
  .get(getPizzaById)
  .put(updatePizza)
  .delete(deletePizza);

module.exports = router;
