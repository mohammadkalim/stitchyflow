# System Architecture Document (SAD)

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Introduction

### 1.1 Purpose
This document describes the system architecture for StitchyFlow, including high-level design, component interactions, technology choices, and deployment architecture.

### 1.2 Scope
This document covers the complete technical architecture including frontend, backend, database, caching, security, and deployment infrastructure.

### 1.3 Audience
- Software architects
- Development team
- DevOps engineers
- Technical stakeholders

---

## 2. Architectural Overview

### 2.1 Architecture Style
StitchyFlow follows a **Three-Tier Architecture** pattern:

1. **Presentation Layer:** React.js frontend
2. **Application Layer:** Node.js/Express.js backend
3. **Data Layer:** MySQL database with Redis caching

### 2.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │  Main Website    │              │   Admin Panel    │    │
│  │   (React.js)     │              │   (React.js)     │    │
│  │   Port: 3000     │              │   Port: 4000     │    │
│  └──────────────────┘              └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTPS (SSL/TLS)
                            │
┌─────────────────────────────────────────────────────────────┐
│                   OpenLiteSpeed (Reverse Proxy)              │
│                      SSL Termination                         │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Node.js / Express.js Backend               │  │
│  │              (Managed by PM2)                        │  │
│  │                                                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │   Auth   │  │   API    │  │ Business │          │  │
│  │  │  Module  │  │  Routes  │  │  Logic   │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  │                                                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │   CORS   │  │Validation│  │   JWT    │          │  │
│  │  │Middleware│  │Middleware│  │Middleware│          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
┌─────────────▼──────────┐   ┌───────────▼──────────┐
│     Redis Cache         │   │    MySQL Database    │
│   (Session & Data)      │   │      Port: 3306      │
│                         │   │                      │
│  - Session Storage      │   │  - Normalized Schema │
│  - Data Caching         │   │  - Stored Procedures │
│  - Rate Limiting        │   │  - Functions         │
│                         │   │  - Views             │
│                         │   │  - Triggers          │
└─────────────────────────┘   └──────────────────────┘
```



---

## 3. Component Architecture

### 3.1 Frontend Architecture

#### 3.1.1 Main Website (Port 3000)
**Technology:** React.js with Material-UI

**Structure:**
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── customer/       # Customer-specific components
│   ├── tailor/         # Tailor-specific components
│   └── business/       # Business owner components
├── pages/              # Page components
│   ├── Home/
│   ├── TailorList/
│   ├── OrderForm/
│   ├── Dashboard/
│   └── Profile/
├── services/           # API service layer
│   ├── api.js         # Axios configuration
│   ├── authService.js
│   ├── orderService.js
│   └── userService.js
├── store/              # State management (Redux/Context)
│   ├── actions/
│   ├── reducers/
│   └── store.js
├── utils/              # Utility functions
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
├── hooks/              # Custom React hooks
├── routes/             # Route configuration
└── App.js              # Root component
```

**Key Features:**
- Component-based architecture
- State management (Redux or Context API)
- Lazy loading for performance
- Responsive design with Material-UI
- Form validation with Formik/React Hook Form
- API integration with Axios
- JWT token management
- Protected routes

#### 3.1.2 Admin Panel (Port 4000)
**Technology:** React.js with Material-UI

**Structure:** Similar to main website with admin-specific components
- User management interface
- Approval workflows
- Analytics dashboards
- System configuration
- Content management

### 3.2 Backend Architecture

#### 3.2.1 Application Structure
```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Database connection
│   │   ├── redis.js         # Redis configuration
│   │   └── env.js           # Environment variables
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── validation.js    # Request validation
│   │   ├── cors.js          # CORS configuration
│   │   ├── errorHandler.js  # Error handling
│   │   └── rateLimiter.js   # Rate limiting
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── order.routes.js
│   │   ├── tailor.routes.js
│   │   └── admin.routes.js
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── services/            # Business logic
│   │   ├── authService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   └── notificationService.js
│   ├── models/              # Database models (ORM)
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Tailor.js
│   │   └── Business.js
│   ├── utils/               # Utility functions
│   │   ├── jwt.js
│   │   ├── bcrypt.js
│   │   ├── logger.js
│   │   └── validators.js
│   ├── database/            # Database scripts
│   │   ├── procedures/      # Stored procedures
│   │   ├── functions/       # Database functions
│   │   ├── views/           # Database views
│   │   └── triggers/        # Database triggers
│   └── app.js               # Express app setup
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json
└── server.js                # Entry point
```

#### 3.2.2 Layered Architecture

**1. Route Layer**
- Defines API endpoints
- Maps HTTP methods to controllers
- Applies middleware (auth, validation)

**2. Controller Layer**
- Handles HTTP requests/responses
- Validates input data
- Calls service layer
- Returns formatted responses

**3. Service Layer**
- Contains business logic
- Interacts with database
- Handles transactions
- Implements complex operations

**4. Data Access Layer**
- ORM models
- Database queries
- Stored procedure calls
- Data transformation



### 3.3 Database Architecture

#### 3.3.1 Database Design Principles
- **Normalization:** Minimum 3NF to eliminate redundancy
- **Referential Integrity:** Foreign key constraints
- **Indexing:** Strategic indexes for query optimization
- **Stored Procedures:** Encapsulate complex business logic
- **Functions:** Reusable calculations and transformations
- **Views:** Simplify complex queries and reporting
- **Triggers:** Maintain data consistency and audit trails

#### 3.3.2 Core Database Entities
- Users (Admin, Business Owner, Tailor, Customer)
- Orders
- Measurements
- Payments
- Reviews and Ratings
- Notifications
- Audit Logs

### 3.4 Caching Architecture

#### 3.4.1 Redis Caching Strategy

**Cache Layers:**

1. **Session Cache**
   - User sessions
   - JWT refresh tokens
   - TTL: Based on token expiration

2. **Data Cache**
   - Frequently accessed data (tailor profiles, categories)
   - Dashboard statistics
   - TTL: 5-15 minutes

3. **Query Cache**
   - Expensive database query results
   - Aggregated analytics data
   - TTL: 1-5 minutes

4. **Rate Limiting**
   - API request tracking
   - Login attempt tracking
   - TTL: 1 hour

**Cache Invalidation Strategy:**
- Time-based expiration (TTL)
- Event-based invalidation (on data updates)
- Manual cache clearing for admin

---

## 4. Security Architecture

### 4.1 Authentication Flow

```
1. User Login Request
   ↓
2. Validate Credentials (bcrypt)
   ↓
3. Generate JWT Access Token (1 hour expiry)
   ↓
4. Generate Refresh Token (7 days expiry)
   ↓
5. Store Refresh Token in Redis
   ↓
6. Return Tokens to Client
   ↓
7. Client Stores Tokens (httpOnly cookies or localStorage)
   ↓
8. Client Includes Access Token in API Requests (Authorization Header)
   ↓
9. Server Validates Token on Each Request
   ↓
10. Token Expired? → Use Refresh Token to Get New Access Token
```

### 4.2 Authorization Flow

```
1. Authenticated Request Received
   ↓
2. Extract JWT Token
   ↓
3. Verify Token Signature
   ↓
4. Extract User Role from Token
   ↓
5. Check Route Permissions
   ↓
6. Verify User Has Required Role
   ↓
7. Allow/Deny Access
```

### 4.3 Security Layers

**Layer 1: Network Security**
- HTTPS/TLS encryption
- SSL certificate via Certbot
- Firewall configuration

**Layer 2: Application Security**
- CORS middleware
- Rate limiting
- Input validation
- Output encoding
- Security headers

**Layer 3: Authentication Security**
- JWT tokens
- Password hashing (bcrypt)
- Refresh token rotation
- Session management

**Layer 4: Authorization Security**
- Role-based access control (RBAC)
- Permission verification
- Resource ownership validation

**Layer 5: Data Security**
- Parameterized queries
- SQL injection prevention
- XSS protection
- Data encryption

---

## 5. Integration Architecture

### 5.1 Internal Integrations

#### 5.1.1 Frontend-Backend Integration
- **Protocol:** HTTPS REST API
- **Format:** JSON
- **Authentication:** JWT Bearer tokens
- **Error Handling:** Standardized error responses

#### 5.1.2 Backend-Database Integration
- **Connection:** MySQL connection pool via ORM
- **Query Execution:** Stored procedures and parameterized queries
- **Transaction Management:** ACID compliance
- **Connection Pooling:** Optimize resource usage

#### 5.1.3 Backend-Cache Integration
- **Connection:** Redis client
- **Usage:** Session storage, data caching, rate limiting
- **Fallback:** Graceful degradation if Redis unavailable

### 5.2 External Integrations

#### 5.2.1 Email Service Integration
- **Purpose:** Transactional emails and notifications
- **Method:** SMTP or API-based service (SendGrid, AWS SES)
- **Configuration:** Environment variables

#### 5.2.2 Payment Gateway Integration
- **Purpose:** Payment processing
- **Method:** RESTful API integration
- **Security:** PCI DSS compliance
- **Providers:** Stripe, PayPal, or local payment gateway

#### 5.2.3 SMS Gateway Integration (Optional)
- **Purpose:** SMS notifications
- **Method:** API integration
- **Providers:** Twilio, AWS SNS

---

## 6. Deployment Architecture

### 6.1 Development Environment

```
Developer Machine (localhost)
├── Frontend: localhost:3000
├── Admin Panel: localhost:4000
├── MySQL: localhost:3306
├── phpMyAdmin: localhost:8080
└── Redis: localhost:6379
```

### 6.2 Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                    Internet Users                        │
└─────────────────────────────────────────────────────────┘
                          │
                    HTTPS (Port 443)
                          │
┌─────────────────────────────────────────────────────────┐
│              OpenLiteSpeed Web Server                    │
│                                                          │
│  - Reverse Proxy                                        │
│  - SSL/TLS Termination (Certbot)                       │
│  - Load Balancing (if multiple instances)              │
│  - Static File Serving                                 │
└─────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
┌─────────────▼──────────┐  ┌────────▼─────────────┐
│   Frontend (React)      │  │  Admin Panel (React) │
│   Served as Static      │  │  Served as Static    │
└─────────────────────────┘  └──────────────────────┘
                          │
                    API Requests
                          │
┌─────────────────────────────────────────────────────────┐
│              PM2 Process Manager                         │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │  Node.js   │  │  Node.js   │  │  Node.js   │       │
│  │ Instance 1 │  │ Instance 2 │  │ Instance N │       │
│  └────────────┘  └────────────┘  └────────────┘       │
│                                                          │
│  - Process Monitoring                                   │
│  - Auto-restart on Failure                             │
│  - Load Balancing                                      │
│  - Log Management                                      │
└─────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
┌─────────────▼──────────┐  ┌────────▼─────────────┐
│    Redis Server         │  │   MySQL Server       │
│                         │  │                      │
│  - Caching              │  │  - Primary Database  │
│  - Session Store        │  │  - Replication       │
│  - Rate Limiting        │  │  - Backups           │
└─────────────────────────┘  └──────────────────────┘
```



### 6.3 Deployment Configuration

#### 6.3.1 PM2 Configuration (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'stitchyflow-api',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

#### 6.3.2 OpenLiteSpeed Configuration
- Virtual host configuration for domain
- Reverse proxy to Node.js backend
- SSL certificate configuration
- Static file serving for React builds
- Gzip compression
- Cache headers

---

## 7. Data Architecture

### 7.1 Data Flow

#### 7.1.1 Read Operation Flow
```
Client Request
   ↓
API Endpoint
   ↓
Authentication Middleware
   ↓
Authorization Check
   ↓
Check Redis Cache
   ↓
Cache Hit? → Return Cached Data
   ↓
Cache Miss? → Query Database (Stored Procedure)
   ↓
Store Result in Cache
   ↓
Return Data to Client
```

#### 7.1.2 Write Operation Flow
```
Client Request
   ↓
API Endpoint
   ↓
Authentication Middleware
   ↓
Authorization Check
   ↓
Validation Middleware
   ↓
Business Logic Service
   ↓
Database Transaction (Stored Procedure)
   ↓
Invalidate Related Cache
   ↓
Trigger Notifications
   ↓
Return Success Response
```

### 7.2 Database Connection Management

**Connection Pooling:**
- Minimum connections: 5
- Maximum connections: 20
- Connection timeout: 10 seconds
- Idle timeout: 30 seconds

**ORM Configuration:**
- Use Sequelize or TypeORM
- Model definitions
- Relationship mappings
- Migration management

---

## 8. Technology Stack Details

### 8.1 Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| React.js | UI framework | 18+ |
| Material-UI | Component library | 5+ |
| React Router | Routing | 6+ |
| Axios | HTTP client | Latest |
| Redux/Context API | State management | Latest |
| Formik | Form handling | Latest |
| Yup | Validation | Latest |
| Chart.js | Data visualization | Latest |

### 8.2 Backend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime environment | 14+ |
| Express.js | Web framework | 4+ |
| jsonwebtoken | JWT handling | Latest |
| bcrypt | Password hashing | Latest |
| cors | CORS middleware | Latest |
| helmet | Security headers | Latest |
| express-validator | Input validation | Latest |
| winston/pino | Logging | Latest |
| nodemailer | Email sending | Latest |

### 8.3 Database Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| MySQL | Primary database | 8.0+ |
| Sequelize/TypeORM | ORM | Latest |
| mysql2 | MySQL driver | Latest |

### 8.4 Infrastructure Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| PM2 | Process management | Latest |
| OpenLiteSpeed | Web server | Latest |
| Redis | Caching | Latest |
| Certbot | SSL certificates | Latest |

---

## 9. Performance Architecture

### 9.1 Performance Optimization Strategies

#### 9.1.1 Frontend Optimization
- Code splitting and lazy loading
- Image optimization and lazy loading
- Minification and bundling
- CDN for static assets (future)
- Browser caching
- Gzip compression

#### 9.1.2 Backend Optimization
- Asynchronous operations (async/await)
- Connection pooling
- Query optimization
- Stored procedures for complex operations
- Response compression
- Efficient algorithms

#### 9.1.3 Database Optimization
- Proper indexing strategy
- Query optimization
- Stored procedures
- Denormalization where justified
- Partitioning for large tables (future)
- Regular maintenance (ANALYZE, OPTIMIZE)

#### 9.1.4 Caching Strategy
- Redis for frequently accessed data
- Cache warming for critical data
- Intelligent cache invalidation
- Multi-level caching

### 9.2 Scalability Considerations

#### 9.2.1 Horizontal Scaling
- Stateless backend design
- PM2 cluster mode
- Load balancing via OpenLiteSpeed
- Session storage in Redis (not in-memory)

#### 9.2.2 Vertical Scaling
- Optimize resource usage
- Monitor and adjust server resources
- Database performance tuning

#### 9.2.3 Database Scaling
- Read replicas for read-heavy operations
- Connection pooling
- Query optimization
- Caching layer to reduce database load

---

## 10. Monitoring and Logging Architecture

### 10.1 Application Logging

**Log Levels:**
- ERROR: Application errors
- WARN: Warning conditions
- INFO: Informational messages
- DEBUG: Debug information (development only)

**Log Storage:**
- File-based logging (Winston/Pino)
- Log rotation to manage disk space
- Centralized log aggregation (future)

**Logged Events:**
- Authentication attempts
- API requests and responses
- Database operations
- Errors and exceptions
- Security events
- Performance metrics

### 10.2 Process Monitoring

**PM2 Monitoring:**
- Process health checks
- CPU and memory usage
- Restart counts
- Error logs
- Performance metrics

### 10.3 Database Monitoring

**Metrics to Monitor:**
- Query performance
- Connection pool usage
- Slow query log
- Deadlocks
- Table sizes
- Index usage

---

## 11. Disaster Recovery and Backup

### 11.1 Backup Strategy

**Database Backups:**
- Automated daily full backups
- Incremental backups every 6 hours
- Backup retention: 30 days
- Offsite backup storage
- Backup verification and testing

**Application Backups:**
- Code repository (Git)
- Configuration files
- Environment variables (encrypted)
- SSL certificates

### 11.2 Recovery Procedures

**Recovery Time Objective (RTO):** 4 hours  
**Recovery Point Objective (RPO):** 6 hours

**Recovery Steps:**
1. Identify failure point
2. Restore from latest backup
3. Verify data integrity
4. Restart services
5. Validate functionality
6. Monitor for issues

---

## 12. Development and Deployment Workflow

### 12.1 Development Workflow

```
1. Feature Branch Creation
   ↓
2. Local Development
   ↓
3. Unit Testing
   ↓
4. Code Review
   ↓
5. Merge to Main Branch
   ↓
6. Automated Testing
   ↓
7. Staging Deployment
   ↓
8. UAT
   ↓
9. Production Deployment
```

### 12.2 Deployment Process

**Steps:**
1. Pull latest code from repository
2. Install/update dependencies
3. Run database migrations
4. Build frontend applications
5. Update environment configuration
6. Restart PM2 processes
7. Verify deployment
8. Monitor for issues

**Rollback Plan:**
- Keep previous version available
- Database migration rollback scripts
- Quick rollback procedure documented

---

## 13. API Architecture

### 13.1 RESTful API Design

**Endpoint Structure:**
```
/api/v1/{resource}/{action}
```

**HTTP Methods:**
- GET: Retrieve resources
- POST: Create resources
- PUT: Update resources (full)
- PATCH: Update resources (partial)
- DELETE: Delete resources

**Authentication:**
- Header: `Authorization: Bearer <token>`

**Response Format:**
- Consistent JSON structure
- HTTP status codes
- Error handling

### 13.2 API Versioning
- Version in URL path (/api/v1/)
- Maintain backward compatibility
- Deprecation notices for old versions

---

## 14. Quality Attributes

### 14.1 Availability
- Target: 99.9% uptime
- Redundancy for critical components
- Health check endpoints
- Automated monitoring and alerts

### 14.2 Reliability
- Comprehensive error handling
- Transaction management
- Data validation
- Graceful degradation

### 14.3 Maintainability
- Clean code principles
- Comprehensive documentation
- Modular architecture
- Automated testing

### 14.4 Security
- Defense in depth
- Regular security audits
- Vulnerability scanning
- Security patch management

---

## 15. Appendices

### 15.1 Environment Variables

```
# Application
NODE_ENV=production
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stitchyflow
DB_USER=root
DB_PASSWORD=secure_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=noreply@stitchyflow.com
EMAIL_PASSWORD=email_password

# Application URLs
FRONTEND_URL=https://stitchyflow.com
ADMIN_URL=https://admin.stitchyflow.com
```

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
