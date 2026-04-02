import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Menu, MenuItem, Divider, Paper, Grid, Fade, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import StraightenIcon from '@mui/icons-material/Straighten';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const NAV_LINKS = [
  { label: 'Tailors',    path: '/marketplace/custom-dresses' },
  { label: 'Promotions', path: '/promotions' },
  { label: 'Insights',   path: '/blog' },
];

const SERVICES_MENU = [
  { icon: <CheckroomIcon sx={{ color: '#2563eb', fontSize: 22 }} />,         label: 'Custom Dresses',   path: '/marketplace/custom-dresses',   desc: 'Tailored to your exact measurements' },
  { icon: <StraightenIcon sx={{ color: '#7c3aed', fontSize: 22 }} />,        label: 'Suits & Blazers',  path: '/marketplace/suits-blazers',    desc: 'Sharp formal & corporate wear' },
  { icon: <AutoAwesomeIcon sx={{ color: '#f59e0b', fontSize: 22 }} />,       label: 'Traditional Wear', path: '/marketplace/traditional-wear', desc: 'Authentic Pakistani heritage styles' },
  { icon: <ContentCutOutlinedIcon sx={{ color: '#10b981', fontSize: 22 }} />,label: 'Alterations',      path: '/marketplace/alterations',      desc: 'Perfect fit for existing clothes' },
];

function Header() {
  const navigate = useNavigate();
  const [megaOpen, setMegaOpen]       = useState(false);
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [userAnchor, setUserAnchor]   = useState(null);
  const [user, setUser]               = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
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
              {SERVICES_MENU.map((item) => (
                <MenuItem key={item.label}
                  onClick={() => { setMobileAnchor(null); navigate(item.path); }}
                  sx={{ fontSize: '0.85rem' }}>
                  {item.label}
                </MenuItem>
              ))}
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
          }}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <Container maxWidth="xl" sx={{ pt: 4, pb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                Tailor Services
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                {SERVICES_MENU.length} services
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {SERVICES_MENU.map((item) => (
                <Grid item xs={12} sm={6} md={6} key={item.label}>
                  <Paper elevation={0} onClick={() => { setMegaOpen(false); navigate(item.path); }}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
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
                      bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.2 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
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
