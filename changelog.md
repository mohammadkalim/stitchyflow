# Changelog

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
