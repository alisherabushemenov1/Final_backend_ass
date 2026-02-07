const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  payment: {
    method: { type: String, enum: ['card'], required: true },
    cardholderName: { type: String },
    last4: { type: String }
  },
  status: { type: String, enum: ['paid'], default: 'paid' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
