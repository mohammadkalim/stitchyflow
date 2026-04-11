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

If your `stitchyflow` database already existed before **2026-04-11** and the admin Tailor Services screen reports unknown columns, apply the navigation columns migration (adds `link_path`, `accent_color`, and refreshes the public view):

```bash
mysql -u root -p12345 < Database/add_tailor_services_link_accent.sql
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
- **Tailor Services (Administration):** Full CRUD on `tailor_services` — add/edit/delete, upload service icons (stored via existing ad image upload API), set name, description, type (category), link path, accent color, enable/disable (active), and popular flag; light-blue themed UI at `/tailor-services`. The admin list prefers **`GET /api/v1/tailor-services/mgmt/list`** (authenticated); it falls back to other admin paths, then to the public catalog if the API process has not been restarted yet. Data is read live from MySQL and drives the main site header “Tailor Services” mega menu.
- **Privacy & Pages Editor:** Edit main website pages (About, Privacy, Terms, Sitemap) with rich text editor and image upload
  - Professional blue UI/UX design
  - Rich text formatting (Bold, Italic, Underline, Headings, Lists, Links)
  - Image upload with automatic optimization
  - SEO fields (meta title, meta description)
  - Active/Inactive toggle for each page
  - All data stored in MySQL database

### Customer Features
- **Entry splash:** On each browser load or refresh, a full-screen splash displays first (duration configurable via `REACT_APP_SPLASH_DURATION_MS` in `frontend/.env`, default 5 seconds), then the requested route; visiting `/` redirects to `/home` after the splash.
- User authentication (Admin, Business Owner, Tailor, Customer)
- Order management system
- Payment processing
- Reviews and ratings
- Real-time notifications
- Analytics dashboards
- **Header — Tailor Services menu:** Loads active services from `/api/v1/tailor-services` (name, description, optional icon image, link path, colors).
- **Tailor Shops page:** Public page at http://localhost:3000/tailor-shops (also linked in the main header).

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
