import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, Avatar, Button,
  Chip, Divider, List, ListItem, ListItemText, ListItemAvatar, LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import Header from '../components/Header';

const stats = [
  { label: 'Total Orders',   value: '0', icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 26, color: '#2563eb' }} />, bg: '#eff6ff', color: '#2563eb' },
  { label: 'Pending',        value: '0', icon: <AccessTimeIcon sx={{ fontSize: 26, color: '#d97706' }} />,          bg: '#fffbeb', color: '#d97706' },
  { label: 'Completed',      value: '0', icon: <CheckCircleOutlineIcon sx={{ fontSize: 26, color: '#16a34a' }} />,  bg: '#f0fdf4', color: '#16a34a' },
  { label: 'Avg. Rating',    value: '—', icon: <StarOutlineIcon sx={{ fontSize: 26, color: '#ea580c' }} />,         bg: '#fff7ed', color: '#ea580c' },
];

function TailorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'tailor') { navigate('/login'); return; }
    setUser(u);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f4ff' }}>
      <Header />
      <Box sx={{ mt: '64px', pt: 4, pb: 6 }}>
        <Container maxWidth="lg">

          {/* Welcome bar */}
          <Paper elevation={0} sx={{
            borderRadius: '16px', p: 3, mb: 3,
            background: 'linear-gradient(135deg, #0d7a6e 0%, #1565c0 50%, #1e4db7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 52, height: 52, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '1.4rem' }}>
                {user.firstName?.[0]?.toUpperCase() || '?'}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                  Welcome, {user.firstName}!
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                  Tailor Shop Dashboard
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Chip label="Tailor Shop" icon={<StorefrontOutlinedIcon sx={{ fontSize: 16, color: '#fff !important' }} />}
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }} />
              <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} size="small" sx={{
                borderColor: 'rgba(255,255,255,0.5)', color: '#fff', textTransform: 'none', fontWeight: 600,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' },
              }}>
                Logout
              </Button>
            </Box>
          </Paper>

          {/* Stats */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {stats.map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <Paper elevation={0} sx={{
                  borderRadius: '14px', p: 2.5,
                  border: '1px solid #e5e7eb', bgcolor: '#fff',
                  display: 'flex', alignItems: 'center', gap: 2,
                }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {s.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>{s.label}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2.5}>
            {/* Shop Status */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>Shop Overview</Typography>

                {[
                  { label: 'Profile Completion', value: 40 },
                  { label: 'Order Acceptance Rate', value: 0 },
                  { label: 'Customer Satisfaction', value: 0 },
                ].map((item) => (
                  <Box key={item.label} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>{item.label}</Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>{item.value}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={item.value}
                      sx={{ height: 7, borderRadius: 4, bgcolor: '#f3f4f6', '& .MuiLinearProgress-bar': { bgcolor: '#2563eb', borderRadius: 4 } }} />
                  </Box>
                ))}

                <Button variant="contained" fullWidth sx={{
                  mt: 1, bgcolor: '#2563eb', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                  '&:hover': { bgcolor: '#1d4ed8' },
                }}>
                  Complete Your Profile
                </Button>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>Quick Actions</Typography>
                <List disablePadding>
                  {[
                    { label: 'Manage Orders',      sub: 'View & update orders',       icon: <ShoppingBagOutlinedIcon sx={{ color: '#2563eb' }} />,  action: () => {} },
                    { label: 'My Services',        sub: 'Add or edit services',       icon: <ContentCutIcon sx={{ color: '#0d7a6e' }} />,           action: () => {} },
                    { label: 'Customers',          sub: 'View your customers',        icon: <PeopleOutlineIcon sx={{ color: '#7c3aed' }} />,        action: () => {} },
                    { label: 'Earnings',           sub: 'Track your revenue',         icon: <TrendingUpIcon sx={{ color: '#16a34a' }} />,           action: () => {} },
                  ].map((item, i, arr) => (
                    <React.Fragment key={item.label}>
                      <ListItem disablePadding sx={{ py: 1, cursor: 'pointer', borderRadius: '8px', px: 1, '&:hover': { bgcolor: '#f9fafb' } }} onClick={item.action}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#f3f4f6', width: 38, height: 38 }}>{item.icon}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>{item.label}</Typography>}
                          secondary={<Typography variant="caption" sx={{ color: '#9ca3af' }}>{item.sub}</Typography>}
                        />
                      </ListItem>
                      {i < arr.length - 1 && <Divider sx={{ my: 0.5 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>

        </Container>
      </Box>
    </Box>
  );
}

export default TailorDashboard;
