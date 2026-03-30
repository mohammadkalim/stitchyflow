import React from 'react';
import { Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function UsersDetails() {
  return (
    <Layout title="Dashboard - Users Details">
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
            background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <InfoIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700, mb: 2 }}>
            Users Details
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 400, mx: 'auto' }}>
            Users details management section coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default UsersDetails;
