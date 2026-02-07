const API_URL = '/api';
let currentUser = null;
let authToken = localStorage.getItem('token');
let currentProductId = null;
let selectedRating = 5;
let cart = null;

// ================= ADMIN ORDERS PANEL =================
let adminOrdersCache = [];

window.addEventListener('DOMContentLoaded', async () => {
  if (authToken) {
    await loadProfile();
  }
  loadProducts();
  initializeRatingStars();
});

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.form-section').forEach(f => f.classList.remove('active'));

  if (tab === 'login') {
    document.querySelectorAll('.tab')[0].classList.add('active');
    document.getElementById('loginForm').classList.add('active');
  } else {
    document.querySelectorAll('.tab')[1].classList.add('active');
    document.getElementById('registerForm').classList.add('active');
  }
}

function showAlert(message, type = 'success') {
  const container = document.getElementById('alertContainer');
  container.innerHTML = `<div class="alert ${type} show">${message}</div>`;
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

function initializeRatingStars() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', function () {
      selectedRating = parseInt(this.dataset.rating, 10);
      updateStars(selectedRating);
    });
  });
  updateStars(5);
}

function updateStars(rating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) star.classList.add('active');
    else star.classList.remove('active');
  });
}

function previewImage() {
  const url = document.getElementById('productImageUrl').value;
  const preview = document.getElementById('imagePreview');

  if (url) {
    preview.src = url;
    preview.classList.add('show');
    preview.onerror = () => {
      showAlert('Invalid image URL', 'error');
      preview.classList.remove('show');
    };
  } else {
    preview.classList.remove('show');
  }
}

async function register() {
  const data = {
    name: document.getElementById('regName').value.trim(),
    email: document.getElementById('regEmail').value.trim(),
    password: document.getElementById('regPassword').value,
    role: document.getElementById('regRole').value
  };

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('✅ Registration successful!', 'success');
      switchTab('login');
      document.getElementById('loginEmail').value = data.email;
    } else {
      showAlert('❌ ' + result.message, 'error');
    }
  } catch (error) {
    showAlert('❌ Network error', 'error');
  }
}

async function login() {
  const data = {
    email: document.getElementById('loginEmail').value.trim(),
    password: document.getElementById('loginPassword').value
  };

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      authToken = result.data.token;
      localStorage.setItem('token', authToken);
      currentUser = result.data.user;

      showAlert('✅ Login successful!', 'success');
      updateUI();
      loadProducts();
      loadCart();
    } else {
      showAlert('❌ ' + result.message, 'error');
    }
  } catch (error) {
    showAlert('❌ Network error', 'error');
  }
}

async function loadProfile() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const result = await res.json();

    if (result.success) {
      currentUser = result.data;
      updateUI();
      loadCart();
    } else {
      localStorage.removeItem('token');
      authToken = null;
    }
  } catch (error) {
    localStorage.removeItem('token');
    authToken = null;
  }
}

function updateUI() {
  if (currentUser) {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('userInfo').classList.add('show');
    document.getElementById('userName').textContent = `${currentUser.name} (${currentUser.role})`;

    if (currentUser.role === 'admin') {
      document.getElementById('adminSection').classList.remove('hidden');
      document.querySelectorAll('.admin-controls').forEach(el => el.classList.add('show'));
    }

    // ✅ show/hide admin orders button
    updateAdminOrdersButton();
  }
}

function logout() {
  localStorage.removeItem('token');
  authToken = null;
  currentUser = null;
  cart = null;
  location.reload();
}

async function createProduct() {
  const data = {
    name: document.getElementById('productName').value.trim(),
    price: parseFloat(document.getElementById('productPrice').value),
    quantity: parseInt(document.getElementById('productQuantity').value, 10) || 0,
    description: document.getElementById('productDesc').value.trim(),
    category: document.getElementById('productCategory').value,
    imageUrl: document.getElementById('productImageUrl').value.trim() || undefined
  };

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('✅ Product created!', 'success');
      loadProducts();
      document.getElementById('productName').value = '';
      document.getElementById('productPrice').value = '';
      document.getElementById('productQuantity').value = '0';
      document.getElementById('productDesc').value = '';
      document.getElementById('productImageUrl').value = '';
      document.getElementById('imagePreview').classList.remove('show');
    } else {
      showAlert('❌ ' + result.message, 'error');
    }
  } catch (error) {
    showAlert('❌ Network error', 'error');
  }
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const result = await res.json();

    const container = document.getElementById('productsContainer');

    if (result.success && result.data && result.data.length > 0) {
      container.innerHTML = `<div class="products-grid">${result.data.map(p => `
        <div class="product-card">
          <img src="${p.imageUrl || 'https://via.placeholder.com/300'}"
               alt="${p.name}"
               class="product-image"
               onerror="this.src='https://via.placeholder.com/300'">
          <div class="product-name">${p.name}</div>
          <div class="product-price">$${Number(p.price).toFixed(2)}</div>
          <p style="color: #666; margin-bottom: 10px;">${p.description}</p>
          <div class="product-meta">
            <span class="badge badge-category">${p.category}</span>
            <span class="badge badge-qty">Stock: ${p.quantity ?? 0}</span>
          </div>

          <div class="product-actions">
            ${currentUser ? `
              <button class="btn btn-small btn-cart" onclick="addToCart('${p._id}')">
                🛒 Add to Cart
              </button>
            ` : ''}
            <button class="btn btn-small btn-review"
                    onclick="openReviewsModal('${p._id}', '${String(p.name).replace(/'/g, "\\'")}')">
              ⭐ Reviews
            </button>
          </div>

          <div class="admin-controls">
            <button class="btn btn-small btn-delete" onclick="deleteProduct('${p._id}')">
              🗑️ Delete
            </button>
          </div>
        </div>
      `).join('')}</div>`;

      if (currentUser && currentUser.role === 'admin') {
        document.querySelectorAll('.admin-controls').forEach(el => el.classList.add('show'));
      }
    } else {
      container.innerHTML = '<p style="text-align:center; padding:40px; color:#999;">No products found</p>';
    }
  } catch (error) {
    document.getElementById('productsContainer').innerHTML =
      '<p style="text-align:center; color:#e74c3c;">Error loading products</p>';
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const result = await res.json();

    if (result.success) {
      showAlert('✅ Product deleted!', 'success');
      loadProducts();
    } else {
      showAlert('❌ ' + result.message, 'error');
    }
  } catch (error) {
    showAlert('❌ Delete failed', 'error');
  }
}

async function loadCart() {
  if (!authToken) return;

  try {
    const res = await fetch(`${API_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const result = await res.json();

    if (result.success) {
      cart = result.data;
      updateCartBadge();
    }
  } catch (error) {
    console.error('Cart load error:', error);
  }
}

function updateCartBadge() {
  if (cart && cart.items) {
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = totalItems;
  } else {
    document.getElementById('cartBadge').textContent = '0';
  }
}

async function addToCart(productId) {
  try {
    const res = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    const result = await res.json();

    if (result.success) {
      cart = result.data;
      updateCartBadge();
      showAlert('✅ Added to cart!', 'success');
    } else {
      showAlert('❌ ' + result.message, 'error');
    }
  } catch (error) {
    showAlert('❌ Failed to add to cart', 'error');
  }
}

async function updateCartItemQty(productId, newQty) {
  try {
    const res = await fetch(`${API_URL}/cart/items/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ quantity: newQty })
    });

    const result = await res.json();

    if (result.success) {
      cart = result.data;
      renderCart();
      updateCartBadge();
    } else {
      showAlert('❌ ' + result.message, 'error');
    }
  } catch (error) {
    showAlert('❌ Update failed', 'error');
  }
}

async function removeFromCart(productId) {
  try {
    const res = await fetch(`${API_URL}/cart/items/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const result = await res.json();

    if (result.success) {
      cart = result.data;
      renderCart();
      updateCartBadge();
      showAlert('✅ Removed from cart', 'success');
    }
  } catch (error) {
    showAlert('❌ Remove failed', 'error');
  }
}

function openCartModal() {
  if (!currentUser) {
    showAlert('❌ Please login to view cart', 'error');
    return;
  }

  document.getElementById('cartModal').classList.add('show');
  renderCart();
}

function closeCartModal() {
  document.getElementById('cartModal').classList.remove('show');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (!cart || cart.items.length === 0) {
    container.innerHTML = '<div class="empty-cart">🛒 Your cart is empty</div>';
    totalEl.textContent = '$0.00';
    return;
  }

  container.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <img src="${item.product.imageUrl || 'https://via.placeholder.com/80'}"
           alt="${item.product.name}"
           class="cart-item-image"
           onerror="this.src='https://via.placeholder.com/80'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-item-price">$${Number(item.price).toFixed(2)} each</div>
        <div style="color: #999; font-size: 0.9rem;">Stock: ${item.product.quantity ?? 0}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateCartItemQty('${item.product._id}', ${item.quantity - 1})">-</button>
        <span class="qty-display">${item.quantity}</span>
        <button class="qty-btn" onclick="updateCartItemQty('${item.product._id}', ${item.quantity + 1})">+</button>
        <button class="btn btn-small btn-delete" onclick="removeFromCart('${item.product._id}')">🗑️</button>
      </div>
    </div>
  `).join('');

  totalEl.textContent = `$${Number(cart.totalPrice || 0).toFixed(2)}`;
}

// ✅ Checkout now opens payment modal (no confirm popup)
async function checkout() {
  if (!cart || cart.items.length === 0) {
    showAlert('❌ Cart is empty', 'error');
    return;
  }
  openPaymentModal();
}

async function openReviewsModal(productId, productName) {
  currentProductId = productId;
  document.getElementById('modalProductName').textContent = `Reviews - ${productName}`;
  document.getElementById('reviewsModal').classList.add('show');

  if (currentUser) {
    document.getElementById('addReviewSection').classList.remove('hidden');
    document.getElementById('reviewAuthor').value = currentUser.name || '';
  } else {
    document.getElementById('addReviewSection').classList.add('hidden');
  }

  selectedRating = 5;
  updateStars(5);
  await loadReviews(productId);
}

function closeReviewsModal() {
  document.getElementById('reviewsModal').classList.remove('show');
  currentProductId = null;
  document.getElementById('reviewAuthor').value = '';
  document.getElementById('reviewComment').value = '';
  document.getElementById('reviewRecommended').checked = true;
  selectedRating = 5;
  updateStars(5);
}

async function loadReviews(productId) {
  const container = document.getElementById('reviewsList');
  container.innerHTML = '<div class="no-reviews">Loading reviews...</div>';

  try {
    const res = await fetch(`${API_URL}/products/${productId}/reviews`);
    const result = await res.json();

    if (result.success && result.data && result.data.length > 0) {
      container.innerHTML = result.data.map(r => `
        <div class="review-item">
          <div class="review-header">
            <span class="review-author">👤 ${r.author}</span>
            <span class="review-rating">${'⭐'.repeat(r.rating)}</span>
          </div>
          <div class="review-comment">${r.comment}</div>
          ${r.recommended ? '<span style="color:#2e7d32; font-size:0.9rem;">✅ Recommended</span>' : ''}
          <div class="review-date">📅 ${new Date(r.createdAt).toLocaleDateString()}</div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<div class="no-reviews">No reviews yet. Be the first!</div>';
    }
  } catch (error) {
    container.innerHTML = '<div class="no-reviews" style="color:#e74c3c;">Error loading reviews</div>';
  }
}

async function submitReview() {
  if (!currentUser) {
    showAlert('❌ Please login to write a review', 'error');
    return;
  }

  const data = {
    author: document.getElementById('reviewAuthor').value.trim(),
    rating: selectedRating,
    comment: document.getElementById('reviewComment').value.trim(),
    recommended: document.getElementById('reviewRecommended').checked
  };

  if (!data.author || !data.comment) {
    showAlert('❌ Please fill all fields', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/products/${currentProductId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('✅ Review submitted!', 'success');
      document.getElementById('reviewComment').value = '';
      document.getElementById('reviewRecommended').checked = true;
      selectedRating = 5;
      updateStars(5);
      await loadReviews(currentProductId);
    } else {
      showAlert('❌ ' + result.message, 'error');
    }
  } catch (error) {
    showAlert('❌ Network error', 'error');
  }
}

// Close modals by clicking outside (cart + reviews + payment + admin orders)
window.addEventListener('click', (e) => {
  const cartModal = document.getElementById('cartModal');
  const reviewsModal = document.getElementById('reviewsModal');
  const paymentModal = document.getElementById('paymentModal');
  const adminOrdersModal = document.getElementById('adminOrdersModal');

  if (e.target === cartModal) closeCartModal();
  if (e.target === reviewsModal) closeReviewsModal();
  if (e.target === paymentModal) closePaymentModal();
  if (e.target === adminOrdersModal) closeAdminOrdersModal();
});

// ================= PAYMENT MODAL (DEMO) =================

function openPaymentModal() {
  const err = document.getElementById('paymentError');
  if (err) {
    err.style.display = 'none';
    err.textContent = '';
  }
  document.getElementById('paymentModal').classList.add('show');
}

function closePaymentModal() {
  document.getElementById('paymentModal').classList.remove('show');
}

function showPaymentError(msg) {
  const err = document.getElementById('paymentError');
  err.textContent = msg;
  err.style.display = 'block';
  err.classList.add('show');
}

// Simple formatting for card fields
document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'cardNumber') {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = digits.replace(/(.{4})/g, '$1 ').trim();
  }

  if (e.target && e.target.id === 'cardExpiry') {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
  }

  if (e.target && e.target.id === 'cardCvc') {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
  }
});

async function payNow() {
  const token = localStorage.getItem('token');
  if (!token) {
    showPaymentError('You must be logged in to pay.');
    return;
  }

  const name = document.getElementById('cardholderName').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
  const exp = document.getElementById('cardExpiry').value.trim();
  const cvc = document.getElementById('cardCvc').value.trim();

  if (!name) return showPaymentError('Please enter the cardholder name.');
  if (cardNumber.length < 12) return showPaymentError('Please enter a valid card number (demo).');
  if (!/^\d{2}\/\d{2}$/.test(exp)) return showPaymentError('Expiry must be in MM/YY format.');
  if (cvc.length < 3) return showPaymentError('CVC must be 3–4 digits.');

  const payload = {
    paymentMethod: 'card',
    cardholderName: name,
    last4: cardNumber.slice(-4)
  };

  try {
    const res = await fetch(`${API_URL}/cart/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      showPaymentError(data.message || 'Payment failed.');
      return;
    }

    closePaymentModal();
    closeCartModal();

    showAlert('✅ Payment successful! Order placed.', 'success');

    cart = { items: [], totalPrice: 0 };
    updateCartBadge();
    loadProducts();

    document.getElementById('cardholderName').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('cardExpiry').value = '';
    document.getElementById('cardCvc').value = '';
  } catch (err) {
    showPaymentError('Network error. Please try again.');
  }
}

// ================= ADMIN ORDERS IMPLEMENTATION =================

function updateAdminOrdersButton() {
  const btn = document.getElementById('adminOrdersBtn');
  if (!btn) return;

  if (currentUser && currentUser.role === 'admin') btn.classList.remove('hidden');
  else btn.classList.add('hidden');
}

function openAdminOrdersModal() {
  if (!currentUser) {
    showAlert('❌ Please login', 'error');
    return;
  }
  if (currentUser.role !== 'admin') {
    showAlert('❌ Access denied: Admin only', 'error');
    return;
  }

  document.getElementById('adminOrdersModal').classList.add('show');
  loadAdminOrders();
}

function closeAdminOrdersModal() {
  document.getElementById('adminOrdersModal').classList.remove('show');
}

async function loadAdminOrders() {
  try {
    if (!authToken) {
      showAlert('❌ Please login', 'error');
      return;
    }

    const res = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      showAlert('❌ ' + (result.message || 'Failed to load orders'), 'error');
      return;
    }

    adminOrdersCache = Array.isArray(result.data) ? result.data : [];
    renderAdminOrders();
  } catch (err) {
    showAlert('❌ Network error while loading orders', 'error');
  }
}

function renderAdminOrders() {
  const list = document.getElementById('adminOrdersList');
  if (!list) return;

  const q = (document.getElementById('ordersSearch')?.value || '').trim().toLowerCase();
  const sort = document.getElementById('ordersSort')?.value || 'newest';

  let items = [...adminOrdersCache];

  items.sort((a, b) => {
    const da = new Date(a.createdAt || 0).getTime();
    const db = new Date(b.createdAt || 0).getTime();
    return sort === 'oldest' ? da - db : db - da;
  });

  if (q) {
    items = items.filter(o => {
      const id = String(o._id || '').toLowerCase();
      const userName = String(o.user?.name || '').toLowerCase();
      const userEmail = String(o.user?.email || '').toLowerCase();
      const status = String(o.status || '').toLowerCase();
      return id.includes(q) || userName.includes(q) || userEmail.includes(q) || status.includes(q);
    });
  }

  if (!items.length) {
    list.innerHTML = `<div class="no-reviews">No orders found</div>`;
    return;
  }

  list.innerHTML = items.map(o => {
    const created = o.createdAt ? new Date(o.createdAt).toLocaleString() : '—';
    const userText = o.user
      ? `${o.user.name || 'User'} (${o.user.email || 'no email'})`
      : '—';

    const total =
      (typeof o.totalPrice === 'number' ? o.totalPrice :
      (typeof o.total === 'number' ? o.total :
      (typeof o.amount === 'number' ? o.amount : null)));

    const totalText = (typeof total === 'number') ? `$${total.toFixed(2)}` : '—';

    const itemsArr =
      Array.isArray(o.items) ? o.items :
      (Array.isArray(o.products) ? o.products :
      (Array.isArray(o.orderItems) ? o.orderItems : null));

    const countText = itemsArr ? `${itemsArr.length} items` : '';

    const status = o.status || 'created';

    return `
      <div class="review-item">
        <div class="review-header">
          <div>
            <div class="review-author">Order: ${o._id}</div>
            <div class="review-date">${created}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700; color:#333;">${totalText}</div>
            <div style="color:#666; font-size:0.9rem;">${countText}</div>
          </div>
        </div>

        <div style="margin-top:8px; color:#444;">
          <b>User:</b> ${userText}
        </div>
        <div style="margin-top:6px; color:#444;">
          <b>Status:</b> ${status}
        </div>

        ${
          itemsArr ? `
            <div style="margin-top:10px;">
              <details>
                <summary style="cursor:pointer; font-weight:600;">View items</summary>
                <div style="margin-top:10px;">
                  ${itemsArr.map(it => {
                    const productName =
                      it.product?.name || it.productName || it.name || it.title || 'Item';
                    const qty = it.quantity ?? it.qty ?? 1;
                    const price = it.price ?? it.unitPrice;
                    const priceText = (typeof price === 'number') ? `$${price.toFixed(2)}` : '';
                    return `
                      <div style="display:flex; justify-content:space-between; gap:10px; padding:6px 0; border-bottom:1px solid #eee;">
                        <div>${productName}</div>
                        <div style="white-space:nowrap;">x${qty} ${priceText}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </details>
            </div>
          ` : ''
        }
      </div>
    `;
  }).join('');
}

