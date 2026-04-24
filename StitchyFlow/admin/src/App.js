import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ADMIN_PAGE_CHUNKS } from './adminPageChunks';
import RouteLoadLogger from './dev/RouteLoadLogger';

const Login = lazy(ADMIN_PAGE_CHUNKS['/login']);
const Dashboard = lazy(ADMIN_PAGE_CHUNKS['/dashboard']);
const Users = lazy(ADMIN_PAGE_CHUNKS['/users']);
const ActiveUsers = lazy(ADMIN_PAGE_CHUNKS['/active-users']);
const DeletedUsers = lazy(ADMIN_PAGE_CHUNKS['/deleted-users']);
const SuspendedUsers = lazy(ADMIN_PAGE_CHUNKS['/suspended-users']);
const UsersDetails = lazy(ADMIN_PAGE_CHUNKS['/users-details']);
const UserInformation = lazy(ADMIN_PAGE_CHUNKS['/user-information']);
const Orders = lazy(ADMIN_PAGE_CHUNKS['/orders']);
const Tailors = lazy(ADMIN_PAGE_CHUNKS['/tailors']);
const Measurements = lazy(ADMIN_PAGE_CHUNKS['/measurements']);
const AirDam = lazy(ADMIN_PAGE_CHUNKS['/air-dam']);
const AirCoats = lazy(ADMIN_PAGE_CHUNKS['/air-coats']);
const FlowerBand = lazy(ADMIN_PAGE_CHUNKS['/flower-band']);
const Payments = lazy(ADMIN_PAGE_CHUNKS['/payments']);
const Reports = lazy(ADMIN_PAGE_CHUNKS['/reports']);
const Settings = lazy(ADMIN_PAGE_CHUNKS['/settings']);
const ChatManagement = lazy(ADMIN_PAGE_CHUNKS['/chat']);
const SMTPSettings = lazy(ADMIN_PAGE_CHUNKS['/smtp-settings']);
const AdminSettings = lazy(ADMIN_PAGE_CHUNKS['/admin-settings']);
const SiteSettings = lazy(ADMIN_PAGE_CHUNKS['/site-settings']);
const SiteMaintenanceMode = lazy(ADMIN_PAGE_CHUNKS['/site-maintenance']);
const AddMoreSMTP = lazy(ADMIN_PAGE_CHUNKS['/add-more-smtp']);
const Business = lazy(ADMIN_PAGE_CHUNKS['/business']);
const TailerVerifications = lazy(ADMIN_PAGE_CHUNKS['/business/tailer-verifications']);
const TailorsShops = lazy(ADMIN_PAGE_CHUNKS['/business/tailors-shops']);
const BusinessShopMedia = lazy(ADMIN_PAGE_CHUNKS['/business/shop-media']);
const BusinessSettings = lazy(ADMIN_PAGE_CHUNKS['/business/settings']);
const BusinessTailerOrders = lazy(ADMIN_PAGE_CHUNKS['/business/tailer-orders']);
const BusinessTailorLogs = lazy(ADMIN_PAGE_CHUNKS['/business/tailor-logs']);
const BusinessTailorsStatus = lazy(ADMIN_PAGE_CHUNKS['/business/tailors-status']);
const BusinessTailorInformation = lazy(ADMIN_PAGE_CHUNKS['/business/tailor-information']);
const BusinessTypeManagement = lazy(ADMIN_PAGE_CHUNKS['/business/business-types']);
const SpecializationManagement = lazy(ADMIN_PAGE_CHUNKS['/business/specializations']);
const AIErrorHandling = lazy(ADMIN_PAGE_CHUNKS['/ai-error-handling']);
const GoogleAuthSettings = lazy(ADMIN_PAGE_CHUNKS['/google-auth']);
const Logs = lazy(ADMIN_PAGE_CHUNKS['/logs/system']);
const AuditLogs = lazy(ADMIN_PAGE_CHUNKS['/logs/audit']);
const SessionsManagement = lazy(ADMIN_PAGE_CHUNKS['/sessions']);
const ActiveSessions = lazy(ADMIN_PAGE_CHUNKS['/sessions/active']);
const InactiveSessions = lazy(ADMIN_PAGE_CHUNKS['/sessions/inactive']);
const SessionLogs = lazy(ADMIN_PAGE_CHUNKS['/sessions/logs']);
const DeletedSessions = lazy(ADMIN_PAGE_CHUNKS['/sessions/deleted']);
const PendingSessions = lazy(ADMIN_PAGE_CHUNKS['/sessions/pending']);
const CategoriesPage = lazy(ADMIN_PAGE_CHUNKS['/ca-sub/category']);
const SubcategoriesPage = lazy(ADMIN_PAGE_CHUNKS['/ca-sub/subcategory']);
const EmailTemplatesPage = lazy(ADMIN_PAGE_CHUNKS['/email-templates']);
const AdsManagement = lazy(ADMIN_PAGE_CHUNKS['/ads-management']);
const AdsAnalytics = lazy(ADMIN_PAGE_CHUNKS['/ads-analytics']);
const SliderMedia = lazy(ADMIN_PAGE_CHUNKS['/slider-media']);
const PrivacyEdit = lazy(ADMIN_PAGE_CHUNKS['/privacy-pages']);

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2196F3' },
    secondary: { main: '#1976d2' },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    }
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }
  },
  components: {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }
      }
    },
    MuiDialog: {
      defaultProps: { fullWidth: true },
      styleOverrides: {
        paper: {
          '@media (max-width:600px)': {
            margin: 8,
            width: 'calc(100% - 16px)',
            maxWidth: '100%',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' }
      }
    }
  }
});

function PageLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <CircularProgress size={40} />
    </Box>
  );
}

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RouteLoadLogger appId="admin" />
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/active-users" element={<PrivateRoute><ActiveUsers /></PrivateRoute>} />
            <Route path="/deleted-users" element={<PrivateRoute><DeletedUsers /></PrivateRoute>} />
            <Route path="/suspended-users" element={<PrivateRoute><SuspendedUsers /></PrivateRoute>} />
            <Route path="/users-details" element={<PrivateRoute><UsersDetails /></PrivateRoute>} />
            <Route path="/user-information" element={<PrivateRoute><UserInformation /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/tailors" element={<PrivateRoute><Tailors /></PrivateRoute>} />
            <Route path="/measurements" element={<PrivateRoute><Measurements /></PrivateRoute>} />
            <Route path="/air-dam" element={<PrivateRoute><AirDam /></PrivateRoute>} />
            <Route path="/air-coats" element={<PrivateRoute><AirCoats /></PrivateRoute>} />
            <Route path="/flower-band" element={<PrivateRoute><FlowerBand /></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/email-templates" element={<PrivateRoute><EmailTemplatesPage /></PrivateRoute>} />
            <Route path="/smtp-settings" element={<PrivateRoute><SMTPSettings /></PrivateRoute>} />
            <Route path="/admin-settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
            <Route path="/site-settings" element={<PrivateRoute><SiteSettings /></PrivateRoute>} />
            <Route path="/site-maintenance" element={<PrivateRoute><SiteMaintenanceMode /></PrivateRoute>} />
            <Route path="/add-more-smtp" element={<PrivateRoute><AddMoreSMTP /></PrivateRoute>} />
            <Route path="/ads-management" element={<PrivateRoute><AdsManagement /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><ChatManagement /></PrivateRoute>} />
            <Route path="/ads-analytics" element={<PrivateRoute><AdsAnalytics /></PrivateRoute>} />
            <Route path="/business" element={<PrivateRoute><Business /></PrivateRoute>} />
            <Route path="/business/tailer-verifications" element={<PrivateRoute><TailerVerifications /></PrivateRoute>} />
            <Route path="/business/tailors-shops" element={<PrivateRoute><TailorsShops /></PrivateRoute>} />
            <Route path="/business/shop-media" element={<PrivateRoute><BusinessShopMedia /></PrivateRoute>} />
            <Route path="/business/settings" element={<PrivateRoute><BusinessSettings /></PrivateRoute>} />
            <Route path="/business/tailer-orders" element={<PrivateRoute><BusinessTailerOrders /></PrivateRoute>} />
            <Route path="/business/tailor-logs" element={<PrivateRoute><BusinessTailorLogs /></PrivateRoute>} />
            <Route path="/business/tailors-status" element={<PrivateRoute><BusinessTailorsStatus /></PrivateRoute>} />
            <Route path="/business/tailor-information" element={<PrivateRoute><BusinessTailorInformation /></PrivateRoute>} />
            <Route path="/business/business-types" element={<PrivateRoute><BusinessTypeManagement /></PrivateRoute>} />
            <Route path="/business/specializations" element={<PrivateRoute><SpecializationManagement /></PrivateRoute>} />
            <Route path="/ai-error-handling" element={<PrivateRoute><AIErrorHandling /></PrivateRoute>} />
            <Route path="/google-auth" element={<PrivateRoute><GoogleAuthSettings /></PrivateRoute>} />
            <Route path="/logs/system" element={<PrivateRoute><Logs /></PrivateRoute>} />
            <Route path="/logs/audit"  element={<PrivateRoute><AuditLogs /></PrivateRoute>} />
            <Route path="/sessions"           element={<PrivateRoute><SessionsManagement /></PrivateRoute>} />
            <Route path="/sessions/active"    element={<PrivateRoute><ActiveSessions /></PrivateRoute>} />
            <Route path="/sessions/inactive"  element={<PrivateRoute><InactiveSessions /></PrivateRoute>} />
            <Route path="/sessions/logs"      element={<PrivateRoute><SessionLogs /></PrivateRoute>} />
            <Route path="/sessions/deleted"   element={<PrivateRoute><DeletedSessions /></PrivateRoute>} />
            <Route path="/sessions/pending"   element={<PrivateRoute><PendingSessions /></PrivateRoute>} />
            <Route path="/ca-sub/category"    element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
            <Route path="/ca-sub/subcategory" element={<PrivateRoute><SubcategoriesPage /></PrivateRoute>} />
            <Route path="/slider-media"       element={<PrivateRoute><SliderMedia /></PrivateRoute>} />
            <Route path="/privacy-pages"      element={<PrivateRoute><PrivacyEdit /></PrivateRoute>} />
            <Route path="/admin-refresh-tokens" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
