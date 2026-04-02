import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, Avatar, Button,
  Chip, Divider, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Badge, AppBar, Toolbar, Drawer, useMediaQuery, useTheme
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
import Header from '../components/Header';
import Footer from '../components/Footer';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Overview',      icon: <DashboardOutlinedIcon fontSize="small" />,    key: 'overview' },
  { label: 'My Orders',     icon: <ShoppingBagOutlinedIcon fontSize="small" />,  key: 'orders' },
  { label: 'Profile',       icon: <PersonOutlineIcon fontSize="small" />,        key: 'profile' },
  { label: 'Invoices',      icon: <PaymentOutlinedIcon fontSize="small" />,      key: 'invoices' },
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
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>My Account</Typography>
        <Typography variant="caption" sx={{ color: '#9ca3af' }}>Manage your orders</Typography>
      </Box>

      {/* Nav */}
      <List sx={{ flex: 1, px: 1.5, py: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = activeKey === item.key;
          return (
            <ListItem key={item.key} disablePadding
              onClick={() => setActiveKey(item.key)}
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
      } else {
        setStats(prev => ({ ...prev, totalTailors }));
      }
    } catch (err) {
      // keep default zeros
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      {/* Hero Banner */}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) scale(1);   opacity: 0.7; }
          50%  { transform: translateY(-18px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0px) scale(1);   opacity: 0.7; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1);   opacity: 0.5; }
          50%       { transform: scale(1.3); opacity: 1;   }
        }
        @keyframes drift {
          0%   { transform: translateX(0) translateY(0); }
          33%  { transform: translateX(12px) translateY(-8px); }
          66%  { transform: translateX(-8px) translateY(6px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <Box sx={{
        mt: '64px',
        background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0f2a52 70%, #0d1f3c 100%)',
        py: { xs: 4, md: 5 }, px: 2, textAlign: 'center', position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated blobs */}
        <Box sx={{ position: 'absolute', top: -40, left: -40, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(37,99,235,0.25)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'drift 8s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', bottom: -30, right: -30, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(124,58,237,0.2)', filter: 'blur(35px)', pointerEvents: 'none', animation: 'drift 10s ease-in-out infinite reverse' }} />
        <Box sx={{ position: 'absolute', top: '30%', left: '20%', width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(245,158,11,0.12)', filter: 'blur(20px)', pointerEvents: 'none', animation: 'drift 12s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', top: '10%', right: '25%', width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(16,185,129,0.15)', filter: 'blur(18px)', pointerEvents: 'none', animation: 'drift 9s ease-in-out infinite reverse' }} />
        {/* Animated floating dots */}
        <Box sx={{ position: 'absolute', top: 24, left: '15%', width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.3)', animation: 'floatUp 3s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', top: 40, left: '35%', width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(245,158,11,0.7)', animation: 'floatUp 4s ease-in-out infinite 0.5s' }} />
        <Box sx={{ position: 'absolute', bottom: 20, left: '45%', width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', animation: 'floatUp 5s ease-in-out infinite 1s' }} />
        <Box sx={{ position: 'absolute', top: 16, right: '30%', width: 7, height: 7, borderRadius: '50%', bgcolor: 'rgba(124,58,237,0.7)', animation: 'pulse 3.5s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', bottom: 30, right: '18%', width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(37,99,235,0.6)', animation: 'floatUp 4.5s ease-in-out infinite 0.8s' }} />
        <Box sx={{ position: 'absolute', top: '50%', left: '8%', width: 5, height: 5, borderRadius: '50%', bgcolor: 'rgba(16,185,129,0.6)', animation: 'pulse 2.5s ease-in-out infinite 0.3s' }} />
        <Box sx={{ position: 'absolute', top: '20%', right: '10%', width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(245,158,11,0.5)', animation: 'floatUp 3.8s ease-in-out infinite 1.2s' }} />
        <Box sx={{ position: 'absolute', bottom: '15%', left: '25%', width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.25)', animation: 'pulse 4s ease-in-out infinite 0.6s' }} />
        {/* Top right actions */}
        <Box sx={{ position: 'absolute', top: 16, right: 20, display: 'flex', gap: 1 }}>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
            <Badge badgeContent={0} color="error"><NotificationsNoneIcon /></Badge>
          </IconButton>
          <Button startIcon={<LogoutIcon />} onClick={handleLogout} size="small" sx={{
            bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', textTransform: 'none',
            fontWeight: 600, borderRadius: '8px', px: 2,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
          }}>
            Logout
          </Button>
        </Box>

        <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1.5, fontSize: '1.8rem', fontWeight: 700, border: '3px solid rgba(255,255,255,0.4)' }}>
          {user.firstName?.[0]?.toUpperCase() || '?'}
        </Avatar>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
          {fullName || user?.firstName || 'User'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Welcome back! Here's your personal tailoring hub
        </Typography>

        {/* Hero stats */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1, md: 3 }, flexWrap: 'wrap' }}>
          {[
            { value: stats.totalTailors ?? 0,                  label: 'Total Tailors' },
            { value: stats.favorites,                         label: 'Favorites' },
            { value: stats.totalBookings,                     label: 'Total Services' },
          ].map((s) => (
            <Box key={s.label} sx={{
              bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '14px',
              px: { xs: 3, md: 5 }, py: 1.5, minWidth: 100,
            }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b' }}>{s.value}</Typography>
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
