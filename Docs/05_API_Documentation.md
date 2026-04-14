# API Documentation

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Base URL:** `http://localhost:5000/api/v1` (Development)  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Introduction

### 1.1 Overview
This document provides comprehensive API documentation for StitchyFlow, including all endpoints, request/response formats, authentication requirements, and error handling.

### 1.2 API Principles
- RESTful architecture
- JSON request/response format
- JWT-based authentication
- Consistent error handling
- Versioned endpoints (/api/v1/)

### 1.3 Base URL
- **Development:** `http://localhost:5000/api/v1`
- **Production:** `https://api.stitchyflow.com/api/v1`

---

## 2. Authentication

### 2.1 Authentication Method
All protected endpoints require JWT Bearer token authentication.

**Header Format:**
```
Authorization: Bearer <access_token>
```

### 2.2 Token Lifecycle
- **Access Token:** Expires in 1 hour
- **Refresh Token:** Expires in 7 days
- Refresh tokens stored in Redis

---

## 3. Standard Response Format

### 3.1 Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### 3.2 Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### 3.3 HTTP Status Codes
- **200 OK:** Successful GET, PUT, PATCH
- **201 Created:** Successful POST
- **204 No Content:** Successful DELETE
- **400 Bad Request:** Invalid input
- **401 Unauthorized:** Missing or invalid authentication
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **409 Conflict:** Resource conflict
- **422 Unprocessable Entity:** Validation error
- **500 Internal Server Error:** Server error

---

## 4. Authentication Endpoints

### 4.1 Register User

**Endpoint:** `POST /auth/register`  
**Authentication:** Not required  
**Description:** Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+92 300 1234567",
  "role": "customer"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "user@example.com",
    "role": "customer",
    "status": "pending"
  },
  "message": "Registration successful. Awaiting approval."
}
```

### 4.2 Login

**Endpoint:** `POST /auth/login`  
**Authentication:** Not required  
**Description:** Authenticate user and receive tokens

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### 4.3 Refresh Token

**Endpoint:** `POST /auth/refresh`  
**Authentication:** Not required  
**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```

### 4.4 Logout

**Endpoint:** `POST /auth/logout`  
**Authentication:** Required  
**Description:** Logout user and invalidate refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 4.5 Forgot Password

**Endpoint:** `POST /auth/forgot-password`  
**Authentication:** Not required  
**Description:** Request password reset

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### 4.6 Reset Password

**Endpoint:** `POST /auth/reset-password`  
**Authentication:** Not required  
**Description:** Reset password using token

**Request Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## 5. User Management Endpoints

### 5.1 Get User Profile

**Endpoint:** `GET /users/profile`  
**Authentication:** Required  
**Description:** Get current user's profile

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+92 300 1234567",
    "role": "customer",
    "profileImage": "https://example.com/image.jpg",
    "createdAt": "2026-03-30T10:00:00Z"
  }
}
```

### 5.2 Update User Profile

**Endpoint:** `PUT /users/profile`  
**Authentication:** Required  
**Description:** Update current user's profile

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+92 300 1234567",
  "profileImage": "https://example.com/new-image.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+92 300 1234567"
  },
  "message": "Profile updated successfully"
}
```

### 5.3 Change Password

**Endpoint:** `POST /users/change-password`  
**Authentication:** Required  
**Description:** Change user password

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 6. Business (tailor shops)

**Base path:** `/business`  
**Authentication:** Required for protected routes (Bearer JWT).

### 6.1 Get tailor shop slot limit

**Endpoint:** `GET /business/shops/business-slots`  
**Authentication:** Required (tailor or business_owner)  
**Description:** Returns how many shops the authenticated tailor may own, how many they already have, and whether they may add another. Limits come from environment variables `TAILOR_MAX_BUSINESSES` (default `1`) and optional `TAILOR_MAX_BUSINESSES_OVERRIDES` (comma-separated `email@x.com:max`).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "maxShops": 2,
    "currentCount": 1,
    "canAddMore": true
  }
}
```

**Response (403):** Non-tailor roles.

### 6.2 Create shop (limit enforced)

**Endpoint:** `POST /business/shops`  
When the tailor already owns `maxShops` rows in `business_tailor_shops`, the API returns **400** with a message indicating the limit (wording depends on `maxShops`).

