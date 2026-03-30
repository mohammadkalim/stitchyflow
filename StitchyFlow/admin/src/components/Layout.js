import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon,
  ShoppingCart as OrdersIcon, ContentCut as TailorsIcon,
  Straighten as MeasurementsIcon, Payment as PaymentIcon,
  Assessment as ReportsIcon, Settings as SettingsIcon,
  ExitToApp as LogoutIcon, Air as AirDamIcon, Checkroom as AirCoatsIcon, LocalFlorist as FlowerBandIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Tailors', icon: <TailorsIcon />, path: '/tailors' },
  { text: 'Measurements', icon: <MeasurementsIcon />, path: '/measurements' },
  { text: 'Air Dam', icon: <AirDamIcon />, path: '/air-dam' },
  { text: 'Air Coats', icon: <AirCoatsIcon />, path: '/air-coats' },
  { text: 'Flower Band', icon: <FlowerBandIcon />, path: '/flower-band' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
];

function Layout({ children, title }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        bgcolor: '#ffffff', 
        color: '#1a1a2e', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderBottom: 'none'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2, '&:hover': { bgcolor: '#f0f0f0' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>S</Typography>
              </Box>
              <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                StitchyFlow
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>Admin</Typography>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#2196F3', fontSize: '0.9rem', fontWeight: 600 }}>A</Avatar>
            <IconButton onClick={handleLogout} sx={{ '&:hover': { bgcolor: '#ffebee' } }}>
              <LogoutIcon sx={{ color: '#666' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 72,
            boxSizing: 'border-box',
            bgcolor: '#ffffff',
            borderRight: '1px solid #e8e8e8',
            transition: 'width 0.25s ease',
            overflowX: 'hidden'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', py: 2 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 44,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2,
                    borderRadius: '8px',
                    mx: 0.5,
                    bgcolor: location.pathname === item.path ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                    background: location.pathname === item.path ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                    color: location.pathname === item.path ? '#ffffff' : '#4a4a6a',
                    '&:hover': {
                      bgcolor: location.pathname === item.path ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' : '#f0f7ff'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? '#ffffff' : '#2196F3'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                          opacity: open ? 1 : 0, 
                          '& .MuiTypography-root': { 
                            fontSize: '0.875rem', 
                            fontWeight: location.pathname === item.path ? 600 : 500 
                          } 
                        }} 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        <Toolbar />
        <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
            {title}
          </Typography>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
