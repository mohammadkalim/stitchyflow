import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import {
  People as PeopleIcon, ShoppingCart as OrdersIcon,
  ContentCut as TailorsIcon, Payment as PaymentIcon,
  Pending as PendingIcon, CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon, TrendingUp as TrendingUpIcon,
  ArrowUpward as ArrowUpIcon, ArrowDownward as ArrowDownIcon
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
    { title: 'Total Customers', value: analytics.total_customers, icon: <PeopleIcon />, color: '#2196F3', gradient: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)', trend: '+12%' },
    { title: 'Total Tailors', value: analytics.total_tailors, icon: <TailorsIcon />, color: '#9C27B0', gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)', trend: '+5%' },
    { title: 'Total Orders', value: analytics.total_orders, icon: <OrdersIcon />, color: '#FF9800', gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', trend: '+8%' },
    { title: 'Total Payments', value: analytics.total_payments, icon: <PaymentIcon />, color: '#4CAF50', gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)', trend: '+15%' },
    { title: 'Pending Orders', value: analytics.pending_orders, icon: <PendingIcon />, color: '#FFC107', gradient: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)', trend: '-3%' },
    { title: 'Completed Orders', value: analytics.completed_orders, icon: <CheckCircleIcon />, color: '#00BCD4', gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)', trend: '+20%' },
    { title: 'In Progress', value: analytics.in_progress_orders, icon: <ShippingIcon />, color: '#3F51B5', gradient: 'linear-gradient(135deg, #3F51B5 0%, #303F9F 100%)', trend: '+10%' },
    { title: 'Total Revenue', value: `$${analytics.total_revenue || 0}`, icon: <TrendingUpIcon />, color: '#E91E63', gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)', trend: '+25%' }
  ];

  return (
    <Layout title="Dashboard">
      <Paper sx={{ 
        p: 3, 
        bgcolor: '#ffffff', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <Grid container spacing={2}>
          {widgets.map((widget, index) => (
            <Grid item xs={3} key={index}>
              <Box sx={{
                p: 1.5,
                borderRadius: '10px',
                bgcolor: '#f8f9fa',
                textAlign: 'center',
                height: '100%',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f0f7ff',
                  transform: 'scale(1.02)'
                }
              }}>
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: widget.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  mx: 'auto',
                  mb: 0.5,
                  '& svg': { fontSize: 16 }
                }}>
                  {widget.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem' }}>
                  {widget.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.65rem', fontWeight: 500 }}>
                  {widget.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
          Professional Analytics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              bgcolor: '#ffffff', 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#2196F3'
                }} />
                <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
                  Order Statistics
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Pending Orders</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1.25rem' }}>{analytics.pending_orders}</Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: '12px', bgcolor: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PendingIcon sx={{ color: '#FF9800', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>In Progress</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1.25rem' }}>{analytics.in_progress_orders}</Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: '12px', bgcolor: '#E8EAF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShippingIcon sx={{ color: '#3F51B5', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box>
                  <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Completed Orders</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1.25rem' }}>{analytics.completed_orders}</Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: '12px', bgcolor: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircleIcon sx={{ color: '#00BCD4', fontSize: 28 }} />
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              bgcolor: '#ffffff', 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#9C27B0'
                }} />
                <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
                  User Statistics
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Total Customers</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1.25rem' }}>{analytics.total_customers}</Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: '12px', bgcolor: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PeopleIcon sx={{ color: '#2196F3', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Total Tailors</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1.25rem' }}>{analytics.total_tailors}</Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: '12px', bgcolor: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TailorsIcon sx={{ color: '#9C27B0', fontSize: 28 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box>
                  <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Total Revenue</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1.25rem' }}>${analytics.total_revenue || 0}</Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: '12px', bgcolor: '#FCE4EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUpIcon sx={{ color: '#E91E63', fontSize: 28 }} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
          Analytics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: '16px', 
              textAlign: 'center', 
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <OrdersIcon sx={{ color: '#2196F3', fontSize: 24 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.75rem', letterSpacing: '-0.5px' }}>{analytics.total_orders}</Typography>
              <Typography sx={{ color: '#666', fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>Total Orders</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: '16px', 
              textAlign: 'center', 
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#FCE4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#E91E63', fontSize: 24 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.75rem', letterSpacing: '-0.5px' }}>${analytics.total_revenue || 0}</Typography>
              <Typography sx={{ color: '#666', fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>Total Revenue</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: '16px', 
              textAlign: 'center', 
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <PaymentIcon sx={{ color: '#4CAF50', fontSize: 24 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.75rem', letterSpacing: '-0.5px' }}>{analytics.total_payments}</Typography>
              <Typography sx={{ color: '#666', fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>Total Payments</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: '16px', 
              textAlign: 'center', 
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#E8EAF6', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <ShippingIcon sx={{ color: '#3F51B5', fontSize: 24 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.75rem', letterSpacing: '-0.5px' }}>{analytics.in_progress_orders}</Typography>
              <Typography sx={{ color: '#666', fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>In Progress</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default Dashboard;
