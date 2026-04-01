# StitchyFlow - Professional Tailoring Marketplace

**Developer:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** +92 333 3836851 | info@logixinventor.com

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
cd StitchyFlow/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin panel dependencies
cd ../admin
npm install
cd ../..
```

### 2. Setup Database

```bash
mysql -u root -p12345 < Database/database_setup.sql
```

### 3. Start All Services

```bash
./start.StitchyFlow.sh
```

## Application URLs

- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:4000
- **Backend API:** http://localhost:5000
- **phpMyAdmin:** http://localhost:8080/phpmyadmin

## Default Credentials

**Database:**
- Username: root
- Password: 12345

**Admin Account:**
- Email: admin@stitchyflow.com
- Password: admin123

## Technology Stack

- **Frontend:** React.js + Material-UI
- **Backend:** Node.js + Express.js
- **Database:** MySQL 8.0+
- **Authentication:** JWT

## Project Structure

```
StitchyFlow/
├── backend/          # Node.js/Express API
├── frontend/         # React customer-facing app
├── admin/            # React admin panel
Database/             # MySQL schema and setup
Docs/                 # Complete documentation
```

## Features

### Admin Panel
- Professional dashboard with 8 analytics widgets
- Collapsible sidebar navigation with blue active state
- Business module with 1 dashboard and 7 nested CRUD pages:
  - Tailer Verifications
  - Tailors Shops
  - Business Settings
  - Business Tailer Orders
  - Business Tailor Logs (auto activity tracking)
  - Business Tailors Status
  - Business Tailor Information/IP
- Complete user management with full CRUD operations:
  - Create new users with role assignment
  - View user details in modal
  - Edit user information
  - Delete users with confirmation
  - Search and filter users by role/status
  - Pagination support
- Order tracking and management
- Tailor management
- Measurement records
- Payment tracking
- Daily/Weekly/Monthly reports
- Clean white theme with blue accents
- Secure login with JWT authentication

### Customer Features
- User authentication (Admin, Business Owner, Tailor, Customer)
- Order management system
- Payment processing
- Reviews and ratings
- Real-time notifications
- Analytics dashboards

## Documentation

See the `Docs/` folder for complete documentation including:
- Business Requirements (BRD)
- Software Requirements (SRS)
- System Architecture (SAD)
- Database Design
- API Documentation
- And more...

---

© 2026 LogixInventor (PVT) Ltd. All rights reserved.
