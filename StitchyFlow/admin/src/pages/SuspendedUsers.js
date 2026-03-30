import React from 'react';
import { Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function SuspendedUsers() {
  return (
    <Layout title="Dashboard - Suspended Users">
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
            <BlockIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700, mb: 2 }}>
            Suspended Users
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 400, mx: 'auto' }}>
            Suspended users management section coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default SuspendedUsers;
