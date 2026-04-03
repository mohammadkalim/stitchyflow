/**
 * TailorDashboard — Full Professional Dashboard
 * Developer: Muhammad Kalim | LogixInventor (PVT) Ltd.
 * Phone/WhatsApp: +92 333 3836851
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, Paper, Avatar, Button, Chip, Divider,
  List, ListItem, ListItemText, ListItemAvatar, LinearProgress,
  Drawer, IconButton, useMediaQuery, useTheme, Dialog, DialogContent,
  Tooltip, CircularProgress, Badge, Menu, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import DashboardOutlinedIcon    from '@mui/icons-material/DashboardOutlined';
import ShoppingBagOutlinedIcon  from '@mui/icons-material/ShoppingBagOutlined';
import ContentCutIcon           from '@mui/icons-material/ContentCut';
import PeopleOutlineIcon        from '@mui/icons-material/PeopleOutline';
import TrendingUpIcon           from '@mui/icons-material/TrendingUp';
import PaymentOutlinedIcon      from '@mui/icons-material/PaymentOutlined';
import PersonOutlineIcon        from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon     from '@mui/icons-material/SettingsOutlined';
import StorefrontOutlinedIcon   from '@mui/icons-material/StorefrontOutlined';
import LogoutIcon               from '@mui/icons-material/Logout';
import MenuIcon                 from '@mui/icons-material/Menu';
import LockOutlinedIcon         from '@mui/icons-material/LockOutlined';
import HourglassEmptyIcon       from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon       from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon   from '@mui/icons-material/CheckCircleOutline';
import NotificationsNoneIcon    from '@mui/icons-material/NotificationsNone';
import StarIcon                 from '@mui/icons-material/Star';
import AccessTimeIcon           from '@mui/icons-material/AccessTime';
import ArrowForwardIcon         from '@mui/icons-material/ArrowForward';
import TrendingDownIcon         from '@mui/icons-material/TrendingDown';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MessageOutlinedIcon      from '@mui/icons-material/MessageOutlined';
import ReviewsOutlinedIcon      from '@mui/icons-material/ReviewsOutlined';
import AnalyticsOutlinedIcon    from '@mui/icons-material/AnalyticsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import InfoOutlinedIcon         from '@mui/icons-material/InfoOutlined';
import AddCircleOutlineIcon     from '@mui/icons-material/AddCircleOutline';
import UpgradeIcon              from '@mui/icons-material/Upgrade';

const SIDEBAR_W = 240;

const NAV = [
  { key: 'overview',   label: 'Overview',        icon: <DashboardOutlinedIcon sx={{ fontSize: 19 }} /> },
  { key: 'orders',     label: 'My Orders',        icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 19 }} /> },
  { key: 'services',   label: 'Services',         icon: <ContentCutIcon sx={{ fontSize: 19 }} /> },
  { key: 'customers',  label: 'Customers',        icon: <PeopleOutlineIcon sx={{ fontSize: 19 }} /> },
  { key: 'bookings',   label: 'Bookings',         icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 19 }} /> },
  { key: 'reviews',    label: 'Reviews',          icon: <ReviewsOutlinedIcon sx={{ fontSize: 19 }} /> },
  { key: 'messages',   label: 'Messages',         icon: <MessageOutlinedIcon sx={{ fontSize: 19 }} /> },
  { key: 'analytics',  label: 'Analytics',        icon: <AnalyticsOutlinedIcon sx={{ fontSize: 19 }} /> },
  { key: 'earnings',   label: 'Earnings',         icon: <TrendingUpIcon sx={{ fontSize: 19 }} /> },
  { key: 'payments',   label: 'Payments',         icon: <PaymentOutlinedIcon sx={{ fontSize: 19 }} /> },
  { key: 'profile',    label: 'Profile',          icon: <PersonOutlineIcon sx={{ fontSize: 19 }} /> },
  { key: 'support',    label: 'Support Tickets',  icon: <SupportAgentOutlinedIcon sx={{ fontSize: 19 }} /> },
  { key: 'settings',   label: 'Settings',         icon: <SettingsOutlinedIcon sx={{ fontSize: 19 }} /> },
];

// ── Mini SVG Line Chart ──────────────────────────────────────────────────────
function LineChart({ data, color = '#22c55e', height = 80 }) {
  const max = Math.max(...data, 1);
  const w = 280, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(' ');
  const area = `0,${h} ` + pts + ` ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`lg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#lg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Mini SVG Bar Chart ───────────────────────────────────────────────────────
function BarChart({ data, color = '#3b82f6', height = 80, labels }) {
  const max = Math.max(...data, 1);
  const w = 280, h = height, gap = 6;
  const bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 18}`} style={{ width: '100%', height: height + 18 }}>
      {data.map((v, i) => {
        const bh = Math.max((v / max) * h, 4);
        const x = i * (bw + gap);
        const y = h - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx="3" fill={color} opacity="0.85" />
            {labels && (
              <text x={x + bw / 2} y={h + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">{labels[i]}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, trend, trendUp, locked }) {
  return (
    <Paper elevation={0} sx={{
      borderRadius: '14px', p: 2.5, border: '1px solid #e2e8f0', bgcolor: '#fff',
      opacity: locked ? 0.55 : 1, position: 'relative', overflow: 'hidden',
    }}>
      {locked && (
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
          <LockOutlinedIcon sx={{ fontSize: 14, color: '#cbd5e1' }} />
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
        {trend !== undefined && (
          <Chip
            size="small"
            icon={trendUp ? <TrendingUpIcon sx={{ fontSize: 12 }} /> : <TrendingDownIcon sx={{ fontSize: 12 }} />}
            label={trend}
            sx={{
              height: 22, fontSize: '0.68rem', fontWeight: 700,
              bgcolor: trendUp ? '#f0fdf4' : '#fef2f2',
              color: trendUp ? '#16a34a' : '#dc2626',
              '& .MuiChip-icon': { color: trendUp ? '#16a34a' : '#dc2626' },
            }}
          />
        )}
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: '#0f172a', lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 500, mt: 0.4 }}>{label}</Typography>
      {sub && <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', mt: 0.3 }}>{sub}</Typography>}
    </Paper>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
function TailorDashboard() {
  const navigate   = useNavigate();
  const theme      = useTheme();
  const isMobile   = useMediaQuery(theme.breakpoints.down('md'));

  const [user,           setUser]           = useState(null);
  const [activeKey,      setActiveKey]      = useState('overview');
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [showRejected,   setShowRejected]   = useState(false);
  const [anchorEl,       setAnchorEl]       = useState(null);

  const revenueData  = [0, 0, 0, 0, 0, 0];
  const bookingData  = [0, 0, 0, 0, 0, 0];
  const months       = ['Jul','Aug','Sep','Oct','Nov','Dec'];

  const fetchApprovalStatus = useCallback(async (token) => {
    try {
      const res  = await fetch('http://localhost:5000/api/v1/tailor-approval/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const s = data.data.approval_status;
        setApprovalStatus(s);
        if (s === 'rejected') setShowRejected(true);
      }
    } catch (_) {}
    finally { setCheckingStatus(false); }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'tailor') { navigate('/login'); return; }
    setUser(u);
    const token = localStorage.getItem('token');
    fetchApprovalStatus(token);
    const iv = setInterval(() => fetchApprovalStatus(token), 15000);
    return () => clearInterval(iv);
  }, [navigate, fetchApprovalStatus]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isApproved = approvalStatus === 'approved';

  const navTo = (key) => {
    if (!isApproved && key !== 'overview') return;
    setActiveKey(key);
    if (isMobile) setMobileOpen(false);
  };

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <Box sx={{ width: SIDEBAR_W, height: '100%', bgcolor: '#0d1b2a', display: 'flex', flexDirection: 'column' }}>
      {/* Brand */}
      <Box sx={{ px: 3, py: 3, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: '10px',
            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <StorefrontOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.1 }}>Business Hub</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>Manage your empire</Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, py: 1.5, overflowY: 'auto', '&::-webkit-scrollbar': { width: 0 } }}>
        {NAV.map((item) => {
          const locked  = !isApproved && item.key !== 'overview';
          const active  = activeKey === item.key;
          return (
            <Tooltip key={item.key} title={locked ? 'Unlocked after admin approval' : ''} placement="right" arrow>
              <Box onClick={() => navTo(item.key)} sx={{
                mx: 1.5, mb: 0.3, px: 2, py: 1,
                borderRadius: '9px',
                display: 'flex', alignItems: 'center', gap: 1.5,
                cursor: locked ? 'not-allowed' : 'pointer',
                bgcolor: active ? 'rgba(34,197,94,0.15)' : 'transparent',
                borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
                opacity: locked ? 0.38 : 1,
                transition: 'all 0.15s',
                '&:hover': { bgcolor: locked ? 'transparent' : active ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.05)' },
              }}>
                <Box sx={{ color: active ? '#22c55e' : 'rgba(255,255,255,0.45)', display: 'flex' }}>
                  {locked ? <LockOutlinedIcon sx={{ fontSize: 16 }} /> : item.icon}
                </Box>
                <Typography sx={{ color: active ? '#fff' : 'rgba(255,255,255,0.55)', fontWeight: active ? 700 : 400, fontSize: '0.85rem', flex: 1 }}>
                  {item.label}
                </Typography>
                {active && <ArrowForwardIcon sx={{ fontSize: 13, color: '#22c55e' }} />}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* User + Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#22c55e', fontSize: '0.85rem', fontWeight: 700 }}>
            {user?.firstName?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>Tailor Shop</Typography>
          </Box>
        </Box>
        <Box onClick={handleLogout} sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1,
          borderRadius: '8px', cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
        }}>
          <LogoutIcon sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 17 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>Logout</Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.65rem', textAlign: 'center', mt: 1.5 }}>
          © 2026 StitchyFlow Vendor
        </Typography>
      </Box>
    </Box>
  );

  if (!user || checkingStatus) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc' }}>
      <CircularProgress sx={{ color: '#22c55e' }} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box sx={{ width: SIDEBAR_W, flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 200 }}>
          <SidebarContent />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} variant="temporary"
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: SIDEBAR_W, bgcolor: '#0d1b2a' } }}>
        <SidebarContent />
      </Drawer>

      {/* Main */}
      <Box sx={{ flex: 1, ml: isMobile ? 0 : `${SIDEBAR_W}px`, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Top Bar */}
        <Box sx={{
          height: 60, bgcolor: '#fff', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', px: 3, gap: 2,
          position: 'sticky', top: 0, zIndex: 100,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {isMobile && <IconButton onClick={() => setMobileOpen(true)} size="small"><MenuIcon /></IconButton>}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Business Dashboard</Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem' }}>Welcome back, {user.firstName}!</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {approvalStatus === 'pending' && (
              <Chip icon={<HourglassEmptyIcon sx={{ fontSize: 13 }} />} label="Pending Approval"
                size="small" sx={{ bgcolor: '#fffbeb', color: '#92400e', fontWeight: 700, fontSize: '0.7rem', border: '1px solid #fde68a' }} />
            )}
            {approvalStatus === 'approved' && (
              <Chip icon={<CheckCircleOutlineIcon sx={{ fontSize: 13 }} />} label="Approved"
                size="small" sx={{ bgcolor: '#f0fdf4', color: '#15803d', fontWeight: 700, fontSize: '0.7rem', border: '1px solid #bbf7d0' }} />
            )}
            <IconButton size="small" sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Badge badgeContent={0} color="error">
                <NotificationsNoneIcon sx={{ fontSize: 20, color: '#64748b' }} />
              </Badge>
            </IconButton>
            <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{
              display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
              px: 1.5, py: 0.8, borderRadius: '10px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#22c55e', fontSize: '0.75rem', fontWeight: 700 }}>
                {user.firstName?.[0]?.toUpperCase()}
              </Avatar>
              <Typography sx={{ fontWeight: 600, color: '#334155', fontSize: '0.82rem' }}>{user.firstName}</Typography>
            </Box>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', mt: 1 } }}>
              <MenuItem onClick={() => { setAnchorEl(null); navTo('profile'); }} sx={{ fontSize: '0.85rem', gap: 1 }}>
                <PersonOutlineIcon sx={{ fontSize: 17 }} /> Profile
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); navTo('settings'); }} sx={{ fontSize: '0.85rem', gap: 1 }}>
                <SettingsOutlinedIcon sx={{ fontSize: 17 }} /> Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ fontSize: '0.85rem', color: '#ef4444', gap: 1 }}>
                <LogoutIcon sx={{ fontSize: 17 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Page Body */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>

          {/* ── PENDING BANNER ── */}
          {approvalStatus === 'pending' && (
            <Paper elevation={0} sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #fde68a', mb: 3 }}>
              <Box sx={{ height: 3, background: 'linear-gradient(90deg,#f59e0b,#d97706)' }} />
              <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HourglassEmptyIcon sx={{ color: '#d97706', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem' }}>Waiting for Admin Approval</Typography>
                  <Typography sx={{ color: '#78350f', fontSize: '0.82rem', mt: 0.2 }}>
                    Your shop is under review. Sidebar features will unlock once approved. You'll receive an email notification.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* ── WELCOME HERO ── */}
          <Paper elevation={0} sx={{
            borderRadius: '16px', p: { xs: 2.5, md: 3.5 }, mb: 3, overflow: 'hidden',
            background: 'linear-gradient(135deg, #0d1b2a 0%, #0f3460 55%, #0e7490 100%)',
            position: 'relative',
          }}>
            {/* decorative circles */}
            <Box sx={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
            <Box sx={{ position: 'absolute', bottom: -20, right: 80, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 0.5 }}>
              Welcome back, {user.firstName}!
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', mb: 2.5 }}>
              Here's what's happening with your shop today. You have{' '}
              <Box component="span" sx={{ color: '#22c55e', fontWeight: 700 }}>0 pending orders</Box>
              {' '}requiring your attention.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                disabled={!isApproved}
                onClick={() => navTo('services')}
                sx={{
                  bgcolor: '#22c55e', color: '#fff', textTransform: 'none', fontWeight: 700,
                  borderRadius: '10px', px: 2.5, py: 1, fontSize: '0.85rem',
                  boxShadow: '0 4px 14px rgba(34,197,94,0.4)',
                  '&:hover': { bgcolor: '#16a34a' },
                  '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' },
                }}
              >
                Add New Service
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarTodayOutlinedIcon />}
                disabled={!isApproved}
                onClick={() => navTo('bookings')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)', color: '#fff', textTransform: 'none',
                  fontWeight: 600, borderRadius: '10px', px: 2.5, py: 1, fontSize: '0.85rem',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.25)' },
                }}
              >
                View Calendar
              </Button>
            </Box>
          </Paper>

          {/* ── FREE PLAN BANNER ── */}
          <Paper elevation={0} sx={{
            borderRadius: '14px', p: 2, mb: 3, border: '1px solid #e2e8f0', bgcolor: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>Free Plan</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>Upgrade to unlock more potential for your shop</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {[
                { label: '0 / 1 Services', icon: '✂️' },
                { label: '— / 3 Portfolios', icon: '🖼️' },
                { label: '— / 10 Media', icon: '📷' },
              ].map(b => (
                <Box key={b.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>{b.icon} {b.label}</Typography>
                </Box>
              ))}
              <Button variant="contained" startIcon={<UpgradeIcon />} size="small" sx={{
                bgcolor: '#22c55e', textTransform: 'none', fontWeight: 700, borderRadius: '8px',
                fontSize: '0.8rem', px: 2, boxShadow: 'none',
                '&:hover': { bgcolor: '#16a34a' },
              }}>
                Upgrade Plan
              </Button>
            </Box>
          </Paper>

          {/* ── STAT CARDS ── */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {[
              { label: 'Total Revenue',   value: 'Rs 0',  sub: '0 completed', icon: <TrendingUpIcon sx={{ fontSize: 20, color: '#22c55e' }} />,          trend: '+12%', trendUp: true  },
              { label: 'Total Bookings',  value: '0',     sub: '0 completed', icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: '#3b82f6' }} />, trend: '0%',   trendUp: false },
              { label: 'Profile Views',   value: '0',     sub: 'Live',        icon: <AnalyticsOutlinedIcon sx={{ fontSize: 20, color: '#8b5cf6' }} />,     trend: '0',    trendUp: false },
              { label: 'Rating Score',    value: '0.0/5', sub: '0 reviews',   icon: <StarIcon sx={{ fontSize: 20, color: '#f59e0b' }} />,                  trend: '—',    trendUp: true  },
            ].map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <StatCard {...s} locked={!isApproved} />
              </Grid>
            ))}
          </Grid>

          {/* ── CHARTS ── */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', opacity: isApproved ? 1 : 0.55 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                      ⚡ Performance Analytics
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>Revenue Trend (PKR) — Last 6 Months</Typography>
                  </Box>
                  <Chip label="Last 6 Months" size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }} />
                </Box>
                <LineChart data={revenueData} color="#22c55e" height={100} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  {months.map(m => <Typography key={m} sx={{ fontSize: '0.68rem', color: '#94a3b8' }}>{m}</Typography>)}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', opacity: isApproved ? 1 : 0.55 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Monthly Bookings</Typography>
                  <Typography sx={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Trend Analysis →</Typography>
                </Box>
                <BarChart data={bookingData} color="#3b82f6" height={100} labels={months} />
              </Paper>
            </Grid>
          </Grid>

          {/* ── RECENT BOOKINGS + OVERVIEW STATS ── */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Recent Bookings</Typography>
                  <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    disabled={!isApproved}
                    onClick={() => navTo('bookings')}
                    sx={{ color: '#22c55e', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                    View All
                  </Button>
                </Box>
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: '#e2e8f0', mb: 1 }} />
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>No recent bookings found.</Typography>
                  {isApproved && (
                    <Button size="small" sx={{ mt: 1.5, color: '#22c55e', textTransform: 'none', fontWeight: 600 }}
                      onClick={() => navTo('services')}>
                      + Add your first service
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', mb: 2 }}>
                  ⚡ Overview Stats
                </Typography>
                {[
                  { label: 'Active Listings',  value: '0' },
                  { label: 'Pending Reviews',  value: '0' },
                  { label: 'Completion Rate',  value: '0%' },
                ].map((s, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.82rem' }}>{s.label}</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{s.value}</Typography>
                  </Box>
                ))}
              </Paper>

              {/* Pro Tip */}
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 2.5, border: '1px solid #bbf7d0', bgcolor: '#f0fdf4' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                  <Typography sx={{ fontWeight: 700, color: '#15803d', fontSize: '0.82rem' }}>Pro Tip</Typography>
                </Box>
                <Typography sx={{ color: '#166534', fontSize: '0.78rem', lineHeight: 1.6, mb: 1.5 }}>
                  Complete your shop profile with high-quality images to increase booking rates by up to 40%. Tailors with full profiles get 3x more orders.
                </Typography>
                <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
                  disabled={!isApproved}
                  onClick={() => navTo('profile')}
                  sx={{ color: '#16a34a', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', p: 0 }}>
                  IMPROVE PROFILE
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* ── YOUR SERVICES ── */}
          <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Your Services</Typography>
              <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                disabled={!isApproved} onClick={() => navTo('services')}
                sx={{ color: '#22c55e', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                Manage All
              </Button>
            </Box>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ContentCutIcon sx={{ fontSize: 40, color: '#e2e8f0', mb: 1 }} />
              <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 1 }}>You haven't added any services yet.</Typography>
              {isApproved ? (
                <Button variant="text" onClick={() => navTo('services')}
                  sx={{ color: '#22c55e', fontWeight: 700, textTransform: 'none', fontSize: '0.85rem' }}>
                  + Register your first service
                </Button>
              ) : (
                <Typography sx={{ color: '#cbd5e1', fontSize: '0.78rem' }}>🔒 Available after admin approval</Typography>
              )}
            </Box>
          </Paper>

        </Box>

        {/* ── FOOTER ── */}
        <Box sx={{ bgcolor: '#0d1b2a', color: 'rgba(255,255,255,0.6)', py: 5, px: { xs: 3, md: 6 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StorefrontOutlinedIcon sx={{ color: '#fff', fontSize: 17 }} />
                </Box>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>StitchyFlow</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.78rem', lineHeight: 1.7, maxWidth: 260 }}>
                Pakistan's leading tailoring marketplace. We connect premium tailors with verified clients through our secure, automated platform.
              </Typography>
            </Grid>
            {[
              { title: 'MARKETPLACE', links: ['Custom Dresses', 'Suits & Blazers', 'Bridal Wear', 'Traditional Wear', 'Alterations', 'Fabric Selection'] },
              { title: 'COMPANY',     links: ['About Us', 'How It Works', 'Careers', 'Press & Media', 'Blog'] },
              { title: 'CONTACT',     links: ['+92 300 123 4567', 'info@stitchyflow.com', 'DHA Phase 6, Karachi', 'Sindh, Pakistan'] },
            ].map(col => (
              <Grid item xs={6} md={2} key={col.title}>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', mb: 1.5 }}>{col.title}</Typography>
                {col.links.map(l => (
                  <Typography key={l} sx={{ fontSize: '0.78rem', mb: 0.8, cursor: 'pointer', '&:hover': { color: '#22c55e' }, transition: 'color 0.15s' }}>{l}</Typography>
                ))}
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontSize: '0.72rem' }}>© 2026 StitchyFlow. All rights reserved.</Typography>
            <Typography sx={{ fontSize: '0.72rem' }}>🔒 Secure Platform</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── REJECTED DIALOG ── */}
      <Dialog open={showRejected} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}>
        <Box sx={{ height: 4, bgcolor: '#ef4444' }} />
        <DialogContent sx={{ px: 4, py: 4, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <CancelOutlinedIcon sx={{ color: '#ef4444', fontSize: 34 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', mb: 1 }}>Application Rejected</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7, mb: 3 }}>
            Your Tailor Shop application was not approved. A notification email has been sent to your registered email address.
          </Typography>
          <Button fullWidth variant="contained" onClick={handleLogout}
            sx={{ bgcolor: '#ef4444', color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', py: 1.3, '&:hover': { bgcolor: '#dc2626' } }}>
            Sign Out
          </Button>
        </DialogContent>
      </Dialog>

    </Box>
  );
}

export default TailorDashboard;
