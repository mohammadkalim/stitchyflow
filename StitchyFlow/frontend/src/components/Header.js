/**
 * Header Component — with dynamic social media links from DB
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Menu, MenuItem, Divider, Paper, Grid, Fade, Avatar, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import StraightenIcon from '@mui/icons-material/Straighten';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ShareIcon from '@mui/icons-material/Share';
import LanguageIcon from '@mui/icons-material/Language';
import { getApiBase } from '../utils/api';

const API_BASE = getApiBase();

/** API serves /uploads and /images (see backend server.js); paths are absolute on API origin. */
function resolveServiceImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const root = API_BASE.replace(/\/api\/v\d+$/i, '');
  const p = url.startsWith('/') ? url : `/${url}`;
  return `${root}${p}`;
}

// Map platform name → MUI icon component
function getSocialIcon(platform, color, size = 18) {
  const sx = { fontSize: size, color };
  const p = (platform || '').toLowerCase();
  if (p === 'facebook')  return <FacebookIcon sx={sx} />;
  if (p === 'instagram') return <InstagramIcon sx={sx} />;
  if (p === 'twitter')   return <TwitterIcon sx={sx} />;
  if (p === 'youtube')   return <YouTubeIcon sx={sx} />;
  if (p === 'linkedin')  return <LinkedInIcon sx={sx} />;
  if (p === 'pinterest') return <PinterestIcon sx={sx} />;
  if (p === 'tiktok' || p === 'snapchat' || p === 'whatsapp') return <ShareIcon sx={sx} />;
  return <LanguageIcon sx={sx} />;
}

const NAV_LINKS = [
  { label: 'Tailor Shops', path: '/tailor-shops' },
  { label: 'Tailors', path: '/All-tailers' },
  { label: 'Promotions', path: '/promotions' },
  { label: 'Insights', path: '/blog' },
];

// Icon mapping for services
const iconMap = {
  CustomDresses: <CheckroomIcon sx={{ color: '#1310ca', fontSize: 22 }} />,
  Suits: <StraightenIcon sx={{ color: '#1310ca', fontSize: 22 }} />,
  Traditional: <AutoAwesomeIcon sx={{ color: '#1310ca', fontSize: 22 }} />,
  Alterations: <ContentCutOutlinedIcon sx={{ color: '#1310ca', fontSize: 22 }} />,
};

function getAutoCategoryIconKey(categoryName) {
  const n = String(categoryName || '').toLowerCase();
  if (/(suit|blazer|coat|formal|corporate|waistcoat)/.test(n)) return 'Suits';
  if (/(traditional|ethnic|shalwar|kurta|sherwani|lehenga|bridal|wedding)/.test(n)) return 'Traditional';
  if (/(alter|repair|fitting|hemming|stitch fix|resize|adjust)/.test(n)) return 'Alterations';
  if (/(dress|gown|frock|abaya|uniform|fashion|design|custom|boutique)/.test(n)) return 'CustomDresses';
  return 'Alterations';
}

function Header() {
  const navigate = useNavigate();
  const [megaOpen, setMegaOpen]         = useState(false);
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [userAnchor, setUserAnchor]     = useState(null);
  const [user, setUser]                 = useState(null);
  const [socialLinks, setSocialLinks]   = useState([]);
  const [servicesMenu, setServicesMenu] = useState([]);
  const [brokenTailorImages, setBrokenTailorImages] = useState(() => new Set());

  /* Read user from localStorage on mount + on storage changes */
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('user');
        setUser(raw ? JSON.parse(raw) : null);
      } catch { setUser(null); }
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  /* Fetch social media links for header from DB */
  useEffect(() => {
    fetch(`${API_BASE}/social-media`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setSocialLinks((data.data || []).filter(l => l.show_header && l.is_active));
        }
      })
      .catch(() => {});
  }, []);

  /* Tailor Services mega menu: active CA/SUB categories from admin (/ca-sub/category), same source as public API */
  useEffect(() => {
    fetch(`${API_BASE}/ca-sub/categories/public`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          const mapped = data.data.map((c) => ({
            key: `catalog-cat-${c.id}`,
            icon: getAutoCategoryIconKey(c.name),
            label: c.name,
            path: `/tailor-services/category/${c.id}`,
            desc: (c.description && String(c.description).trim()) || 'Tailors in this catalogue category',
            color: '#1310ca',
            imageUrl: null,
          }));
          setServicesMenu(mapped);
        } else {
          setServicesMenu([]);
        }
      })
      .catch(() => {
        setServicesMenu([]);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setUserAnchor(null);
    navigate('/home');
  };

  const handleDashboard = () => {
    setUserAnchor(null);
    navigate(user?.role === 'tailor' ? '/tailor-dashboard' : '/customer-dashboard');
  };

  /* Avatar initials */
  const initials = user
    ? `${(user.firstName || user.name || user.email || 'U')[0]}`.toUpperCase()
    : 'U';

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200 }}>
      <AppBar position="static" elevation={0} sx={{
        bgcolor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 0.5, minHeight: '60px !important' }}>

            {/* Logo */}
            <Box onClick={() => navigate('/home')} sx={{
              display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexShrink: 0,
            }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: '8px',
                bgcolor: '#2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ContentCutIcon sx={{ color: '#fff', fontSize: 16 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a2e', lineHeight: 1.1 }}>
                  StitchyFlow
                </Typography>
                <Typography sx={{ fontSize: '0.58rem', color: '#9ca3af', lineHeight: 1, letterSpacing: '0.04em' }}>
                  Just Click to Tailoring Services
                </Typography>
              </Box>
            </Box>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {/* Tailor Services trigger */}
              <Button
                endIcon={<KeyboardArrowDownIcon sx={{
                  fontSize: 16,
                  transform: megaOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }} />}
                onClick={() => setMegaOpen((v) => !v)}
                sx={{
                  color: megaOpen ? '#2563eb' : '#374151',
                  fontWeight: 500, fontSize: '0.85rem',
                  textTransform: 'none', px: 1.5,
                  bgcolor: megaOpen ? '#eff6ff' : 'transparent',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#eff6ff', color: '#2563eb' },
                }}>
                Tailor Services
              </Button>

              {NAV_LINKS.map((link) => (
                <Button key={link.label} onClick={() => navigate(link.path)}
                  sx={{
                    color: '#374151', fontWeight: 500, fontSize: '0.85rem',
                    textTransform: 'none', px: 1.5, borderRadius: '8px',
                    '&:hover': { bgcolor: '#f9fafb', color: '#2563eb' },
                  }}>
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Right Actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>

              {/* Dynamic Social Media Icons (header) */}
              {socialLinks.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 0.5 }}>
                  {socialLinks.map(link => (
                    <Tooltip key={link.id} title={link.label} arrow>
                      <IconButton
                        size="small"
                        component="a"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          p: 0.6,
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          color: link.color || '#374151',
                          '&:hover': { bgcolor: (link.color || '#2563eb') + '15', borderColor: link.color || '#2563eb' },
                          transition: 'all 0.18s',
                        }}
                      >
                        {getSocialIcon(link.platform, link.color || '#374151', 16)}
                      </IconButton>
                    </Tooltip>
                  ))}
                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
                </Box>
              )}
              {user ? (
                /* ── Logged-in: avatar + dropdown ── */
                <>
                  <Box
                    onClick={(e) => setUserAnchor(e.currentTarget)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1,
                      cursor: 'pointer', borderRadius: '10px',
                      px: 1, py: 0.5,
                      transition: 'background 0.18s',
                      '&:hover': { bgcolor: '#eff6ff' },
                    }}
                  >
                    <Avatar
                      src={user.avatar || user.profileImage || undefined}
                      sx={{
                        width: 34, height: 34,
                        bgcolor: '#2563eb',
                        fontSize: '0.88rem', fontWeight: 700,
                        border: '2px solid #e0e7ff',
                      }}>
                      {initials}
                    </Avatar>
                    <Typography sx={{
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: '#1a1a2e',
                      maxWidth: 90,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {user.firstName || user.name?.split(' ')[0] || 'Account'}
                    </Typography>
                    <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                  </Box>

                  {/* User dropdown menu */}
                  <Menu
                    anchorEl={userAnchor}
                    open={Boolean(userAnchor)}
                    onClose={() => setUserAnchor(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.2, minWidth: 220,
                        borderRadius: '14px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        overflow: 'visible',
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: -6, right: 16,
                          width: 12, height: 12,
                          bgcolor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderBottom: 'none', borderRight: 'none',
                          transform: 'rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}>

                    {/* User info header */}
                    <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={user.avatar || user.profileImage || undefined}
                          sx={{ width: 40, height: 40, bgcolor: '#2563eb', fontSize: '1rem', fontWeight: 700 }}>
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e', lineHeight: 1.2 }}>
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.name || user.email}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', lineHeight: 1.3 }}>
                            {user.email}
                          </Typography>
                          <Box sx={{
                            display: 'inline-block', mt: 0.4,
                            px: 1, py: 0.1,
                            bgcolor: user.role === 'tailor' ? '#fef3c7' : '#eff6ff',
                            color: user.role === 'tailor' ? '#d97706' : '#2563eb',
                            borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700,
                            textTransform: 'capitalize',
                          }}>
                            {user.role || 'Customer'}
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ mx: 1 }}/>

                    <MenuItem onClick={handleDashboard} sx={{
                      mx: 1, my: 0.5, borderRadius: '8px',
                      fontSize: '0.85rem', fontWeight: 500, color: '#374151',
                      gap: 1.5,
                      '&:hover': { bgcolor: '#eff6ff', color: '#2563eb' },
                    }}>
                      <DashboardOutlinedIcon sx={{ fontSize: 18 }}/>
                      My Dashboard
                    </MenuItem>

                    <MenuItem onClick={() => { setUserAnchor(null); navigate('/customer-dashboard'); }} sx={{
                      mx: 1, my: 0.5, borderRadius: '8px',
                      fontSize: '0.85rem', fontWeight: 500, color: '#374151',
                      gap: 1.5,
                      '&:hover': { bgcolor: '#eff6ff', color: '#2563eb' },
                    }}>
                      <PersonOutlineIcon sx={{ fontSize: 18 }}/>
                      My Profile
                    </MenuItem>

                    <Divider sx={{ mx: 1, my: 0.5 }}/>

                    <MenuItem onClick={handleLogout} sx={{
                      mx: 1, my: 0.5, mb: 1, borderRadius: '8px',
                      fontSize: '0.85rem', fontWeight: 600, color: '#ef4444',
                      gap: 1.5,
                      '&:hover': { bgcolor: '#fef2f2' },
                    }}>
                      <LogoutIcon sx={{ fontSize: 18 }}/>
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                /* ── Guest: Sign In + List Your Business ── */
                <>
                  <Button onClick={() => navigate('/login')}
                    sx={{
                      color: '#374151', fontWeight: 500, fontSize: '0.85rem',
                      textTransform: 'none', px: 1.5,
                      '&:hover': { color: '#2563eb' },
                    }}>
                    Sign In
                  </Button>
                  <Button variant="contained" onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: '#2563eb', color: '#fff',
                      fontWeight: 700, fontSize: '0.85rem',
                      textTransform: 'none',
                      borderRadius: '8px', px: 2.5, py: 0.9,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' },
                    }}>
                    List Your Business
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile */}
            <IconButton sx={{ display: { xs: 'flex', md: 'none' } }}
              onClick={(e) => setMobileAnchor(e.currentTarget)}>
              <MenuIcon sx={{ color: '#374151' }} />
            </IconButton>
            <Menu anchorEl={mobileAnchor} open={Boolean(mobileAnchor)}
              onClose={() => setMobileAnchor(null)}
              PaperProps={{ sx: { width: 240, borderRadius: '12px', mt: 1 } }}>
              {servicesMenu.length > 0 ? (
                servicesMenu.map((item) => (
                  <MenuItem key={item.key || item.label}
                    onClick={() => { setMobileAnchor(null); navigate(item.path); }}
                    sx={{ fontSize: '0.85rem' }}>
                    {item.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled sx={{ fontSize: '0.85rem', opacity: 0.8 }}>
                  Category Not Available
                </MenuItem>
              )}
              <Divider />
              {NAV_LINKS.map((link) => (
                <MenuItem key={link.label}
                  onClick={() => { setMobileAnchor(null); navigate(link.path); }}
                  sx={{ fontSize: '0.85rem' }}>
                  {link.label}
                </MenuItem>
              ))}
              <Divider />
              {user ? (
                [
                  <MenuItem key="dash" onClick={() => { setMobileAnchor(null); handleDashboard(); }} sx={{ fontSize: '0.85rem', gap: 1 }}>
                    <DashboardOutlinedIcon sx={{ fontSize: 18, color: '#2563eb' }}/> My Dashboard
                  </MenuItem>,
                  <MenuItem key="logout" onClick={() => { setMobileAnchor(null); handleLogout(); }} sx={{ fontSize: '0.85rem', color: '#ef4444', gap: 1 }}>
                    <LogoutIcon sx={{ fontSize: 18 }}/> Sign Out
                  </MenuItem>,
                ]
              ) : (
                [
                  <MenuItem key="signin" onClick={() => { setMobileAnchor(null); navigate('/login'); }} sx={{ fontSize: '0.85rem' }}>Sign In</MenuItem>,
                  <MenuItem key="register" onClick={() => { setMobileAnchor(null); navigate('/register'); }}
                    sx={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700 }}>
                    List Your Business
                  </MenuItem>,
                ]
              )}
            </Menu>

          </Toolbar>
        </Container>
      </AppBar>

      {/* Mega Menu Panel */}
      <Fade in={megaOpen}>
        <Box
          sx={{
            display: megaOpen ? 'block' : 'none',
            bgcolor: '#fff',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            width: '598px',
            maxHeight: 'none',
            overflow: 'visible',
            borderRadius: '0 0 12px 12px',
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1100,
          }}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <Container sx={{ pt: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                Tailor Services
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                {servicesMenu.length} categories
              </Typography>
            </Box>
            {servicesMenu.length > 0 ? (
              <Grid container spacing={2}>
                {servicesMenu.map((item) => (
                  <Grid item xs={12} sm={6} md={6} key={item.key || item.label}>
                    <Paper elevation={0} onClick={() => { setMegaOpen(false); navigate(item.path); }}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 1.2,
                        p: 2, borderRadius: '12px',
                        border: '1px solid #f3f4f6',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        '&:hover': {
                          bgcolor: '#eff6ff',
                          borderColor: '#bfdbfe',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
                        },
                      }}>
                      <Box sx={{
                        width: 44, height: 44, borderRadius: '10px',
                        bgcolor: item.color ? item.color + '15' : '#f8fafc',
                        color: item.color || '#2563eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, 
                        overflow: 'hidden',
                      }}>
                        {item.imageUrl && !brokenTailorImages.has(`${item.label}|${item.imageUrl}`) ? (
                          <Avatar
                            src={resolveServiceImageUrl(item.imageUrl)}
                            variant="rounded"
                            sx={{ width: 44, height: 44 }}
                            imgProps={{
                              loading: 'lazy',
                              decoding: 'async',
                              onError: () => {
                                setBrokenTailorImages((prev) => new Set(prev).add(`${item.label}|${item.imageUrl}`));
                              },
                            }}
                          />
                        ) : (
                          iconMap[item.icon] || <ContentCutIcon sx={{ fontSize: 22, color: '#1310ca' }} />
                        )}
                      </Box>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.2 }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  border: '1px dashed #d1d5db',
                  borderRadius: '12px',
                  py: 4,
                  px: 2,
                  textAlign: 'center',
                  color: '#6b7280',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Category Not Available
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      </Fade>

      {/* Backdrop to close mega menu */}
      {megaOpen && (
        <Box onClick={() => setMegaOpen(false)}
          sx={{ position: 'fixed', inset: 0, zIndex: -1 }} />
      )}
    </Box>
  );
}

export default Header;
