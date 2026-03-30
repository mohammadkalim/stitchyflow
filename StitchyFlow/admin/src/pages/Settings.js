import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, Grid } from '@mui/material';
import Layout from '../components/Layout';

function Settings() {
  const [settings, setSettings] = useState({
    site_name: 'StitchyFlow',
    admin_email: '',
    support_email: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <Layout title="Dashboard - Settings">
      <Paper sx={{ 
        p: 4, 
        bgcolor: '#ffffff', 
        border: '1px solid rgba(0,0,0,0.05)', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#2196F3'
          }} />
          <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
            General Settings
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Name"
                value={settings.site_name}
                onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': { borderColor: '#2196F3', borderWidth: 2 }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#2196F3' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Admin Email"
                type="email"
                value={settings.admin_email}
                onChange={(e) => setSettings({...settings, admin_email: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': { borderColor: '#2196F3', borderWidth: 2 }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#2196F3' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Support Email"
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({...settings, support_email: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': { borderColor: '#2196F3', borderWidth: 2 }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#2196F3' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': { borderColor: '#2196F3', borderWidth: 2 }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#2196F3' }
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 4,
              bgcolor: '#2196F3',
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)',
              '&:hover': { bgcolor: '#1976d2', boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)' }
            }}
          >
            Save Settings
          </Button>
        </form>
      </Paper>
    </Layout>
  );
}

export default Settings;
