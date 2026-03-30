# Environment Configuration Guide

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Environment Overview

### 1.1 Environments
- **Development:** Local development environment
- **Staging:** Pre-production testing environment
- **Production:** Live production environment

### 1.2 Configuration Management
- Environment variables stored in `.env` files
- Never commit `.env` files to version control
- Use `.env.example` as template
- Different configurations for each environment

---

## 2. Backend Environment Variables

### 2.1 Development (.env)

```env
# Application
NODE_ENV=development
PORT=5000
APP_NAME=StitchyFlow

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stitchyflow
DB_USER=root
DB_PASSWORD=12345
DB_CONNECTION_LIMIT=10

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@stitchyflow.com

# Application URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:4000
API_URL=http://localhost:5000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Session
SESSION_SECRET=your_session_secret_change_in_production
SESSION_TIMEOUT=1800000

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:4000

# Payment Gateway (if applicable)
PAYMENT_API_KEY=your_payment_api_key
PAYMENT_SECRET_KEY=your_payment_secret_key
PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

### 2.2 Production (.env.production)

```env
# Application
NODE_ENV=production
PORT=5000
APP_NAME=StitchyFlow

# Database
DB_HOST=your-production-db-host
DB_PORT=3306
DB_NAME=stitchyflow_prod
DB_USER=stitchyflow_user
DB_PASSWORD=strong_production_password_here
DB_CONNECTION_LIMIT=20

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=strong_redis_password
REDIS_DB=0

# JWT
JWT_SECRET=very_strong_production_jwt_secret_key_here
JWT_REFRESH_SECRET=very_strong_refresh_secret_key_here
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=noreply@stitchyflow.com

# Application URLs
FRONTEND_URL=https://stitchyflow.com
ADMIN_URL=https://admin.stitchyflow.com
API_URL=https://api.stitchyflow.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/var/www/stitchyflow/uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# Logging
LOG_LEVEL=error
LOG_FILE_PATH=/var/log/stitchyflow

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Session
SESSION_SECRET=very_strong_session_secret_production
SESSION_TIMEOUT=1800000

# CORS
CORS_ORIGIN=https://stitchyflow.com,https://admin.stitchyflow.com

# Payment Gateway
PAYMENT_API_KEY=production_payment_api_key
PAYMENT_SECRET_KEY=production_payment_secret_key
PAYMENT_WEBHOOK_SECRET=production_webhook_secret

# SSL
SSL_CERT_PATH=/etc/letsencrypt/live/stitchyflow.com/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/stitchyflow.com/privkey.pem
```

---

## 3. Frontend Environment Variables

### 3.1 Development (.env)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_WS_URL=ws://localhost:5000

# Application
REACT_APP_NAME=StitchyFlow
REACT_APP_VERSION=1.0.0

# Features
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=true

# File Upload
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# Google Maps (if applicable)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Analytics (if applicable)
REACT_APP_GA_TRACKING_ID=
```

### 3.2 Production (.env.production)

```env
# API Configuration
REACT_APP_API_URL=https://api.stitchyflow.com/api/v1
REACT_APP_WS_URL=wss://api.stitchyflow.com

# Application
REACT_APP_NAME=StitchyFlow
REACT_APP_VERSION=1.0.0

# Features
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false

# File Upload
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=production_google_maps_api_key

# Analytics
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

---

## 4. Configuration Loading

### 4.1 Backend Configuration

```javascript
// config/env.js

require('dotenv').config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    name: process.env.APP_NAME || 'StitchyFlow'
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || 'stitchyflow',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB, 10) || 0
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expire: process.env.JWT_EXPIRE || '1h',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d'
  },
  
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM
  },
  
  urls: {
    frontend: process.env.FRONTEND_URL,
    admin: process.env.ADMIN_URL,
    api: process.env.API_URL
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || []
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs'
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || []
  }
};
```

---

## 5. Environment Validation

### 5.1 Validation Script

```javascript
// scripts/validate-env.js

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

function validateEnvironment() {
  const missing = [];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(varName => console.error(`  - ${varName}`));
    process.exit(1);
  }
  
  console.log('✓ All required environment variables are set');
}

validateEnvironment();
```

---

## 6. Environment-Specific Configurations

### 6.1 Database Configuration

```javascript
// config/database.js

const config = require('./env');

const dbConfig = {
  development: {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    connectionLimit: 10,
    debug: true
  },
  
  production: {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    connectionLimit: 20,
    debug: false,
    ssl: {
      rejectUnauthorized: true
    }
  }
};

module.exports = dbConfig[config.app.env];
```

---

## 7. Secrets Management

### 7.1 Best Practices
- Never commit secrets to version control
- Use environment variables for all secrets
- Rotate secrets regularly
- Use different secrets for each environment
- Store production secrets securely
- Limit access to production secrets

### 7.2 .env.example Template

```env
# Application
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stitchyflow
DB_USER=root
DB_PASSWORD=your_password_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=change_this_in_production
JWT_REFRESH_SECRET=change_this_in_production
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@stitchyflow.com

# URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:4000
API_URL=http://localhost:5000
```

---

## 8. Configuration Checklist

### 8.1 Development Setup
- [ ] Copy .env.example to .env
- [ ] Update database credentials
- [ ] Set JWT secrets
- [ ] Configure email settings
- [ ] Set application URLs
- [ ] Verify all required variables

### 8.2 Production Setup
- [ ] Create production .env file
- [ ] Use strong passwords and secrets
- [ ] Configure production database
- [ ] Set up production email service
- [ ] Configure production URLs
- [ ] Enable SSL/TLS
- [ ] Set appropriate log levels
- [ ] Configure rate limiting
- [ ] Verify CORS settings
- [ ] Test all configurations

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
