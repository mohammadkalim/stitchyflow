# Changelog

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
