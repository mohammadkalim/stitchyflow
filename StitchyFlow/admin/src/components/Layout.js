import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Collapse,
  Menu, MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon,
  ShoppingCart as OrdersIcon, ContentCut as TailorsIcon,
  Straighten as MeasurementsIcon, Payment as PaymentIcon,
  Assessment as ReportsIcon, Settings as SettingsIcon,
  ExitToApp as LogoutIcon, Air as AirDamIcon, Checkroom as AirCoatsIcon, LocalFlorist as FlowerBandIcon,
  CheckCircle as ActiveIcon, Delete as DeletedIcon, Block as SuspendedIcon, Info as DetailsIcon, Person as InfoIcon,
  ExpandMore, ExpandLess, ChevronLeft, ChevronRight,
  Email as SMTPIcon, AdminPanelSettings as AdminSettingsIcon, Language as SiteSettingsIcon, Build as MaintenanceIcon, AddCircle as AddIcon
} from '@mui/icons-material';

const drawerWidth = 300;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Tailors', icon: <TailorsIcon />, path: '/tailors' },
  { text: 'Measurements', icon: <MeasurementsIcon />, path: '/measurements' },
  { text: 'Air Dam', icon: <AirDamIcon />, path: '/air-dam' },
  { text: 'Air Coats', icon: <AirCoatsIcon />, path: '/air-coats' },
  { text: 'Flower Band', icon: <FlowerBandIcon />, path: '/flower-band' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments' }
];

const userSubItems = [
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Active Users', icon: <ActiveIcon />, path: '/active-users' },
  { text: 'Deleted Users', icon: <DeletedIcon />, path: '/deleted-users' },
  { text: 'Suspended Users', icon: <SuspendedIcon />, path: '/suspended-users' },
  { text: 'Users Details', icon: <DetailsIcon />, path: '/users-details' },
  { text: 'User Information', icon: <InfoIcon />, path: '/user-information' }
];

const adminSubItems = [
  { text: 'SMTP Settings', icon: <SMTPIcon />, path: '/smtp-settings' },
  { text: 'Admin Settings', icon: <AdminSettingsIcon />, path: '/admin-settings' },
  { text: 'Site Settings', icon: <SiteSettingsIcon />, path: '/site-settings' },
  { text: 'Site Maintenance', icon: <MaintenanceIcon />, path: '/site-maintenance' },
  { text: 'Add More SMTP', icon: <AddIcon />, path: '/add-more-smtp' }
];

function Layout({ children, title }) {
  const [open, setOpen] = useState(true);
  const [usersOpen, setUsersOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleUsersToggle = () => {
    setUsersOpen(!usersOpen);
  };

  const handleAdminToggle = () => {
    setAdminOpen(!adminOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    handleLogout();
  };

  const isUserPage = userSubItems.some(item => location.pathname === item.path);
  const isAdminPage = adminSubItems.some(item => location.pathname === item.path);

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={handleAvatarClick}>
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>Admin</Typography>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#2196F3', fontSize: '0.9rem', fontWeight: 600 }}>A</Avatar>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                minWidth: '280px',
                overflow: 'hidden'
              }
            }}
          >
            <Box sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
              textAlign: 'center'
            }}>
              <Avatar sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: '#ffffff', 
                color: '#2196F3',
                fontSize: '1.5rem', 
                fontWeight: 700,
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>A</Avatar>
              <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
                Admin
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                admin@stitchyflow.com
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <MenuItem sx={{ py: 1.5, px: 2, borderRadius: '10px', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '10px', 
                    bgcolor: '#E3F2FD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography sx={{ color: '#2196F3', fontWeight: 700, fontSize: '0.9rem' }}>@</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem' }}>Username</Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>Admin</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem 
                onClick={handleLogoutClick} 
                sx={{ 
                  py: 1.5, 
                  px: 2, 
                  borderRadius: '10px',
                  '&:hover': { bgcolor: '#FFEBEE' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '10px', 
                    bgcolor: '#FFEBEE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <LogoutIcon sx={{ color: '#F44336', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ color: '#F44336', fontWeight: 600, fontSize: '0.95rem' }}>
                    Logout
                  </Typography>
                </Box>
              </MenuItem>
            </Box>
          </Menu>
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
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: open ? 'flex-end' : 'center' }}>
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ 
              bgcolor: '#f0f7ff',
              '&:hover': { bgcolor: '#e3f2fd' },
              width: 36,
              height: 36,
              transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <ChevronLeft sx={{ color: '#2196F3', fontSize: 24 }} />
          </IconButton>
        </Box>
        <Box sx={{ overflow: 'auto', py: 1 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <ListItemButton
                  onClick={() => { navigate(item.path); setOpen(true); }}
                  sx={{
                    minHeight: 50,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    py: 1,
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
                    mr: open ? 2.5 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? '#ffffff' : '#1a1a2e',
                    '& svg': { fontSize: 22 }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                          opacity: open ? 1 : 0, 
                          '& .MuiTypography-root': { 
                            fontSize: '0.95rem', 
                            fontWeight: location.pathname === item.path ? 600 : 500 
                          } 
                        }} 
                      />
                </ListItemButton>
              </ListItem>
            ))}

            <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton
                onClick={handleUsersToggle}
                sx={{
                  minHeight: 56,
                  justifyContent: open ? 'initial' : 'center',
                  px: 3,
                  py: 1.5,
                  borderRadius: '10px',
                  mx: 0.5,
                  bgcolor: isUserPage ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                  background: isUserPage ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                  color: isUserPage ? '#ffffff' : '#4a4a6a',
                  '&:hover': {
                    bgcolor: isUserPage ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' : '#f0f7ff'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isUserPage ? '#ffffff' : '#1a1a2e',
                  '& svg': { fontSize: 26 }
                }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Users" 
                  sx={{ 
                        opacity: open ? 1 : 0, 
                        '& .MuiTypography-root': { 
                          fontSize: '1.1rem', 
                          fontWeight: isUserPage ? 700 : 600 
                        } 
                      }} 
                />
                {open && (usersOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={usersOpen && open} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ pl: 2 }}>
                  {userSubItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}>
                      <ListItemButton
                        onClick={() => { navigate(item.path); setOpen(true); }}
                        sx={{
                          minHeight: 54,
                          justifyContent: open ? 'initial' : 'center',
                          px: 3,
                          py: 1.25,
                          borderRadius: '10px',
                          mx: 0.5,
                          bgcolor: location.pathname === item.path ? '#2196F3' : 'transparent',
                          color: location.pathname === item.path ? '#ffffff' : '#666',
                          '&:hover': {
                            bgcolor: location.pathname === item.path ? '#1976d2' : '#e3f2fd'
                          }
                        }}
                      >
                        <ListItemIcon sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: location.pathname === item.path ? '#ffffff' : '#1a1a2e',
                          '& svg': { fontSize: 24 }
                        }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          sx={{ 
                                opacity: open ? 1 : 0, 
                                '& .MuiTypography-root': { 
                                  fontSize: '1rem', 
                                  fontWeight: location.pathname === item.path ? 600 : 500 
                                } 
                              }} 
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton
                onClick={handleAdminToggle}
                sx={{
                  minHeight: 56,
                  justifyContent: open ? 'initial' : 'center',
                  px: 3,
                  py: 1.5,
                  borderRadius: '10px',
                  mx: 0.5,
                  bgcolor: isAdminPage ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                  background: isAdminPage ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                  color: isAdminPage ? '#ffffff' : '#4a4a6a',
                  '&:hover': {
                    bgcolor: isAdminPage ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' : '#f0f7ff'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isAdminPage ? '#ffffff' : '#1a1a2e',
                  '& svg': { fontSize: 26 }
                }}>
                  <AdminSettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Administration" 
                  sx={{ 
                        opacity: open ? 1 : 0, 
                        '& .MuiTypography-root': { 
                          fontSize: '1.1rem', 
                          fontWeight: isAdminPage ? 700 : 600 
                        } 
                      }} 
                />
                {open && (adminOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={adminOpen && open} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ pl: 2 }}>
                  {adminSubItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}>
                      <ListItemButton
                        onClick={() => { navigate(item.path); setOpen(true); }}
                        sx={{
                          minHeight: 54,
                          justifyContent: open ? 'initial' : 'center',
                          px: 3,
                          py: 1.25,
                          borderRadius: '10px',
                          mx: 0.5,
                          bgcolor: location.pathname === item.path ? '#2196F3' : 'transparent',
                          color: location.pathname === item.path ? '#ffffff' : '#666',
                          '&:hover': {
                            bgcolor: location.pathname === item.path ? '#1976d2' : '#e3f2fd'
                          }
                        }}
                      >
                        <ListItemIcon sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: location.pathname === item.path ? '#ffffff' : '#1a1a2e',
                          '& svg': { fontSize: 24 }
                        }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          sx={{ 
                                opacity: open ? 1 : 0, 
                                '& .MuiTypography-root': { 
                                  fontSize: '1rem', 
                                  fontWeight: location.pathname === item.path ? 600 : 500 
                                } 
                              }} 
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate('/reports'); setOpen(true); }}
                sx={{
                  minHeight: 50,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  py: 1,
                  borderRadius: '8px',
                  mx: 0.5,
                  bgcolor: location.pathname === '/reports' ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                  background: location.pathname === '/reports' ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                  color: location.pathname === '/reports' ? '#ffffff' : '#4a4a6a',
                  '&:hover': {
                    bgcolor: location.pathname === '/reports' ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' : '#f0f7ff'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2.5 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === '/reports' ? '#ffffff' : '#1a1a2e',
                  '& svg': { fontSize: 22 }
                }}>
                  <ReportsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Reports" 
                  sx={{ 
                        opacity: open ? 1 : 0, 
                        '& .MuiTypography-root': { 
                          fontSize: '0.95rem', 
                          fontWeight: location.pathname === '/reports' ? 600 : 500 
                        } 
                      }} 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate('/settings'); setOpen(true); }}
                sx={{
                  minHeight: 50,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  py: 1,
                  borderRadius: '8px',
                  mx: 0.5,
                  bgcolor: location.pathname === '/settings' ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                  background: location.pathname === '/settings' ? 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)' : 'transparent',
                  color: location.pathname === '/settings' ? '#ffffff' : '#4a4a6a',
                  '&:hover': {
                    bgcolor: location.pathname === '/settings' ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' : '#f0f7ff'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2.5 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === '/settings' ? '#ffffff' : '#1a1a2e',
                  '& svg': { fontSize: 22 }
                }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Settings" 
                  sx={{ 
                        opacity: open ? 1 : 0, 
                        '& .MuiTypography-root': { 
                          fontSize: '0.95rem', 
                          fontWeight: location.pathname === '/settings' ? 600 : 500 
                        } 
                      }} 
                />
              </ListItemButton>
            </ListItem>
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
