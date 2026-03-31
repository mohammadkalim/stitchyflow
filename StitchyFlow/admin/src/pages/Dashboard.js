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
    { title: 'Reviews', icon: <ReviewsIcon sx={{ fontSize: 28, color: '#FFEB3B' }} />, path: '/reviews', bgColor: '#FFFDE7' },
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Welcome back, Admin! Here's your daily overview.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#999' }}>
              Updated: {new Date().toLocaleTimeString()}
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              size="small"
              sx={{ 
                borderRadius: '8px', 
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: '#666',
                '&:hover': {
                  borderColor: '#bdbdbd',
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              Refresh
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
              size="small"
              sx={{ 
                borderRadius: '8px', 
                textTransform: 'none',
                background: '#5B5FED',
                boxShadow: 'none',
                '&:hover': { 
                  background: '#4A4DD8',
                  boxShadow: '0 2px 8px rgba(91, 95, 237, 0.3)'
                }
              }}
            >
              Download Report
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
              <Box sx={{ 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Revenue chart will be displayed here
                </Typography>
              </Box>
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
