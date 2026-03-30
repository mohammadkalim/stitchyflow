import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Build as MaintenanceIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function SiteMaintenanceMode() {
  return (
    <Layout title="Administration - Site Maintenance Mode">
      <Card sx={{ 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <MaintenanceIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700, mb: 2 }}>
            Site Maintenance Mode
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 400, mx: 'auto' }}>
            Enable or disable maintenance mode for the site.
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default SiteMaintenanceMode;
