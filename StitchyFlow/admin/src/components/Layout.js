import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar,
  Menu, MenuItem, Chip, Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon, People as PeopleIcon,
  ShoppingCart as OrdersIcon, ContentCut as TailorsIcon,
  Straighten as MeasurementsIcon, Payment as PaymentIcon,
  Assessment as ReportsIcon, Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Checkroom as AirCoatsIcon,
  ExpandMore, ExpandLess,
  AdminPanelSettings as AdminSettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Email as SMTPIcon,
  Language as SiteSettingsIcon,
  Build as MaintenanceIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  VerifiedUser as VerificationIcon,
  Store as StoreIcon,
  BusinessCenter as BusinessSettingsIcon,
  Receipt as OrdersBusinessIcon,
  History as LogsIcon,
  CheckCircle as StatusIcon,
  Info as InfoIcon,
  Category as CategoryIcon,
  Stars as SpecializationIcon,
  Psychology as AIErrorIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }
];

const userSubItems = [
  { text: 'All Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Active Users', icon: <PeopleIcon />, path: '/active-users' },
  { text: 'Deleted Users', icon: <PeopleIcon />, path: '/deleted-users' },
  { text: 'Suspended Users', icon: <PeopleIcon />, path: '/suspended-users' }
];

const otherMenuItems = [
  { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Measurements', icon: <MeasurementsIcon />, path: '/measurements', badge: 'NEW' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Fabric Inventory', icon: <AirCoatsIcon />, path: '/air-coats' }
];

const businessSubItems = [
  { text: 'Tailer Verifications', icon: <VerificationIcon />, path: '/business/tailer-verifications' },
  { text: 'Tailors Shops', icon: <StoreIcon />, path: '/business/tailors-shops' },
  { text: 'Business Settings', icon: <BusinessSettingsIcon />, path: '/business/settings' },
  { text: 'Business Tailer Orders', icon: <OrdersBusinessIcon />, path: '/business/tailer-orders' },
  { text: 'Business Tailor Logs', icon: <LogsIcon />, path: '/business/tailor-logs' },
  { text: 'Business Tailors Status', icon: <StatusIcon />, path: '/business/tailors-status' },
  { text: 'Business Tailor Information/IP', icon: <InfoIcon />, path: '/business/tailor-information' },
  { text: 'Business Type Management', icon: <CategoryIcon />, path: '/business/business-types' },
  { text: 'Specialization Management', icon: <SpecializationIcon />, path: '/business/specializations' }
];

const adminSubItems = [
  { text: 'SMTP Settings', icon: <SMTPIcon />, path: '/smtp-settings' },
  { text: 'Admin Settings', icon: <AdminSettingsIcon />, path: '/admin-settings' },
  { text: 'Site Settings', icon: <SiteSettingsIcon />, path: '/site-settings' },
  { text: 'Site Maintenance', icon: <MaintenanceIcon />, path: '/site-maintenance' },
  { text: 'AI Error Handling', icon: <AIErrorIcon />, path: '/ai-error-handling', badge: 'AI' }
];

function Layout({ children, title }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/settings');
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Top AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, 
          bgcolor: '#ffffff', 
          color: '#1a1a2e', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderBottom: '1px solid #e8eaed'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
          {/* Left: Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '10px', 
              background: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>S</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem', lineHeight: 1.2 }}>
                StitchyFlow
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                Admin Panel
              </Typography>
            </Box>
          </Box>

          {/* Right: Search, Notifications, Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: '#666' }}>
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ color: '#666' }}>
              <Box sx={{ position: 'relative' }}>
                <NotificationsIcon />
                <Box sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#f44336'
                }} />
              </Box>
            </IconButton>
            <Box 
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} 
              onClick={handleAvatarClick}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2', fontSize: '0.9rem', fontWeight: 600 }}>
                A
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', fontSize: '0.875rem', lineHeight: 1.2 }}>
                  Admin User
                </Typography>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                  admin@stitchyflow.com
                </Typography>
              </Box>
            </Box>
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
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                minWidth: '220px',
                border: '1px solid #e8eaed'
              }
            }}
          >
            {/* User Info Header */}
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e8eaed' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#1976d2', fontSize: '1rem', fontWeight: 600 }}>
                  A
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', fontSize: '0.875rem', lineHeight: 1.3 }}>
                    Admin User
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                    admin@stitchyflow.com
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Menu Items */}
            <Box sx={{ py: 1 }}>
              <MenuItem 
                onClick={handleProfileClick} 
                sx={{ 
                  py: 1.5, 
                  px: 2.5,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#666', fontSize: 20 }} />
                </ListItemIcon>
                <Typography sx={{ color: '#333', fontWeight: 500, fontSize: '0.875rem' }}>
                  Profile
                </Typography>
              </MenuItem>

              <MenuItem 
                onClick={handleSettingsClick} 
                sx={{ 
                  py: 1.5, 
                  px: 2.5,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon sx={{ color: '#666', fontSize: 20 }} />
                </ListItemIcon>
                <Typography sx={{ color: '#333', fontWeight: 500, fontSize: '0.875rem' }}>
                  Settings
                </Typography>
              </MenuItem>

              <Box sx={{ borderTop: '1px solid #e8eaed', mt: 1, pt: 1 }}>
                <MenuItem 
                  onClick={handleLogoutClick} 
                  sx={{ 
                    py: 1.5, 
                    px: 2.5,
                    '&:hover': {
                      bgcolor: '#ffebee'
                    }
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: '#f44336', fontSize: 20 }} />
                  </ListItemIcon>
                  <Typography sx={{ color: '#f44336', fontWeight: 500, fontSize: '0.875rem' }}>
                    Sign out
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#ffffff',
            borderRight: '1px solid #e8eaed',
            boxShadow: 'none'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', py: 2 }}>
          <List sx={{ px: 2 }}>
            {menuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 44,
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    bgcolor: location.pathname === item.path ? '#E3F2FD' : 'transparent',
                    color: location.pathname === item.path ? '#1976d2' : '#666',
                    '&:hover': {
                      bgcolor: location.pathname === item.path ? '#E3F2FD' : '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 36,
                    color: location.pathname === item.path ? '#1976d2' : '#999',
                    '& svg': { fontSize: 20 }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        fontSize: '0.875rem', 
                        fontWeight: location.pathname === item.path ? 600 : 500
                      } 
                    }} 
                  />
                  {item.badge && (
                    <Chip 
                      label={item.badge} 
                      size="small"
                      sx={{ 
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: item.badge === 'NEW' ? '#4CAF50' : item.badge === 'AI' ? '#6366F1' : '#f5f5f5',
                        color: item.badge === 'NEW' || item.badge === 'AI' ? '#fff' : '#666'
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}

            {/* Users with Submenu */}
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setUsersOpen(!usersOpen)}
                sx={{
                  minHeight: 44,
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  bgcolor: userSubItems.some(item => location.pathname === item.path) ? '#E3F2FD' : 'transparent',
                  color: userSubItems.some(item => location.pathname === item.path) ? '#1976d2' : '#666',
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: userSubItems.some(item => location.pathname === item.path) ? '#1976d2' : '#999',
                  '& svg': { fontSize: 20 }
                }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Users" 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: '0.875rem', 
                      fontWeight: userSubItems.some(item => location.pathname === item.path) ? 600 : 500
                    } 
                  }} 
                />
                <Chip 
                  label="1" 
                  size="small"
                  sx={{ 
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    bgcolor: '#f5f5f5',
                    color: '#666',
                    mr: 1
                  }}
                />
                {usersOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
              </ListItemButton>
            </ListItem>

            <Collapse in={usersOpen} timeout="auto" unmountOnExit>
              <List disablePadding sx={{ pl: 2 }}>
                {userSubItems.map((item) => (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        minHeight: 40,
                        borderRadius: '8px',
                        px: 2,
                        py: 0.75,
                        bgcolor: location.pathname === item.path ? '#E3F2FD' : 'transparent',
                        color: location.pathname === item.path ? '#1976d2' : '#666',
                        '&:hover': {
                          bgcolor: location.pathname === item.path ? '#E3F2FD' : '#f5f5f5'
                        }
                      }}
                    >
                      <ListItemIcon sx={{
                        minWidth: 32,
                        color: location.pathname === item.path ? '#1976d2' : '#999',
                        '& svg': { fontSize: 18 }
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        sx={{ 
                          '& .MuiTypography-root': { 
                            fontSize: '0.8125rem', 
                            fontWeight: location.pathname === item.path ? 600 : 500
                          } 
                        }} 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>

            {/* Other Menu Items */}
            {otherMenuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 44,
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    bgcolor: location.pathname === item.path ? '#E3F2FD' : 'transparent',
                    color: location.pathname === item.path ? '#1976d2' : '#666',
                    '&:hover': {
                      bgcolor: location.pathname === item.path ? '#E3F2FD' : '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 36,
                    color: location.pathname === item.path ? '#1976d2' : '#999',
                    '& svg': { fontSize: 20 }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        fontSize: '0.875rem', 
                        fontWeight: location.pathname === item.path ? 600 : 500
                      } 
                    }} 
                  />
                  {item.badge && (
                    <Chip 
                      label={item.badge} 
                      size="small"
                      sx={{ 
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: item.badge === 'NEW' ? '#4CAF50' : '#f5f5f5',
                        color: item.badge === 'NEW' ? '#fff' : '#666'
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}

            {/* Business with Submenu */}
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setBusinessOpen(!businessOpen)}
                sx={{
                  minHeight: 44,
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  bgcolor: businessSubItems.some(item => location.pathname === item.path) ? '#E3F2FD' : 'transparent',
                  color: businessSubItems.some(item => location.pathname === item.path) ? '#1976d2' : '#666',
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: businessSubItems.some(item => location.pathname === item.path) ? '#1976d2' : '#999',
                  '& svg': { fontSize: 20 }
                }}>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Business" 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: '0.875rem', 
                      fontWeight: businessSubItems.some(item => location.pathname === item.path) ? 600 : 500
                    } 
                  }} 
                />
                {businessOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
              </ListItemButton>
            </ListItem>

            <Collapse in={businessOpen} timeout="auto" unmountOnExit>
              <List disablePadding sx={{ pl: 2 }}>
                {businessSubItems.map((item) => (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        minHeight: 40,
                        borderRadius: '8px',
                        px: 2,
                        py: 0.75,
                        bgcolor: location.pathname === item.path ? '#E3F2FD' : 'transparent',
                        color: location.pathname === item.path ? '#1976d2' : '#666',
                        '&:hover': {
                          bgcolor: location.pathname === item.path ? '#E3F2FD' : '#f5f5f5'
                        }
                      }}
                    >
                      <ListItemIcon sx={{
                        minWidth: 32,
                        color: location.pathname === item.path ? '#1976d2' : '#999',
                        '& svg': { fontSize: 18 }
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        sx={{ 
                          '& .MuiTypography-root': { 
                            fontSize: '0.8125rem', 
                            fontWeight: location.pathname === item.path ? 600 : 500
                          } 
                        }} 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>

            {/* Administration with Submenu */}
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setAdminOpen(!adminOpen)}
                sx={{
                  minHeight: 44,
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  bgcolor: adminSubItems.some(item => location.pathname === item.path) ? '#E3F2FD' : 'transparent',
                  color: adminSubItems.some(item => location.pathname === item.path) ? '#1976d2' : '#666',
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: adminSubItems.some(item => location.pathname === item.path) ? '#1976d2' : '#999',
                  '& svg': { fontSize: 20 }
                }}>
                  <AdminSettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Administration" 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: '0.875rem', 
                      fontWeight: adminSubItems.some(item => location.pathname === item.path) ? 600 : 500
                    } 
                  }} 
                />
                {adminOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
              </ListItemButton>
            </ListItem>

            <Collapse in={adminOpen} timeout="auto" unmountOnExit>
              <List disablePadding sx={{ pl: 2 }}>
                {adminSubItems.map((item) => (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        minHeight: 40,
                        borderRadius: '8px',
                        px: 2,
                        py: 0.75,
                        bgcolor: location.pathname === item.path ? '#E3F2FD' : 'transparent',
                        color: location.pathname === item.path ? '#1976d2' : '#666',
                        '&:hover': {
                          bgcolor: location.pathname === item.path ? '#E3F2FD' : '#f5f5f5'
                        }
                      }}
                    >
                      <ListItemIcon sx={{
                        minWidth: 32,
                        color: location.pathname === item.path ? '#1976d2' : '#999',
                        '& svg': { fontSize: 18 }
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        sx={{ 
                          '& .MuiTypography-root': { 
                            fontSize: '0.8125rem', 
                            fontWeight: location.pathname === item.path ? 600 : 500
                          } 
                        }} 
                      />
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            bgcolor: item.badge === 'AI' ? '#6366F1' : '#4CAF50',
                            color: '#fff'
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>

            {/* Settings */}
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate('/settings')}
                sx={{
                  minHeight: 44,
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  bgcolor: location.pathname === '/settings' ? '#E3F2FD' : 'transparent',
                  color: location.pathname === '/settings' ? '#1976d2' : '#666',
                  '&:hover': {
                    bgcolor: location.pathname === '/settings' ? '#E3F2FD' : '#f5f5f5'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: location.pathname === '/settings' ? '#1976d2' : '#999',
                  '& svg': { fontSize: 20 }
                }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Settings" 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: '0.875rem', 
                      fontWeight: location.pathname === '/settings' ? 600 : 500
                    } 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          </List>

          {/* Need Help Section */}
          <Box sx={{ px: 3, mt: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', fontSize: '0.875rem' }}>
              Need Help?
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Toolbar />
        <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
