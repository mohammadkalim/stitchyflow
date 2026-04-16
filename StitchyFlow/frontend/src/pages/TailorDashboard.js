// TailorDashboard — Business Owner Dashboard
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Chip, Divider, Grid,
  Drawer, IconButton, useMediaQuery, useTheme, Dialog, DialogContent,
  Tooltip, CircularProgress, Badge,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Header from '../components/Header';
import OverviewSection from './tailor/OverviewSection';
import MyBusinessesSection from './tailor/MyBusinessesSection';
import ServicesSection from './tailor/ServicesSection';
import PromotionsSection from './tailor/PromotionsSection';
import OrdersSection from './tailor/OrdersSection';
import ReviewsSection from './tailor/ReviewsSection';
import MessagesSection from './tailor/MessagesSection';
import AnalyticsSection from './tailor/AnalyticsSection';
import SupportSection from './tailor/SupportSection';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import BusinessIcon from '@mui/icons-material/Business';

const SIDEBAR_W = 260;
const HEADER_H = 60;
/** Full options green bar height — only shown on Overview (Dashboard) */
const SUBBAR_H = 52;

const FOREST = '#1b4332';
const NAVY = '#0d1b2a';
const PAGE_BG = '#f4f6f8';

const SIDEBAR_NAV = [
  { key: 'overview',    label: 'Overview',        Icon: DashboardOutlinedIcon },
  { key: 'businesses',  label: 'My Businesses',   Icon: StorefrontOutlinedIcon },
  { key: 'services',    label: 'Services',         Icon: MiscellaneousServicesOutlinedIcon },
  { key: 'promotions',  label: 'Promotions',       Icon: LocalOfferOutlinedIcon },
  { key: 'bookings',    label: 'Orders',           Icon: CalendarTodayOutlinedIcon },
  { key: 'reviews',     label: 'Reviews',          Icon: StarBorderIcon },
  { key: 'messages',    label: 'Messages',         Icon: MessageOutlinedIcon },
  { key: 'analytics',   label: 'Analytics',        Icon: AnalyticsOutlinedIcon },
  { key: 'support',     label: 'Support Tickets',  Icon: SupportAgentOutlinedIcon },
];

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
  const [heroBannerOpen, setHeroBannerOpen] = useState(false);

  const fetchApprovalStatus = useCallback(async () => {
    try {
      const data = await apiFetch('/tailor-approval/status');
      if (data.success) {
        const s = data.data.approval_status;
        setApprovalStatus(s);
        if (s === 'rejected') setShowRejected(true);
        try {
          const raw = localStorage.getItem('user');
          if (raw && s) {
            const u = JSON.parse(raw);
            if (u.approvalStatus !== s) {
              u.approvalStatus = s;
              localStorage.setItem('user', JSON.stringify(u));
              setUser(u);
            }
          }
        } catch (_) { /* ignore */ }
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
    if (u.approvalStatus) setApprovalStatus(u.approvalStatus);
    fetchApprovalStatus();
    const iv = setInterval(() => fetchApprovalStatus(), 15000);
    return () => clearInterval(iv);
  }, [navigate, fetchApprovalStatus]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isApproved = approvalStatus === 'approved';
  const showFullDashboardBar = activeKey === 'overview';
  const topStack = HEADER_H + (showFullDashboardBar ? SUBBAR_H : 0);

  const navToSection = (key) => {
    if (!isApproved && key !== 'overview') return;
    setActiveKey(key);
    if (isMobile) setMobileOpen(false);
  };

  const navTo = (key) => {
    if (!isApproved && key !== 'overview') return;
    navToSection(key);
  };

  const SidebarContent = () => (
    <Box sx={{
      width: SIDEBAR_W, height: '100%', bgcolor: '#fff',
      borderRight: '1px solid #e8ecf1', display: 'flex', flexDirection: 'column',
    }}>
      {/* ── Brand Card (original dark hub) ── */}
      <Box sx={{ p: 1.75, pb: 1.25 }}>
        <Box sx={{
          borderRadius: '14px', p: 2,
          background: 'linear-gradient(135deg, #0d1b2a 0%, #112233 60%, #0d2137 100%)',
          position: 'relative', overflow: 'hidden', minHeight: 88,
        }}>
          <Box sx={{
            position: 'absolute', top: 6, right: 8, opacity: 0.18,
            fontSize: 52, color: '#fff', lineHeight: 1,
            fontFamily: 'Material Icons', display: 'flex',
          }}>
            <BusinessIcon sx={{ fontSize: 52 }} />
          </Box>
          <Box sx={{
            width: 38, height: 38, borderRadius: '10px',
            bgcolor: 'rgba(45,106,79,0.85)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', mb: 1.25,
          }}>
            <BusinessIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>
            Business Hub
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem', mt: 0.2 }}>
            Manage your empire
          </Typography>
        </Box>
      </Box>

      {/* ── Nav Items (green active state) ── */}
      <Box sx={{ flex: 1, px: 1.25, pb: 1.5, overflowY: 'auto', '&::-webkit-scrollbar': { width: 3 } }}>
        {SIDEBAR_NAV.map((item) => {
          const locked = !isApproved && item.key !== 'overview';
          const active = activeKey === item.key;
          const IconComp = item.Icon;
          return (
            <Tooltip key={item.key} title={locked ? 'Available after admin approval' : ''} placement="right" arrow>
              <Box
                onClick={() => navTo(item.key)}
                sx={{
                  mb: 0.15, px: 1.5, py: 0.9,
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', gap: 1.25,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  bgcolor: active ? 'rgba(40,167,69,0.1)' : 'transparent',
                  transition: 'background 0.15s',
                  '&:hover': {
                    bgcolor: locked ? 'transparent' : active ? 'rgba(40,167,69,0.13)' : '#f5f7fa',
                  },
                }}
              >
                <Box sx={{
                  width: 28, height: 28, borderRadius: '7px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: active ? 'rgba(40,167,69,0.15)' : 'transparent',
                }}>
                  {locked
                    ? <LockOutlinedIcon sx={{ fontSize: 15, color: '#c0c8d4' }} />
                    : <IconComp sx={{ fontSize: 16, color: active ? '#2d6a4f' : '#8a96a3' }} />
                  }
                </Box>
                <Typography sx={{
                  flex: 1,
                  fontSize: '0.83rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#1b4332' : '#4a5568',
                  letterSpacing: '0.01em',
                }}>
                  {item.label}
                </Typography>
                {active && (
                  <ChevronRightIcon sx={{ fontSize: 16, color: '#2d6a4f', flexShrink: 0 }} />
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid #f0f2f5' }}>
        <Typography sx={{ color: '#b0bac5', fontSize: '0.63rem', textAlign: 'center' }}>
          © {new Date().getFullYear()} StitchyFlow Tailor Shop
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
      {showFullDashboardBar && (
        <Box
          sx={{
            position: 'fixed',
            top: HEADER_H,
            left: 0,
            right: 0,
            height: SUBBAR_H,
            zIndex: 1190,
            display: 'flex',
            alignItems: 'center',
            px: { xs: 2, md: 3 },
            background: 'linear-gradient(90deg, #06402B 0%, #053828 50%, #06402B 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.16)',
          }}
        >
          {isMobile && (
            <IconButton size="small" onClick={() => setMobileOpen(true)} sx={{ color: '#fff', mr: 0.5 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: 'rgba(16,185,129,0.22)', display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center', mr: 1.25 }}>
            <StorefrontOutlinedIcon sx={{ color: '#d1fae5', fontSize: 18 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.93rem', lineHeight: 1.1 }}>
              Business Dashboard
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.76rem' }}>
              Welcome back, {user.firstName}!
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {approvalStatus === 'pending' && (
              <Chip
                icon={<HourglassEmptyIcon sx={{ fontSize: 12 }} />}
                label="Pending"
                size="small"
                sx={{ display: { xs: 'none', sm: 'flex' }, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '0.63rem', border: '1px solid rgba(255,255,255,0.2)' }}
              />
            )}
            {approvalStatus === 'approved' && (
              <Chip
                icon={<CheckCircleOutlineIcon sx={{ fontSize: 12 }} />}
                label="Approved"
                size="small"
                sx={{ display: { xs: 'none', sm: 'flex' }, bgcolor: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, fontSize: '0.63rem' }}
              />
            )}
            <IconButton size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }}>
              <Badge badgeContent={0} color="error"><NotificationsNoneIcon sx={{ fontSize: 20 }} /></Badge>
            </IconButton>
            <Box sx={{ display: { xs: 'none', sm: 'inline-flex' }, alignItems: 'stretch', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.25)', bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  borderRadius: 0,
                  px: 1.5,
                  py: 0.5,
                  border: 'none',
                  minWidth: 0,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                }}
              >
                Logout
              </Button>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); setHeroBannerOpen((v) => !v); }}
                aria-label={heroBannerOpen ? 'Hide welcome banner' : 'Show welcome banner'}
                sx={{
                  color: '#fff',
                  borderRadius: 0,
                  borderLeft: '1px solid rgba(255,255,255,0.25)',
                  px: 0.75,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                }}
              >
                <KeyboardArrowDownIcon sx={{ fontSize: 18, transition: 'transform 0.2s', transform: heroBannerOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} variant="temporary" ModalProps={{ keepMounted: true }} PaperProps={{ sx: { width: SIDEBAR_W } }}>
        <SidebarContent />
      </Drawer>

      {/* ── Main layout: sidebar + content ── */}
      <Box sx={{ display: 'flex', pt: `${topStack}px` }}>
        {/* Sidebar — sticky, stops before footer */}
        {!isMobile && (
          <Box sx={{
            width: SIDEBAR_W, flexShrink: 0,
            position: 'sticky', top: topStack,
            height: `calc(100vh - ${topStack}px)`,
            alignSelf: 'flex-start',
            zIndex: 100,
          }}>
            <SidebarContent />
          </Box>
        )}

        {/* Content */}
        <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 3 } }}>
          {isMobile && !showFullDashboardBar && (
            <Box sx={{ mb: 1.25 }}>
              <IconButton size="small" onClick={() => setMobileOpen(true)} sx={{ color: '#334155', bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
          {approvalStatus === 'pending' && (
            <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #fde68a', mb: 3 }}>
              <Box sx={{ height: 3, background: 'linear-gradient(90deg,#f59e0b,#d97706)' }} />
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HourglassEmptyIcon sx={{ color: '#d97706', fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#92400e', fontSize: '0.92rem' }}>Waiting for Admin Approval</Typography>
                  <Typography sx={{ color: '#78350f', fontSize: '0.8rem', mt: 0.2 }}>Your tailor shop is under review. Sidebar tools unlock once approved.</Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {activeKey === 'overview'   && <OverviewSection user={user} isApproved={isApproved} onNavigate={navToSection} showHeroBanner={heroBannerOpen} />}
          {activeKey === 'businesses' && <MyBusinessesSection isApproved={isApproved} />}
          {activeKey === 'services'   && <ServicesSection isApproved={isApproved} />}
          {activeKey === 'promotions' && <PromotionsSection isApproved={isApproved} />}
          {activeKey === 'bookings'   && <OrdersSection isApproved={isApproved} />}
          {activeKey === 'reviews'    && <ReviewsSection isApproved={isApproved} />}
          {activeKey === 'messages'   && <MessagesSection isApproved={isApproved} user={user} />}
          {activeKey === 'analytics'  && <AnalyticsSection isApproved={isApproved} />}
          {activeKey === 'support'    && <SupportSection isApproved={isApproved} />}
        </Box>
      </Box>

      {/* ── Footer — full width, below everything ── */}
      <Box sx={{ bgcolor: NAVY, color: 'rgba(255,255,255,0.65)', py: { xs: 4, md: 5 }, px: { xs: 3, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '0.9rem' }}>S</Box>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.15 }}>StitchyFlow</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>ENTERPRISE EDITION</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', lineHeight: 1.75, maxWidth: 300, mb: 2 }}>
              Pakistan&apos;s tailoring marketplace connecting verified tailors with clients.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[FacebookIcon, InstagramIcon, LinkedInIcon].map((Ico, i) => (
                <Box key={i} sx={{ width: 32, height: 32, borderRadius: '9px', bgcolor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' } }}>
                  <Ico sx={{ fontSize: 16, color: '#fff' }} />
                </Box>
              ))}
            </Box>
          </Grid>
          {[
            { title: 'Marketplace', links: ["Men's Suits", 'Alterations', 'Custom Dresses', 'Bridal Wear', 'Traditional Wear'] },
            { title: 'Company', links: ['About StitchyFlow', 'How It Works', 'Careers', 'Press & Media', 'Blog'] },
            { title: 'Contact', links: ['+92 300 123 4567', 'hello@stitchyflow.com', 'DHA Phase 6, Karachi'] },
          ].map((col) => (
            <Grid item xs={12} sm={6} md={3} key={col.title}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.1em', mb: 1.5, textTransform: 'uppercase' }}>{col.title}</Typography>
              {col.links.map((l) => (
                <Typography key={l} sx={{ fontSize: '0.78rem', mb: 0.85, cursor: 'pointer', '&:hover': { color: '#95d5b2' }, transition: 'color 0.15s' }}>{l}</Typography>
              ))}
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontSize: '0.72rem' }}>© {new Date().getFullYear()} StitchyFlow. All rights reserved.</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <SecurityOutlinedIcon sx={{ fontSize: 15, opacity: 0.85 }} />
            <Typography sx={{ fontSize: '0.72rem' }}>Secure Platform</Typography>
          </Box>
        </Box>
      </Box>



      <Dialog open={showRejected} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '18px', overflow: 'hidden' } }}>
        <Box sx={{ height: 4, bgcolor: '#ef4444' }} />
        <DialogContent sx={{ px: 4, py: 4, textAlign: 'center' }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <CancelOutlinedIcon sx={{ color: '#ef4444', fontSize: 32 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 1 }}>Application Rejected</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.83rem', lineHeight: 1.7, mb: 3 }}>
            Your tailor shop application was not approved. A notification email has been sent to your registered email address.
          </Typography>
          <Button fullWidth variant="contained" onClick={handleLogout}
            sx={{ bgcolor: '#ef4444', color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', py: 1.2, '&:hover': { bgcolor: '#dc2626' } }}>
            Sign Out
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default TailorDashboard;
