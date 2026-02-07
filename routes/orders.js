const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const Order = require('../models/Order');

// All order routes require authentication
router.use(authenticate);

// ✅ User: Can see their own orders
router.get('/my', async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
});

// ✅ Admin:Can see all orders
router.get('/', authorize('admin'), async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email role') 
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
});

module.exports = router;
