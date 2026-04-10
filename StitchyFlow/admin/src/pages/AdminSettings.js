import React, { useEffect, useMemo, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Grid, TextField, Switch, FormControlLabel,
  Button, Alert, CircularProgress, Paper, Chip, LinearProgress
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  CleaningServices as CleaningIcon
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
  const [refreshStats, setRefreshStats] = useState({
    total_tokens: 0,
    active_tokens: 0,
    expired_tokens: 0,
    login_count: 0,
    logout_count: 0,
    storage: { percent_used: 0, used_bytes: 0, free_bytes: 0 },
    history: []
  });
  const [refreshLoading, setRefreshLoading] = useState(true);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [refreshMessageType, setRefreshMessageType] = useState('success');

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS),
    [settings]
  );

  const isStorageReportedFull = refreshStats.storage.percent_used >= 100 && refreshStats.storage.used_bytes >= 1024 * 1024;
  const isStorageHigh = refreshStats.storage.percent_used >= 89 && !isStorageReportedFull;

  const loadRefreshTokenStats = async () => {
    setRefreshLoading(true);
    setRefreshMessage('');
    try {
      const response = await api.get('/admin/refresh-tokens');
      if (response.data?.success && response.data?.data) {
        setRefreshStats(response.data.data);
      }
    } catch (error) {
      setRefreshMessage(error.response?.data?.error?.message || 'Failed to load refresh token stats');
      setRefreshMessageType('error');
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleCleanupExpiredTokens = async () => {
    setCleanupLoading(true);
    setRefreshMessage('');
    try {
      const response = await api.delete('/admin/refresh-tokens/cleanup');
      if (response.data?.success) {
        setRefreshMessage(response.data.message || 'Expired tokens cleaned successfully');
        setRefreshMessageType('success');
        await loadRefreshTokenStats();
      }
    } catch (error) {
      setRefreshMessage(error.response?.data?.error?.message || 'Failed to clean expired tokens');
      setRefreshMessageType('error');
    } finally {
      setCleanupLoading(false);
    }
  };

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
    loadRefreshTokenStats();
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

                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: '14px', border: '1px solid #d6e6f7', background: '#ffffff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
                          <StorageIcon sx={{ color: '#fff', fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#1a1a2e' }}>Admin Refresh Tokens</Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Monitor refresh-token health, login/logout activity, and storage warnings.
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        sx={{ borderRadius: '12px', textTransform: 'none', px: 3, py: 1.2, background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)' }}
                        onClick={handleCleanupExpiredTokens}
                        disabled={cleanupLoading || refreshLoading}
                        startIcon={cleanupLoading ? <CircularProgress size={18} color="inherit" /> : <CleaningIcon />}
                      >
                        {cleanupLoading ? 'Cleaning...' : 'Clean Expired Tokens'}
                      </Button>
                    </Box>

                    {refreshMessage && (
                      <Alert severity={refreshMessageType} sx={{ mb: 3, borderRadius: '10px' }}>
                        {refreshMessage}
                      </Alert>
                    )}

                    {refreshLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
                        <CircularProgress size={42} sx={{ color: '#1976d2' }} />
                      </Box>
                    ) : (
                      <>
                        <Grid container spacing={2}>
                          {[
                            { label: 'Total Tokens', value: refreshStats.total_tokens, color: '#1976d2' },
                            { label: 'Active Tokens', value: refreshStats.active_tokens, color: '#10b981' },
                            { label: 'Expired Tokens', value: refreshStats.expired_tokens, color: '#f97316' },
                          ].map((item) => (
                            <Grid item xs={12} md={4} key={item.label}>
                              <Paper sx={{ p: 2, borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fbff' }}>
                                <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block', fontWeight: 600 }}>
                                  {item.label}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: item.color }}>
                                  {item.value}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>

                        <Box sx={{ mt: 3, p: 3, borderRadius: '14px', border: '1px solid #d6e6f7', background: '#f9fbff' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                            <Box>
                              <Typography sx={{ color: '#1a1a2e', fontWeight: 700 }}>Storage Health</Typography>
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Table growth is measured from InnoDB allocation and free space.
                              </Typography>
                            </Box>
                            <Box sx={{ minWidth: 120 }}>
                              <Typography variant="subtitle2" sx={{ color: '#1a1a2e', fontWeight: 700, textAlign: 'right' }}>
                                {Math.min(refreshStats.storage.percent_used, 100)}%
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', textAlign: 'right' }}>
                                used
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(refreshStats.storage.percent_used, 100)}
                            sx={{ height: 10, borderRadius: '10px', mt: 2, bgcolor: '#dbeafe', '& .MuiLinearProgress-bar': { borderRadius: '10px', backgroundColor: refreshStats.storage.percent_used >= 89 ? '#f97316' : '#1976d2' } }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 2, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ color: '#374151' }}>
                              Used: {(refreshStats.storage.used_bytes / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#374151' }}>
                              Free: {(refreshStats.storage.free_bytes / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                          </Box>

                          {isStorageReportedFull ? (
                            <Alert severity="error" sx={{ mt: 3, borderRadius: '10px' }}>
                              Storage is full. Cleaning expired refresh tokens now can restore admin panel responsiveness.
                            </Alert>
                          ) : isStorageHigh ? (
                            <Alert severity="warning" sx={{ mt: 3, borderRadius: '10px' }}>
                              Storage usage is high. Clean expired refresh tokens to avoid admin performance slowdowns.
                            </Alert>
                          ) : (
                            <Alert severity="success" sx={{ mt: 3, borderRadius: '10px' }}>
                              Refresh token storage is healthy.
                            </Alert>
                          )}
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                          <Typography sx={{ fontWeight: 700, color: '#1a1a2e' }}>Login / Logout Activity</Typography>
                        </Box>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, borderRadius: '14px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                              <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block', fontWeight: 600 }}>
                                Total Logins
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>
                                {refreshStats.login_count}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, borderRadius: '14px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                              <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block', fontWeight: 600 }}>
                                Total Logouts
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f97316' }}>
                                {refreshStats.logout_count}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, borderRadius: '14px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                              <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block', fontWeight: 600 }}>
                                Stored Events
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
                                {refreshStats.history.length}
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 3, p: 2, borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fbff' }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, color: '#1a1a2e', fontWeight: 700 }}>
                            Recent Login/Logout Events
                          </Typography>
                          {refreshStats.history.length === 0 ? (
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                              No recent login or logout activity found.
                            </Typography>
                          ) : (
                            <Box sx={{ display: 'grid', gap: 2 }}>
                              {refreshStats.history.map((event, index) => (
                                <Box key={`${event.action}-${index}`} sx={{ p: 2, borderRadius: '12px', border: '1px solid #d6e6f7', background: '#ffffff' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                    <Typography sx={{ fontWeight: 700, color: '#1a1a2e' }}>{event.action}</Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>{new Date(event.created_at).toLocaleString()}</Typography>
                                  </Box>
                                  <Typography variant="body2" sx={{ color: '#475569', mt: 1 }}>
                                    {event.user_name} — {event.ip_address || 'IP not available'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                                    {event.details || event.user_agent || 'No additional details'}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </>
                    )}
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
