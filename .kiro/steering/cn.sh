/**
 * TailorDashboard — Full vendor layout aligned with StitchyFlow / EventKro-style dashboard
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, Paper, Button, Chip, Divider,
  Drawer, IconButton, useMediaQuery, useTheme, Dialog, DialogContent,
  Tooltip, CircularProgress, Badge, Fab,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import BusinessIcon from '@mui/icons-material/Business';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SIDEBAR_W = 280;
const HEADER_H = 60;
const SUBBAR_H = 52;
const TOP_STACK = HEADER_H + SUBBAR_H;

const FOREST = '#1b4332';
const FOREST_LIGHT = '#2d6a4f';
const NAVY = '#0d1b2a';
const PAGE_BG = '#f7fafc';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
`;

const SIDEBAR_NAV = [
  { key: 'overview', label: 'Overview', Icon: DashboardOutlinedIcon },
  { key: 'businesses', label: 'My Businesses', Icon: StorefrontOutlinedIcon },
  { key: 'messages', label: 'Messages', Icon: MessageOutlinedIcon },
  { key: 'analytics', label: 'Analytics', Icon: AnalyticsOutlinedIcon },
  { key: 'support', label: 'Support Tickets', Icon: SupportAgentOutlinedIcon },
  { key: 'terms', label: 'Terms & Privacy', Icon: GavelOutlinedIcon },
];

function LineChart({ data, color = '#40916c', height = 100 }) {
  const max = Math.max(...data, 1);
  const w = 400;
  const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 12) - 6;
    return `${x},${y}`;
  }).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  const gid = `lg-${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function BarChart({ data, color = '#2563eb', height = 100, labels }) {
  const max = Math.max(...data, 1);
  const w = 400;
  const h = height;
  const gap = 8;
  const bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 18}`} style={{ width: '100%', height: height + 18 }}>
      {data.map((v, i) => {
        const bh = Math.max((v / max) * h, 4);
        const x = i * (bw + gap);
        const y = h - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx="4" fill={color} opacity="0.88" />
            {labels && (
              <text x={x + bw / 2} y={h + 14} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="inherit">
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function StatCard({ label, value, sub, icon, trend, trendUp, live, locked }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '14px',
        p: 2.5,
        border: '1px solid #e2e8f0',
        bgcolor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        opacity: locked ? 0.55 : 1,
        position: 'relative',
        height: '100%',
      }}
    >
      {locked && (
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
          <LockOutlinedIcon sx={{ fontSize: 14, color: '#cbd5e1' }} />
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        {live && (
          <Chip
            label="Live"
            size="small"
            sx={{
              height: 22,
              fontSize: '0.65rem',
              fontWeight: 800,
              bgcolor: '#ede9fe',
              color: '#6d28d9',
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          />
        )}
        {trend !== undefined && !live && (
          <Chip
            size="small"
            icon={trendUp ? <TrendingUpIcon sx={{ fontSize: 12 }} /> : <TrendingDownIcon sx={{ fontSize: 12 }} />}
            label={trend}
            sx={{
              height: 22,
              fontSize: '0.68rem',
              fontWeight: 700,
              bgcolor: trendUp ? '#f0fdf4' : '#fef2f2',
              color: trendUp ? '#16a34a' : '#dc2626',
              '& .MuiChip-icon': { color: trendUp ? '#16a34a' : '#dc2626' },
            }}
          />
        )}
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: '1.55rem', color: '#0f172a', lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600, mt: 0.4 }}>{label}</Typography>
      {sub && (
        <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', mt: 0.35 }}>
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

function TailorDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [user, setUser] = useState(null);
  const [activeKey, setActiveKey] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [showRejected, setShowRejected] = useState(false);
  const [secureOpen, setSecureOpen] = useState(true);

  const revenueData = [0, 0, 0, 0, 0, 0];
  const bookingData = [0, 0, 0, 0, 0, 0];
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fetchApprovalStatus = useCallback(async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/tailor-approval/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const s = data.data.approval_status;
        setApprovalStatus(s);
        if (s === 'rejected') setShowRejected(true);
      }
    } catch (_) {}
    finally {
      setCheckingStatus(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== 'tailor') {
      navigate('/login');
      return;
    }
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

  const routeForKey = (key) => {
    switch (key) {
      case 'overview':
        navToSection('overview');
        break;
      case 'businesses':
      case 'services':
      case 'media':
      case 'features':
      case 'why':
        navToSection('services');
        break;
      case 'locations':
        navToSection('profile');
        break;
      case 'promotions':
        navigate('/promotions');
        break;
      case 'bookings':
        navToSection('bookings');
        break;
      case 'reviews':
        navToSection('reviews');
        break;
      case 'messages':
        navToSection('messages');
        break;
      case 'analytics':
        navToSection('analytics');
        break;
      case 'support':
        navToSection('support');
        break;
      case 'terms':
        navigate('/about');
        break;
      default:
        navToSection('overview');
    }
  };

  const navToSection = (key) => {
    if (!isApproved && key !== 'overview') return;
    setActiveKey(key);
    if (isMobile) setMobileOpen(false);
  };

  const navTo = (key) => {
    const locked = !isApproved && key !== 'overview';
    if (locked) return;
    routeForKey(key);
  };

  const SidebarContent = () => (
    <Box
      sx={{
        width: SIDEBAR_W,
        height: '100%',
        bgcolor: '#fff',
        borderRight: '1px solid #e8ecf1',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '14px',
            p: 2,
            background: `linear-gradient(135deg, ${NAVY} 0%, #132238 100%)`,
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 8px 24px rgba(13,27,42,0.18)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BusinessIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.92rem', lineHeight: 1.15 }}>
                Business Hub
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem' }}>Manage your empire</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ flex: 1, px: 1.5, pb: 2, overflowY: 'auto', '&::-webkit-scrollbar': { width: 6 } }}>
        {SIDEBAR_NAV.map((item) => {
          const locked = !isApproved && item.key !== 'overview';
          const section =
            item.key === 'overview'
              ? 'overview'
              : ['businesses', 'media', 'features', 'why'].includes(item.key)
                ? 'services'
                : item.key === 'locations'
                  ? 'profile'
                  : ['promotions', 'terms'].includes(item.key)
                    ? null
                    : item.key;
          const active = section != null && activeKey === section;

          const IconComp = item.Icon;
          return (
            <Tooltip key={item.key} title={locked ? 'Available after admin approval' : ''} placement="right" arrow>
              <Box
                onClick={() => navTo(item.key)}
                sx={{
                  mb: 0.35,
                  px: 1.75,
                  py: 1,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  bgcolor: active ? 'rgba(64,145,108,0.12)' : 'transparent',
                  border: active ? `1px solid rgba(27,67,50,0.15)` : '1px solid transparent',
                  opacity: locked ? 0.4 : 1,
                  transition: 'all 0.15s',
                  '&:hover': {
                    bgcolor: locked ? 'transparent' : active ? 'rgba(64,145,108,0.14)' : '#f8fafc',
                  },
                }}
              >
                <Box sx={{ color: active ? FOREST : '#94a3b8', display: 'flex' }}>
                  {locked ? <LockOutlinedIcon sx={{ fontSize: 18 }} /> : <IconComp sx={{ fontSize: 18 }} />}
                </Box>
                <Typography
                  sx={{
                    color: active ? FOREST : '#475569',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.84rem',
                    flex: 1,
                  }}
                >
                  {item.label}
                </Typography>
                {active && <ChevronRightIcon sx={{ fontSize: 18, color: FOREST }} />}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid #eef2f7' }}>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.68rem', textAlign: 'center' }}>
          © {new Date().getFullYear()} StitchyFlow Vendor
        </Typography>
      </Box>
    </Box>
  );

  if (!user || checkingStatus)
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: PAGE_BG }}>
        <CircularProgress sx={{ color: FOREST }} />
      </Box>
    );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: PAGE_BG }}>
      <Header />

      {/* Forest green context bar */}
      <Box
        sx={{
          position: 'fixed',
          top: HEADER_H,
          left: 0,
          right: 0,
          height: SUBBAR_H,
          zIndex: 1190,
          bgcolor: NAVY,
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 1.5, md: 3 },
          gap: 2,
        }}
      >
        {isMobile && (
          <IconButton size="small" onClick={() => setMobileOpen(true)} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: 'rgba(255,255,255,0.12)',
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StorefrontOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '0.82rem', sm: '0.92rem' }, lineHeight: 1.2 }}>
              Business Dashboard
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: { xs: '0.68rem', sm: '0.72rem' } }}>
              Welcome back, {user.firstName}!
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {approvalStatus === 'pending' && (
            <Chip
              icon={<HourglassEmptyIcon sx={{ fontSize: 13 }} />}
              label="Pending"
              size="small"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                bgcolor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.65rem',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
          )}
          {approvalStatus === 'approved' && (
            <Chip
              icon={<CheckCircleOutlineIcon sx={{ fontSize: 13 }} />}
              label="Approved"
              size="small"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                bgcolor: 'rgba(255,255,255,0.12)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.65rem',
              }}
            />
          )}
          <IconButton size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }}>
            <Badge badgeContent={0} color="error">
              <NotificationsNoneIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
          <Button
            onClick={handleLogout}
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: '#fff',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              borderRadius: '10px',
              px: 1.5,
              py: 0.5,
              border: '1px solid rgba(255,255,255,0.25)',
              bgcolor: 'rgba(255,255,255,0.08)',
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: SIDEBAR_W } }}
      >
        <SidebarContent />
      </Drawer>

      <Box sx={{ display: 'flex', pt: `${TOP_STACK}px` }}>
        {!isMobile && (
          <Box
            sx={{
              width: SIDEBAR_W,
              flexShrink: 0,
              position: 'fixed',
              top: TOP_STACK,
              left: 0,
              height: `calc(100vh - ${TOP_STACK}px)`,
              zIndex: 100,
            }}
          >
            <SidebarContent />
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            ml: isMobile ? 0 : `${SIDEBAR_W}px`,
            width: 1,
            minHeight: `calc(100vh - ${TOP_STACK}px)`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto', width: 1 }}>
            {approvalStatus === 'pending' && (
              <Paper
                elevation={0}
                sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #fde68a', mb: 3 }}
              >
                <Box sx={{ height: 3, background: 'linear-gradient(90deg,#f59e0b,#d97706)' }} />
                <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: '#fffbeb',
                      border: '1px solid #fde68a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <HourglassEmptyIcon sx={{ color: '#d97706', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem' }}>
                      Waiting for Admin Approval
                    </Typography>
                    <Typography sx={{ color: '#78350f', fontSize: '0.82rem', mt: 0.2 }}>
                      Your tailor shop is under review. Sidebar tools unlock once approved. You will receive an email when
                      the status changes.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Hero */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: '16px',
                p: { xs: 2.5, md: 3.5 },
                mb: 3,
                overflow: 'hidden',
                background: `linear-gradient(125deg, ${NAVY} 0%, #16324a 55%, #1b4965 100%)`,
                position: 'relative',
                boxShadow: '0 12px 40px rgba(13,27,42,0.2)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -20,
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.04)',
                }}
              />
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.25rem', md: '1.55rem' }, mb: 0.75 }}>
                Welcome back, {user.firstName}!
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', mb: 2.75, maxWidth: 640 }}>
                Here is a snapshot of your tailor shop. You have{' '}
                <Box component="span" sx={{ color: '#95d5b2', fontWeight: 800 }}>
                  0 pending bookings
                </Box>{' '}
                and your orders are on track.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  disabled={!isApproved}
                  onClick={() => navToSection('services')}
                  sx={{
                    bgcolor: FOREST_LIGHT,
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '12px',
                    px: 2.75,
                    py: 1.1,
                    fontSize: '0.88rem',
                    boxShadow: '0 6px 18px rgba(27,67,50,0.35)',
                    '&:hover': { bgcolor: FOREST },
                    '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.35)' },
                  }}
                >
                  Add New Business
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CalendarTodayOutlinedIcon />}
                  disabled={!isApproved}
                  onClick={() => navToSection('bookings')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.35)',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '12px',
                    px: 2.75,
                    py: 1.1,
                    fontSize: '0.88rem',
                    bgcolor: 'rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.22)', borderColor: 'rgba(255,255,255,0.45)' },
                    '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.25)' },
                  }}
                >
                  View Calendar
                </Button>
              </Box>
            </Paper>

            {/* Plan */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: '14px',
                p: 2.25,
                mb: 3,
                border: '1px solid #e8ecf1',
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '11px',
                    bgcolor: '#fffbeb',
                    border: '1px solid #fde68a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <StarIcon sx={{ color: '#f59e0b', fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Free Plan</Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.76rem' }}>
                    Upgrade to unlock higher limits for listings, services, and media.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 }, flexWrap: 'wrap' }}>
                {[
                  { t: '0 / 1 Businesses' },
                  { t: '0 / 5 Services' },
                  { t: '0 / 10 Media' },
                ].map((x) => (
                  <Typography key={x.t} sx={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                    {x.t}
                  </Typography>
                ))}
                {/* Upgrade Plan button hidden
                <Button
                  variant="contained"
                  startIcon={<UpgradeIcon />}
                  size="small"
                  sx={{
                    bgcolor: FOREST,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    px: 2.25,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: FOREST_LIGHT },
                  }}
                >
                  Upgrade Plan
                </Button>
                */}
              </Box>
            </Paper>

            {/* KPI row */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              {[
                {
                  label: 'Total Revenue',
                  value: 'Rs 0',
                  sub: 'PKR lifetime',
                  icon: <AttachMoneyIcon sx={{ fontSize: 22, color: '#40916c' }} />,
                  trend: '+1.2%',
                  trendUp: true,
                },
                {
                  label: 'Total Bookings',
                  value: '0',
                  sub: '2 completed',
                  icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 22, color: '#2563eb' }} />,
                  trend: undefined,
                  trendUp: true,
                },
                {
                  label: 'Profile Views',
                  value: '0',
                  sub: 'Last 30 days',
                  icon: <VisibilityIcon sx={{ fontSize: 22, color: '#7c3aed' }} />,
                  live: true,
                },
                {
                  label: 'Rating Score',
                  value: '0.0 / 5.0',
                  sub: 'From verified clients',
                  icon: <StarIcon sx={{ fontSize: 22, color: '#f59e0b' }} />,
                  trend: undefined,
                  trendUp: true,
                },
              ].map((s) => (
                <Grid item xs={6} lg={3} key={s.label}>
                  <StatCard {...s} locked={!isApproved} />
                </Grid>
              ))}
            </Grid>

            {/* Charts */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '14px',
                    p: 3,
                    border: '1px solid #e8ecf1',
                    bgcolor: '#fff',
                    height: '100%',
                    opacity: isApproved ? 1 : 0.55,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>Revenue Trend</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.76rem' }}>Performance analytics (PKR) — last 6 months</Typography>
                    </Box>
                    <Chip
                      label="Last 6 Months"
                      size="small"
                      sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }}
                    />
                  </Box>
                  <LineChart data={revenueData} color="#40916c" height={110} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    {months.map((m) => (
                      <Typography key={m} sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                        {m}
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '14px',
                    p: 3,
                    border: '1px solid #e8ecf1',
                    bgcolor: '#fff',
                    height: '100%',
                    opacity: isApproved ? 1 : 0.55,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>Monthly Bookings</Typography>
                    <Typography sx={{ color: '#2563eb', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                      Trend analysis →
                    </Typography>
                  </Box>
                  <BarChart data={bookingData} color="#2563eb" height={110} labels={months} />
                </Paper>
              </Grid>
            </Grid>

            {/* Recent + businesses | Overview + tip */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12} lg={8}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '14px',
                    p: 3,
                    border: '1px solid #e8ecf1',
                    bgcolor: '#fff',
                    mb: 2.5,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>Recent Bookings</Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                      disabled={!isApproved}
                      onClick={() => navToSection('bookings')}
                      sx={{ color: FOREST, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}
                    >
                      View All
                    </Button>
                  </Box>
                  <Box sx={{ textAlign: 'center', py: 5 }}>
                    <WorkOutlineIcon sx={{ fontSize: 44, color: '#e2e8f0', mb: 1 }} />
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.88rem' }}>No recent bookings found.</Typography>
                  </Box>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{ borderRadius: '14px', p: 3, border: '1px solid #e8ecf1', bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>Your Businesses</Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                      disabled={!isApproved}
                      onClick={() => navToSection('services')}
                      sx={{ color: FOREST, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}
                    >
                      Manage
                    </Button>
                  </Box>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <StorefrontOutlinedIcon sx={{ fontSize: 44, color: '#e2e8f0', mb: 1 }} />
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.88rem', mb: 1.5 }}>
                      You have not added any businesses yet.
                    </Typography>
                    {isApproved ? (
                      <Button
                        onClick={() => navToSection('services')}
                        sx={{ color: '#2563eb', fontWeight: 800, textTransform: 'none', fontSize: '0.88rem' }}
                      >
                        Register your first business
                      </Button>
                    ) : (
                      <Typography sx={{ color: '#cbd5e1', fontSize: '0.78rem' }}>Unlocked after admin approval</Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '14px',
                    p: 3,
                    border: '1px solid #e8ecf1',
                    bgcolor: '#fff',
                    mb: 2.5,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', mb: 2 }}>Overview Stats</Typography>
                  {[
                    { label: 'Active Listings', value: '0' },
                    { label: 'Pending Reviews', value: '0' },
                    { label: 'Completion Rate', value: '0%' },
                  ].map((s, i) => (
                    <Box
                      key={s.label}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1.25,
                        borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
                      }}
                    >
                      <Typography sx={{ color: '#64748b', fontSize: '0.84rem' }}>{s.label}</Typography>
                      <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{s.value}</Typography>
                    </Box>
                  ))}
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '14px',
                    p: 2.5,
                    border: '1px solid #c8e6c9',
                    bgcolor: '#e8f5e9',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 18, color: FOREST }} />
                    <Typography sx={{ fontWeight: 800, color: FOREST, fontSize: '0.85rem' }}>Pro Tip</Typography>
                  </Box>
                  <Typography sx={{ color: '#1b4332', fontSize: '0.8rem', lineHeight: 1.65, mb: 1.75 }}>
                    Complete your shop profile with clear photos and measurements guidance. Shops with full profiles receive
                    more orders and better reviews.
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    disabled={!isApproved}
                    onClick={() => navToSection('profile')}
                    sx={{ color: FOREST, textTransform: 'none', fontWeight: 800, fontSize: '0.78rem', p: 0, minWidth: 0 }}
                  >
                    IMPROVE PROFILE +
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Footer */}
          <Box sx={{ bgcolor: NAVY, color: 'rgba(255,255,255,0.65)', py: { xs: 4, md: 5 }, px: { xs: 2, md: 6 }, mt: 'auto' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      color: '#fff',
                      fontSize: '0.95rem',
                    }}
                  >
                    S
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem', lineHeight: 1.15 }}>StitchyFlow</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', letterSpacing: '0.12em' }}>
                      ENTERPRISE EDITION
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.8rem', lineHeight: 1.75, maxWidth: 300, mb: 2 }}>
                  Pakistan&apos;s tailoring marketplace connecting verified tailors with clients through a secure, guided
                  experience.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[FacebookIcon, InstagramIcon, LinkedInIcon].map((Ico, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: 'rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' },
                      }}
                    >
                      <Ico sx={{ fontSize: 18, color: '#fff' }} />
                    </Box>
                  ))}
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: 'rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontWeight: 800,
                      color: '#fff',
                      fontSize: '0.75rem',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' },
                    }}
                  >
                    X
                  </Box>
                </Box>
              </Grid>
              {[
                {
                  title: 'Marketplace',
                  links: ["Men's Suits", 'Alterations', 'Custom Dresses', 'Bridal Wear', 'Traditional Wear', 'Fabric Studio'],
                },
                { title: 'Company', links: ['About StitchyFlow', 'How It Works', 'Careers', 'Press & Media', 'Blog'] },
                {
                  title: 'Contact',
                  links: ['+92 300 123 4567', 'hello@stitchyflow.com', 'DHA Phase 6, Karachi', 'Sindh, Pakistan'],
                },
              ].map((col) => (
                <Grid item xs={12} sm={6} md={3} key={col.title}>
                  <Typography
                    sx={{
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      letterSpacing: '0.1em',
                      mb: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {col.title}
                  </Typography>
                  {col.links.map((l) => (
                    <Typography
                      key={l}
                      sx={{
                        fontSize: '0.8rem',
                        mb: 0.9,
                        cursor: 'pointer',
                        '&:hover': { color: '#95d5b2' },
                        transition: 'color 0.15s',
                      }}
                    >
                      {l}
                    </Typography>
                  ))}
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography sx={{ fontSize: '0.74rem' }}>© {new Date().getFullYear()} StitchyFlow. All rights reserved.</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <SecurityOutlinedIcon sx={{ fontSize: 16, opacity: 0.85 }} />
                <Typography sx={{ fontSize: '0.74rem' }}>Secure Platform</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {secureOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            zIndex: 1300,
            maxWidth: 320,
            p: 2,
            borderRadius: '14px',
            display: { xs: 'none', sm: 'block' },
            border: '1px solid #e5e7eb',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1.25 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SecurityOutlinedIcon sx={{ color: '#2563eb', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', mb: 0.25 }}>
                  Secure your account
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                  Turn on two-step verification from Settings to protect payouts and client data.
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setSecureOpen(false)} sx={{ mt: -0.5 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Chat button hidden - can be re-enabled when chat feature is ready
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          bgcolor: FOREST_LIGHT,
          '&:hover': { bgcolor: FOREST },
        }}
      >
        <ChatIcon />
      </Fab>
      */}

      <Dialog open={showRejected} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}>
        <Box sx={{ height: 4, bgcolor: '#ef4444' }} />
        <DialogContent sx={{ px: 4, py: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CancelOutlinedIcon sx={{ color: '#ef4444', fontSize: 34 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', mb: 1 }}>Application Rejected</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7, mb: 3 }}>
            Your tailor shop application was not approved. A notification email has been sent to your registered email
            address.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogout}
            sx={{
              bgcolor: '#ef4444',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '12px',
              textTransform: 'none',
              py: 1.3,
              '&:hover': { bgcolor: '#dc2626' },
            }}
          >
            Sign Out
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default TailorDashboard;
