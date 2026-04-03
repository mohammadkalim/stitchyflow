import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, Avatar, Button,
  Chip, Divider, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Badge, AppBar, Toolbar, Drawer, useMediaQuery, useTheme,
  TextField, InputAdornment, Alert, Switch, FormControlLabel
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
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

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'customer') { navigate('/login'); return; }
    setUser(u);
    fetchStats(u);
  }, [navigate]);

  const fetchStats = async (u) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const userId = u.userId || u.user_id;

      // Fetch orders
      const res = await fetch(`http://localhost:5000/api/v1/orders?customerId=${userId}`, { headers });
      const data = await res.json();

      // Fetch total tailors count
      let totalTailors = 0;
      try {
        const tRes = await fetch('http://localhost:5000/api/v1/users?role=tailor', { headers });
        const tData = await tRes.json();
        if (tData.success && Array.isArray(tData.data)) totalTailors = tData.data.length;
        else if (tData.success && tData.data?.total) totalTailors = tData.data.total;
      } catch (_) {}

      if (data.success && Array.isArray(data.data)) {
        const orderList = data.data;
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

        // Build notifications from recent orders
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
      const res = await fetch('http://localhost:5000/api/v1/password/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          oldPassword: pwForm.current,
          newPassword: pwForm.newPw,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMsg({ type: 'success', text: 'Password changed successfully.' });
        setPwForm({ current: '', newPw: '', confirm: '' });
      } else {
        setPwMsg({ type: 'error', text: data.error?.message || 'Failed to change password.' });
      }
    } catch {
      setPwMsg({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
                    <Switch
                      checked={twoFA}
                      onChange={e => {
                        setTwoFA(e.target.checked);
                        setTwoFAMsg({
                          type: e.target.checked ? 'success' : 'info',
                          text: e.target.checked
                            ? '2FA enabled. Your account is now more secure.'
                            : '2FA disabled. We recommend keeping it enabled.',
                        });
                      }}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#16a34a' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#16a34a' },
                      }}
                    />
                  </Box>
                </Box>

                {twoFA && (
                  <Box sx={{ p: 2.5, borderRadius: '14px', bgcolor: '#eff6ff', border: '1px solid #bfdbfe', mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e40af', mb: 0.5 }}>
                      How 2FA works
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#3730a3', lineHeight: 1.6, display: 'block' }}>
                      When you log in, you'll be asked for a verification code in addition to your password.
                      This code is sent to your registered email address and expires in 10 minutes.
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
