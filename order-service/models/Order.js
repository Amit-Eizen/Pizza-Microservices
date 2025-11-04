const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please add a user ID'],
    ref: 'User'
  },
  items: [{
    pizzaId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please add a pizza ID']
    },
    pizzaName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: [true, 'Please add quantity'],
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: [true, 'Please add price']
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Please add total amount'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  deliveryAddress: {
    street: {
      type: String,
      required: [true, 'Please add street address']
    },
    city: {
      type: String,
      required: [true, 'Please add city']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add zip code']
    }
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Online'],
    default: 'Cash'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
