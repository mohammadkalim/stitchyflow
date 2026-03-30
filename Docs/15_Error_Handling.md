# Error Handling Guide

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Error Handling Strategy

### 1.1 Objectives
- Provide meaningful error messages
- Log errors for debugging
- Maintain system stability
- Protect sensitive information
- Improve user experience

### 1.2 Error Categories
- Validation Errors (400)
- Authentication Errors (401)
- Authorization Errors (403)
- Not Found Errors (404)
- Conflict Errors (409)
- Server Errors (500)

---

## 2. Backend Error Handling

### 2.1 Custom Error Classes

```javascript
// utils/errors.js

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError
};
```

### 2.2 Error Handler Middleware

```javascript
// middleware/errorHandler.js

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?.id
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message);
    error = new ValidationError(message.join(', '));
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ConflictError(`${field} already exists`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }

  // Send response
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.statusCode || 500,
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
```

### 2.3 Async Error Wrapper

```javascript
// utils/asyncHandler.js

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// Usage
const asyncHandler = require('../utils/asyncHandler');

router.get('/orders', asyncHandler(async (req, res) => {
  const orders = await Order.findAll();
  res.json({ success: true, data: orders });
}));
```

---

## 3. Frontend Error Handling

### 3.1 API Error Handler

```javascript
// services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          showError('Access denied');
          break;
        case 404:
          showError('Resource not found');
          break;
        case 500:
          showError('Server error. Please try again later');
          break;
        default:
          showError(data.error?.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response
      showError('Network error. Please check your connection');
    } else {
      // Something else happened
      showError('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 3.2 Error Boundary Component

```javascript
// components/ErrorBoundary.js

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Something went wrong</h1>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 3.3 Form Validation Errors

```javascript
// components/OrderForm.js

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  garmentType: yup.string().required('Garment type is required'),
  chest: yup.number()
    .required('Chest measurement is required')
    .positive('Must be positive')
    .min(20, 'Minimum 20 inches'),
  waist: yup.number()
    .required('Waist measurement is required')
    .positive('Must be positive')
});

function OrderForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/orders', data);
      showSuccess('Order placed successfully');
    } catch (error) {
      showError('Failed to place order');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('garmentType')} />
        {errors.garmentType && (
          <span className="error">{errors.garmentType.message}</span>
        )}
      </div>
      
      <div>
        <input {...register('chest')} type="number" />
        {errors.chest && (
          <span className="error">{errors.chest.message}</span>
        )}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 4. Database Error Handling

### 4.1 MySQL Error Handling

```javascript
// services/orderService.js

const { ValidationError, NotFoundError, ConflictError } = require('../utils/errors');

class OrderService {
  async createOrder(orderData) {
    try {
      const [result] = await db.query(
        'CALL sp_create_order(?, ?, ?, ?, ?, ?)',
        [
          orderData.customerId,
          orderData.tailorId,
          orderData.garmentType,
          orderData.description,
          orderData.estimatedPrice,
          orderData.orderId
        ]
      );
      return result[0];
    } catch (error) {
      // Handle specific MySQL errors
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictError('Order already exists');
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new ValidationError('Invalid customer or tailor ID');
      }
      throw error;
    }
  }

  async getOrderById(orderId) {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [orderId]
    );
    
    if (orders.length === 0) {
      throw new NotFoundError('Order');
    }
    
    return orders[0];
  }
}
```

---

## 5. Validation Error Handling

### 5.1 Input Validation Middleware

```javascript
// middleware/validation.js

const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    throw new ValidationError(messages.join(', '));
  }
  
  next();
};

module.exports = validate;

// Usage
const { body } = require('express-validator');

router.post('/orders',
  [
    body('garmentType').notEmpty().withMessage('Garment type is required'),
    body('customerId').isInt().withMessage('Invalid customer ID'),
    body('estimatedPrice').isFloat({ min: 0 }).withMessage('Invalid price')
  ],
  validate,
  orderController.createOrder
);
```

---

## 6. Logging Errors

### 6.1 Winston Logger Configuration

```javascript
// utils/logger.js

const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

---

## 7. Error Response Format

### 7.1 Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": {
      "field": "email",
      "issue": "Email is required"
    }
  }
}
```

---

## 8. Error Handling Best Practices

### 8.1 Guidelines
- Always use try-catch for async operations
- Never expose sensitive information in errors
- Log all errors with context
- Provide user-friendly error messages
- Use appropriate HTTP status codes
- Handle errors at the right level
- Test error scenarios
- Monitor error rates

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
