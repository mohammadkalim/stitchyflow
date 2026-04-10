import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Storage as StorageIcon,
  CleaningServices as CleaningIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';

function AdminRefreshTokens() {
  const [refreshStats, setRefreshStats] = useState({
    total_tokens: 0,
    active_tokens: 0,
    expired_tokens: 0,
    login_count: 0,
    logout_count: 0,
    storage: { percent_used: 0, used_bytes: 0, free_bytes: 0 },
    history: []
  });
  const [storageOverview, setStorageOverview] = useState({
    storage: { percent_used: 0, used_bytes: 0, free_bytes: 0, allocated_bytes: 0 },
    modules: []
  });
  const [refreshLoading, setRefreshLoading] = useState(true);
  const [storageLoading, setStorageLoading] = useState(true);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [fullCleanupLoading, setFullCleanupLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const isStorageReportedFull =
    refreshStats.storage.percent_used >= 100 &&
    refreshStats.storage.used_bytes >= 1024 * 1024;
  const isStorageHigh = refreshStats.storage.percent_used >= 89 && !isStorageReportedFull;
  const fullStoragePercent = Math.min(storageOverview.storage.percent_used || 0, 100);
  const isFullStorageHigh = fullStoragePercent >= 89 && fullStoragePercent < 100;
  const isFullStorageCritical = fullStoragePercent >= 100;

  const loadRefreshTokenStats = async () => {
    setRefreshLoading(true);
    setMessage('');
    try {
      const response = await api.get('/admin/refresh-tokens');
      if (response.data?.success && response.data?.data) {
        setRefreshStats(response.data.data);
      }
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to load refresh token stats');
      setMessageType('error');
    } finally {
      setRefreshLoading(false);
    }
  };

  const loadStorageOverview = async () => {
    setStorageLoading(true);
    try {
      const response = await api.get('/admin/storage/overview');
      if (response.data?.success && response.data?.data) {
        setStorageOverview(response.data.data);
      }
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to load storage overview');
      setMessageType('error');
    } finally {
      setStorageLoading(false);
    }
  };

  const handleCleanupExpiredTokens = async () => {
    setCleanupLoading(true);
    setMessage('');
    try {
      const response = await api.delete('/admin/refresh-tokens/cleanup');
      if (response.data?.success) {
        setMessage(response.data.message || 'Expired tokens cleaned successfully');
        setMessageType('success');
        await loadRefreshTokenStats();
        await loadStorageOverview();
      }
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to clean expired tokens');
      setMessageType('error');
    } finally {
      setCleanupLoading(false);
    }
  };

  const handleFullStorageCleanup = async () => {
    setFullCleanupLoading(true);
    setMessage('');
    try {
      const response = await api.post('/admin/storage/cleanup', {
        expired_refresh_tokens: true,
        old_session_logs_days: 60,
        old_ai_error_logs_days: 60,
        orphan_chat_files: true
      });
      if (response.data?.success) {
        const bytesFreed = Number(response.data?.data?.bytes_freed || 0);
        const freedMb = (bytesFreed / 1024 / 1024).toFixed(2);
        setMessage(`Full storage cleanup completed. Freed ${freedMb} MB.`);
        setMessageType('success');
        await Promise.all([loadRefreshTokenStats(), loadStorageOverview()]);
      }
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to run full storage cleanup');
      setMessageType('error');
    } finally {
      setFullCleanupLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([loadRefreshTokenStats(), loadStorageOverview()]);
  }, []);

  return (
    <Layout title="Administration - Admin Refresh Tokens">
      <Card
        sx={{
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(13, 71, 161, 0.10)',
          border: '1px solid #d6e6f7',
          background: 'linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '14px', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
                <StorageIcon sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.2rem' }}>
                  Admin Refresh Tokens
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Track admin login/logout activity and refresh-token storage health.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                sx={{ borderRadius: '12px', textTransform: 'none', px: 3, py: 1.2, background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)' }}
                onClick={handleCleanupExpiredTokens}
                disabled={cleanupLoading || refreshLoading}
                startIcon={cleanupLoading ? <CircularProgress size={18} color="inherit" /> : <CleaningIcon />}
              >
                {cleanupLoading ? 'Cleaning...' : 'Clean Expired Tokens'}
              </Button>
              <Button
                variant="outlined"
                sx={{ borderRadius: '12px', textTransform: 'none', px: 3, py: 1.2 }}
                onClick={handleFullStorageCleanup}
                disabled={fullCleanupLoading || storageLoading}
                startIcon={fullCleanupLoading ? <CircularProgress size={18} color="inherit" /> : <CleaningIcon />}
              >
                {fullCleanupLoading ? 'Running Full Cleanup...' : 'Run Full Storage Cleanup'}
              </Button>
            </Box>
          </Box>

          {message && (
            <Alert severity={messageType} sx={{ mb: 3, borderRadius: '10px' }}>
              {message}
            </Alert>
          )}

          {refreshLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={42} sx={{ color: '#1976d2' }} />
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {[
                  { label: 'Total Tokens', value: refreshStats.total_tokens, color: '#1976d2' },
                  { label: 'Active Tokens', value: refreshStats.active_tokens, color: '#10b981' },
                  { label: 'Expired Tokens', value: refreshStats.expired_tokens, color: '#f97316' }
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
                      If storage reaches 89% or full, admin panel can become slow.
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
                    Storage is full. Cleaning expired refresh tokens can make admin panel fast again.
                  </Alert>
                ) : isStorageHigh ? (
                  <Alert severity="warning" sx={{ mt: 3, borderRadius: '10px' }}>
                    Storage is above 89%. Clean expired refresh tokens to avoid admin panel slow performance.
                  </Alert>
                ) : (
                  <Alert severity="success" sx={{ mt: 3, borderRadius: '10px' }}>
                    Refresh token storage is healthy.
                  </Alert>
                )}
              </Box>

              <Box sx={{ mt: 3, p: 3, borderRadius: '14px', border: '1px solid #d6e6f7', background: '#ffffff' }}>
                <Typography sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>Full Storage System</Typography>
                {storageLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={30} sx={{ color: '#1976d2' }} />
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        Used: {(Number(storageOverview.storage.used_bytes || 0) / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        Free: {(Number(storageOverview.storage.free_bytes || 0) / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 700 }}>
                        Usage: {fullStoragePercent}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={fullStoragePercent}
                      sx={{ mt: 1.5, height: 10, borderRadius: '10px', bgcolor: '#dbeafe', '& .MuiLinearProgress-bar': { borderRadius: '10px', backgroundColor: isFullStorageHigh || isFullStorageCritical ? '#f97316' : '#1976d2' } }}
                    />
                    {isFullStorageCritical ? (
                      <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
                        Storage is full. Run Full Storage Cleanup for faster admin performance.
                      </Alert>
                    ) : isFullStorageHigh ? (
                      <Alert severity="warning" sx={{ mt: 2, borderRadius: '10px' }}>
                        Storage crossed 89%. Run Full Storage Cleanup to keep admin fast.
                      </Alert>
                    ) : (
                      <Alert severity="success" sx={{ mt: 2, borderRadius: '10px' }}>
                        Full storage health is normal.
                      </Alert>
                    )}

                    <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                      {storageOverview.modules.map((module) => (
                        <Grid item xs={12} md={6} key={module.key}>
                          <Paper sx={{ p: 1.5, borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fbff' }}>
                            <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.9rem' }}>
                              {module.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.4 }}>
                              Rows/Files: {module.rows}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                              Used: {(Number(module.used_bytes || 0) / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
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
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {new Date(event.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#475569', mt: 1 }}>
                          {event.user_name} - {event.ip_address || 'IP not available'}
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
        </CardContent>
      </Card>
    </Layout>
  );
}

export default AdminRefreshTokens;
