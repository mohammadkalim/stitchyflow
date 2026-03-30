import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon, ShoppingCart as OrdersIcon,
  ContentCut as TailorsIcon, Payment as PaymentIcon,
  Pending as PendingIcon, CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon, TrendingUp as TrendingUpIcon
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
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/v1/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(response.data.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  const widgets = [
    { title: 'Total Customers', value: analytics.total_customers, icon: <PeopleIcon sx={{ fontSize: 28 }} />, color: '#2196F3' },
    { title: 'Total Tailors', value: analytics.total_tailors, icon: <TailorsIcon sx={{ fontSize: 28 }} />, color: '#9C27B0' },
    { title: 'Total Orders', value: analytics.total_orders, icon: <OrdersIcon sx={{ fontSize: 28 }} />, color: '#FF9800' },
    { title: 'Total Payments', value: analytics.total_payments, icon: <PaymentIcon sx={{ fontSize: 28 }} />, color: '#4CAF50' },
    { title: 'Pending Orders', value: analytics.pending_orders, icon: <PendingIcon sx={{ fontSize: 28 }} />, color: '#FFC107' },
    { title: 'Completed Orders', value: analytics.completed_orders, icon: <CheckCircleIcon sx={{ fontSize: 28 }} />, color: '#00BCD4' },
    { title: 'In Progress', value: analytics.in_progress_orders, icon: <ShippingIcon sx={{ fontSize: 28 }} />, color: '#3F51B5' },
    { title: 'Total Revenue', value: `$${analytics.total_revenue || 0}`, icon: <TrendingUpIcon sx={{ fontSize: 28 }} />, color: '#E91E63' }
  ];

  return (
    <Layout title="Dashboard">
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ maxWidth: '1200px', width: '100%' }}>
          <Grid container spacing={2.5}>
            {widgets.map((widget, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Paper sx={{
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  height: 150,
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    bgcolor: widget.color,
                    color: '#ffffff',
                    p: 1.5,
                    borderRadius: '12px',
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56
                  }}>
                    {widget.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 0.5 }}>
                    {widget.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', fontSize: '0.813rem' }}>
                    {widget.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#000' }}>
              Professional Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#2196F3', fontWeight: 600 }}>
                    Order Statistics
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Typography sx={{ color: '#666' }}>Pending:</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#000' }}>{analytics.pending_orders}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Typography sx={{ color: '#666' }}>In Progress:</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#000' }}>{analytics.in_progress_orders}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#666' }}>Completed:</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#000' }}>{analytics.completed_orders}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#2196F3', fontWeight: 600 }}>
                    User Statistics
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Typography sx={{ color: '#666' }}>Total Customers:</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#000' }}>{analytics.total_customers}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Typography sx={{ color: '#666' }}>Total Tailors:</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#000' }}>{analytics.total_tailors}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#666' }}>Total Revenue:</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#000' }}>${analytics.total_revenue || 0}</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

export default Dashboard;
