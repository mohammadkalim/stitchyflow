# Testing Strategy Document

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Testing Overview

### 1.1 Testing Objectives
- Ensure code quality and reliability
- Verify functional requirements
- Validate system performance
- Identify and fix defects early
- Ensure security compliance

### 1.2 Testing Levels
1. Unit Testing
2. Integration Testing
3. System Testing
4. User Acceptance Testing (UAT)
5. Performance Testing
6. Security Testing

---

## 2. Unit Testing

### 2.1 Backend Unit Tests (Jest)

```javascript
// tests/services/authService.test.js
const authService = require('../../src/services/authService');

describe('AuthService', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'Test123!';
      const hashed = await authService.hashPassword(password);
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'Test123!';
      const hashed = await authService.hashPassword(password);
      const result = await authService.comparePassword(password, hashed);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'Test123!';
      const hashed = await authService.hashPassword(password);
      const result = await authService.comparePassword('Wrong123!', hashed);
      expect(result).toBe(false);
    });
  });
});
```

### 2.2 Frontend Unit Tests (React Testing Library)

```javascript
// tests/components/LoginForm.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../../src/components/LoginForm';

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
```

---

## 3. Integration Testing

### 3.1 API Integration Tests (Supertest)

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId');
    });

    it('should return error for duplicate email', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Test123!',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer'
        });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Test123!',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'customer'
        });
      
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });
  });
});
```

---

## 4. End-to-End Testing

### 4.1 E2E Tests (Cypress)

```javascript
// cypress/e2e/customer-order-flow.cy.js
describe('Customer Order Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.login('customer@example.com', 'Test123!');
  });

  it('should complete full order placement', () => {
    // Browse tailors
    cy.contains('Browse Tailors').click();
    cy.url().should('include', '/tailors');
    
    // Select tailor
    cy.get('[data-testid="tailor-card"]').first().click();
    cy.contains('Place Order').click();
    
    // Fill order form
    cy.get('#garmentType').select('Shirt');
    cy.get('#chest').type('40');
    cy.get('#waist').type('34');
    cy.get('#specialInstructions').type('Please use blue fabric');
    
    // Submit order
    cy.contains('Submit Order').click();
    
    // Verify confirmation
    cy.contains('Order placed successfully').should('be.visible');
    cy.url().should('include', '/orders');
  });
});
```

---

## 5. Performance Testing

### 5.1 Load Testing Script

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100
  processor: "./test-functions.js"

scenarios:
  - name: "User Journey"
    flow:
      - post:
          url: "/api/v1/auth/login"
          json:
            email: "test@example.com"
            password: "Test123!"
          capture:
            - json: "$.data.accessToken"
              as: "token"
      - get:
          url: "/api/v1/orders"
          headers:
            Authorization: "Bearer {{ token }}"
```

---

## 6. Security Testing

### 6.1 Security Test Cases

```javascript
// tests/security/auth.security.test.js
describe('Security Tests', () => {
  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in login', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: "admin' OR '1'='1",
          password: "anything"
        });
      
      expect(response.status).toBe(401);
    });
  });

  describe('XSS Prevention', () => {
    it('should sanitize user input', async () => {
      const response = await request(app)
        .post('/api/v1/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: '<script>alert("XSS")</script>'
        });
      
      expect(response.body.data.firstName).not.toContain('<script>');
    });
  });

  describe('Rate Limiting', () => {
    it('should block after too many requests', async () => {
      for (let i = 0; i < 10; i++) {
        await request(app).post('/api/v1/auth/login').send({
          email: 'test@example.com',
          password: 'wrong'
        });
      }
      
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong'
        });
      
      expect(response.status).toBe(429);
    });
  });
});
```

---

## 7. Test Coverage

### 7.1 Coverage Goals
- Unit Tests: 80%+ coverage
- Integration Tests: 70%+ coverage
- E2E Tests: Critical paths covered

### 7.2 Generate Coverage Report

```bash
# Backend
npm run test:coverage

# Frontend
npm run test -- --coverage
```

---

## 8. Continuous Integration

### 8.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: testpass
          MYSQL_DATABASE: stitchyflow_test
        ports:
          - 3306:3306
      
      redis:
        image: redis:6
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## 9. Test Data Management

### 9.1 Test Database Setup

```sql
-- Create test database
CREATE DATABASE stitchyflow_test;

-- Import schema
SOURCE database/schema.sql;

-- Insert test data
INSERT INTO users (email, password_hash, first_name, last_name, role, status)
VALUES 
  ('admin@test.com', '$2b$10$...', 'Admin', 'User', 'admin', 'active'),
  ('customer@test.com', '$2b$10$...', 'Test', 'Customer', 'customer', 'active'),
  ('tailor@test.com', '$2b$10$...', 'Test', 'Tailor', 'tailor', 'active');
```

### 9.2 Test Data Cleanup

```javascript
// tests/setup.js
afterEach(async () => {
  // Clean up test data
  await Order.destroy({ where: {}, truncate: true });
  await Payment.destroy({ where: {}, truncate: true });
});
```

---

## 10. Testing Best Practices

### 10.1 General Principles
- Write tests before or alongside code (TDD)
- Keep tests independent and isolated
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test edge cases and error conditions

### 10.2 Code Example

```javascript
describe('OrderService', () => {
  // Arrange
  let orderService;
  let mockDatabase;
  
  beforeEach(() => {
    mockDatabase = createMockDatabase();
    orderService = new OrderService(mockDatabase);
  });
  
  it('should create order with valid data', async () => {
    // Arrange
    const orderData = {
      customerId: 1,
      tailorId: 2,
      garmentType: 'Shirt'
    };
    
    // Act
    const result = await orderService.createOrder(orderData);
    
    // Assert
    expect(result).toHaveProperty('orderId');
    expect(result.status).toBe('pending');
  });
});
```

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
