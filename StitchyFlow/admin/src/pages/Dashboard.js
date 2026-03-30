import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon, ShoppingCart as OrdersIcon,
  ContentCut as TailorsIcon, Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon, CheckCircle as CheckCircleIcon,
  Pending as PendingIcon, LocalShipping as ShippingIcon
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
    { title: 'Total Customers', value: analytics.total_customers, icon: <PeopleIcon />, color: '#2196F3' },
    { title: 'Total Tailors', value: analytics.total_tailors, icon: <TailorsIcon />, color: '#2196F3' },
    { title: 'Total Orders', value: analytics.total_orders, icon: <OrdersIcon />, color: '#2196F3' },
    { title: 'Total Payments', value: analytics.total_payments, icon: <PaymentIcon />, color: '#2196F3' },
    { title: 'Pending Orders', value: analytics.pending_orders, icon: <PendingIcon />, color: '#2196F3' },
    { title: 'Completed Orders', value: analytics.completed_orders, icon: <CheckCircleIcon />, color: '#2196F3' },
    { title: 'In Progress', value: analytics.in_progress_orders, icon: <ShippingIcon />, color: '#2196F3' },
    { title: 'Total Revenue', value: `$${analytics.total_revenue || 0}`, icon: <TrendingUpIcon />, color: '#2196F3' }
  ];

  return (
    <Layout title="Dashboard">
      <Grid container spacing={3}>
        {widgets.map((widget, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
            }}>
              <Box sx={{
                bgcolor: widget.color,
                color: '#ffffff',
                p: 2,
                borderRadius: '50%',
                mb: 2
              }}>
                {widget.icon}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 1 }}>
                {widget.value}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Pending:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{analytics.pending_orders}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>In Progress:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{analytics.in_progress_orders}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Completed:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{analytics.completed_orders}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2196F3', fontWeight: 600 }}>
                User Statistics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Total Customers:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{analytics.total_customers}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Total Tailors:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{analytics.total_tailors}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Total Revenue:</Typography>
                <Typography sx={{ fontWeight: 600 }}>${analytics.total_revenue || 0}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default Dashboard;
