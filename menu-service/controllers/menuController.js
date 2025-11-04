const Pizza = require('../models/Pizza');

// @desc    Get all pizzas
// @route   GET /api/menu
// @access  Public
exports.getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();

    res.status(200).json({
      success: true,
      count: pizzas.length,
      data: pizzas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single pizza by ID
// @route   GET /api/menu/:id
// @access  Public
exports.getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pizza
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new pizza
// @route   POST /api/menu
// @access  Private (Admin only - will add auth later)
exports.createPizza = async (req, res) => {
  try {
    const { name, description, price, image, category, ingredients } = req.body;

    // Check if pizza already exists
    const pizzaExists = await Pizza.findOne({ name });
    if (pizzaExists) {
      return res.status(400).json({
        success: false,
        message: 'Pizza with this name already exists'
      });
    }

    // Create pizza
    const pizza = await Pizza.create({
      name,
      description,
      price,
      image,
      category,
      ingredients
    });

    res.status(201).json({
      success: true,
      data: pizza
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update pizza
// @route   PUT /api/menu/:id
// @access  Private (Admin only - will add auth later)
exports.updatePizza = async (req, res) => {
  try {
    let pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza not found'
      });
    }

    pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: pizza
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete pizza
// @route   DELETE /api/menu/:id
// @access  Private (Admin only - will add auth later)
exports.deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza not found'
      });
    }

    await pizza.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Pizza deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
