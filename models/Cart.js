const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: {
      type: [cartItemSchema],
      default: []
    },
    totalPrice: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

cartSchema.pre('save', function () {
  this.totalPrice = this.items.reduce((total, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return total + price * qty;
  }, 0);
});


// ✅ Add item to cart
cartSchema.methods.addItem = function (productId, quantity, price) {
  const qty = Number(quantity);
  const pr = Number(price);

  if (!Number.isFinite(qty) || qty <= 0) return;
  if (!Number.isFinite(pr) || pr < 0) return;

  const existingItem = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity = Number(existingItem.quantity) + qty;
    // price оставляем как есть или обновляем текущей ценой:
    existingItem.price = pr;
  } else {
    this.items.push({ product: productId, quantity: qty, price: pr });
  }
};

// ✅ Remove item from cart
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
};

// ✅ Update item quantity (qty=0 => remove)
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
  const qty = Number(quantity);
  if (!Number.isFinite(qty)) return;

  const item = this.items.find(
    (i) => i.product.toString() === productId.toString()
  );

  if (!item) return;

  if (qty <= 0) {
    this.removeItem(productId);
  } else {
    item.quantity = qty;
  }
};

// ✅ Clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.totalPrice = 0;
};

module.exports = mongoose.model('Cart', cartSchema);
