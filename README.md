# 🛍️ Product Management System - Full Stack E-Commerce Application

**Complete E-Commerce Platform with JWT Authentication, RBAC, Shopping Cart, Orders & Reviews**

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v4.4+-success.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-v4.18+-blue.svg)](https://expressjs.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles--permissions)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🎯 Overview

Full-stack e-commerce application demonstrating modern web development practices with Node.js, Express, and MongoDB. This project includes complete authentication, authorization, shopping cart functionality, order management, and product reviews.

### Key Highlights

- ✅ **JWT Authentication** - Secure token-based auth with bcrypt password hashing
- ✅ **Role-Based Access Control** - User and Admin roles with different permissions
- ✅ **Shopping Cart** - Full cart functionality with real-time updates
- ✅ **Order Management** - Complete order system with status tracking
- ✅ **Product Reviews** - 5-star rating system with comments
- ✅ **Image Support** - Product images via URL
- ✅ **MVC Architecture** - Clean, organized code structure
- ✅ **Responsive UI** - Modern, mobile-friendly interface

---

## ✨ Features

### 🔐 Authentication & Security
- User registration with email validation
- Secure login with JWT tokens (7-day expiration)
- Password hashing with bcrypt (10 rounds)
- Role-based access control (User/Admin)
- Protected API routes

### 📦 Product Management
**Admin Features:**
- Create products with images (URL)
- Update product details
- Delete products
- Manage inventory (stock quantity)
- Image preview before saving

**Public Features:**
- Browse all products with images
- View product details
- Filter by category
- Search products by name
- Sort by price/name/date

### 🛒 Shopping Cart
- Add products to cart (with stock validation)
- Update item quantities (+/-)
- Remove items from cart
- Real-time cart total calculation
- Cart badge showing item count
- Persistent cart per user
- Checkout creates order

### 📋 Order Management
**Admin Features:**
- View all orders with customer details
- Filter orders by status
- Update order status (Pending → Processing → Completed)
- Delete orders
- Auto-generated order numbers (ORD-YYYYMMDD-####)

**User Features:**
- View own order history
- Order confirmation after checkout
- Real-time stock updates

### ⭐ Reviews & Ratings
- Write product reviews (authenticated users)
- 5-star rating system
- Recommended product checkbox
- Display all reviews with timestamps
- Admin can moderate reviews

### 🎨 User Interface
- Responsive design (mobile-friendly)
- Modern gradient UI
- Modal windows for cart & reviews
- Image placeholders for missing images
- Form validation
- Success/error notifications
- Loading states

---

## 🛠️ Technologies

### Backend
```
Node.js v14+          - JavaScript runtime
Express.js v4.18.2    - Web framework
MongoDB v4.4+         - NoSQL database
Mongoose v8.0.0       - MongoDB ODM
JWT v9.0.2            - Authentication tokens
Bcrypt v2.4.3         - Password hashing
CORS v2.8.5           - Cross-origin requests
Dotenv v16.3.1        - Environment variables
```

### Frontend
```
HTML5                 - Structure
CSS3                  - Styling (Gradients, Flexbox, Grid)
Vanilla JavaScript    - Client-side logic
Fetch API             - HTTP requests
```

### Development Tools
```
Nodemon v3.0.1        - Auto-restart server
Postman               - API testing
MongoDB Compass       - Database GUI
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **npm** (v6+) - Comes with Node.js
- **MongoDB** (v4.4+) - [Download](https://www.mongodb.com/try/download/community) OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)

### Step-by-Step Setup

#### 1. Create Project Directory

```bash
mkdir Final_back
cd Final_back
```

#### 2. Initialize npm

```bash
npm init -y
```

#### 3. Install Dependencies

```bash
# Production dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator

# Development dependencies
npm install --save-dev nodemon
```

#### 4. Create Directory Structure

```bash
# Linux/Mac
mkdir config controllers middleware models routes public

# Windows (PowerShell)
New-Item -ItemType Directory -Path config, controllers, middleware, models, routes, public
```

#### 5. Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## ⚙️ Configuration

### 1. Create .env File

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/assignment4_db

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/assignment4_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-in-production
JWT_EXPIRE=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

⚠️ **Important:**
- `JWT_SECRET` must be at least 32 characters
- Never commit `.env` to version control
- Change all secrets in production

### 2. MongoDB Setup

#### Option A: MongoDB Atlas (Cloud) ⭐ Recommended

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free account
3. Create cluster (FREE tier M0)
4. **Database Access**: Create user (admin/admin123)
5. **Network Access**: Allow access from anywhere (0.0.0.0/0)
6. Get connection string: **Connect → Connect your application**
7. Update `.env` with connection string

#### Option B: Local MongoDB

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Install with default settings
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
```

---

## 📁 Project Structure

```
assignment4/
├── config/
│   └── database.js              # MongoDB connection
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── productController.js     # Product CRUD logic
│   ├── cartController.js        # Shopping cart logic
│   └── reviewController.js      # Review CRUD logic
├── middleware/
│   ├── auth.js                  # JWT verification & RBAC
│   └── errorHandler.js          # Global error handling
├── models/
│   ├── User.js                  # User schema
│   ├── Product.js               # Product schema
│   ├── Cart.js                  # Cart schema
│   ├── Review.js                # Review schema
│   └── Order.js                 # Order schema
├── routes/
│   ├── auth.js                  # Auth routes
│   ├── products.js              # Product routes
│   ├── cart.js                  # Cart routes
│   ├── reviews.js               # Review routes
│   └── orders.js                # Order routes
├── public/
│   ├── index.html               # Frontend UI
│   └── app.js                   # Client JavaScript
├── .env                         # Environment variables
├── .gitignore                   # Git ignore
├── package.json                 # Dependencies
├── server.js                    # Main entry point
└── README.md                    # This file
```

### MVC Architecture Flow

```
┌─────────────────────────────────────────────────────┐
│  CLIENT (Browser)                                   │
│  public/index.html + app.js                         │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP Requests
                    ▼
┌─────────────────────────────────────────────────────┐
│  SERVER (Express) - server.js                       │
├─────────────────────────────────────────────────────┤
│  MIDDLEWARE                                         │
│  ├── CORS                                           │
│  ├── Body Parser                                    │
│  ├── Authentication (JWT)                           │
│  └── Authorization (RBAC)                           │
├─────────────────────────────────────────────────────┤
│  ROUTES                                             │
│  ├── /api/auth       → authRoutes                  │
│  ├── /api/products   → productRoutes               │
│  ├── /api/cart       → cartRoutes                  │
│  ├── /api/reviews    → reviewRoutes                │
│  └── /api/orders     → orderRoutes                 │
├─────────────────────────────────────────────────────┤
│  CONTROLLERS (Business Logic)                       │
│  ├── authController                                 │
│  ├── productController                              │
│  ├── cartController                                 │
│  ├── reviewController                               │
│  └── orderController                                │
├─────────────────────────────────────────────────────┤
│  MODELS (Data Schemas)                              │
│  ├── User.js                                        │
│  ├── Product.js                                     │
│  ├── Cart.js                                        │
│  ├── Review.js                                      │
│  └── Order.js                                       │
└───────────────────┬─────────────────────────────────┘
                    │ Mongoose ODM
                    ▼
┌─────────────────────────────────────────────────────┐
│  DATABASE (MongoDB)                                 │
│  Collections: users, products, carts, reviews,     │
│               orders                                │
└─────────────────────────────────────────────────────┘
```

---

## ▶️ Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Expected Console Output

```
=================================
🚀 Server running in development mode
📡 Port: 3000
🌐 URL: http://localhost:3000
📚 API: http://localhost:3000/api
=================================
API Endpoints:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me
  GET    /api/products
  POST   /api/products (admin)
  GET    /api/cart
  POST   /api/cart/items
  POST   /api/cart/checkout
  GET    /api/orders (admin)
  GET    /api/orders/my-orders
  PUT    /api/orders/:id/status (admin)
=================================
✅ MongoDB Connected: localhost
📊 Database Name: assignment4_db
```

### Access Application

Open browser: **http://localhost:3000**

---

## API Endpoints



### Auth Routes (Public)

- `POST /api/auth/register` - Register new user

- `POST /api/auth/login` - Login user

- `GET /api/auth/me` - Get current user (Protected)

- `PUT /api/auth/me` - Update profile (Protected)



### Product Routes

- `GET /api/products` - Get all products (Public)

- `GET /api/products/:id` - Get single product (Public)

- `POST /api/products` - Create product (Admin only)

- `PUT /api/products/:id` - Update product (Admin only)

- `DELETE /api/products/:id` - Delete product (Admin only)



### Review Routes

- `GET /api/products/:productId/reviews` - Get product reviews (Public)

- `GET /api/reviews/:id` - Get single review (Public)

- `POST /api/products/:productId/reviews` - Create review (Authenticated users)

- `PUT /api/reviews/:id` - Update review (Admin only)

- `DELETE /api/reviews/:id` - Delete review (Admin only)



### Cart Routes

- `GET /api/cart` – Get current user cart (Authenticated users)

- `POST /api/cart/items` – Add product to cart (Authenticated users)

- `PUT /api/cart/items/:productId` – Update cart item quantity (Authenticated users)

- `DELETE /api/cart/items/:productId` – Remove product from cart (Authenticated users)

- `POST /api/cart/checkout` – Checkout cart and create order (Authenticated users)



### Order Routes

- `POST /api/orders` – Create new order (Authenticated users)

- `GET /api/orders/my` – Get current user orders (Authenticated users)

- `GET /api/orders` – Get all orders (Admin only)

- `PUT /api/orders/:id/status` – Update order status (Admin only)

- `DELETE /api/orders/:id` – Delete order (Admin only)

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Header
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### 📦 Product Endpoints

#### Get All Products (Public)
```http
GET /api/products?category=Electronics&minPrice=100&sortBy=price-asc
```

#### Get Single Product (Public)
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "price": 999.99,
  "description": "Latest smartphone",
  "category": "Electronics",
  "quantity": 50,
  "imageUrl": "https://example.com/iphone.jpg"
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 899.99,
  "quantity": 45
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

---

### 🛒 Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439013",
  "quantity": 2
}
```

#### Update Quantity
```http
PUT /api/cart/items/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/items/:productId
Authorization: Bearer <token>
```

#### Checkout
```http
POST /api/cart/checkout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order placed successfully!",
  "data": {
    "orderNumber": "ORD-20240118-0001",
    "items": [...],
    "totalPrice": 1999.98,
    "status": "pending"
  }
}
```

---

### 📋 Order Endpoints

#### Get All Orders (Admin Only)
```http
GET /api/orders?status=pending
Authorization: Bearer <admin_token>
```

#### Get My Orders
```http
GET /api/orders/my-orders
Authorization: Bearer <token>
```

#### Get Single Order
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

#### Update Order Status (Admin Only)
```http
PUT /api/orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "processing"
}
```

#### Delete Order (Admin Only)
```http
DELETE /api/orders/:id
Authorization: Bearer <admin_token>
```

#### Get Order Statistics (Admin Only)
```http
GET /api/orders/stats
Authorization: Bearer <admin_token>
```

---

### ⭐ Review Endpoints

#### Create Review (Authenticated)
```http
POST /api/products/:productId/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "author": "John Doe",
  "rating": 5,
  "comment": "Excellent product!",
  "recommended": true
}
```

#### Get Product Reviews (Public)
```http
GET /api/products/:productId/reviews
```

#### Update Review (Admin Only)
```http
PUT /api/reviews/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated comment"
}
```

#### Delete Review (Admin Only)
```http
DELETE /api/reviews/:id
Authorization: Bearer <admin_token>
```

---

## 👥 User Roles & Permissions

### Access Control Matrix

| Action | Public | User | Admin |
|--------|--------|------|-------|
| **Authentication** |
| Register | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| View Profile | ❌ | ✅ | ✅ |
| **Products** |
| View Products | ✅ | ✅ | ✅ |
| Create Product | ❌ | ❌ | ✅ |
| Update Product | ❌ | ❌ | ✅ |
| Delete Product | ❌ | ❌ | ✅ |
| **Cart** |
| View Cart | ❌ | ✅ | ✅ |
| Add to Cart | ❌ | ✅ | ✅ |
| Checkout | ❌ | ✅ | ✅ |
| **Orders** |
| View Own Orders | ❌ | ✅ | ✅ |
| View All Orders | ❌ | ❌ | ✅ |
| Update Order Status | ❌ | ❌ | ✅ |
| Delete Order | ❌ | ❌ | ✅ |
| **Reviews** |
| View Reviews | ✅ | ✅ | ✅ |
| Create Review | ❌ | ✅ | ✅ |
| Update Review | ❌ | ❌ | ✅ |
| Delete Review | ❌ | ❌ | ✅ |

### Test Accounts

```
Admin:
Email: admin@test.com
Password: admin123

User:
Email: user@test.com
Password: user123
```

---

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, 6+ chars),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Product Schema
```javascript
{
  name: String (required, 3-100 chars),
  price: Number (required, >= 0),
  description: String (required, 10-500 chars),
  category: String (required, enum),
  quantity: Number (default: 0, >= 0),
  inStock: Boolean (default: true),
  imageUrl: String (default: placeholder),
  createdBy: ObjectId (ref: User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Cart Schema
```javascript
{
  user: ObjectId (required, unique, ref: User),
  items: [{
    product: ObjectId (required, ref: Product),
    quantity: Number (required, >= 1),
    price: Number (required)
  }],
  totalPrice: Number (calculated),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Order Schema
```javascript
{
  orderNumber: String (auto-generated, unique),
  user: ObjectId (required, ref: User),
  items: [{
    product: ObjectId (ref: Product),
    productName: String (required),
    quantity: Number (required),
    price: Number (required),
    total: Number (required)
  }],
  totalPrice: Number (required),
  status: String (enum: ['pending', 'processing', 'completed', 'cancelled']),
  paymentMethod: String (default: 'Cash on Delivery'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Review Schema
```javascript
{
  productId: ObjectId (required, ref: Product),
  author: String (required, 2-50 chars),
  rating: Number (required, 1-5, integer),
  comment: String (required, 5-1000 chars),
  recommended: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Entity Relationships

```
User (1) ────────── (1) Cart
  │
  │ (1 to many)
  ├─────────────► Order
  │
  │ (1 to many)
  └─────────────► Review
                    │
                    │ (many to 1)
                    ▼
                 Product
```

---

## 🔒 Security Features

### 1. Password Security
- **Bcrypt hashing** with 10 rounds of salting
- Passwords never stored in plain text
- One-way encryption (cannot be reversed)
- Unique salt per password

### 2. JWT Authentication
- Signed tokens with HS256 algorithm
- 7-day expiration (configurable)
- Stateless (no server-side sessions)
- Contains user ID, email, and role
- Cannot be forged without secret key

### 3. Input Validation
- Mongoose schema validation
- Required field checks
- String length limits
- Number range validation
- Email format validation
- Enum values for categories/roles

### 4. Authorization Middleware
```javascript
// Authenticate - verify JWT
authenticate(req, res, next)

// Authorize - check role
authorize('admin')(req, res, next)
```

### 5. Error Handling
- Global error handler
- Specific error types (Validation, Cast, Duplicate)
- No sensitive data in errors
- Development vs Production modes

### 6. CORS Configuration
- Configured for cross-origin requests
- Allowed methods and headers specified

---

## 🧪 Testing

### Test Checklist

#### Authentication ✅
- [ ] Register new user
- [ ] Register with duplicate email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access admin route as user (should fail)

#### Products ✅
- [ ] Get all products (public)
- [ ] Create product as admin
- [ ] Create product as user (should fail)
- [ ] Update product as admin
- [ ] Delete product as admin

#### Cart ✅
- [ ] Add product to cart
- [ ] Update quantity
- [ ] Remove from cart
- [ ] Checkout creates order

#### Orders ✅
- [ ] View orders as admin
- [ ] Filter orders by status
- [ ] Update order status
- [ ] View own orders as user

#### Reviews ✅
- [ ] Create review as user
- [ ] View all reviews (public)
- [ ] Update review as admin
- [ ] Delete review as admin

### Using Postman

1. Import collection (if provided)
2. Register admin user
3. Login and save token
4. Test all endpoints with saved token

---

## 🚢 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_very_long_and_secure_secret_key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

### Deployment Platforms

**Recommended:**
- **Backend**: Railway, Render, or Heroku
- **Database**: MongoDB Atlas (free tier)

### Pre-Deployment Checklist

- [ ] Update all environment variables
- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV to production
- [ ] Test all features locally
- [ ] Configure CORS for production domain
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Add error logging
- [ ] Set up backup strategy

---

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

---

## 🎓 Project Features Summary

### Core Features
- ✅ User Authentication (Register, Login, Profile)
- ✅ Product CRUD (Create, Read, Update, Delete)
- ✅ Shopping Cart (Add, Update, Remove, Checkout)
- ✅ Order Management (View, Update Status, Track)
- ✅ Product Reviews (Create, Read, Update, Delete)
- ✅ Image Upload Support (URL-based)
- ✅ Role-Based Access Control
- ✅ Stock Management
- ✅ Order Number Generation

### Technical Features
- ✅ MVC Architecture
- ✅ JWT Authentication
- ✅ Password Hashing (Bcrypt)
- ✅ MongoDB with Mongoose
- ✅ RESTful API Design
- ✅ Error Handling
- ✅ Input Validation
- ✅ CORS Configuration
- ✅ Environment Variables

### UI Features
- ✅ Responsive Design
- ✅ Modern UI with Gradients
- ✅ Modal Windows
- ✅ Real-time Updates
- ✅ Form Validation
- ✅ Notifications
- ✅ Admin Panel
- ✅ Order Dashboard

---

## 👨‍💻 Author

**Alisher Abushemenov**
- Final - Web Technologies
- Date: 08.02.2026

🚀 **Happy Coding!**
