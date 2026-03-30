import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
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
    { title: 'Total Customers', value: analytics.total_customers, icon: <PeopleIcon sx={{ fontSize: 28 }} />, color: '#2196F3' },
    { title: 'Total Tailors', value: analytics.total_tailors, icon: <TailorsIcon sx={{ fontSize: 28 }} />, color: '#2196F3' },
    { title: 'Total Orders', value: analytics.total_orders, icon: <OrdersIcon sx={{ fontSize: 28 }} />, color: '#2196F3' },
    { title: 'Total Payments', value: analytics.total_payments, icon: <PaymentIcon sx={{ fontSize: 28 }} />, color: '#2196F3' },
    { title: 'Pending Orders', value: analytics.pending_orders, icon: <PendingIcon sx={{ fontSize: 28 }} />, color: '#FF9800' },
    { title: 'Completed Orders', value: analytics.completed_orders, icon: <CheckCircleIcon sx={{ fontSize: 28 }} />, color: '#4CAF50' },
    { title: 'In Progress', value: analytics.in_progress_orders, icon: <ShippingIcon sx={{ fontSize: 28 }} />, color: '#9C27B0' },
    { title: 'Total Revenue', value: `$${analytics.total_revenue || 0}`, icon: <TrendingUpIcon sx={{ fontSize: 28 }} />, color: '#00BCD4' }
  ];

  return (
    <Layout title="Dashboard">
      {/* Widgets Grid - 2 Rows, 4 Columns */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {widgets.map((widget, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              bgcolor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{
                    bgcolor: `${widget.color}15`,
                    color: widget.color,
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {widget.icon}
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 0.5, fontSize: '1.75rem' }}>
                  {widget.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                  {widget.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Professional Analytics Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#000' }}>
          Analytics Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              bgcolor: '#ffffff', 
              border: '1px solid #e0e0e0', 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <Typography variant="h6" sx={{ mb: 2.5, color: '#2196F3', fontWeight: 600, fontSize: '1.1rem' }}>
                Order Statistics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>Pending Orders:</Typography>
                <Typography sx={{ fontWeight: 600, color: '#FF9800', fontSize: '0.95rem' }}>{analytics.pending_orders}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>In Progress:</Typography>
                <Typography sx={{ fontWeight: 600, color: '#9C27B0', fontSize: '0.95rem' }}>{analytics.in_progress_orders}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>Completed:</Typography>
                <Typography sx={{ fontWeight: 600, color: '#4CAF50', fontSize: '0.95rem' }}>{analytics.completed_orders}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              bgcolor: '#ffffff', 
              border: '1px solid #e0e0e0', 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <Typography variant="h6" sx={{ mb: 2.5, color: '#2196F3', fontWeight: 600, fontSize: '1.1rem' }}>
                User Statistics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>Total Customers:</Typography>
                <Typography sx={{ fontWeight: 600, color: '#2196F3', fontSize: '0.95rem' }}>{analytics.total_customers}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>Total Tailors:</Typography>
                <Typography sx={{ fontWeight: 600, color: '#2196F3', fontSize: '0.95rem' }}>{analytics.total_tailors}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>Total Revenue:</Typography>
                <Typography sx={{ fontWeight: 600, color: '#00BCD4', fontSize: '0.95rem' }}>${analytics.total_revenue || 0}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default Dashboard;
