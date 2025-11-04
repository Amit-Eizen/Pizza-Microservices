const mongoose = require('mongoose');

const PizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a pizza name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL'],
    default: '/images/default-pizza.jpg'
  },
  category: {
    type: String,
    enum: ['Classic', 'Premium', 'Vegetarian', 'Vegan', 'Spicy'],
    default: 'Classic'
  },
  ingredients: {
    type: [String],
    required: [true, 'Please add ingredients']
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pizza', PizzaSchema);
