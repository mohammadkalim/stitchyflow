# Changelog

**Project Name:** StitchyFlow  
**Maintained by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned Features
- Mobile applications (iOS and Android)
- Real-time chat between customers and tailors
- Video consultation feature
- Advanced analytics dashboard
- Multi-language support
- Payment gateway integration
- SMS notifications

---

## [1.4.0] - 2026-04-10

### Added - Social Media Links Management (Full Stack)
- Admin panel Settings page → Social Media tab: full CRUD (Add, Edit, Delete, Toggle active)
- Each link supports: platform, label, URL, icon color, show in header, show in footer, footer position (left/right), sort order, active status
- `social_media_links` database table with seed data (Facebook, Instagram, Twitter, YouTube, LinkedIn, TikTok)
- Backend REST API: GET, POST, PUT, DELETE, PATCH toggle — `/api/v1/social-media`
- Frontend `Header.js` now dynamically fetches and displays active social icons marked `show_header=true`
- Frontend `Footer.js` now dynamically fetches and displays active social icons split by `footer_position` (left in brand column, right in contact column)
- Fallback static icons in footer if no DB links are configured

---

## [1.1.0] - 2026-03-30

### Added - Admin Panel Complete Redesign
- Professional admin panel with collapsible sidebar navigation
- Dashboard with 8 medium-sized analytics widgets
- Professional analytics section below widgets
- Clean white theme with blue (#2196F3) accent colors
- Sidebar with toggle button (Menu/ChevronLeft icons)
- Active page highlighting in blue color
- Complete page management system:
  - Dashboard - Analytics overview
  - Users - Customer management with status chips
  - Orders - Order tracking with status colors
  - Tailors - Tailor management
  - Measurements - Customer measurement records
  - Payments - Payment tracking with status
  - Reports - Daily/Weekly/Monthly analytics
  - Settings - System configuration
- Professional login page:
  - Centered popup design
  - "StitchyFlow Login" header text
  - Clean white theme with blue buttons
  - No animations or hints
  - JWT authentication with adminToken
- Backend admin API routes:
  - GET /api/v1/admin/analytics
  - GET /api/v1/admin/users
  - GET /api/v1/admin/orders
  - GET /api/v1/admin/tailors
  - GET /api/v1/admin/measurements
  - GET /api/v1/admin/payments
  - GET /api/v1/admin/reports
- Protected routes with JWT authentication
- Logout functionality
- Responsive table layouts
- Material-UI components throughout
- Admin panel README documentation

### Changed
- Updated App.js with all new routes
- Improved authentication flow
- Enhanced UI/UX consistency
- Better error handling in admin pages

---

## [1.0.0] - 2026-03-30

### Added
- Initial release of StitchyFlow platform
- User authentication and authorization system
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Business Owner, Tailor, Customer)
- Admin panel for system management
- Business owner dashboard
- Tailor dashboard
- Customer interface
- Order management system
- Order placement and tracking
- Order status workflow
- Measurement management
- Payment tracking system
- Review and rating system
- Notification system
- Email notifications
- In-app notifications
- User profile management
- Business profile management
- Tailor profile management
- Dashboard analytics
- MySQL database with stored procedures, functions, views, and triggers
- Redis caching implementation
- API documentation (Swagger)
- Comprehensive error handling
- Input validation and sanitization
- Security features (HTTPS, CORS, rate limiting)
- Responsive UI design with Material-UI
- Image upload functionality
- Search and filter capabilities
- Pagination for large datasets
- Audit logging
- Session management
- Password reset functionality

### Security
- Bcrypt password hashing
- JWT token authentication
- HTTPS/TLS encryption
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Security headers implementation

### Documentation
- Business Requirements Document (BRD)
- Software Requirements Specification (SRS)
- System Architecture Document (SAD)
- Database Design Document
- API Documentation
- UI/UX Design Document
- Developer Guide
- SDLC Documentation
- Security & Compliance Plan
- UAT Plan
- Deployment & Operations Guide
- Performance Optimization Guide
- Testing Strategy
- Git Workflow Guide
- Error Handling Guide
- Environment Configuration Guide

### Infrastructure
- PM2 process management
- OpenLiteSpeed web server
- MySQL 8.0+ database
- Redis caching server
- SSL certificate with Certbot
- Automated backups
- Logging with Winston/Pino
- Monitoring setup

---

## Version History

### Version Numbering
- **Major version (X.0.0)**: Incompatible API changes
- **Minor version (0.X.0)**: New features, backward compatible
- **Patch version (0.0.X)**: Bug fixes, backward compatible

### Release Schedule
- Major releases: Annually
- Minor releases: Quarterly
- Patch releases: As needed

---

## Future Roadmap

### Version 1.1.0 (Planned: Q2 2026)
- Payment gateway integration (Stripe/PayPal)
- Advanced search with filters
- Bulk order management
- Export functionality (PDF, Excel)
- Enhanced analytics
- Performance optimizations

### Version 1.2.0 (Planned: Q3 2026)
- Real-time notifications (WebSocket)
- Chat system
- Video consultation
- Mobile-responsive improvements
- Multi-language support

### Version 2.0.0 (Planned: Q4 2026)
- Mobile applications (iOS/Android)
- Advanced AI recommendations
- Automated measurement suggestions
- Social media integration
- Marketplace features

---

## Changelog Guidelines

### Types of Changes
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

### Example Entry Format
```markdown
## [1.1.0] - 2026-06-15

### Added
- Payment gateway integration with Stripe
- Export orders to PDF functionality
- Advanced search filters

### Changed
- Improved dashboard performance
- Updated UI components

### Fixed
- Order status update bug
- Email notification timing issue

### Security
- Updated dependencies
- Enhanced input validation
```

---

**Last Updated:** March 30, 2026  
**Maintained by:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
