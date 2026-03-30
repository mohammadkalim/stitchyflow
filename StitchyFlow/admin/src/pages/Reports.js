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

  return (
    <Layout title="Reports">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 600, mb: 2 }}>
              Daily Report
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Revenue:</Typography>
              <Typography sx={{ fontWeight: 600 }}>${reports.daily_revenue}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Orders:</Typography>
              <Typography sx={{ fontWeight: 600 }}>{reports.total_orders_today}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 600, mb: 2 }}>
              Weekly Report
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Revenue:</Typography>
              <Typography sx={{ fontWeight: 600 }}>${reports.weekly_revenue}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Orders:</Typography>
              <Typography sx={{ fontWeight: 600 }}>{reports.total_orders_week}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 600, mb: 2 }}>
              Monthly Report
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Revenue:</Typography>
              <Typography sx={{ fontWeight: 600 }}>${reports.monthly_revenue}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Orders:</Typography>
              <Typography sx={{ fontWeight: 600 }}>{reports.total_orders_month}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Reports;
