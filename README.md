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
- **Promotions & pricing:** http://localhost:3000/promotions — hero slider uses admin **`/promotions`** slides when configured; otherwise static assets **`/promotions/promotions-1.png`** and **`/promotions/promotions-2.png`**. Tailors with businesses see tier hints (Standard up to 4 services per shop, Pro above) and checkout opens the public shop page.

## Tailor service images (`/images/services/...`)

The database may reference paths such as `/images/services/mens-shirt.jpg`. The API serves these from **`StitchyFlow/backend/public/images/`** (URL prefix `/images/...`). Add JPG/PNG files there to match the DB paths, or upload icons via the admin Tailor Services flow (stored under `/uploads/ads/`). Restart the backend after adding files.

## Tailor “My Businesses” limits

Per tailor account, the API caps how many shops they can create (default **1**). Configure in **`StitchyFlow/backend/.env`** (see **`StitchyFlow/backend/.env.example`**):

- `TAILOR_MAX_BUSINESSES` — global default (optional).
- `TAILOR_MAX_BUSINESSES_OVERRIDES` — per-email max, e.g. `markhubstore98@gmail.com:2` (comma-separated list) or JSON `{"markhubstore98@gmail.com":2}`.

Restart the backend after changing these values.

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

## Auth session (access + refresh)

The API issues a short-lived **access** JWT (`JWT_EXPIRE`, often `24h`) and a longer **refresh** JWT (`JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRE`). The customer **frontend** stores both and uses **`POST /api/v1/auth/refresh`** (via `apiFetch`) when the access token is rejected, so tailor/customer dashboards keep loading data after idle periods without a manual logout/login. Set **`JWT_REFRESH_SECRET`** (and optionally **`JWT_REFRESH_EXPIRE`**, e.g. `7d`) in **`StitchyFlow/backend/.env`**.

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
- **Slider Media management:** Existing slider media admin/backend flow stores page slider records in MySQL, including background and text color values used by supported pages such as Tailor Shops.

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
- **Tailor Shops slider theming:** The Tailor Shops hero/slider supports page-specific fallback theme colors and can use database-saved slider background/text colors managed through the existing slider media admin/API flow.

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