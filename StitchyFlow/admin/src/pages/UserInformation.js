import React from 'react';
import { Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function UserInformation() {
  return (
    <Layout title="Dashboard - User Information">
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
            background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <PersonIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700, mb: 2 }}>
            User Information
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 400, mx: 'auto' }}>
            User information management section coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default UserInformation;
