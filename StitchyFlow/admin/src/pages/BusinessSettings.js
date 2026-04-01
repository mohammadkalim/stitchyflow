import React, { useState } from 'react';
import { Box, Typography, Card, TextField, Button, Switch, FormControlLabel, Divider, Grid } from '@mui/material';
import { Save as SaveIcon, Settings as SettingsIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function BusinessSettings() {
  const [settings, setSettings] = useState({
    commissionRate: '15',
    minOrderAmount: '500',
    maxOrderAmount: '50000',
    autoApproval: false,
    emailNotifications: true,
    smsNotifications: false,
    allowCancellation: true,
    cancellationWindow: '24'
  });

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
          Business Settings
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Configure business rules and preferences
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Commission Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid #2563EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SettingsIcon sx={{ color: '#1976d2', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                Commission Settings
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Commission Rate (%)"
              value={settings.commissionRate}
              onChange={(e) => handleChange('commissionRate', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Minimum Order Amount (₹)"
              value={settings.minOrderAmount}
              onChange={(e) => handleChange('minOrderAmount', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Maximum Order Amount (₹)"
              value={settings.maxOrderAmount}
              onChange={(e) => handleChange('maxOrderAmount', e.target.value)}
            />
          </Card>
        </Grid>

        {/* Approval Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid #2563EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SettingsIcon sx={{ color: '#1976d2', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                Approval Settings
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.autoApproval}
                  onChange={(e) => handleChange('autoApproval', e.target.checked)}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1976d2' } }}
                />
              }
              label="Auto-approve new tailors"
              sx={{ mb: 2 }}
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.allowCancellation}
                  onChange={(e) => handleChange('allowCancellation', e.target.checked)}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1976d2' } }}
                />
              }
              label="Allow order cancellation"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Cancellation Window (hours)"
              value={settings.cancellationWindow}
              onChange={(e) => handleChange('cancellationWindow', e.target.value)}
              disabled={!settings.allowCancellation}
            />
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid #2563EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SettingsIcon sx={{ color: '#1976d2', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                Notification Settings
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.emailNotifications}
                      onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1976d2' } }}
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.smsNotifications}
                      onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1976d2' } }}
                    />
                  }
                  label="SMS Notifications"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: '#1976d2',
              borderRadius: '10px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            Save Settings
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default BusinessSettings;
