/**
 * Layout Component — Fully Mobile Responsive
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar,
  Menu, MenuItem, Chip, Collapse, useMediaQuery, useTheme, Divider
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
  Psychology as AIErrorIcon,
  Google as GoogleAuthIcon,
  Campaign as AdsIcon,
  Insights as InsightsIcon,
  Chat as ChatIcon,
  ManageSearch as LogsManagementIcon,
  GppGood as AuditLogsIcon,
  DevicesOther as SessionsIcon,
  CheckCircleOutline as ActiveSessionIcon,
  PauseCircleOutline as InactiveSessionIcon,
  DeleteOutline as DeletedSessionIcon,
  HourglassEmpty as PendingSessionIcon,
  HistoryToggleOff as SessionLogsIcon,
  AccountTree as CASubIcon,
  Label as SubcategoryIcon,
  Article as EmailTemplateIcon,
  Slideshow as SlideshowIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }
];

const userSubItems = [
  { text: 'All Users',       icon: <PeopleIcon />, path: '/users' },
  { text: 'Active Users',    icon: <PeopleIcon />, path: '/active-users' },
  { text: 'Deleted Users',   icon: <PeopleIcon />, path: '/deleted-users' },
  { text: 'Suspended Users', icon: <PeopleIcon />, path: '/suspended-users' }
];

const otherMenuItems = [
  { text: 'Orders',           icon: <OrdersIcon />,        path: '/orders' },
  { text: 'Measurements',     icon: <MeasurementsIcon />,  path: '/measurements', badge: 'NEW' },
  { text: 'Payments',         icon: <PaymentIcon />,       path: '/payments' },
  { text: 'Reports',          icon: <ReportsIcon />,       path: '/reports' },
  { text: 'Chat Management',  icon: <ChatIcon />,          path: '/chat', badge: 'NEW' },
  { text: 'Fabric Inventory', icon: <AirCoatsIcon />,      path: '/air-coats' },
  { text: 'Email Templates',  icon: <EmailTemplateIcon />, path: '/email-templates' }
];

const adsSubItems = [
  { text: 'Splash Ads',    icon: <AdsIcon />,      path: '/ads-management' },
  { text: 'Ads Analytics', icon: <InsightsIcon />, path: '/ads-analytics' }
];

const businessSubItems = [
  { text: 'Tailer Verifications',       icon: <VerificationIcon />,     path: '/business/tailer-verifications' },
  { text: 'Tailors Shops',              icon: <StoreIcon />,            path: '/business/tailors-shops' },
  { text: 'Business Settings',          icon: <BusinessSettingsIcon />, path: '/business/settings' },
  { text: 'Business Tailer Orders',     icon: <OrdersBusinessIcon />,   path: '/business/tailer-orders' },
  { text: 'Business Tailor Logs',       icon: <LogsIcon />,             path: '/business/tailor-logs' },
  { text: 'Business Tailors Status',    icon: <StatusIcon />,           path: '/business/tailors-status' },
  { text: 'Business Tailor Info/IP',    icon: <InfoIcon />,             path: '/business/tailor-information' },
  { text: 'Business Type Management',   icon: <CategoryIcon />,         path: '/business/business-types' },
  { text: 'Specialization Management',  icon: <SpecializationIcon />,   path: '/business/specializations' }
];

const adminSubItems = [
  { text: 'SMTP Settings',    icon: <SMTPIcon />,           path: '/smtp-settings' },
  { text: 'Admin Settings',   icon: <AdminSettingsIcon />,  path: '/admin-settings' },
  { text: 'Site Settings',    icon: <SiteSettingsIcon />,   path: '/site-settings' },
  { text: 'Site Maintenance', icon: <MaintenanceIcon />,    path: '/site-maintenance' },
  { text: 'AI Error Handling',icon: <AIErrorIcon />,        path: '/ai-error-handling', badge: 'AI' },
  { text: 'Google Login Auth',icon: <GoogleAuthIcon />,     path: '/google-auth', badge: 'NEW' },
];

const logsSubItems = [
  { text: 'Logs',       icon: <LogsIcon />,      path: '/logs/system' },
  { text: 'Audit Logs', icon: <AuditLogsIcon />, path: '/logs/audit' },
];

const sessionsSubItems = [
  { text: 'Active Sessions',   icon: <ActiveSessionIcon />,   path: '/sessions/active' },
  { text: 'Inactive Sessions', icon: <InactiveSessionIcon />, path: '/sessions/inactive' },
  { text: 'Sessions Logs',     icon: <SessionLogsIcon />,     path: '/sessions/logs' },
  { text: 'Deleted Sessions',  icon: <DeletedSessionIcon />,  path: '/sessions/deleted' },
  { text: 'Pending Sessions',  icon: <PendingSessionIcon />,  path: '/sessions/pending' },
];

const caSubItems = [
  { text: 'Category',    icon: <CategoryIcon />,    path: '/ca-sub/category' },
  { text: 'Subcategory', icon: <SubcategoryIcon />, path: '/ca-sub/subcategory' }
];

// ── Reusable nav item ─────────────────────────────────────────────────────────
function NavItem({ item, location, navigate, onNavigate, indent = false }) {
  const active = location.pathname === item.path;
  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={() => { navigate(item.path); onNavigate && onNavigate(); }}
        sx={{
          minHeight: indent ? 40 : 44,
          borderRadius: '8px',
          px: indent ? 1.5 : 2,
          py: indent ? 0.75 : 1,
          bgcolor: active ? '#E3F2FD' : 'transparent',
          color: active ? '#1976d2' : '#666',
          '&:hover': { bgcolor: active ? '#E3F2FD' : '#f5f5f5' }
        }}
      >
        <ListItemIcon sx={{ minWidth: indent ? 32 : 36, color: active ? '#1976d2' : '#999', '& svg': { fontSize: indent ? 18 : 20 } }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          sx={{ '& .MuiTypography-root': { fontSize: indent ? '0.8125rem' : '0.875rem', fontWeight: active ? 600 : 500 } }}
        />
        {item.badge && (
          <Chip
            label={item.badge}
            size="small"
            sx={{
              height: 18, fontSize: '0.6rem', fontWeight: 700,
              bgcolor: item.badge === 'AI' ? '#6366F1' : item.badge === 'NEW' ? '#4CAF50' : '#7c3aed',
              color: '#fff'
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
}

// ── Reusable collapsible group ────────────────────────────────────────────────
function NavGroup({ label, icon, items, location, navigate, onNavigate, chipLabel, chipColor }) {
  const isActive = items.some(i => location.pathname === i.path);
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  return (
    <>
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={() => setOpen(v => !v)}
          sx={{
            minHeight: 44, borderRadius: '8px', px: 2, py: 1,
            bgcolor: isActive ? '#E3F2FD' : 'transparent',
            color: isActive ? '#1976d2' : '#666',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#1976d2' : '#999', '& svg': { fontSize: 20 } }}>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={label}
            sx={{ '& .MuiTypography-root': { fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 } }}
          />
          {chipLabel && (
            <Chip label={chipLabel} size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: chipColor || '#f5f5f5', color: chipColor ? '#fff' : '#666', mr: 0.5 }} />
          )}
          {open ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ pl: 2 }}>
          {items.map(item => (
            <NavItem key={item.text} item={item} location={location} navigate={navigate} onNavigate={onNavigate} indent />
          ))}
        </List>
      </Collapse>
    </>
  );
}

// ── Sidebar content ───────────────────────────────────────────────────────────
function SidebarContent({ location, navigate, onNavigate }) {
  return (
    <Box sx={{ overflow: 'auto', py: 2, height: '100%' }}>
      <List sx={{ px: 2 }}>
        {/* Dashboard */}
        {menuItems.map(item => (
          <NavItem key={item.text} item={item} location={location} navigate={navigate} onNavigate={onNavigate} />
        ))}

        {/* Users */}
        <NavGroup label="Users" icon={<PeopleIcon />} items={userSubItems}
          location={location} navigate={navigate} onNavigate={onNavigate} />

        {/* Sessions */}
        <NavGroup label="Sessions" icon={<SessionsIcon />} items={sessionsSubItems}
          location={location} navigate={navigate} onNavigate={onNavigate}
          chipLabel="5" chipColor="#0284c7" />

        {/* CA/SUB */}
        <NavGroup label="CA/SUB" icon={<CASubIcon />} items={caSubItems}
          location={location} navigate={navigate} onNavigate={onNavigate} />

        {/* Business */}
        <NavGroup label="Business" icon={<BusinessIcon />} items={businessSubItems}
          location={location} navigate={navigate} onNavigate={onNavigate} />

        {/* Other items */}
        {otherMenuItems.map(item => (
          <NavItem key={item.text} item={item} location={location} navigate={navigate} onNavigate={onNavigate} />
        ))}

        {/* Splash Ads */}
        <NavGroup label="Splash Ads" icon={<AdsIcon />} items={adsSubItems}
          location={location} navigate={navigate} onNavigate={onNavigate} />

        {/* Slider Media */}
        <NavItem
          item={{ text: 'Slider Media', icon: <SlideshowIcon />, path: '/slider-media', badge: 'NEW' }}
          location={location} navigate={navigate} onNavigate={onNavigate}
        />

        {/* Administration */}
        <NavGroup label="Administration" icon={<AdminSettingsIcon />} items={adminSubItems}
          location={location} navigate={navigate} onNavigate={onNavigate} />

        {/* Logs Management */}
        <NavGroup label="Logs Management" icon={<LogsManagementIcon />} items={logsSubItems}
          location={location} navigate={navigate} onNavigate={onNavigate} />

        {/* Settings */}
        <NavItem
          item={{ text: 'Settings', icon: <SettingsIcon />, path: '/settings' }}
          location={location} navigate={navigate} onNavigate={onNavigate}
        />
      </List>

      <Box sx={{ px: 3, mt: 2, pb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', fontSize: '0.875rem' }}>
          Need Help?
        </Typography>
        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
          Contact: info@logixinventor.com
        </Typography>
      </Box>
    </Box>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
function Layout({ children, title }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>

      {/* ── Top AppBar ── */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: '#ffffff',
          color: '#1a1a2e',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderBottom: '1px solid #e8eaed'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: '56px !important', sm: '64px !important' } }}>

          {/* Left: Hamburger (mobile) + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(v => !v)}
                sx={{ color: '#374151', mr: 0.5 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{
              width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 },
              borderRadius: '10px', background: '#1976d2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: '1rem', sm: '1.2rem' } }}>S</Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem', lineHeight: 1.2 }}>
                StitchyFlow
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                Admin Panel
              </Typography>
            </Box>
          </Box>

          {/* Right: Icons + Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            <IconButton sx={{ color: '#666', display: { xs: 'none', sm: 'flex' } }}>
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ color: '#666' }}>
              <Box sx={{ position: 'relative' }}>
                <NotificationsIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                <Box sx={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336' }} />
              </Box>
            </IconButton>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar sx={{ width: { xs: 30, sm: 36 }, height: { xs: 30, sm: 36 }, bgcolor: '#1976d2', fontSize: '0.9rem', fontWeight: 600 }}>
                A
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', fontSize: '0.875rem', lineHeight: 1.2 }}>
                  Admin User
                </Typography>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                  admin@stitchyflow.com
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Profile dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1.5, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 220, border: '1px solid #e8eaed' } }}
          >
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e8eaed' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#1976d2', fontSize: '1rem', fontWeight: 600 }}>A</Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', fontSize: '0.875rem' }}>Admin User</Typography>
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>admin@stitchyflow.com</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ py: 1 }}>
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}
                sx={{ py: 1.5, px: 2.5, gap: 1.5, '&:hover': { bgcolor: '#f5f5f5' } }}>
                <PersonIcon sx={{ color: '#666', fontSize: 20 }} />
                <Typography sx={{ color: '#333', fontWeight: 500, fontSize: '0.875rem' }}>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}
                sx={{ py: 1.5, px: 2.5, gap: 1.5, '&:hover': { bgcolor: '#f5f5f5' } }}>
                <SettingsIcon sx={{ color: '#666', fontSize: 20 }} />
                <Typography sx={{ color: '#333', fontWeight: 500, fontSize: '0.875rem' }}>Settings</Typography>
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout}
                sx={{ py: 1.5, px: 2.5, gap: 1.5, '&:hover': { bgcolor: '#ffebee' } }}>
                <LogoutIcon sx={{ color: '#f44336', fontSize: 20 }} />
                <Typography sx={{ color: '#f44336', fontWeight: 500, fontSize: '0.875rem' }}>Sign out</Typography>
              </MenuItem>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ── Mobile Drawer (temporary) ── */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#ffffff',
            borderRight: '1px solid #e8eaed',
          }
        }}
      >
        {/* Mobile drawer header */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2, py: 1.5, borderBottom: '1px solid #e8eaed',
          minHeight: 56
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>S</Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.95rem' }}>StitchyFlow</Typography>
          </Box>
          <IconButton size="small" onClick={() => setMobileOpen(false)} sx={{ color: '#666' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <SidebarContent location={location} navigate={navigate} onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      {/* ── Desktop Drawer (permanent) ── */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
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
        <SidebarContent location={location} navigate={navigate} />
      </Drawer>

      {/* ── Main Content ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          minWidth: 0,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '56px !important', sm: '64px !important' } }} />
        <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
