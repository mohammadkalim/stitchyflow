import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import axios from 'axios';
import Layout from '../components/Layout';

function Reports() {
  const [reports, setReports] = useState({
    daily_revenue: 0,
    weekly_revenue: 0,
    monthly_revenue: 0,
    total_orders_today: 0,
    total_orders_week: 0,
    total_orders_month: 0
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/v1/admin/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(response.data.data || reports);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };
    fetchReports();
  }, []);

  const reportCards = [
    { title: 'Daily Report', revenue: reports.daily_revenue, orders: reports.total_orders_today, color: '#2196F3', icon: '📅' },
    { title: 'Weekly Report', revenue: reports.weekly_revenue, orders: reports.total_orders_week, color: '#9C27B0', icon: '📊' },
    { title: 'Monthly Report', revenue: reports.monthly_revenue, orders: reports.total_orders_month, color: '#4CAF50', icon: '📈' }
  ];

  return (
    <Layout title="Dashboard - Reports">
      <Grid container spacing={3}>
        {reportCards.map((report, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper sx={{ 
              p: 3, 
              bgcolor: '#ffffff', 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: `${report.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {report.icon}
                </Box>
                <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
                  {report.title}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Revenue</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.5rem' }}>${report.revenue}</Typography>
                </Box>
                <Box sx={{
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  bgcolor: `${report.color}15`,
                  color: report.color,
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  {report.revenue > 0 ? '+' : ''}{Math.round((report.revenue / (reports.monthly_revenue || 1)) * 100)}%
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box>
                  <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Total Orders</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1.25rem' }}>{report.orders}</Typography>
                </Box>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ color: '#666' }}>📦</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export default Reports;
