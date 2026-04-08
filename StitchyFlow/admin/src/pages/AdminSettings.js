import React, { useEffect, useMemo, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Grid, TextField, Switch, FormControlLabel,
  Button, Alert, CircularProgress, Paper, Chip
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';

const DEFAULT_SETTINGS = {
  site_name: 'StitchyFlow',
  admin_email: 'admin@stitchyflow.com',
  support_email: 'support@stitchyflow.com',
  allow_registration: true,
  email_verification: true,
  maintenance_mode: false,
  max_login_attempts: 5,
  session_timeout_hours: 8,
  password_reset_expire_minutes: 30,
  verification_code_expire_minutes: 10
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#f8fbff',
    '& fieldset': { borderColor: '#d9e6f7' },
    '&:hover fieldset': { borderColor: '#90caf9' },
    '&.Mui-focused fieldset': { borderColor: '#42a5f5' }
  }
};

const switchSx = {
  '& .MuiSwitch-switchBase.Mui-checked': { color: '#2196F3' },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2196F3' }
};

function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS),
    [settings]
  );

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings');
        if (response.data?.success && response.data?.data) {
          setSettings({ ...DEFAULT_SETTINGS, ...response.data.data });
        }
      } catch (error) {
        setMessage(error.response?.data?.error?.message || 'Failed to load admin settings');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const setField = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...settings,
        max_login_attempts: Number(settings.max_login_attempts) || 5,
        session_timeout_hours: Number(settings.session_timeout_hours) || 8,
        password_reset_expire_minutes: Number(settings.password_reset_expire_minutes) || 30,
        verification_code_expire_minutes: Number(settings.verification_code_expire_minutes) || 10
      };
      const response = await api.put('/admin/settings', payload);
      if (response.data?.success) {
        setMessage(response.data.message || 'Admin settings saved successfully');
        setMessageType('success');
      } else {
        setMessage('Failed to save admin settings');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to save admin settings');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Administration - Admin Settings">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={50} sx={{ color: '#2196F3' }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Administration - Admin Settings">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(13, 71, 161, 0.10)',
            border: '1px solid #d6e6f7',
            background: 'linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AdminIcon sx={{ fontSize: 34, color: '#fff' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700 }}>
                      Admin Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Fully configurable admin controls with database persistence
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
                    boxShadow: '0 8px 18px rgba(25, 118, 210, 0.30)'
                  }}
                >
                  {saving ? 'Saving...' : (hasChanges ? 'Save Settings' : 'No Changes')}
                </Button>
              </Box>

              {message && (
                <Alert severity={messageType} sx={{ mb: 3, borderRadius: '10px' }}>
                  {message}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: '14px', border: '1px solid #d6e6f7', background: '#ffffff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <SettingsIcon sx={{ color: '#1976d2' }} />
                      <Typography sx={{ fontWeight: 700, color: '#1a1a2e' }}>General</Typography>
                    </Box>
                    <TextField fullWidth label="Site Name" value={settings.site_name} onChange={(e) => setField('site_name', e.target.value)} sx={{ ...inputSx, mb: 2 }} />
                    <TextField fullWidth label="Admin Email" type="email" value={settings.admin_email} onChange={(e) => setField('admin_email', e.target.value)} sx={{ ...inputSx, mb: 2 }} />
                    <TextField fullWidth label="Support Email" type="email" value={settings.support_email} onChange={(e) => setField('support_email', e.target.value)} sx={inputSx} />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: '14px', border: '1px solid #d6e6f7', background: '#ffffff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <SecurityIcon sx={{ color: '#1976d2' }} />
                      <Typography sx={{ fontWeight: 700, color: '#1a1a2e' }}>Security & Access</Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Max Login Attempts" type="number" value={settings.max_login_attempts} onChange={(e) => setField('max_login_attempts', e.target.value)} sx={inputSx} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Session Timeout (hours)" type="number" value={settings.session_timeout_hours} onChange={(e) => setField('session_timeout_hours', e.target.value)} sx={inputSx} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Password Reset Expiry (min)" type="number" value={settings.password_reset_expire_minutes} onChange={(e) => setField('password_reset_expire_minutes', e.target.value)} sx={inputSx} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Verification Expiry (min)" type="number" value={settings.verification_code_expire_minutes} onChange={(e) => setField('verification_code_expire_minutes', e.target.value)} sx={inputSx} />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: '14px', border: '1px solid #d6e6f7', background: '#ffffff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <EmailIcon sx={{ color: '#1976d2' }} />
                      <Typography sx={{ fontWeight: 700, color: '#1a1a2e' }}>Platform Controls</Typography>
                    </Box>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel control={<Switch sx={switchSx} checked={settings.allow_registration} onChange={(e) => setField('allow_registration', e.target.checked)} />} label="Allow Registration" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel control={<Switch sx={switchSx} checked={settings.email_verification} onChange={(e) => setField('email_verification', e.target.checked)} />} label="Email Verification" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel control={<Switch sx={switchSx} checked={settings.maintenance_mode} onChange={(e) => setField('maintenance_mode', e.target.checked)} />} label="Maintenance Mode" />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" sx={{ bgcolor: settings.maintenance_mode ? '#fff3e0' : '#e3f2fd', color: settings.maintenance_mode ? '#ef6c00' : '#1565c0', fontWeight: 600 }} label={settings.maintenance_mode ? 'Maintenance Enabled' : 'System Live'} />
                      <Chip size="small" sx={{ bgcolor: settings.allow_registration ? '#e1f5fe' : '#eceff1', color: settings.allow_registration ? '#0277bd' : '#546e7a', fontWeight: 600 }} label={settings.allow_registration ? 'Registration Open' : 'Registration Closed'} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default AdminSettings;
