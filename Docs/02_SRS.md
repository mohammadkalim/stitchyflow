# Software Requirements Specification (SRS)

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a complete description of all functions and specifications for the StitchyFlow web application. It is intended for developers, testers, project managers, and stakeholders.

### 1.2 Scope
StitchyFlow is a web-based platform that connects customers with professional tailors through an intuitive interface. The system includes:
- Customer-facing website for browsing and ordering
- Tailor dashboard for order management
- Business owner dashboard for business operations
- Admin panel for system administration

### 1.3 Definitions, Acronyms, and Abbreviations
- **API:** Application Programming Interface
- **JWT:** JSON Web Token
- **CRUD:** Create, Read, Update, Delete
- **UI/UX:** User Interface/User Experience
- **SSL:** Secure Sockets Layer
- **CORS:** Cross-Origin Resource Sharing
- **ORM:** Object-Relational Mapping
- **PM2:** Process Manager 2

### 1.4 References
- Business Requirements Document (BRD)
- System Architecture Document (SAD)
- Database Design Document
- API Documentation

### 1.5 Overview
This document describes functional and non-functional requirements, system features, external interface requirements, and other specifications necessary for development.

---

## 2. Overall Description

### 2.1 Product Perspective
StitchyFlow is a standalone web application that operates as a marketplace platform connecting multiple stakeholders in the tailoring industry.

### 2.2 Product Functions
- User registration and authentication
- Role-based access control (Admin, Business Owner, Tailor, Customer)
- Order placement and management
- Dashboard analytics and reporting
- Payment processing and tracking
- Communication and notifications
- Review and rating system

### 2.3 User Classes and Characteristics

#### 2.3.1 Administrator
- Technical proficiency: High
- Frequency of use: Daily
- Functions: System management, user approval, configuration

#### 2.3.2 Business Owner
- Technical proficiency: Medium
- Frequency of use: Daily
- Functions: Business operations, tailor management, analytics

#### 2.3.3 Tailor
- Technical proficiency: Low to Medium
- Frequency of use: Daily
- Functions: Order management, status updates, earnings tracking

#### 2.3.4 Customer
- Technical proficiency: Low to Medium
- Frequency of use: As needed
- Functions: Browse tailors, place orders, track status

### 2.4 Operating Environment
- **Client:** Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Server:** Node.js runtime on Linux/Unix environment
- **Web Server:** OpenLiteSpeed
- **Database:** MySQL 8.0+
- **Cache:** Redis
- **Process Manager:** PM2

### 2.5 Design and Implementation Constraints
- Must use React.js for frontend
- Must use Node.js/Express.js for backend
- Must use MySQL with stored procedures, functions, views, and triggers
- Must implement JWT authentication
- Must use Material-UI for UI components
- Must support localhost development environment
- MySQL port fixed at 3306

### 2.6 Assumptions and Dependencies
- Users have stable internet connection
- Modern web browser availability
- MySQL and Redis servers are operational
- Email service for notifications is available
- SSL certificates can be obtained via Let's Encrypt

---

## 3. System Features

### 3.1 User Authentication and Authorization

#### 3.1.1 Description
Secure user authentication system with role-based access control using JWT tokens.

#### 3.1.2 Functional Requirements


**FR-3.1.1:** System shall provide registration forms for each user type  
**FR-3.1.2:** System shall validate email uniqueness during registration  
**FR-3.1.3:** System shall hash passwords using bcrypt or similar  
**FR-3.1.4:** System shall generate JWT access tokens upon successful login  
**FR-3.1.5:** System shall implement refresh token mechanism  
**FR-3.1.6:** System shall validate tokens on protected routes  
**FR-3.1.7:** System shall implement role-based middleware  
**FR-3.1.8:** Admin shall approve Business Owner and Tailor registrations  
**FR-3.1.9:** System shall provide password reset functionality  
**FR-3.1.10:** System shall implement session timeout after inactivity

### 3.2 Admin Panel

#### 3.2.1 Description
Comprehensive administrative interface for complete system management and oversight.

#### 3.2.2 Functional Requirements

**FR-3.2.1:** Admin shall view dashboard with system statistics  
**FR-3.2.2:** Admin shall manage all user accounts (view, edit, delete, suspend)  
**FR-3.2.3:** Admin shall approve/reject Business Owner registrations  
**FR-3.2.4:** Admin shall approve/reject Tailor registrations  
**FR-3.2.5:** Admin shall view all orders across the platform  
**FR-3.2.6:** Admin shall access comprehensive analytics and reports  
**FR-3.2.7:** Admin shall configure system settings and parameters  
**FR-3.2.8:** Admin shall manage platform content and policies  
**FR-3.2.9:** Admin shall view system logs and audit trails  
**FR-3.2.10:** Admin shall manage categories and service types  
**FR-3.2.11:** Admin shall handle dispute resolution  
**FR-3.2.12:** Admin shall configure commission rates

### 3.3 Business Owner Dashboard

#### 3.3.1 Description
Dedicated dashboard for business owners to manage their tailoring business operations.

#### 3.3.2 Functional Requirements

**FR-3.3.1:** Business Owner shall view personalized dashboard with key metrics  
**FR-3.3.2:** Business Owner shall manage tailor profiles and assignments  
**FR-3.3.3:** Business Owner shall view all orders for their business  
**FR-3.3.4:** Business Owner shall assign orders to tailors  
**FR-3.3.5:** Business Owner shall track order status and progress  
**FR-3.3.6:** Business Owner shall manage customer relationships  
**FR-3.3.7:** Business Owner shall access business analytics and reports  
**FR-3.3.8:** Business Owner shall configure pricing and services  
**FR-3.3.9:** Business Owner shall manage business profile and information  
**FR-3.3.10:** Business Owner shall view revenue and financial reports  
**FR-3.3.11:** Business Owner shall communicate with customers and tailors  
**FR-3.3.12:** Business Owner shall manage tailor availability and capacity

### 3.4 Tailor Dashboard

#### 3.4.1 Description
Dedicated interface for tailors to manage their assigned orders and profile.

#### 3.4.2 Functional Requirements

**FR-3.4.1:** Tailor shall view dashboard with pending and active orders  
**FR-3.4.2:** Tailor shall receive notifications for new order assignments  
**FR-3.4.3:** Tailor shall accept or reject order requests  
**FR-3.4.4:** Tailor shall update order status through workflow stages  
**FR-3.4.5:** Tailor shall add notes and updates to orders  
**FR-3.4.6:** Tailor shall upload progress photos  
**FR-3.4.7:** Tailor shall manage availability calendar  
**FR-3.4.8:** Tailor shall view earnings and payment history  
**FR-3.4.9:** Tailor shall update profile and skills  
**FR-3.4.10:** Tailor shall communicate with customers  
**FR-3.4.11:** Tailor shall view ratings and reviews  
**FR-3.4.12:** Tailor shall mark orders as completed

### 3.5 Customer Features

#### 3.5.1 Description
Customer-facing features for browsing tailors and placing orders.

#### 3.5.2 Functional Requirements

**FR-3.5.1:** Customer shall browse available tailors with filters  
**FR-3.5.2:** Customer shall view tailor profiles with ratings and reviews  
**FR-3.5.3:** Customer shall place custom tailoring orders  
**FR-3.5.4:** Customer shall upload measurement details  
**FR-3.5.5:** Customer shall upload reference images  
**FR-3.5.6:** Customer shall track order status in real-time  
**FR-3.5.7:** Customer shall communicate with assigned tailor  
**FR-3.5.8:** Customer shall make payments securely  
**FR-3.5.9:** Customer shall view order history  
**FR-3.5.10:** Customer shall rate and review completed orders  
**FR-3.5.11:** Customer shall request order modifications  
**FR-3.5.12:** Customer shall cancel orders with proper workflow  
**FR-3.5.13:** Customer shall save favorite tailors  
**FR-3.5.14:** Customer shall receive notifications for order updates

### 3.6 Order Management System

#### 3.6.1 Description
Comprehensive order lifecycle management from placement to completion.

#### 3.6.2 Functional Requirements

**FR-3.6.1:** System shall support order creation with detailed specifications  
**FR-3.6.2:** System shall assign unique order IDs  
**FR-3.6.3:** System shall track order status through defined stages  
**FR-3.6.4:** System shall support order status: Pending, Accepted, In Progress, Completed, Cancelled  
**FR-3.6.5:** System shall send notifications on status changes  
**FR-3.6.6:** System shall support order modifications with approval workflow  
**FR-3.6.7:** System shall handle order cancellations with refund logic  
**FR-3.6.8:** System shall store order history and audit trail  
**FR-3.6.9:** System shall calculate estimated completion dates  
**FR-3.6.10:** System shall support bulk order operations for business owners



### 3.7 Payment Processing

#### 3.7.1 Description
Secure payment processing system for order transactions.

#### 3.7.2 Functional Requirements

**FR-3.7.1:** System shall support multiple payment methods  
**FR-3.7.2:** System shall process payments securely  
**FR-3.7.3:** System shall generate payment receipts  
**FR-3.7.4:** System shall track payment status  
**FR-3.7.5:** System shall handle refunds for cancelled orders  
**FR-3.7.6:** System shall calculate and track commission  
**FR-3.7.7:** System shall manage tailor payouts  
**FR-3.7.8:** System shall generate financial reports

### 3.8 Notification System

#### 3.8.1 Description
Multi-channel notification system for user communication.

#### 3.8.2 Functional Requirements

**FR-3.8.1:** System shall send email notifications for critical events  
**FR-3.8.2:** System shall provide in-app notifications  
**FR-3.8.3:** System shall notify users of order status changes  
**FR-3.8.4:** System shall notify tailors of new order assignments  
**FR-3.8.5:** System shall notify business owners of important events  
**FR-3.8.6:** System shall allow users to configure notification preferences

### 3.9 Analytics and Reporting

#### 3.9.1 Description
Comprehensive analytics and reporting capabilities for data-driven decisions.

#### 3.9.2 Functional Requirements

**FR-3.9.1:** System shall track key performance indicators (KPIs)  
**FR-3.9.2:** Admin shall view platform-wide analytics  
**FR-3.9.3:** Business owners shall view business-specific analytics  
**FR-3.9.4:** System shall generate revenue reports  
**FR-3.9.5:** System shall track user engagement metrics  
**FR-3.9.6:** System shall provide order analytics  
**FR-3.9.7:** System shall support custom date range filtering  
**FR-3.9.8:** System shall export reports in multiple formats

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements
- Modern, clean, and professional design
- Material-UI component library
- Responsive design for all screen sizes
- Consistent branding and color scheme
- Intuitive navigation
- Accessibility compliance
- Loading indicators for async operations
- Error messages and validation feedback

#### 4.1.2 Main Website (Port 3000)
- Homepage with platform overview
- Tailor browsing and search interface
- Tailor profile pages
- Order placement forms
- Customer dashboard
- Order tracking interface
- User profile management
- Review and rating interface

#### 4.1.3 Admin Panel (Port 4000)
- Admin dashboard with system overview
- User management interface
- Approval workflow interface
- System configuration panels
- Analytics and reporting dashboards
- Content management interface
- Audit log viewer



### 4.2 Hardware Interfaces
- No direct hardware interface requirements
- Standard server hardware for hosting
- Network infrastructure for internet connectivity

### 4.3 Software Interfaces

#### 4.3.1 Database Interface
- **System:** MySQL 8.0+
- **Port:** 3306
- **Connection:** Via ORM with connection pooling
- **Features:** Stored procedures, functions, views, triggers

#### 4.3.2 Cache Interface
- **System:** Redis
- **Purpose:** Session storage, data caching, rate limiting
- **Connection:** Redis client library

#### 4.3.3 Email Service Interface
- **Purpose:** Transactional emails and notifications
- **Protocol:** SMTP or API-based service
- **Configuration:** Environment variables

#### 4.3.4 Payment Gateway Interface
- **Purpose:** Payment processing
- **Integration:** RESTful API
- **Security:** PCI DSS compliance considerations

### 4.4 Communication Interfaces

#### 4.4.1 HTTP/HTTPS Protocol
- All client-server communication via HTTPS
- RESTful API architecture
- JSON data format

#### 4.4.2 WebSocket (Optional Future Enhancement)
- Real-time notifications
- Live order updates

---

## 5. System Features - Detailed Requirements

### 5.1 User Registration and Authentication

**Priority:** High  
**Risk:** Medium

#### 5.1.1 Stimulus/Response Sequences
1. User accesses registration page
2. User fills registration form with required information
3. System validates input data
4. System creates user account (pending approval for Business Owner/Tailor)
5. System sends confirmation email
6. Admin approves account (for Business Owner/Tailor)
7. User receives approval notification
8. User can log in with credentials

#### 5.1.2 Functional Requirements

**FR-5.1.1:** Registration form shall include: name, email, phone, password, role selection  
**FR-5.1.2:** System shall validate email format and uniqueness  
**FR-5.1.3:** System shall enforce password strength requirements (min 8 chars, uppercase, lowercase, number)  
**FR-5.1.4:** System shall hash passwords before storage  
**FR-5.1.5:** Login shall return JWT access token and refresh token  
**FR-5.1.6:** Access token shall expire after 1 hour  
**FR-5.1.7:** Refresh token shall expire after 7 days  
**FR-5.1.8:** System shall provide token refresh endpoint  
**FR-5.1.9:** System shall implement logout functionality  
**FR-5.1.10:** System shall log authentication attempts



### 5.2 Order Management

**Priority:** High  
**Risk:** High

#### 5.2.1 Stimulus/Response Sequences
1. Customer browses tailors and selects one
2. Customer fills order form with specifications
3. System validates and creates order
4. System notifies tailor/business owner
5. Tailor accepts order
6. Tailor updates order progress
7. Customer receives status notifications
8. Tailor marks order complete
9. Customer confirms and rates order

#### 5.2.2 Functional Requirements

**FR-5.2.1:** Order form shall capture: garment type, measurements, fabric details, special instructions  
**FR-5.2.2:** System shall support image uploads for reference  
**FR-5.2.3:** System shall calculate estimated price  
**FR-5.2.4:** System shall assign unique order number  
**FR-5.2.5:** System shall track order through status workflow  
**FR-5.2.6:** System shall send notifications at each status change  
**FR-5.2.7:** System shall support order modification requests  
**FR-5.2.8:** System shall handle order cancellations with business rules  
**FR-5.2.9:** System shall store complete order history  
**FR-5.2.10:** System shall support order search and filtering

### 5.3 Dashboard and Analytics

**Priority:** High  
**Risk:** Low

#### 5.3.1 Functional Requirements

**FR-5.3.1:** Each user role shall have customized dashboard  
**FR-5.3.2:** Dashboards shall display relevant KPIs and metrics  
**FR-5.3.3:** System shall provide data visualization (charts, graphs)  
**FR-5.3.4:** System shall support date range filtering  
**FR-5.3.5:** System shall calculate real-time statistics  
**FR-5.3.6:** System shall cache dashboard data for performance  
**FR-5.3.7:** Business owners shall view revenue trends  
**FR-5.3.8:** Tailors shall view order completion rates  
**FR-5.3.9:** Admin shall view platform growth metrics  
**FR-5.3.10:** System shall export reports in PDF/Excel format

---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements

**NFR-6.1.1:** Page load time shall not exceed 2 seconds under normal load  
**NFR-6.1.2:** API response time shall not exceed 500ms for 95% of requests  
**NFR-6.1.3:** System shall support 1000+ concurrent users  
**NFR-6.1.4:** Database queries shall be optimized using indexes and stored procedures  
**NFR-6.1.5:** Images shall be optimized and lazy-loaded  
**NFR-6.1.6:** Redis caching shall reduce database load by 60%  
**NFR-6.1.7:** System shall implement pagination for large datasets  
**NFR-6.1.8:** Async operations shall be used for non-blocking I/O

### 6.2 Security Requirements

**NFR-6.2.1:** All data transmission shall use HTTPS/TLS 1.2+  
**NFR-6.2.2:** Passwords shall be hashed using bcrypt (cost factor 10+)  
**NFR-6.2.3:** System shall implement CORS policy  
**NFR-6.2.4:** System shall validate and sanitize all user inputs  
**NFR-6.2.5:** System shall protect against SQL injection  
**NFR-6.2.6:** System shall protect against XSS attacks  
**NFR-6.2.7:** System shall implement rate limiting  
**NFR-6.2.8:** System shall log security events  
**NFR-6.2.9:** Sensitive data shall be encrypted at rest  
**NFR-6.2.10:** System shall implement CSRF protection

### 6.3 Reliability Requirements

**NFR-6.3.1:** System uptime shall be ≥99.9%  
**NFR-6.3.2:** System shall implement comprehensive error handling  
**NFR-6.3.3:** System shall provide graceful degradation  
**NFR-6.3.4:** System shall implement automated health checks  
**NFR-6.3.5:** System shall support automatic recovery from failures  
**NFR-6.3.6:** Database backups shall be automated daily  
**NFR-6.3.7:** System shall maintain transaction integrity

### 6.4 Availability Requirements

**NFR-6.4.1:** System shall be available 24/7  
**NFR-6.4.2:** Planned maintenance windows shall not exceed 2 hours  
**NFR-6.4.3:** System shall notify users of scheduled maintenance  
**NFR-6.4.4:** Critical services shall have redundancy

### 6.5 Maintainability Requirements

**NFR-6.5.1:** Code shall follow consistent style guidelines  
**NFR-6.5.2:** Code shall include inline comments for complex logic  
**NFR-6.5.3:** System shall use environment-based configuration  
**NFR-6.5.4:** System shall implement structured logging  
**NFR-6.5.5:** Code shall be modular and follow separation of concerns  
**NFR-6.5.6:** System shall include comprehensive API documentation  
**NFR-6.5.7:** Database schema shall be version controlled



### 6.6 Portability Requirements

**NFR-6.6.1:** Frontend shall work on all modern browsers  
**NFR-6.6.2:** System shall be responsive across devices  
**NFR-6.6.3:** Backend shall be platform-independent (Node.js)  
**NFR-6.6.4:** System shall support deployment on various hosting environments

### 6.7 Scalability Requirements

**NFR-6.7.1:** Architecture shall support horizontal scaling  
**NFR-6.7.2:** Database shall be optimized for growth  
**NFR-6.7.3:** System shall handle increasing user load  
**NFR-6.7.4:** Caching strategy shall support scalability  
**NFR-6.7.5:** API design shall support versioning

### 6.8 Usability Requirements

**NFR-6.8.1:** Interface shall be intuitive and require minimal training  
**NFR-6.8.2:** System shall provide helpful error messages  
**NFR-6.8.3:** System shall include user guidance and tooltips  
**NFR-6.8.4:** Forms shall include inline validation  
**NFR-6.8.5:** System shall support keyboard navigation  
**NFR-6.8.6:** Loading states shall be clearly indicated

---

## 7. Database Requirements

### 7.1 General Database Requirements

**DR-7.1.1:** Database shall use MySQL 8.0 or higher  
**DR-7.1.2:** Schema shall be highly normalized (3NF minimum)  
**DR-7.1.3:** All tables shall have primary keys  
**DR-7.1.4:** Foreign key constraints shall enforce referential integrity  
**DR-7.1.5:** Indexes shall be created for frequently queried columns  
**DR-7.1.6:** Timestamps (created_at, updated_at) shall be included in all tables

### 7.2 Stored Procedures Requirements

**DR-7.2.1:** Complex business logic shall be implemented as stored procedures  
**DR-7.2.2:** CRUD operations shall use stored procedures  
**DR-7.2.3:** Stored procedures shall include error handling  
**DR-7.2.4:** Stored procedures shall be documented with comments

### 7.3 Functions Requirements

**DR-7.3.1:** Reusable calculations shall be implemented as functions  
**DR-7.3.2:** Functions shall be deterministic where possible  
**DR-7.3.3:** Functions shall handle NULL values appropriately

### 7.4 Views Requirements

**DR-7.4.1:** Complex queries shall be encapsulated in views  
**DR-7.4.2:** Views shall be used for reporting and analytics  
**DR-7.4.3:** Views shall optimize frequently accessed data combinations

### 7.5 Triggers Requirements

**DR-7.5.1:** Triggers shall maintain data integrity  
**DR-7.5.2:** Triggers shall audit critical data changes  
**DR-7.5.3:** Triggers shall update denormalized data automatically  
**DR-7.5.4:** Triggers shall be thoroughly tested to avoid performance issues

---

## 8. API Requirements

### 8.1 General API Requirements

**AR-8.1.1:** APIs shall follow RESTful principles  
**AR-8.1.2:** APIs shall use appropriate HTTP methods (GET, POST, PUT, DELETE)  
**AR-8.1.3:** APIs shall return appropriate HTTP status codes  
**AR-8.1.4:** APIs shall use JSON for request/response bodies  
**AR-8.1.5:** APIs shall implement versioning (e.g., /api/v1/)  
**AR-8.1.6:** APIs shall be documented using Swagger/OpenAPI  
**AR-8.1.7:** Protected APIs shall require JWT authentication  
**AR-8.1.8:** APIs shall implement rate limiting  
**AR-8.1.9:** APIs shall validate request data  
**AR-8.1.10:** APIs shall return consistent error response format

### 8.2 API Response Format

#### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

---

## 9. Security Requirements

### 9.1 Authentication Security

**SR-9.1.1:** Passwords shall meet complexity requirements  
**SR-9.1.2:** Failed login attempts shall be rate-limited  
**SR-9.1.3:** Account lockout after 5 failed attempts  
**SR-9.1.4:** JWT tokens shall include expiration  
**SR-9.1.5:** Refresh tokens shall be stored securely  
**SR-9.1.6:** Password reset shall use secure token mechanism

### 9.2 Authorization Security

**SR-9.2.1:** All routes shall implement role-based access control  
**SR-9.2.2:** Users shall only access authorized resources  
**SR-9.2.3:** API endpoints shall verify user permissions  
**SR-9.2.4:** Admin actions shall require additional verification

### 9.3 Data Security

**SR-9.3.1:** Sensitive data shall be encrypted in transit (HTTPS)  
**SR-9.3.2:** Passwords shall never be stored in plain text  
**SR-9.3.3:** Personal information shall be protected  
**SR-9.3.4:** Payment information shall follow PCI standards  
**SR-9.3.5:** Database backups shall be encrypted

### 9.4 Application Security

**SR-9.4.1:** Input validation on both client and server  
**SR-9.4.2:** SQL injection prevention through parameterized queries  
**SR-9.4.3:** XSS prevention through output encoding  
**SR-9.4.4:** CSRF protection for state-changing operations  
**SR-9.4.5:** Security headers implementation (CSP, X-Frame-Options, etc.)  
**SR-9.4.6:** File upload validation and sanitization  
**SR-9.4.7:** API rate limiting to prevent abuse

---

## 10. Quality Attributes

### 10.1 Testability
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical workflows
- Test coverage minimum 80%

### 10.2 Modularity
- Separation of concerns
- Reusable components
- Clear module boundaries
- Dependency injection where appropriate

### 10.3 Extensibility
- Plugin architecture for future enhancements
- API versioning for backward compatibility
- Configurable business rules
- Modular feature implementation

---

## 11. Appendices

### 11.1 Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React.js | Latest |
| UI Library | Material-UI | Latest |
| Backend | Node.js | 14+ |
| Framework | Express.js | Latest |
| Database | MySQL | 8.0+ |
| Cache | Redis | Latest |
| Process Manager | PM2 | Latest |
| Web Server | OpenLiteSpeed | Latest |
| SSL | Certbot | Latest |

### 11.2 Port Configuration

| Service | Port |
|---------|------|
| Frontend | 3000 |
| Admin Panel | 4000 |
| MySQL | 3306 |
| phpMyAdmin | 8080 |
| Redis | 6379 (default) |

### 11.3 Development Credentials

**Database:**
- Username: root
- Password: 12345 (development only)

**Production Note:** All credentials must be changed for production deployment.

---

## 12. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Technical Lead | Muhammad Kalim | | March 30, 2026 |
| QA Lead | | | |
| Business Stakeholder | | | |

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
