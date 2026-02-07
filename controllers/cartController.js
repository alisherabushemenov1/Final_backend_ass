const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name price imageUrl quantity');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json({ success: true, data: cart });
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity == null) {
    return res.status(400).json({
      success: false,
      message: 'Product ID and quantity are required'
    });
  }

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a positive number'
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if ((product.quantity ?? 0) < qty) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.quantity} items available in stock`
    });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  cart.addItem(productId, qty, product.price);
  await cart.save();

  cart = await Cart.findById(cart._id).populate('items.product', 'name price imageUrl quantity');

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart
  });
});

// @desc    Update item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 0) {
    return res.status(400).json({ success: false, message: 'Valid quantity is required' });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  if (qty > 0) {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if ((product.quantity ?? 0) < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} items available`
      });
    }
  }

  cart.updateItemQuantity(productId, qty);
  await cart.save();

  const updatedCart = await Cart.findById(cart._id)
    .populate('items.product', 'name price imageUrl quantity');

  res.status(200).json({
    success: true,
    message: 'Cart updated',
    data: updatedCart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

  cart.removeItem(productId);
  await cart.save();

  const updatedCart = await Cart.findById(cart._id)
    .populate('items.product', 'name price imageUrl quantity');

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: updatedCart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

  cart.clearCart();
  await cart.save();

  res.status(200).json({ success: true, message: 'Cart cleared', data: cart });
});

// @desc    Checkout (demo payment + save Order + clear cart)
// @route   POST /api/cart/checkout
// @access  Private
exports.checkout = asyncHandler(async (req, res) => {
  const { paymentMethod, cardholderName, last4 } = req.body;

  if (!paymentMethod) {
    return res.status(400).json({ success: false, message: 'Payment method is required' });
  }

  if (paymentMethod === 'card') {
    if (!cardholderName || !String(cardholderName).trim()) {
      return res.status(400).json({ success: false, message: 'Cardholder name is required' });
    }
    const l4 = String(last4 || '');
    if (!/^\d{4}$/.test(l4)) {
      return res.status(400).json({ success: false, message: 'last4 is required (4 digits)' });
    }
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  // Stock check
  for (const item of cart.items) {
    if (!item.product) {
      return res.status(400).json({
        success: false,
        message: 'Some cart items reference missing products'
      });
    }
    if ((item.product.quantity ?? 0) < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.product.name}`
      });
    }
  }

  // Update product stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { quantity: -item.quantity }
    });
  }

  // ✅ Save order to DB (THIS MUST BE INSIDE CHECKOUT)
  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity
    })),
    totalPrice: cart.totalPrice,
    payment: {
      method: paymentMethod,
      cardholderName: paymentMethod === 'card' ? String(cardholderName).trim() : undefined,
      last4: paymentMethod === 'card' ? String(last4) : undefined
    },
    status: 'paid'
  });

  const orderSummary = {
    orderId: order._id,
    items: order.items,
    totalPrice: order.totalPrice,
    payment: order.payment,
    purchasedAt: order.createdAt
  };

  // Clear cart
  cart.clearCart();
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Purchase successful!',
    data: orderSummary
  });
});
