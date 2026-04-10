# Changelog

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
