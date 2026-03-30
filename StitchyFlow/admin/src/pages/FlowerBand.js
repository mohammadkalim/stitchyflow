import React from 'react';
import { Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { LocalFlorist as FlowerBandIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function FlowerBand() {
  return (
    <Layout title="Dashboard - Flower Band">
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
            background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <FlowerBandIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700, mb: 2 }}>
            Flower Band Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 400, mx: 'auto' }}>
            Flower Band management section coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default FlowerBand;
