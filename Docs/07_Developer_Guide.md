# Developer Guide

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Introduction

### 1.1 Purpose
This guide provides comprehensive instructions for developers working on StitchyFlow, including setup, coding standards, workflows, and best practices.

### 1.2 Prerequisites

#### Required Knowledge
- JavaScript/ES6+
- React.js fundamentals
- Node.js and Express.js
- MySQL and SQL
- RESTful API design
- Git version control

#### Required Software
- Node.js 14+ and npm
- MySQL 8.0+
- Redis Server
- Git
- Code editor (VS Code recommended)
- Postman or similar API testing tool

---

## 2. Development Environment Setup

### 2.1 Initial Setup

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd StitchyFlow
```

#### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin panel dependencies
cd ../admin
npm install
```

#### Step 3: Environment Configuration
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration
```

**Backend .env Configuration:**
```env
# Application
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stitchyflow
DB_USER=root
DB_PASSWORD=12345

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Application URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:4000
API_URL=http://localhost:5000
```

#### Step 4: Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE stitchyflow;
exit;

# Import schema
mysql -u root -p stitchyflow < database/schema.sql

# Import seed data (optional)
mysql -u root -p stitchyflow < database/seed.sql
```

#### Step 5: Start Redis
```bash
redis-server
```

#### Step 6: Start Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: Admin Panel
cd admin
npm start
```

---

## 3. Project Structure

### 3.1 Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── env.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── cors.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── order.routes.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── orderController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── orderService.js
│   │   └── emailService.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── index.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── logger.js
│   │   └── validators.js
│   └── app.js
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── procedures/
├── tests/
├── .env
├── .env.example
├── package.json
└── server.js
```

### 3.2 Frontend Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── customer/
│   │   └── tailor/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Dashboard/
│   │   └── Orders/
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   ├── store/
│   │   ├── actions/
│   │   ├── reducers/
│   │   └── store.js
│   ├── utils/
│   ├── hooks/
│   ├── routes/
│   ├── App.js
│   └── index.js
├── package.json
└── .env
```

---

## 4. Coding Standards

### 4.1 JavaScript/Node.js Standards

#### Naming Conventions
```javascript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() {}

// Classes: PascalCase
class UserService {}

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;

// Private methods: _prefixed
function _privateMethod() {}

// File names: kebab-case
// user-controller.js, auth-service.js
```

#### Code Style
```javascript
// Use const/let, never var
const apiUrl = 'http://localhost:5000';
let counter = 0;

// Arrow functions for callbacks
array.map(item => item.id);

// Async/await over promises
async function fetchData() {
  try {
    const data = await api.get('/users');
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Destructuring
const { firstName, lastName } = user;

// Template literals
const message = `Hello, ${userName}!`;

// Short-circuit evaluation
const value = input || 'default';
```

