import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon, People as PeopleIcon,
  ShoppingCart as OrdersIcon, ContentCut as TailorsIcon,
  Straighten as MeasurementsIcon, Payment as PaymentIcon,
  Assessment as ReportsIcon, Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Tailors', icon: <TailorsIcon />, path: '/tailors' },
  { text: 'Measurements', icon: <MeasurementsIcon />, path: '/measurements' },
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
    <Box sx={{ display: 'flex', bgcolor: '#ffffff', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#ffffff', color: '#000' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2 }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            StitchyFlow Admin Panel
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            boxSizing: 'border-box',
            bgcolor: '#ffffff',
            borderRight: '1px solid #e0e0e0',
            transition: 'width 0.3s'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    bgcolor: location.pathname === item.path ? '#2196F3' : 'transparent',
                    color: location.pathname === item.path ? '#ffffff' : '#000',
                    '&:hover': {
                      bgcolor: location.pathname === item.path ? '#1976d2' : '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? '#ffffff' : '#2196F3'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#ffffff' }}>
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#000' }}>
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
