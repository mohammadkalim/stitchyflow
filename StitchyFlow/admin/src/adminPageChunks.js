/**
 * Single source of truth for admin route code-splitting.
 * Used by App (React.lazy) and for hover/idle prefetch so navigation feels instant.
 */
export const ADMIN_PAGE_CHUNKS = {
  '/login': () => import('./pages/Login'),
  '/dashboard': () => import('./pages/Dashboard'),
  '/users': () => import('./pages/Users'),
  '/active-users': () => import('./pages/ActiveUsers'),
  '/deleted-users': () => import('./pages/DeletedUsers'),
  '/suspended-users': () => import('./pages/SuspendedUsers'),
  '/users-details': () => import('./pages/UsersDetails'),
  '/user-information': () => import('./pages/UserInformation'),
  '/orders': () => import('./pages/Orders'),
  '/tailors': () => import('./pages/Tailors'),
  '/measurements': () => import('./pages/Measurements'),
  '/air-dam': () => import('./pages/AirDam'),
  '/air-coats': () => import('./pages/AirCoats'),
  '/flower-band': () => import('./pages/FlowerBand'),
  '/payments': () => import('./pages/Payments'),
  '/reports': () => import('./pages/Reports'),
  '/settings': () => import('./pages/Settings'),
  '/chat': () => import('./pages/ChatManagement'),
  '/smtp-settings': () => import('./pages/SMTPSettings'),
  '/admin-settings': () => import('./pages/AdminSettings'),
  '/site-settings': () => import('./pages/SiteSettings'),
  '/site-maintenance': () => import('./pages/SiteMaintenanceMode'),
  '/add-more-smtp': () => import('./pages/AddMoreSMTP'),
  '/business': () => import('./pages/Business'),
  '/business/tailer-verifications': () => import('./pages/business/TailerVerifications'),
  '/business/tailors-shops': () => import('./pages/business/TailorsShops'),
  '/business/settings': () => import('./pages/BusinessSettings'),
  '/business/tailer-orders': () => import('./pages/BusinessTailerOrders'),
  '/business/tailor-logs': () => import('./pages/BusinessTailorLogs'),
  '/business/tailors-status': () => import('./pages/BusinessTailorsStatus'),
  '/business/tailor-information': () => import('./pages/BusinessTailorInformation'),
  '/business/business-types': () => import('./pages/business/BusinessTypeManagement'),
  '/business/specializations': () => import('./pages/business/SpecializationManagement'),
  '/ai-error-handling': () => import('./pages/AIErrorHandling'),
  '/google-auth': () => import('./pages/GoogleAuthSettings'),
  '/logs/system': () => import('./pages/logs/Logs'),
  '/logs/audit': () => import('./pages/logs/AuditLogs'),
  '/sessions': () => import('./pages/sessions/SessionsManagement'),
  '/sessions/active': () => import('./pages/sessions/ActiveSessions'),
  '/sessions/inactive': () => import('./pages/sessions/InactiveSessions'),
  '/sessions/logs': () => import('./pages/sessions/SessionLogs'),
  '/sessions/deleted': () => import('./pages/sessions/DeletedSessions'),
  '/sessions/pending': () => import('./pages/sessions/PendingSessions'),
  '/ca-sub/category': () => import('./pages/CategoriesPage'),
  '/ca-sub/subcategory': () => import('./pages/SubcategoriesPage'),
  '/email-templates': () => import('./pages/EmailTemplatesPage'),
  '/ads-management': () => import('./pages/AdsManagement'),
  '/ads-analytics': () => import('./pages/AdsAnalytics'),
  '/slider-media': () => import('./pages/SliderMedia'),
  '/privacy-pages': () => import('./pages/PrivacyEdit'),
  '/tailor-services': () => import('./pages/TailorServices'),
};

/** Start loading a route chunk early (hover, idle). Safe to call repeatedly. */
export function prefetchAdminPage(path) {
  const load = ADMIN_PAGE_CHUNKS[path];
  if (load) void load();
}
