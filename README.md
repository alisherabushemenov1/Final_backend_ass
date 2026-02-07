# 🛍️ Product Management System - Full Stack E-Commerce Application

**Complete E-Commerce Platform with JWT Authentication, RBAC, Shopping Cart, Orders & Reviews**

---

## 📋 Table of Contents

- Overview
- Features
- Technologies
- Installation
- Configuration
- Project Structure
- API Documentation
- User Roles & Permissions
- Database Schema
- Testing
- Deployment

---

## 🎯 Overview

Full-stack e-commerce application demonstrating modern web development practices with Node.js, Express, and MongoDB.  
The project implements authentication, authorization, shopping cart, order management, and product reviews.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT authentication with bcrypt password hashing
- Role-Based Access Control (User / Admin)
- Protected API routes

### 📦 Product Management
- Admin: create, update, delete products
- Public: view all products with images
- Stock quantity management

### 🛒 Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart per user
- Checkout creates an order

### 📋 Order Management
- Users can view their own orders
- Admin can view and manage all orders
- Order status management
- Orders linked to users

### ⭐ Reviews
- 5-star rating system
- Product comments
- Admin moderation

---

## 🛠️ Technologies

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt

**Frontend**
- HTML
- CSS
- Vanilla JavaScript (Fetch API)

---

## 🚀 Installation

```bash
npm install
npm run dev
```

---

## ⚙️ Configuration

Create `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/assignment4_db
JWT_SECRET=your_jwt_secret_key
```

---

## 📁 Project Structure

```
Final_back/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── public/
│   ├── index.html
│   └── app.js
├── server.js
└── README.md
```

---

## 📚 API Documentation

### Base URL
```
/api
```

### Authentication Header
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### Register
```
POST /api/auth/register
```

### Login
```
POST /api/auth/login
```

### Get Profile
```
GET /api/auth/me
```

---

## 📦 Product Endpoints

### Get All Products
```
GET /api/products
```

### Create Product (Admin)
```
POST /api/products
```

### Delete Product (Admin)
```
DELETE /api/products/:id
```

---

## 🛒 Cart Endpoints

### Get Cart
```
GET /api/cart
```

### Add to Cart
```
POST /api/cart/items
```

### Checkout
```
POST /api/cart/checkout
```

---

## 📋 Orders API (Implemented)

The Orders API provides full order lifecycle management with strict Role-Based Access Control.

### Access Rules
- **User**: create orders, view own orders
- **Admin**: view all orders, update order status, delete orders

All routes are protected using JWT authentication.

---

### Create Order (User)

```
POST /api/orders
Authorization: Bearer <token>
```

```json
{
  "items": [
    {
      "product": "65f1abc123",
      "quantity": 2,
      "price": 25
    }
  ],
  "totalPrice": 50,
  "paymentMethod": "card"
}
```

---

### Get My Orders (User)

```
GET /api/orders/my
Authorization: Bearer <token>
```

---

### Get All Orders (Admin)

```
GET /api/orders
Authorization: Bearer <admin_token>
```

Returns all orders with populated user data (name, email).  
Used in the Admin Orders Panel on the frontend.

---

### Update Order Status (Admin)

```
PUT /api/orders/:id/status
Authorization: Bearer <admin_token>
```

```json
{
  "status": "processing"
}
```

Allowed statuses:
```
created → processing → completed
```

---

### Delete Order (Admin)

```
DELETE /api/orders/:id
Authorization: Bearer <admin_token>
```

---

## 👥 User Roles & Permissions

| Action | User | Admin |
|------|------|-------|
| View products | ✅ | ✅ |
| Create product | ❌ | ✅ |
| Add to cart | ✅ | ✅ |
| Checkout | ✅ | ✅ |
| View own orders | ✅ | ✅ |
| View all orders | ❌ | ✅ |
| Update order status | ❌ | ✅ |
| Delete order | ❌ | ✅ |

---

## 🗄️ Database Schema (Order)

```js
{
  user: ObjectId,
  items: [
    {
      product: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,
  status: String,
  createdAt: Date
}
```

---

## 🧪 Testing

- Postman used for API testing
- All protected routes tested with JWT
- Admin permissions verified

---

## 🚢 Deployment

- Backend deployed on Render
- MongoDB Atlas used for production database
- Environment variables configured on Render

---

## 📄 License

Educational project (Assignment 4)

---

## 👨‍💻 Author

Your Name  
Assignment 4 – Web Technologies  
2024

---

✅ Project Status: Complete
