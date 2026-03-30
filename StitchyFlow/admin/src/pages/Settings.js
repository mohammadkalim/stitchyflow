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
    <Layout title="Settings">
      <Paper sx={{ p: 4, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#2196F3', fontWeight: 600 }}>
          General Settings
        </Typography>
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
                    '&.Mui-focused fieldset': { borderColor: '#2196F3' }
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
                    '&.Mui-focused fieldset': { borderColor: '#2196F3' }
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
                    '&.Mui-focused fieldset': { borderColor: '#2196F3' }
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
                    '&.Mui-focused fieldset': { borderColor: '#2196F3' }
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
              mt: 3,
              bgcolor: '#2196F3',
              '&:hover': { bgcolor: '#1976d2' },
              px: 4
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
