import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyCode from './pages/VerifyCode';
import ForgotPassword from './pages/ForgotPassword';
import SplashGate from './components/SplashGate';
import CustomerDashboard from './pages/CustomerDashboard';
import TailorDashboard from './pages/TailorDashboard';
// Marketplace
import CustomDresses from './pages/marketplace/CustomDresses';
import SuitsBlazer from './pages/marketplace/SuitsBlazer';
import BridalWear from './pages/marketplace/BridalWear';
import TraditionalWear from './pages/marketplace/TraditionalWear';
import Alterations from './pages/marketplace/Alterations';
import FabricSelection from './pages/marketplace/FabricSelection';
// Company
import About from './pages/company/About';
import HowItWorks from './pages/company/HowItWorks';
import Careers from './pages/company/Careers';
import PressMedia from './pages/company/PressMedia';
import Blog from './pages/company/Blog';
import Promotions from './pages/Promotions';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';

const theme = createTheme({
  palette: {
    primary: { main: '#29B6F6' },
    secondary: { main: '#4FC3F7' }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<SplashGate />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/marketplace/custom-dresses" element={<CustomDresses />} />
            <Route path="/marketplace/suits-blazers" element={<SuitsBlazer />} />
            <Route path="/marketplace/bridal-wear" element={<BridalWear />} />
            <Route path="/marketplace/traditional-wear" element={<TraditionalWear />} />
            <Route path="/marketplace/alterations" element={<Alterations />} />
            <Route path="/marketplace/fabric-selection" element={<FabricSelection />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press-media" element={<PressMedia />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/tailor-dashboard" element={<TailorDashboard />} />
            <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
