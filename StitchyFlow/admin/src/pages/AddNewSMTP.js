import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AddCircle as AddIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function AddNewSMTP() {
  return (
    <Layout title="Administration - Add New SMTP">
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
            background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <AddIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700, mb: 2 }}>
            Add New SMTP
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 400, mx: 'auto' }}>
            Add a new SMTP server configuration.
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default AddNewSMTP;
