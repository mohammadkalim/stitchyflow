import React, { useEffect, useState } from 'react';
import { 
  Grid, Paper, Typography, Box, Button, Chip
} from '@mui/material';
import {
  People as UsersIcon,
  ShoppingCart as OrdersIcon,
  ContentCut as TailorsIcon,
  Payment as PaymentIcon,
  Assessment as ReportsIcon,
  Straighten as MeasurementsIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Chat as ChatIcon,
  Star as ReviewsIcon,
  AdminPanelSettings as AdminIcon,
  Checkroom as FabricIcon
} from '@mui/icons-material';
import axios from 'axios';
import Layout from '../components/Layout';

function Dashboard() {
  const [analytics, setAnalytics] = useState({
    total_customers: 0,
    total_tailors: 0,
    total_orders: 0,
    total_payments: 0,
    pending_orders: 0,
    completed_orders: 0,
    in_progress_orders: 0,
    total_revenue: 0
  });

  useEffect(() => {
    // Commented out API call - uncomment when backend is ready
    /*
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        
        const response = await axios.get('http://localhost:5000/api/v1/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(response.data.data);
      } catch (error) {
        // Silently handle error
      }
    };
    fetchAnalytics();
    */
  }, []);

  const quickAccessItems = [
    { title: 'Manage Users', icon: <UsersIcon sx={{ fontSize: 28, color: '#2196F3' }} />, path: '/users', bgColor: '#E3F2FD' },
    { title: 'Orders', icon: <OrdersIcon sx={{ fontSize: 28, color: '#4CAF50' }} />, path: '/orders', bgColor: '#E8F5E9' },
    { title: 'Tailors', icon: <TailorsIcon sx={{ fontSize: 28, color: '#FF9800' }} />, path: '/tailors', bgColor: '#FFF3E0' },
    { title: 'Payments', icon: <PaymentIcon sx={{ fontSize: 28, color: '#9C27B0' }} />, path: '/payments', bgColor: '#F3E5F5' },
    { title: 'Reports', icon: <ReportsIcon sx={{ fontSize: 28, color: '#E91E63' }} />, path: '/reports', bgColor: '#FCE4EC' },
    { title: 'Measurements', icon: <MeasurementsIcon sx={{ fontSize: 28, color: '#00BCD4' }} />, path: '/measurements', bgColor: '#E0F7FA' },
    { title: 'Fabric Inventory', icon: <FabricIcon sx={{ fontSize: 28, color: '#FFC107' }} />, path: '/air-coats', bgColor: '#FFF8E1' },
    { title: 'Settings', icon: <SettingsIcon sx={{ fontSize: 28, color: '#607D8B' }} />, path: '/settings', bgColor: '#ECEFF1' },
    { title: 'Chat Support', icon: <ChatIcon sx={{ fontSize: 28, color: '#3F51B5' }} />, path: '/chat', bgColor: '#E8EAF6' },
    { title: 'Slider Media', icon: <ReviewsIcon sx={{ fontSize: 28, color: '#FFEB3B' }} />, path: '/slider-media', bgColor: '#FFFDE7' },
    { title: 'Administration', icon: <AdminIcon sx={{ fontSize: 28, color: '#795548' }} />, path: '/admin-settings', bgColor: '#EFEBE9' },
    { title: 'Inventory', icon: <InventoryIcon sx={{ fontSize: 28, color: '#009688' }} />, path: '/air-dam', bgColor: '#E0F2F1' }
  ];

  const recentActivities = [
    { title: 'New Order Confirmed', time: 'Just now', type: 'order' },
    { title: 'New Order Confirmed', time: 'Just now', type: 'order' },
    { title: 'New Order Confirmed', time: 'Just now', type: 'order' },
    { title: 'New Order Confirmed', time: 'Just now', type: 'order' },
    { title: 'New Order Confirmed', time: 'Just now', type: 'order' }
  ];

  return (
    <Layout title="Dashboard">
      <Box>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5, fontSize: { xs: '1.4rem', sm: '2rem' } }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Welcome back, Admin! Here's your daily overview.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#999', display: { xs: 'none', sm: 'block' } }}>
              Updated: {new Date().toLocaleTimeString()}
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              size="small"
              sx={{ borderRadius: '8px', textTransform: 'none', borderColor: '#e0e0e0', color: '#666', '&:hover': { borderColor: '#bdbdbd', bgcolor: '#f5f5f5' } }}
            >
              Refresh
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
              size="small"
              sx={{ borderRadius: '8px', textTransform: 'none', background: '#5B5FED', boxShadow: 'none', '&:hover': { background: '#4A4DD8' } }}
            >
              Download
            </Button>
          </Box>
        </Box>

        {/* Quick Access Section */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Box sx={{ 
              width: 6, 
              height: 24, 
              bgcolor: '#5B5FED', 
              borderRadius: '3px', 
              mr: 1.5 
            }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
              Quick Access
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {quickAccessItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
                <Box 
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    bgcolor: '#ffffff',
                    p: 2,
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transform: 'translateY(-2px)',
                      borderColor: '#e0e0e0'
                    }
                  }}
                >
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '10px',
                    bgcolor: item.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1.5
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', fontSize: '0.8125rem' }}>
                    {item.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Performance Overview */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e', mb: 3 }}>
            Performance Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2.5, 
                bgcolor: '#f8f9fa', 
                borderRadius: '12px',
                border: '1px solid #e8eaed'
              }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1, fontSize: '0.875rem' }}>
                  Total Orders
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
                  {analytics.total_orders}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip 
                    label="+0%" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#E8F5E9', 
                      color: '#2E7D32',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 20
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                    Since last month
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2.5, 
                bgcolor: '#f8f9fa', 
                borderRadius: '12px',
                border: '1px solid #e8eaed'
              }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1, fontSize: '0.875rem' }}>
                  Active Orders
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
                  {analytics.in_progress_orders}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip 
                    label="+0%" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#E8F5E9', 
                      color: '#2E7D32',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 20
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                    Since last month
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2.5, 
                bgcolor: '#f8f9fa', 
                borderRadius: '12px',
                border: '1px solid #e8eaed'
              }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1, fontSize: '0.875rem' }}>
                  Total Tailors
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
                  {analytics.total_tailors}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip 
                    label="+0%" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#E8F5E9', 
                      color: '#2E7D32',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 20
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                    Since last month
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2.5, 
                bgcolor: '#f8f9fa', 
                borderRadius: '12px',
                border: '1px solid #e8eaed'
              }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1, fontSize: '0.875rem' }}>
                  Total Revenue
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
                  Rs {analytics.total_revenue || 0}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip 
                    label="+0%" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#E8F5E9', 
                      color: '#2E7D32',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 20
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                    Since last month
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Revenue Analytics & Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                  Revenue Analytics (PKR)
                </Typography>
                <Button 
                  size="small" 
                  sx={{ textTransform: 'none', color: '#666', fontSize: '0.875rem' }}
                >
                  Last 6 Months ▼
                </Button>
              </Box>

              {/* Bar Chart */}
              {(() => {
                const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
                const values = [
                  analytics?.revenue_by_month?.[0] ?? 12500,
                  analytics?.revenue_by_month?.[1] ?? 28000,
                  analytics?.revenue_by_month?.[2] ?? 19500,
                  analytics?.revenue_by_month?.[3] ?? 35000,
                  analytics?.revenue_by_month?.[4] ?? 22000,
                  analytics?.revenue_by_month?.[5] ?? analytics?.total_revenue ?? 41000,
                ];
                const maxVal = Math.max(...values, 1);
                const formatPKR = (v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : `${v}`;
                return (
                  <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {/* Y-axis labels + bars */}
                    <Box sx={{ flex: 1, display: 'flex', gap: 0, position: 'relative' }}>
                      {/* Y-axis */}
                      <Box sx={{ width: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pb: '28px', pr: 1 }}>
                        {[100, 75, 50, 25, 0].map(pct => (
                          <Typography key={pct} variant="caption" sx={{ color: '#aaa', fontSize: '0.65rem', textAlign: 'right', lineHeight: 1 }}>
                            {formatPKR(Math.round(maxVal * pct / 100))}
                          </Typography>
                        ))}
                      </Box>
                      {/* Chart area */}
                      <Box sx={{ flex: 1, position: 'relative' }}>
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map(pct => (
                          <Box key={pct} sx={{
                            position: 'absolute', left: 0, right: 0,
                            bottom: `calc(28px + ${pct}% * (100% - 28px) / 100)`,
                            borderTop: '1px dashed #f0f0f0', zIndex: 0
                          }} />
                        ))}
                        {/* Bars */}
                        <Box sx={{ position: 'absolute', inset: 0, bottom: '28px', display: 'flex', alignItems: 'flex-end', gap: '6px', px: 1 }}>
                          {values.map((val, i) => {
                            const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                            const isMax = val === maxVal && val > 0;
                            return (
                              <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                {/* Value label on top */}
                                <Typography variant="caption" sx={{ fontSize: '0.62rem', color: isMax ? '#1976d2' : '#999', fontWeight: isMax ? 700 : 400, mb: 0.3 }}>
                                  {val > 0 ? `${formatPKR(val)}` : ''}
                                </Typography>
                                {/* Bar */}
                                <Box sx={{
                                  width: '100%',
                                  height: `${Math.max(heightPct, val > 0 ? 2 : 0)}%`,
                                  minHeight: val > 0 ? 4 : 0,
                                  background: isMax
                                    ? 'linear-gradient(180deg,#1976d2,#42a5f5)'
                                    : 'linear-gradient(180deg,#90CAF9,#BBDEFB)',
                                  borderRadius: '4px 4px 0 0',
                                  transition: 'height 0.6s ease',
                                  position: 'relative',
                                  '&:hover': { filter: 'brightness(0.9)' }
                                }} />
                              </Box>
                            );
                          })}
                        </Box>
                        {/* X-axis labels */}
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28px', display: 'flex', px: 1, gap: '6px' }}>
                          {months.map((m, i) => (
                            <Box key={i} sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="caption" sx={{ fontSize: '0.72rem', color: '#666', fontWeight: 500 }}>{m}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                    {/* Legend */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'flex-end' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '3px', background: 'linear-gradient(180deg,#1976d2,#42a5f5)' }} />
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '0.72rem' }}>Peak Month</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '3px', background: 'linear-gradient(180deg,#90CAF9,#BBDEFB)' }} />
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '0.72rem' }}>Revenue (PKR)</Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })()}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e', mb: 3 }}>
                Recent Activity
              </Typography>
              <Box>
                {recentActivities.map((activity, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < recentActivities.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#4CAF50' 
                      }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', fontSize: '0.875rem' }}>
                          {activity.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      size="small" 
                      sx={{ 
                        textTransform: 'none',
                        color: '#5B5FED',
                        minWidth: 'auto',
                        fontSize: '0.8125rem'
                      }}
                    >
                      View
                    </Button>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default Dashboard;
