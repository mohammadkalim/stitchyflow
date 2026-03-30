import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import ActiveUsers from './pages/ActiveUsers';
import DeletedUsers from './pages/DeletedUsers';
import SuspendedUsers from './pages/SuspendedUsers';
import UsersDetails from './pages/UsersDetails';
import UserInformation from './pages/UserInformation';
import Orders from './pages/Orders';
import Tailors from './pages/Tailors';
import Measurements from './pages/Measurements';
import AirDam from './pages/AirDam';
import AirCoats from './pages/AirCoats';
import FlowerBand from './pages/FlowerBand';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SMTPSettings from './pages/SMTPSettings';
import AdminSettings from './pages/AdminSettings';
import SiteSettings from './pages/SiteSettings';
import SiteMaintenanceMode from './pages/SiteMaintenanceMode';
import AddMoreSMTP from './pages/AddMoreSMTP';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2196F3' },
    secondary: { main: '#1976d2' },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    }
  }
});

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
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
          <Route path="/smtp-settings" element={<PrivateRoute><SMTPSettings /></PrivateRoute>} />
          <Route path="/admin-settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
          <Route path="/site-settings" element={<PrivateRoute><SiteSettings /></PrivateRoute>} />
          <Route path="/site-maintenance" element={<PrivateRoute><SiteMaintenanceMode /></PrivateRoute>} />
          <Route path="/add-more-smtp" element={<PrivateRoute><AddMoreSMTP /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
