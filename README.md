# Product Management System - Final

Secure CRUD API with JWT Authentication and Role-Based Access Control (RBAC) using MVC architecture.

## Features

- ✅ **MVC Architecture** - Organized code structure
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **RBAC** - Role-based access control (User/Admin)
- ✅ **Password Hashing** - bcrypt encryption
- ✅ **Multi-Object CRUD** - Products & Reviews
- ✅ **Protected Routes** - Admin-only endpoints

## 🛠️ Technologies

### Backend
- **Node.js v14+** — JavaScript runtime
- **Express.js v4.18.2** — Web framework
- **MongoDB v4.4+** — NoSQL database
- **Mongoose v8.0.0** — MongoDB ODM
- **JWT v9.0.2** — Authentication tokens
- **Bcrypt v2.4.3** — Password hashing
- **CORS v2.8.5** — Cross-origin resource sharing
- **Dotenv v16.3.1** — Environment variables management

---

### Frontend
- **HTML5** — Application structure
- **CSS3** — Styling (Gradients, Flexbox, Grid)
- **Vanilla JavaScript** — Client-side logic
- **Fetch API** — HTTP requests handling

---

### Development Tools
- **Nodemon v3.0.1** — Auto-restart server during development
- **Postman** — API testing and debugging
- **MongoDB Compass** — MongoDB database GUI

## ✨ Features

### 🔐 Authentication & Security
- User registration with email validation
- Secure login using JWT tokens (7-day expiration)
- Password hashing with bcrypt (10 salt rounds)
- Role-Based Access Control (User / Admin)
- Protected API routes with middleware

---

### 📦 Product Management

**Admin Features:**
- Create products with image support (URL)
- Update product details
- Delete products
- Manage inventory (stock quantity)
- Image preview before saving product

**Public Features:**
- Browse all products with images
- View detailed product information
- Filter products by category
- Search products by name
- Sort products by price, name, or creation date

---

### 🛒 Shopping Cart
- Add products to cart with stock validation
- Update item quantities (+ / −)
- Remove items from cart
- Real-time cart total price calculation
- Cart badge showing total items count
- Persistent cart per authenticated user
- Checkout process creates an order

---

### 📋 Order Management

**Admin Features:**
- View all orders with customer details
- Filter orders by status
- Update order status  
  (`Pending → Processing → Completed`)
- Delete orders
- Auto-generated order numbers  
  (`ORD-YYYYMMDD-####`)

**User Features:**
- View personal order history
- Receive order confirmation after checkout
- Real-time stock updates after purchase

---

### ⭐ Reviews & Ratings
- Write product reviews (authenticated users only)
- 5-star rating system
- “Recommended” checkbox for reviews
- Display all reviews with timestamps
- Admin moderation (update / delete reviews)

---

### 🎨 User Interface
- Fully responsive design (mobile-friendly)
- Modern UI with gradient styling
- Modal windows for cart and reviews
- Image placeholders for missing images
- Client-side form validation
- Success and error notifications
- Loading states for better UX


## Project Structure (MVC)

```
assignment4/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User schema with auth methods
    ├── Cart.js              # Cart schema
|   |── Order.js             # Order schema
│   ├── Product.js           # Product schema
│   └── Review.js            # Review schema
├── controllers/
│   ├── authController.js    # Authentication logic
|   ├── cartController.js    # Card Crud logic
│   ├── productController.js # Product CRUD logic
│   └── reviewController.js  # Review CRUD logic
├── routes/
│   ├── auth.js              # Auth routes
|   ├── orders.js            # Orders routes
|   ├── cart.js              # Cart routes
│   ├── products.js          # Product routes
│   └── reviews.js           # Review routes
├── middleware/
│   ├── auth.js              # JWT verification & RBAC
│   └── errorHandler.js      # Error handling
├── public/
│   └── index.html           # Frontend with auth
|   ├── app.js               # Functrionality
├── .env
├── package.json
└── server.js                # App entry point
```

## 🚀 Installation (Explanation)

This section describes how to prepare the development environment and install all required tools and dependencies for running the project locally.

### Prerequisites

Before starting the project, make sure the following software is installed on your computer:

- **Node.js (v14 or higher)** — required to run JavaScript code on the server side.  
  Node.js also includes **npm**, which is used to manage project dependencies.

- **npm (v6 or higher)** — Node Package Manager, used to install libraries such as Express, Mongoose, JWT, and others.

- **MongoDB (v4.4 or higher)** — database used to store users, products, carts, orders, and reviews.  
  MongoDB can be installed locally or replaced with **MongoDB Atlas**, a free cloud database service.

---

### Step-by-Step Setup

1. **Create Project Directory**  
   A new folder is created for the project. This directory will contain all backend and frontend files of the application.

2. **Initialize npm**  
   The `npm init -y` command creates a `package.json` file.  
   This file stores information about the project and lists all dependencies required to run the application.

3. **Install Dependencies**  
   Production dependencies such as Express, Mongoose, JWT, bcrypt, and dotenv are installed.  
   These libraries provide core functionality including:
   - HTTP server handling
   - Database connection
   - Authentication and authorization
   - Password hashing
   - Environment variable management  

   Development dependency **Nodemon** is also installed.  
   Nodemon automatically restarts the server when code changes, which simplifies development.

4. **Create Directory Structure**  
   Project folders are created to follow the MVC (Model–View–Controller) architecture:
   - `config` — database and configuration files
   - `controllers` — business logic
   - `middleware` — authentication, authorization, error handling
   - `models` — MongoDB schemas
   - `routes` — API endpoints
   - `public` — frontend files (HTML, CSS, JavaScript)

After completing these steps, the project is ready for environment configuration and server startup.

## Authentication Flow

### 1. Register User
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // or "admin"
}
```

### 2. Login
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Use Token
Add to request headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

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


## Access Control (RBAC)

### Public Access
- GET requests (Read products and reviews)
- Registration and login

### Authenticated Users
- Create reviews
- View own profile

### Admin Only
- Create, Update, Delete products
- Update, Delete reviews

## Request Examples

### Create Product (Admin)
```
POST /api/products
Headers: 
  Authorization: Bearer YOUR_ADMIN_TOKEN
  Content-Type: application/json

Body:
{
  "name": "iPhone 15 Pro",
  "price": 999.99,
  "description": "Latest Apple smartphone",
  "category": "Electronics",
  "quantity": 50
}
```

### Create Review (Any authenticated user)
```
POST /api/products/:productId/reviews
Headers: 
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body:
{
  "author": "John Doe",
  "rating": 5,
  "comment": "Excellent product!"
}
```
## Cart & Orders

```http
GET /api/cart
Authorization: Bearer <JWT_TOKEN>

POST /api/cart/items
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "productId": "65f1abc123",
  "quantity": 2
}

PUT /api/cart/items/65f1abc123
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "quantity": 3
}

DELETE /api/cart/items/65f1abc123
Authorization: Bearer <JWT_TOKEN>

POST /api/orders
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

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

GET /api/orders/my
Authorization: Bearer <JWT_TOKEN>

GET /api/orders
Authorization: Bearer <ADMIN_JWT_TOKEN>
```


## Testing

### Test Accounts

**Admin Account:**
```
Email: admin@test.com
Password: admin123
```

**Regular User:**
```
Email: user@test.com
Password: user123
```

### Using Postman

1. Register/Login to get JWT token
2. Copy the token
3. Add to Authorization header: `Bearer YOUR_TOKEN`
4. Test protected endpoints

## Security Features

### Password Security
- Passwords hashed using bcrypt
- Salt rounds: 10 (configurable)
- Never stored in plain text
- Passwords excluded from query results

### JWT Security
- Token expiration (7 days default)
- Signed with secret key
- Contains user ID, email, and role
- Verified on protected routes

### Role-Based Access
- Middleware checks user role
- Admin-only routes return 403 if unauthorized
- User info attached to request object

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Required role: admin"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Field is required"]
}
```

## Assignment Requirements

### ✅ MVC Architecture
- [x] Separate models, controllers, routes
- [x] Middleware folder
- [x] Config folder
- [x] Clean code organization

### ✅ Multi-Object CRUD
- [x] Primary: Product (full CRUD)
- [x] Secondary: Review (full CRUD)
- [x] Relationships between objects

### ✅ Authentication
- [x] User model with email/password/role
- [x] Password hashing with bcrypt
- [x] JWT token generation
- [x] Login/Register endpoints

### ✅ RBAC
- [x] Public: GET routes
- [x] Authenticated: Create reviews
- [x] Admin: POST/PUT/DELETE products
- [x] Role verification middleware

## Troubleshooting

**"Invalid token"**
- Check token format: `Bearer TOKEN`
- Verify token hasn't expired
- Ensure JWT_SECRET matches

**"Access denied"**
- Check user role (admin vs user)
- Verify token is valid
- Login again if token expired

**"User already exists"**
- Email must be unique
- Try different email

## Environment Variables

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/assignment4_db
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
```
