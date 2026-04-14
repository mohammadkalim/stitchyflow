# Changelog

## 2026-04-11 20:45:00 PKT

- **Tailor Shops slider theme/colors:** Documented support for Tailor Shops hero/slider theming through the existing slider media flow, including page-specific fallback colors on the frontend and use of database-saved background/text colors via current admin/backend slider records.

## 2026-04-11 20:30:00 PKT

- **Admin tailor service images 404 / CORP:** Express now serves **`GET /images/...`** from `StitchyFlow/backend/public/images/`. Helmet uses **`crossOriginResourcePolicy: 'cross-origin'`** so images from the API (port 5000) load in the admin (4000) and main site (3000) without `ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`. Admin Tailor Services **Avatar** and header mega-menu images fall back on **`onError`** when a file is missing.

## 2026-04-11 19:45:00 PKT

- **Tailor Services admin 404 (stale Node process):** Added **`GET /api/v1/tailor-services/mgmt/list`** for the full table. Admin UI tries `mgmt/list`, then `admin/tailor-services`, then public **`GET /api/v1/tailor-services`** with an info toast (active rows only) when the API was not restarted. **`/tailor-services/admin/all`** now uses `authenticateToken` only.

## 2026-04-11 19:00:00 PKT

- **Fix admin Tailor Services 404:** Admin list moved to **`GET /api/v1/admin/tailor-services`** (registered in `admin.routes.js`). The admin UI now calls `api.get('/admin/tailor-services')` so the list resolves reliably (avoids 404 on `/tailor-services/admin/all` when the nested route was not matched or an older API process was running).

## 2026-04-11 19:15:00 PKT

- **Fix persistent 404 on `/api/v1/admin/tailor-services`:** The same handler is now registered **on `server.js`** with `app.get('/api/v1/admin/tailor-services', …)` **before** `app.use('/api/v1/admin', …)`, so the route always resolves regardless of nested-router ordering. Duplicate removed from `admin.routes.js` (comment left pointing to `server.js`).

## 2026-04-11 18:30:00 PKT

- **Admin Tailor Services (`/tailor-services`):** Rebuilt to use live MySQL data via `GET /api/v1/tailor-services/admin/all` with full CRUD (`POST`, `PUT /:id`, `DELETE /:id`, `PATCH …/toggle-active`, `PATCH …/toggle-popular`). Service icons use the existing admin image upload (`/admin/ads/upload-image`). UI uses a light-blue theme. Fixed admin API import to use the named `api` axios instance.
- **Backend `tailor_services.routes.js`:** Registered static routes before `/:id` (fixes `/meta/categories`). Added `link_path` and `accent_color` on create/update. Replaced invalid `JSON_ARRAY()` JavaScript usage with `[]` JSON for JSON columns. Added admin-only `GET /admin/all`.
- **Database:** `create_tailor_services_table.sql` includes `link_path` and `accent_color`. New migration `Database/add_tailor_services_link_accent.sql` for existing databases; updates `vw_tailor_services_list`.
- **Main site header:** Mega menu maps `service_name`, `service_description`, `link_path`, `accent_color`, and `image_url` from the public tailor-services API; shows uploaded images when present.
- **Customer site:** New page `TailorShops.js` and route `/tailor-shops`; header nav includes “Tailor Shops”.
- Developer: Muhammad Kalim, LogixInventor (PVT) Ltd.

## 2026-04-11 11:49:00 PKT

- Tailor Services: **implemented comprehensive service catalog with live database integration**
  - Created MySQL table `tailor_services` with 25 sample services including pricing, categories, duration, difficulty levels, tags, materials, and size options
  - Updated backend API routes (`tailor_services.routes.js`) with full CRUD operations:
    - GET /api/v1/tailor-services (all active services)
    - GET /api/v1/tailor-services/:id (single service)
    - GET /api/v1/tailor-services/category/:category (filter by category)
    - GET /api/v1/tailor-services/meta/categories (all categories)
    - POST /api/v1/tailor-services (create new service - admin only)
    - PUT /api/v1/tailor-services/:id (update service - admin only)
    - DELETE /api/v1/tailor-services/:id (delete service - admin only)
    - PATCH /api/v1/tailor-services/:id/toggle-popular (toggle popular status)
    - PATCH /api/v1/tailor-services/:id/toggle-active (toggle active status)
  - Created frontend component `TailorServices.js` with modern UI/UX:
    - Real-time data fetching from database
    - Category filtering with dynamic buttons
    - Popular services highlighting section
    - Service cards with images, pricing, duration, difficulty level, tags
    - Statistics dashboard (total services, popular services, categories)
    - Loading and error states
    - Responsive grid layout
  - Added route `/marketplace/tailor-services` to App.js
  - Database populated with 25 diverse services across categories: Men's Wear, Women's Wear, Bottom Wear, Alterations, Embroidery, Home Decor, Uniforms, Kids Wear
  - All data displayed live from MySQL database
  - Developer: Muhammad Kalim, LogixInventor (PVT) Ltd.

## 2026-04-10 21:54:00 PKT

- Dynamic Frontend Pages: **implemented live database-driven pages for About, Privacy Policy, Terms & Conditions, and Sitemap**
  - Created new frontend components: `PrivacyPolicy.js`, `TermsConditions.js`, `Sitemap.js` in `frontend/src/pages/legal/`
  - Updated `About.js` to fetch content dynamically from database instead of static content
  - All pages fetch data from `/api/v1/privacy-pages/:key` endpoint and display live from database
  - Added routes in `App.js`: `/privacy`, `/terms`, `/sitemap` for the new pages
  - Updated `Footer.js` links to navigate to `/privacy`, `/terms`, `/sitemap` pages
  - All pages are fully mobile responsive using Material-UI responsive sx props (xs, md breakpoints)
  - Pages display rich HTML content with proper styling for headings, paragraphs, lists, links, and images
  - Loading states with circular progress indicators for better UX
  - Error handling with alert messages for failed API calls
  - Images in content are responsive with max-width 100% and proper styling
  - Backend server.js updated to create `uploads/privacy` directory for image storage
  - Admin panel PrivacyEdit.js updated to use dynamic API base URL instead of hardcoded localhost:5000
  - Database table `privacy_pages` populated with default content for all four pages
  - All changes made in Admin Panel reflect immediately on main website (live database updates)
  - Developer: Muhammad Kalim, LogixInventor (PVT) Ltd.

## 2026-04-10 20:16:00 PKT

- Privacy Edit feature: **verified and confirmed fully functional**
  - Database table `privacy_pages` created and populated with default data (About, Privacy, Terms, Sitemap)
  - Backend API endpoints tested and working: GET /api/v1/privacy-pages, PUT /api/v1/privacy-pages/:key, POST /api/v1/privacy-pages/upload-image
  - Admin panel page accessible at http://localhost:4000/privacy-pages and via Settings → Privacy & Pages tab
  - Image upload functionality tested with automatic optimization (Sharp library)
  - Professional blue UI/UX design confirmed with Material-UI components
  - Rich text editor with formatting tools (Bold, Italic, Underline, Headings, Lists, Links, Images)
  - SEO fields (meta title, meta description) and Active/Inactive toggle working
  - All data stored in MySQL database and displayed live from DB
  - Developer: Muhammad Kalim, LogixInventor (PVT) Ltd.

## 2026-04-10 18:38:00 PKT

- Privacy Edit feature: added **image upload functionality** to rich text editor
  - Added backend route `POST /api/v1/privacy-pages/upload-image` with authentication
  - Implemented automatic image optimization (JPEG/PNG resized to 1920x1080, 85% quality)
  - Added image upload button (🖼️) to toolbar with upload progress indicator (⏳)
  - Supported formats: JPG, PNG, WEBP, GIF, SVG (max 5MB)
  - Images stored in `/uploads/privacy/` directory with optimized versions
  - Updated PrivacyEdit.js component with image upload handler
  - Created comprehensive documentation in `Docs/Privacy_Edit_Feature.md`

## 2026-04-02 16:00:00 PKT

- Splash screen: documented animation list in file header; added **eight floating sparkle dots** with drift / opacity motion.

## 2026-04-02 14:00:00 PKT

- Splash screen: added slow **full-screen gradient drift** on the background and a gentle **vertical float** on the tagline (after intro animation).

## 2026-04-02 12:00:00 PKT

- Splash screen: added **rotating conic gold ring** behind the glass logo (14s loop) while the “S” stays still; **StitchyFlow** title uses a gentle breathing letter-spacing / glow loop.

## 2026-04-01 23:45:00 PKT

- Splash screen: added full-screen light sheen sweep, loading label pulse, and three staggered bouncing dots next to the countdown.

## 2026-04-01 23:30:00 PKT

- Customer splash screen: added motion design — logo entrance (scale/fade), gentle float/sway on the gold frame, letter “S” glow pulse, staggered fade-up for title/tagline/loading/footer, ambient background pulse, and shimmer sweep on the progress bar.

## 2026-04-01 23:10:00 PKT

- Customer frontend splash default duration set to **5 seconds** (`REACT_APP_SPLASH_DURATION_MS` default 5000 ms; still override via `frontend/.env`).

## 2026-04-01 22:55:00 PKT

- Customer frontend: full-screen corporate splash on every full page load and refresh (`SplashGate` wrapping all routes).
- Splash uses brand gradient `#2596be` / `rgb(37, 150, 190)` with dark depth, gold-bordered rounded square, glass-style “S”, titles “StitchyFlow” and “Just Click to Tailoring Services”, determinate loading bar over configurable duration (`REACT_APP_SPLASH_DURATION_MS`, default 5000 ms), and footer “Powered by LogixInventor (PVT) Ltd.”
- After splash on `/`, app navigates to `/home` with replace.

## 2026-03-31 17:45:01 PKT

- Added new backend module `business.routes.js` with authenticated CRUD APIs for:
  - Tailer Verifications
  - Tailors Shops
  - Business Settings
  - Business Tailer Orders
  - Business Tailor Logs
  - Business Tailors Status
  - Business Tailor Information/IP
- Added automatic database table initialization (`CREATE TABLE IF NOT EXISTS`) for all 7 business entities and logs table.
- Added automatic activity logging so create/update/delete actions from business pages are stored in `business_tailor_logs` with user role, user ID, IP, and user agent.
- Wired backend route into `server.js` under `/api/v1/business`.
- Added admin API utility (`admin/src/utils/api.js`) to centralize API base URL via `.env` (`REACT_APP_API_URL`) and bearer headers.
- Added one main Business page and 7 nested admin pages with working CRUD UI.
- Added business navigation entry in admin sidebar.
- Updated login API call to use centralized API URL and improved error for backend offline state (`ERR_CONNECTION_REFUSED` scenario).
- Updated `README.md` with the new business module details.