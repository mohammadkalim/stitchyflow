import React from 'react';
import { Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { Air as AirDamIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function AirDam() {
  return (
    <Layout title="Dashboard - Air Dam">
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
            background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <AirDamIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700, mb: 2 }}>
            Air Dam Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 400, mx: 'auto' }}>
            Air Dam management section coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default AirDam;
