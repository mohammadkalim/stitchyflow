import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, Avatar, Button,
  Chip, Divider, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Badge, AppBar, Toolbar, Drawer, useMediaQuery, useTheme,
  TextField, InputAdornment, Alert, Switch, FormControlLabel, CircularProgress,
  Dialog, DialogContent
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import StarIcon from '@mui/icons-material/Star';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityIcon from '@mui/icons-material/Security';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Overview',      icon: <DashboardOutlinedIcon fontSize="small" />,    key: 'overview' },
  { label: 'My Orders',     icon: <ShoppingBagOutlinedIcon fontSize="small" />,  key: 'orders' },
  { label: 'Profile',       icon: <PersonOutlineIcon fontSize="small" />,        key: 'profile' },
  { label: 'Invoices',      icon: <PaymentOutlinedIcon fontSize="small" />,      key: 'invoices' },
  { label: 'Security',      icon: <SecurityIcon fontSize="small" />,             key: 'security' },
  { label: 'Support Desk',  icon: <SupportAgentOutlinedIcon fontSize="small" />, key: 'support' },
];

const BOOKING_STATS = [
  { label: 'Total Bookings',    value: '0',    icon: <ShoppingBagOutlinedIcon />, bg: '#eff6ff', color: '#2563eb' },
  { label: 'Total Spent',       value: 'Rs 0', icon: <PaymentOutlinedIcon />,     bg: '#f0fdf4', color: '#16a34a' },
  { label: 'Avg Booking Value', value: 'Rs 0', icon: <StarIcon />,                bg: '#fff7ed', color: '#ea580c' },
  { label: 'Favorites',         value: '0',    icon: <FavoriteBorderIcon />,      bg: '#fdf4ff', color: '#9333ea' },
];

const BOOKING_STATUS = [
  { label: 'Pending',   value: 0, icon: <HourglassEmptyIcon />,      bg: '#fff7ed', color: '#ea580c' },
  { label: 'Confirmed', value: 0, icon: <CheckCircleOutlineIcon />,   bg: '#f0fdf4', color: '#16a34a' },
  { label: 'Completed', value: 0, icon: <BookmarkBorderIcon />,       bg: '#eff6ff', color: '#2563eb' },
  { label: 'Cancelled', value: 0, icon: <CancelOutlinedIcon />,       bg: '#fef2f2', color: '#dc2626' },
];

const QUICK_ACTIONS = [
  { label: 'Find Tailors',     sub: 'Explore tailors',   icon: <SearchOutlinedIcon />,     bg: '#eff6ff', color: '#2563eb' },
  { label: 'Browse Services',  sub: 'Find what you need', icon: <StorefrontOutlinedIcon />, bg: '#f0fdf4', color: '#16a34a' },
  { label: 'View Vendors',     sub: 'Connect with pros',  icon: <PeopleOutlineIcon />,      bg: '#f5f3ff', color: '#7c3aed' },
  { label: 'Edit Profile',     sub: 'Update your info',   icon: <EditOutlinedIcon />,       bg: '#fff7ed', color: '#ea580c' },
];

const RECENT_ACTIVITY = [];

function SidebarContent({ user, activeKey, setActiveKey, onLogout }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fff' }}>
      {/* User card */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: '#2563eb', mx: 'auto', mb: 1.5, fontSize: '1.4rem', fontWeight: 700 }}>
          {user?.firstName?.[0]?.toUpperCase() || '?'}
        </Avatar>
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>{user?.firstName} {user?.lastName}</Typography>
      </Box>

      {/* Nav */}
      <List sx={{ flex: 1, px: 1.5, py: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = activeKey === item.key;
          return (
            <ListItem key={item.key} disablePadding
              onClick={() => { setActiveKey(item.key); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              sx={{
                borderRadius: '10px', mb: 0.5, cursor: 'pointer',
                bgcolor: active ? '#2563eb' : 'transparent',
                color: active ? '#fff' : '#374151',
                '&:hover': { bgcolor: active ? '#2563eb' : '#f3f4f6' },
                px: 1.5, py: 1,
              }}>
              <ListItemIcon sx={{ color: active ? '#fff' : '#6b7280', minWidth: 34 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 500 }} />
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid #f3f4f6' }}>
        <Button fullWidth startIcon={<LogoutIcon />} onClick={onLogout} sx={{
          color: '#6b7280', textTransform: 'none', fontWeight: 600, justifyContent: 'flex-start',
          borderRadius: '10px', px: 1.5,
          '&:hover': { bgcolor: '#fef2f2', color: '#dc2626' },
        }}>
          Logout
        </Button>
      </Box>
    </Box>
  );
}

function CustomerDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState(null);
  const [activeKey, setActiveKey] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwShow, setPwShow] = useState({ current: false, newPw: false, confirm: false });
  const [pwMsg, setPwMsg] = useState(null);
  const [twoFA, setTwoFA] = useState(false);
  const [twoFAMsg, setTwoFAMsg] = useState(null);
  const [totpSetup, setTotpSetup] = useState(null);      // { qrCode, secret, otpauthUrl }
  const [totpCode, setTotpCode] = useState('');
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpVerified, setTotpVerified] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [stats, setStats] = useState({
    totalTailors: 0,
    favorites: 0,
    totalSpent: 0,
    totalBookings: 0,
    avgBookingValue: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  const fetchTotpStatus = async () => {
    try {
      const data = await apiFetch('/totp/status');
      const enabled = data.data?.totpEnabled === true || data.data?.totpEnabled == 1;
      setTwoFA(enabled);
      setTotpVerified(enabled);
    } catch (e) {
      console.error('TOTP status fetch failed:', e);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'customer') { navigate('/login'); return; }
    setUser(u);
    fetchStats(u);
    fetchTotpStatus();
  }, [navigate]);

  // Separate effect: re-fetch TOTP status whenever Security tab is opened
  useEffect(() => {
    if (activeKey === 'security') {
      fetchTotpStatus();
    }
  }, [activeKey]);

  const fetchStats = async (u) => {
    try {
      const userId = u.userId || u.user_id;
      let totalTailors = 0;
      let orderList = [];

      const [ordersResult, tailorsResult] = await Promise.allSettled([
        apiFetch(`/orders?customerId=${encodeURIComponent(userId)}`),
        apiFetch('/users?role=tailor'),
      ]);

      if (ordersResult.status === 'fulfilled' && ordersResult.value.success) {
        orderList = Array.isArray(ordersResult.value.data) ? ordersResult.value.data : [];
      }

      if (tailorsResult.status === 'fulfilled' && tailorsResult.value.success) {
        if (Array.isArray(tailorsResult.value.data)) {
          totalTailors = tailorsResult.value.data.length;
        } else if (tailorsResult.value.data?.total) {
          totalTailors = tailorsResult.value.data.total;
        }
      }

      if (orderList.length > 0) {
        setOrders(orderList);
        const completed = orderList.filter(o => o.status === 'completed').length;
        const pending   = orderList.filter(o => o.status === 'pending').length;
        const confirmed = orderList.filter(o => o.status === 'accepted').length;
        const cancelled = orderList.filter(o => o.status === 'cancelled').length;
        const spent     = orderList.filter(o => o.payment_status === 'completed').reduce((sum, o) => sum + (parseFloat(o.payment_amount) || 0), 0);
        const avg       = orderList.length > 0 ? spent / orderList.length : 0;

        setStats({
          totalTailors,
          favorites: 0,
          totalSpent: spent,
          totalBookings: orderList.length,
          avgBookingValue: avg,
          pending,
          confirmed,
          completed,
          cancelled,
        });

        const notifs = orderList.slice(0, 5).map(o => ({
          id: o.order_id,
          title: `Order #${o.order_number}`,
          sub: `${o.garment_type || 'Item'} — ${o.status?.charAt(0).toUpperCase() + o.status?.slice(1)}`,
          time: o.created_at ? new Date(o.created_at).toLocaleDateString('en-PK') : '',
          read: false,
        }));
        setNotifications(notifs);
      } else {
        setStats(prev => ({ ...prev, totalTailors }));
      }
    } catch (err) {
      // keep default zeros
    }
  };

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      return setPwMsg({ type: 'error', text: 'Please fill in all fields.' });
    }
    if (pwForm.newPw !== pwForm.confirm) {
      return setPwMsg({ type: 'error', text: 'New passwords do not match.' });
    }
    if (pwForm.newPw.length < 6) {
      return setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
    }
    try {
      await apiFetch('/password/update', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          oldPassword: pwForm.current,
          newPassword: pwForm.newPw,
        }),
      });
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (error) {
      setPwMsg({ type: 'error', text: error.message || 'Failed to change password.' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleTwoFAToggle = async (checked) => {
    const token = localStorage.getItem('token');
    if (checked) {
      // Start TOTP setup — fetch QR code
      setTotpLoading(true);
      setTwoFAMsg(null);
      try {
        const data = await apiFetch('/totp/setup');
        setTotpSetup(data.data);
        setTwoFA(true);
        setTotpVerified(false);
        setTotpCode('');
      } catch (error) {
        setTwoFAMsg({ type: 'error', text: error.message || 'Failed to setup 2FA.' });
      } finally {
        setTotpLoading(false);
      }
    } else {
      // Disable TOTP
      try {
        await apiFetch('/totp/disable', { method: 'POST' });
      } catch (_) {}
      setTwoFA(false);
      setTotpSetup(null);
      setTotpVerified(false);
      setTotpCode('');
      setTwoFAMsg({ type: 'info', text: '2FA disabled. We recommend keeping it enabled.' });
    }
  };

  const handleTotpVerify = async () => {
    if (!totpCode || totpCode.length !== 6) {
      return setTwoFAMsg({ type: 'error', text: 'Please enter the 6-digit code from your authenticator app.' });
    }
    setTotpLoading(true);
    setTwoFAMsg(null);
    try {
      const data = await apiFetch('/totp/verify', {
        method: 'POST',
        body: JSON.stringify({ token: totpCode }),
      });
      setTotpVerified(true);
      setTotpSetup(null);
      setTotpCode('');
      setTwoFAMsg({ type: 'success', text: '2FA enabled. Your account is now more secure.' });
      if (data.data?.backupCodes) {
        setBackupCodes(data.data.backupCodes);
        setShowBackupCodes(true);
      }
    } catch (error) {
      setTwoFAMsg({ type: 'error', text: error.message || 'Invalid code.' });
    } finally {
      setTotpLoading(false);
    }
  };

  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  // Hero config per active tab
  const heroConfig = {
    overview: {
      bg: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0f2a52 70%, #0d1f3c 100%)',
      blob1: 'rgba(37,99,235,0.25)', blob2: 'rgba(124,58,237,0.2)',
      title: 'Dashboard Overview',
      subtitle: "Welcome back! Here's your personal tailoring hub",
      accentColor: '#f59e0b',
      icon: <DashboardOutlinedIcon sx={{ fontSize: 32 }} />,
      stats: [
        { value: stats.totalTailors ?? 0, label: 'Total Tailors' },
        { value: stats.favorites,         label: 'Favorites' },
        { value: stats.totalBookings,     label: 'Total Services' },
      ],
    },
    orders: {
      bg: 'linear-gradient(135deg, #431407 0%, #7c2d12 40%, #9a3412 70%, #7c2d12 100%)',
      blob1: 'rgba(234,88,12,0.35)', blob2: 'rgba(251,146,60,0.25)',
      title: 'My Orders',
      subtitle: 'Track and manage all your tailoring orders',
      accentColor: '#fb923c',
      icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 32 }} />,
      stats: [
        { value: stats.totalBookings, label: 'My Orders' },
        { value: stats.completed,     label: 'Total Orders' },
        { value: orders.filter(o => o.payment_status === 'completed').length, label: 'Invoices' },
      ],
    },
    profile: {
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1e40af 70%, #1e3a5f 100%)',
      blob1: 'rgba(37,99,235,0.3)', blob2: 'rgba(99,102,241,0.25)',
      title: 'My Profile',
      subtitle: 'Manage your personal information',
      accentColor: '#60a5fa',
      icon: <PersonOutlineIcon sx={{ fontSize: 32 }} />,
      stats: [
        { value: stats.totalBookings, label: 'Total Orders' },
        { value: stats.completed,     label: 'Completed' },
        { value: stats.totalTailors,  label: 'Tailors' },
      ],
    },
    invoices: {
      bg: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 70%, #14532d 100%)',
      blob1: 'rgba(22,163,74,0.3)', blob2: 'rgba(16,185,129,0.2)',
      title: 'Invoices',
      subtitle: 'View and download your payment invoices',
      accentColor: '#4ade80',
      icon: <PaymentOutlinedIcon sx={{ fontSize: 32 }} />,
      stats: [
        { value: orders.filter(o => o.payment_status === 'completed').length, label: 'Paid Invoices' },
        { value: `Rs ${stats.totalSpent.toLocaleString()}`, label: 'Total Spent' },
        { value: stats.totalBookings, label: 'Total Orders' },
      ],
    },
    security: {
      bg: 'linear-gradient(135deg, #0c1a0c 0%, #14401a 40%, #166534 70%, #14401a 100%)',
      blob1: 'rgba(22,163,74,0.2)', blob2: 'rgba(15,118,110,0.2)',
      title: 'Security',
      subtitle: 'Manage your account security and password',
      accentColor: '#34d399',
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      stats: [
        { value: 'Active',                        label: 'Account Status' },
        { value: twoFA ? '2FA On' : '2FA Off',    label: 'Two-Factor Auth' },
        { value: 'Secure',                        label: 'Password' },
      ],
    },
    support: {
      bg: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 40%, #5b21b6 70%, #4c1d95 100%)',
      blob1: 'rgba(124,58,237,0.35)', blob2: 'rgba(167,139,250,0.2)',
      title: 'Support Desk',
      subtitle: 'Get help from our support team',
      accentColor: '#c4b5fd',
      icon: <SupportAgentOutlinedIcon sx={{ fontSize: 32 }} />,
      stats: [
        { value: '24/7',  label: 'Support' },
        { value: '< 1hr', label: 'Response Time' },
        { value: '100%',  label: 'Satisfaction' },
      ],
    },
  };

  const hero = heroConfig[activeKey] || heroConfig.overview;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      {/* Hero Banner */}
      <Box sx={{
        mt: '64px',
        background: hero.bg,
        py: { xs: 4, md: 5 }, px: 2, textAlign: 'center', position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top right actions */}
        <Box sx={{ position: 'absolute', top: 16, right: 20, display: 'flex', gap: 1 }}>
          <IconButton
            onClick={e => setNotifAnchor(e.currentTarget)}
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
          >
            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          {/* Notification Popover */}
          {Boolean(notifAnchor) && (
            <Box
              onClick={() => setNotifAnchor(null)}
              sx={{ position: 'fixed', inset: 0, zIndex: 1200 }}
            />
          )}
          {Boolean(notifAnchor) && (
            <Box sx={{
              position: 'absolute', top: 48, right: 0, zIndex: 1300,
              width: 320, bgcolor: '#fff', borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              border: '1px solid #e5e7eb', overflow: 'hidden',
            }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Notifications</Typography>
                {notifications.length > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => setNotifications(n => n.map(x => ({ ...x, read: true })))}
                  >
                    Mark all read
                  </Typography>
                )}
              </Box>
              {notifications.length === 0 ? (
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <NotificationsNoneIcon sx={{ fontSize: 36, color: '#d1d5db', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>No notifications</Typography>
                </Box>
              ) : (
                notifications.map((n, i) => (
                  <Box
                    key={n.id}
                    onClick={() => {
                      setNotifications(prev => prev.map((x, idx) => idx === i ? { ...x, read: true } : x));
                      setNotifAnchor(null);
                      setActiveKey('orders');
                    }}
                    sx={{
                      px: 2.5, py: 1.5, cursor: 'pointer',
                      bgcolor: n.read ? '#fff' : '#eff6ff',
                      borderBottom: '1px solid #f9fafb',
                      display: 'flex', alignItems: 'flex-start', gap: 1.5,
                      '&:hover': { bgcolor: '#f3f4f6' },
                    }}
                  >
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: n.read ? 'transparent' : '#2563eb', mt: 0.8, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.82rem' }}>{n.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>{n.sub}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#9ca3af', flexShrink: 0, fontSize: '0.7rem' }}>{n.time}</Typography>
                  </Box>
                ))
              )}
            </Box>
          )}

          <Button startIcon={<LogoutIcon />} onClick={handleLogout} size="small" sx={{
            bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', textTransform: 'none',
            fontWeight: 600, borderRadius: '8px', px: 2,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
          }}>
            Logout
          </Button>
        </Box>

        <Box sx={{
          width: 64, height: 64, borderRadius: '50%',
          bgcolor: '#fff', color: hero.accentColor,
          mx: 'auto', mb: 1.5,
          border: `3px solid ${hero.accentColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {hero.icon}
        </Box>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
          {hero.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          {hero.subtitle}
        </Typography>

        {/* Hero stats */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1, md: 3 }, flexWrap: 'wrap' }}>
          {hero.stats.map((s) => (
            <Box key={s.label} sx={{
              bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '14px',
              px: { xs: 3, md: 5 }, py: 1.5, minWidth: 100,
              transition: 'all 0.3s',
            }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: hero.accentColor }}>{s.value}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Body */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>

          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', minHeight: 400 }}>
              <SidebarContent user={user} activeKey={activeKey} setActiveKey={setActiveKey} onLogout={handleLogout} />
            </Paper>
          </Grid>

          {/* Main */}
          <Grid item xs={12} md={9}>

            {/* My Orders Tab */}
            {activeKey === 'orders' && (
              <Paper elevation={0} sx={{ borderRadius: '16px', p: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <ShoppingBagOutlinedIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>My Orders</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 2 }}>
                  All your booking history
                </Typography>

                {orders.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 1 }} />
                    <Typography variant="body1" sx={{ color: '#9ca3af', fontWeight: 500 }}>No bookings yet</Typography>
                    <Typography variant="caption" sx={{ color: '#d1d5db' }}>Your orders will appear here</Typography>
                  </Box>
                ) : (
                  orders.map((order) => {
                    const statusColors = {
                      pending:   { bg: '#fff7ed', color: '#ea580c' },
                      accepted:  { bg: '#f0fdf4', color: '#16a34a' },
                      completed: { bg: '#eff6ff', color: '#2563eb' },
                      cancelled: { bg: '#fef2f2', color: '#dc2626' },
                    };
                    const sc = statusColors[order.status] || { bg: '#f3f4f6', color: '#6b7280' };
                    return (
                      <Box key={order.order_id} sx={{
                        display: 'flex', alignItems: 'center', gap: 2,
                        p: 2, borderRadius: '12px', border: '1px solid #f3f4f6',
                        mb: 1.5, bgcolor: '#fafafa',
                        transition: 'all 0.2s',
                        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.06)', bgcolor: '#fff' },
                      }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}>
                          <ShoppingBagOutlinedIcon />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                              {order.garment_type || 'N/A'}
                            </Typography>
                            <Chip
                              label={order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                              size="small"
                              sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600, fontSize: '0.7rem', height: 20 }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                            Order #{order.order_number} &nbsp;·&nbsp; {order.tailor_name || 'Tailor'}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                            Rs {parseFloat(order.final_price || order.estimated_price || 0).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('en-PK') : ''}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Paper>
            )}

            {/* Profile Tab */}
            {activeKey === 'profile' && (
              <Paper elevation={0} sx={{ borderRadius: '16px', p: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <PersonOutlineIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>My Profile</Typography>
                </Box>
                <Grid container spacing={2}>
                  {[
                    { label: 'First Name',  value: user?.firstName || '—' },
                    { label: 'Last Name',   value: user?.lastName  || '—' },
                    { label: 'Email',       value: user?.email     || '—' },
                    { label: 'Phone',       value: user?.phone     || '—' },
                    { label: 'Role',        value: user?.role      || '—' },
                  ].map((f) => (
                    <Grid item xs={12} sm={6} key={f.label}>
                      <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>{f.label}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e', mt: 0.3 }}>{f.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {/* Invoices Tab */}
            {activeKey === 'invoices' && (
              <Paper elevation={0} sx={{ borderRadius: '16px', p: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                    <PaymentOutlinedIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Invoices</Typography>
                </Box>
                {orders.filter(o => o.payment_status === 'completed').length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <PaymentOutlinedIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 1 }} />
                    <Typography variant="body1" sx={{ color: '#9ca3af', fontWeight: 500 }}>No invoices yet</Typography>
                    <Typography variant="caption" sx={{ color: '#d1d5db' }}>Completed payments will appear here</Typography>
                  </Box>
                ) : (
                  orders.filter(o => o.payment_status === 'completed').map((order) => (
                    <Box key={order.order_id} sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      p: 2, borderRadius: '12px', border: '1px solid #f3f4f6', mb: 1.5, bgcolor: '#fafafa',
                    }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                        <PaymentOutlinedIcon />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                          {order.garment_type || 'Order'} — #{order.order_number}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('en-PK') : ''}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#16a34a' }}>
                        Rs {parseFloat(order.payment_amount || order.final_price || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  ))
                )}
              </Paper>
            )}

            {/* Security Tab */}
            {activeKey === 'security' && (
              <Paper elevation={0} sx={{ borderRadius: '16px', p: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                    <SecurityIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Security</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 3 }}>
                  Manage your password and account security
                </Typography>

                {/* Account Status Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {[
                    { label: 'Account Status', value: 'Active',   color: '#16a34a', bg: '#f0fdf4' },
                    { label: 'Email Verified', value: 'Verified', color: '#2563eb', bg: '#eff6ff' },
                    { label: 'Login Method',   value: 'Password', color: '#7c3aed', bg: '#f5f3ff' },
                  ].map(c => (
                    <Grid item xs={12} sm={4} key={c.label}>
                      <Box sx={{ p: 2, borderRadius: '12px', bgcolor: c.bg, border: `1px solid ${c.color}20`, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.68rem' }}>{c.label}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: c.color, mt: 0.3 }}>{c.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* Change Password */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                    <LockOutlinedIcon sx={{ fontSize: 16 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Change Password</Typography>
                </Box>

                {pwMsg && (
                  <Alert severity={pwMsg.type} sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setPwMsg(null)}>
                    {pwMsg.text}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  {[
                    { label: 'Current Password', key: 'current' },
                    { label: 'New Password',      key: 'newPw'   },
                    { label: 'Confirm Password',  key: 'confirm' },
                  ].map(f => (
                    <Grid item xs={12} sm={6} key={f.key}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.5, display: 'block' }}>{f.label}</Typography>
                      <TextField
                        fullWidth size="small"
                        type={pwShow[f.key] ? 'text' : 'password'}
                        placeholder={f.label}
                        value={pwForm[f.key]}
                        onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={() => setPwShow(p => ({ ...p, [f.key]: !p[f.key] }))}>
                                {pwShow[f.key]
                                  ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                                  : <VisibilityOutlinedIcon   sx={{ fontSize: 18, color: '#9ca3af' }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleChangePassword}
                    startIcon={<LockOutlinedIcon />}
                    sx={{
                      bgcolor: '#16a34a', color: '#fff', textTransform: 'none',
                      fontWeight: 700, borderRadius: '10px', px: 3, py: 1.2,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#15803d', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' },
                    }}
                  >
                    Update Password
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Two-Factor Authentication */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <SecurityIcon sx={{ fontSize: 16 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Two-Factor Authentication (2FA)</Typography>
                </Box>

                {twoFAMsg && (
                  <Alert severity={twoFAMsg.type} sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setTwoFAMsg(null)}>
                    {twoFAMsg.text}
                  </Alert>
                )}

                <Box sx={{
                  p: 2.5, borderRadius: '14px',
                  bgcolor: twoFA ? '#f0fdf4' : '#f9fafb',
                  border: `1px solid ${twoFA ? '#bbf7d0' : '#e5e7eb'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 2, mb: 2,
                }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                      {twoFA ? '2FA is Enabled' : '2FA is Disabled'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      {twoFA
                        ? 'Your account is protected with two-factor authentication.'
                        : 'Enable 2FA to add an extra layer of security to your account.'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip
                      label={twoFA ? 'ON' : 'OFF'}
                      size="small"
                      sx={{
                        fontWeight: 700, fontSize: '0.72rem',
                        bgcolor: twoFA ? '#f0fdf4' : '#fef2f2',
                        color: twoFA ? '#16a34a' : '#dc2626',
                      }}
                    />
                    {totpLoading ? (
                      <CircularProgress size={24} sx={{ color: '#16a34a' }} />
                    ) : (
                      <Switch
                        checked={twoFA}
                        onChange={e => handleTwoFAToggle(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#16a34a' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#16a34a' },
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* QR Code Setup — Professional Modal */}
                <Dialog
                  open={!!(twoFA && totpSetup && !totpVerified)}
                  onClose={() => { setTwoFA(false); setTotpSetup(null); setTotpCode(''); setTwoFAMsg(null); }}
                  maxWidth="sm"
                  fullWidth
                  PaperProps={{
                    sx: {
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
                      background: '#fff',
                    }
                  }}
                >
                  {/* Header Banner */}
                  <Box sx={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0e7490 100%)',
                    px: 4, pt: 4, pb: 3, position: 'relative',
                  }}>
                    <IconButton
                      onClick={() => { setTwoFA(false); setTotpSetup(null); setTotpCode(''); setTwoFAMsg(null); }}
                      sx={{ position: 'absolute', top: 14, right: 14, color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: '14px',
                        background: 'rgba(255,255,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}>
                        <ShieldOutlinedIcon sx={{ color: '#38bdf8', fontSize: 26 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.2 }}>
                          Two-Factor Authentication
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', mt: 0.3 }}>
                          Secure your account with an authenticator app
                        </Typography>
                      </Box>
                    </Box>

                    {/* Steps indicator */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      {['Scan QR', 'Enter Code', 'Done'].map((step, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Box sx={{
                            width: 22, height: 22, borderRadius: '50%',
                            bgcolor: i === 0 ? '#38bdf8' : i === 1 && totpCode.length > 0 ? '#38bdf8' : 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 700,
                            color: i <= 1 ? '#0f172a' : 'rgba(255,255,255,0.4)',
                            transition: 'all 0.3s',
                          }}>
                            {i + 1}
                          </Box>
                          <Typography sx={{ color: i === 0 ? '#e0f2fe' : 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: i === 0 ? 600 : 400 }}>
                            {step}
                          </Typography>
                          {i < 2 && <Box sx={{ width: 20, height: 1, bgcolor: 'rgba(255,255,255,0.15)', mx: 0.3 }} />}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <DialogContent sx={{ px: 4, py: 3 }}>

                    {/* App suggestions */}
                    <Box sx={{
                      display: 'flex', gap: 1, mb: 3, p: 2,
                      borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0',
                      alignItems: 'center',
                    }}>
                      <SmartphoneIcon sx={{ color: '#64748b', fontSize: 18, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>
                        Download <strong>Google Authenticator</strong>, <strong>Authy</strong>, or <strong>Microsoft Authenticator</strong> on your phone, then scan the QR code below.
                      </Typography>
                    </Box>

                    {/* QR Code */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <Box sx={{
                        position: 'relative',
                        p: '3px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7, #0369a1)',
                        boxShadow: '0 8px 32px rgba(14,165,233,0.25)',
                      }}>
                        <Box sx={{
                          bgcolor: '#fff', borderRadius: '18px', p: 2.5,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <QRCodeSVG
                            value={totpSetup?.otpauthUrl || ''}
                            size={190}
                            bgColor="#ffffff"
                            fgColor="#0f172a"
                            level="M"
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Manual key */}
                    <Box sx={{
                      borderRadius: '14px', overflow: 'hidden',
                      border: '1px solid #e2e8f0', mb: 3,
                    }}>
                      <Box sx={{ px: 2.5, py: 1.2, bgcolor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Manual Entry Key
                        </Typography>
                      </Box>
                      <Box sx={{ px: 2.5, py: 1.8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                        <Typography sx={{
                          fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem',
                          color: '#0f172a', letterSpacing: '0.12em', wordBreak: 'break-all',
                        }}>
                          {totpSetup?.secret}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => navigator.clipboard.writeText(totpSetup?.secret || '')}
                          sx={{
                            flexShrink: 0, color: '#64748b', bgcolor: '#f1f5f9',
                            borderRadius: '8px', p: 0.8,
                            '&:hover': { bgcolor: '#e2e8f0', color: '#0f172a' },
                          }}
                        >
                          <ContentCopyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Divider with label */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ flex: 1, height: '1px', bgcolor: '#e2e8f0' }} />
                      <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Step 2 — Verify
                      </Typography>
                      <Box sx={{ flex: 1, height: '1px', bgcolor: '#e2e8f0' }} />
                    </Box>

                    {/* Code input */}
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', mb: 1.5 }}>
                      Enter the 6-digit code from your authenticator app
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'stretch' }}>
                      <TextField
                        fullWidth
                        placeholder="• • • • • •"
                        value={totpCode}
                        onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputProps={{
                          maxLength: 6,
                          style: { textAlign: 'center', letterSpacing: '0.5em', fontWeight: 800, fontSize: '1.3rem', fontFamily: 'monospace', padding: '14px 0' }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: '#f8fafc',
                            '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
                            '&:hover fieldset': { borderColor: '#94a3b8' },
                            '&.Mui-focused fieldset': { borderColor: '#0ea5e9', borderWidth: '2px' },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleTotpVerify}
                        disabled={totpLoading || totpCode.length !== 6}
                        sx={{
                          minWidth: 140, borderRadius: '12px', textTransform: 'none',
                          fontWeight: 700, fontSize: '0.88rem', px: 3,
                          background: totpCode.length === 6
                            ? 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                            : undefined,
                          boxShadow: totpCode.length === 6 ? '0 4px 16px rgba(14,165,233,0.35)' : 'none',
                          '&:hover': { background: 'linear-gradient(135deg, #0284c7, #0369a1)', boxShadow: '0 6px 20px rgba(14,165,233,0.4)' },
                          '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
                          transition: 'all 0.2s',
                        }}
                      >
                        {totpLoading
                          ? <CircularProgress size={20} sx={{ color: '#fff' }} />
                          : <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <CheckCircleIcon sx={{ fontSize: 18 }} /> Verify
                            </Box>
                        }
                      </Button>
                    </Box>

                    {twoFAMsg && (
                      <Alert
                        severity={twoFAMsg.type}
                        sx={{ mt: 2, borderRadius: '12px', fontSize: '0.82rem', border: '1px solid', borderColor: twoFAMsg.type === 'error' ? '#fecaca' : '#bbf7d0' }}
                      >
                        {twoFAMsg.text}
                      </Alert>
                    )}
                  </DialogContent>

                  {/* Footer */}
                  <Box sx={{ px: 4, pb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <LockOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                      <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        Secured with end-to-end encryption
                      </Typography>
                    </Box>
                    <Button
                      onClick={() => { setTwoFA(false); setTotpSetup(null); setTotpCode(''); setTwoFAMsg(null); }}
                      sx={{
                        color: '#64748b', textTransform: 'none', fontWeight: 600,
                        fontSize: '0.82rem', borderRadius: '10px', px: 2,
                        '&:hover': { bgcolor: '#f1f5f9', color: '#334155' },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Dialog>

                {/* Backup Codes Modal */}
                <Dialog
                  open={showBackupCodes}
                  onClose={() => setShowBackupCodes(false)}
                  maxWidth="sm"
                  fullWidth
                  PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.18)' } }}
                >
                  {/* Header */}
                  <Box sx={{
                    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
                    px: 4, pt: 4, pb: 3, position: 'relative',
                  }}>
                    <IconButton
                      onClick={() => setShowBackupCodes(false)}
                      size="small"
                      sx={{ position: 'absolute', top: 14, right: 14, color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: '14px',
                        background: 'rgba(255,255,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}>
                        <CheckCircleIcon sx={{ color: '#6ee7b7', fontSize: 26 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.2 }}>
                          2FA Enabled Successfully
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', mt: 0.3 }}>
                          Save your backup codes in a safe place
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <DialogContent sx={{ px: 4, py: 3 }}>
                    {/* Warning */}
                    <Box sx={{
                      display: 'flex', gap: 1.5, p: 2, mb: 3,
                      borderRadius: '12px', bgcolor: '#fffbeb', border: '1px solid #fde68a',
                    }}>
                      <Typography sx={{ fontSize: '1.1rem' }}>⚠️</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.6 }}>
                        These backup codes can be used to access your account if you lose your authenticator device.
                        <strong> Each code can only be used once.</strong> Store them securely.
                      </Typography>
                    </Box>

                    {/* Codes Grid */}
                    <Box sx={{
                      borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', mb: 3,
                    }}>
                      <Box sx={{ px: 2.5, py: 1.2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Backup Codes (8 codes)
                        </Typography>
                        <Chip label="One-time use" size="small" sx={{ fontSize: '0.65rem', bgcolor: '#fef3c7', color: '#92400e', fontWeight: 600, height: 20 }} />
                      </Box>
                      <Box sx={{ p: 2.5 }}>
                        <Grid container spacing={1.5}>
                          {backupCodes.map((code, i) => (
                            <Grid item xs={6} sm={3} key={i}>
                              <Box sx={{
                                p: 1.5, borderRadius: '10px',
                                bgcolor: '#f8fafc', border: '1px solid #e2e8f0',
                                textAlign: 'center',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
                              }}>
                                <Typography sx={{
                                  fontFamily: 'monospace', fontWeight: 700,
                                  fontSize: '1rem', color: '#0f172a', letterSpacing: '0.15em',
                                }}>
                                  {code}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => {
                          navigator.clipboard.writeText(backupCodes.join('\n'));
                        }}
                        sx={{
                          borderRadius: '12px', textTransform: 'none', fontWeight: 600,
                          fontSize: '0.85rem', py: 1.3,
                          borderColor: '#e2e8f0', color: '#334155',
                          '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
                        }}
                      >
                        Copy All Codes
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<span style={{ fontSize: '1rem' }}>⬇</span>}
                        onClick={() => {
                          const content = [
                            'StitchyFlow - 2FA Backup Codes',
                            '================================',
                            `Generated: ${new Date().toLocaleString()}`,
                            '',
                            'Keep these codes safe. Each code can only be used once.',
                            '',
                            ...backupCodes.map((c, i) => `${i + 1}. ${c}`),
                            '',
                            'www.stitchyflow.com',
                          ].join('\n');
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'stitchyflow-backup-codes.txt';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        sx={{
                          borderRadius: '12px', textTransform: 'none', fontWeight: 700,
                          fontSize: '0.85rem', py: 1.3,
                          background: 'linear-gradient(135deg, #059669, #047857)',
                          boxShadow: '0 4px 14px rgba(5,150,105,0.35)',
                          '&:hover': { background: 'linear-gradient(135deg, #047857, #065f46)' },
                        }}
                      >
                        Download Codes
                      </Button>
                    </Box>
                  </DialogContent>

                  <Box sx={{ px: 4, pb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      onClick={() => setShowBackupCodes(false)}
                      sx={{
                        borderRadius: '12px', textTransform: 'none', fontWeight: 700,
                        fontSize: '0.88rem', px: 4, py: 1.2,
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                        color: '#fff',
                        boxShadow: '0 4px 14px rgba(14,165,233,0.3)',
                        '&:hover': { background: 'linear-gradient(135deg, #0284c7, #0369a1)' },
                      }}
                    >
                      I've Saved My Codes
                    </Button>
                  </Box>
                </Dialog>
                {twoFA && totpVerified && (
                  <Box sx={{ p: 2.5, borderRadius: '14px', bgcolor: '#eff6ff', border: '1px solid #bfdbfe', mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e40af', mb: 0.5 }}>
                      How 2FA works
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#3730a3', lineHeight: 1.6, display: 'block' }}>
                      When you log in, you'll be asked for a 6-digit code from your authenticator app.
                      This code changes every 30 seconds and keeps your account secure.
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Security Tips */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1.5 }}>Security Tips</Typography>
                <Grid container spacing={1.5}>
                  {[
                    { tip: 'Use a strong password with letters, numbers and symbols', ok: true },
                    { tip: 'Never share your password with anyone',                   ok: true },
                    { tip: 'Log out from shared or public devices',                   ok: true },
                    { tip: 'Update your password regularly every 3 months',           ok: false },
                  ].map((t, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1.5, borderRadius: '10px', bgcolor: t.ok ? '#f0fdf4' : '#fff7ed', border: `1px solid ${t.ok ? '#bbf7d0' : '#fed7aa'}` }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 16, color: t.ok ? '#16a34a' : '#ea580c', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="caption" sx={{ color: '#374151', lineHeight: 1.5 }}>{t.tip}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {/* Support Desk Tab */}
            {activeKey === 'support' && (
              <Paper elevation={0} sx={{ borderRadius: '16px', p: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333ea' }}>
                    <SupportAgentOutlinedIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Support Desk</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 3 }}>
                  Need help? Contact our support team
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'WhatsApp',  value: '+92 333 3836851',        color: '#16a34a', bg: '#f0fdf4' },
                    { label: 'Email',     value: 'info@logixinventor.com', color: '#2563eb', bg: '#eff6ff' },
                    { label: 'Website',   value: 'www.logixinventor.com',  color: '#7c3aed', bg: '#f5f3ff' },
                  ].map((c) => (
                    <Grid item xs={12} sm={4} key={c.label}>
                      <Box sx={{ p: 2.5, borderRadius: '14px', bgcolor: c.bg, border: `1px solid ${c.color}20`, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>{c.label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: c.color, mt: 0.5, wordBreak: 'break-all' }}>{c.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 3, p: 2.5, borderRadius: '14px', bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>LogixInventor (PVT) Ltd.</Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Our support team is available to assist you with any issues related to your orders, payments, or account.
                  </Typography>
                </Box>
              </Paper>
            )}

            {/* Overview content */}
            {activeKey === 'overview' && <>



            {/* Quick Stats Widgets */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: 'Favorite Tailors', value: stats.favorites,    icon: <FavoriteBorderIcon />, bg: '#fef2f2', color: '#dc2626' },
                { label: 'Saved Tailors',    value: stats.favorites,    icon: <BookmarkBorderIcon />, bg: '#eff6ff', color: '#2563eb' },
                { label: 'Total Orders',     value: stats.totalBookings, icon: <ShoppingBagOutlinedIcon />, bg: '#f0fdf4', color: '#16a34a' },
              ].map((w) => (
                <Grid item xs={12} sm={4} key={w.label}>
                  <Paper elevation={0} sx={{
                    borderRadius: '14px', p: 3, border: '1px solid #e5e7eb', bgcolor: '#fff',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' },
                  }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, color: w.color }}>
                      {w.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>{w.value}</Typography>
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.78rem' }}>{w.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Booking Status */}
            <Paper elevation={0} sx={{ borderRadius: '16px', p: 3, mb: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 2 }}></Typography>
              <Grid container spacing={2}>
                {[
                { label: 'Pending',   value: stats.pending,   icon: <HourglassEmptyIcon />,    bg: '#fff7ed', color: '#ea580c' },
                { label: 'Confirmed', value: stats.confirmed, icon: <CheckCircleOutlineIcon />, bg: '#f0fdf4', color: '#16a34a' },
                { label: 'Completed', value: stats.completed, icon: <BookmarkBorderIcon />,     bg: '#eff6ff', color: '#2563eb' },
                { label: 'Cancelled', value: stats.cancelled, icon: <CancelOutlinedIcon />,     bg: '#fef2f2', color: '#dc2626' },
              ].map((s) => (
                  <Grid item xs={6} sm={3} key={s.label}>
                    <Box sx={{
                      borderRadius: '12px', p: 2, bgcolor: s.bg, textAlign: 'center',
                      border: `1px solid ${s.color}20`,
                    }}>
                      <Box sx={{ color: s.color, mb: 0.5 }}>{s.icon}</Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                      <Typography variant="caption" sx={{ color: s.color, fontWeight: 600, fontSize: '0.75rem' }}>{s.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Recent Activity */}
            <Paper elevation={0} sx={{ borderRadius: '16px', p: 3, mb: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                  <NotificationsNoneIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Recent Activity</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 2 }}>Your latest actions and updates</Typography>
              {RECENT_ACTIVITY.map((item, i) => (
                <Box key={i} sx={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  p: 1.5, borderRadius: '10px', bgcolor: '#f9fafb', mb: 1.5,
                  border: '1px solid #f3f4f6',
                }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                    {item.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>{item.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>{item.sub}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#9ca3af', flexShrink: 0 }}>{item.time}</Typography>
                </Box>
              ))}
            </Paper>

            {/* Quick Actions */}
            <Paper elevation={0} sx={{ borderRadius: '16px', p: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333ea' }}>
                  <StorefrontOutlinedIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Quick Actions</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 2 }}>Jump to common tasks</Typography>
              <Grid container spacing={2}>
                {QUICK_ACTIONS.map((a) => (
                  <Grid item xs={6} sm={3} key={a.label}>
                    <Box onClick={() => navigate('/home')} sx={{
                      borderRadius: '14px', p: 2, bgcolor: a.bg, textAlign: 'center', cursor: 'pointer',
                      border: `1px solid ${a.color}20`,
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 6px 20px ${a.color}25` },
                    }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, color: a.color, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        {a.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.82rem' }}>{a.label}</Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.72rem' }}>{a.sub}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            </> /* end overview */}

          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}

export default CustomerDashboard;
