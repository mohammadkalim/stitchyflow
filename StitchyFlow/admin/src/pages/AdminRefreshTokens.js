/**
 * Admin Panel Refresh Logs & Storage
 * Logs every admin panel refresh automatically.
 * Shows storage overview and provides a Clean Storage button.
 * Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, CircularProgress,
  Alert, LinearProgress, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  Storage as StorageIcon,
  CleaningServices as CleanIcon,
  Refresh as RefreshIcon,
  CheckCircle as OkIcon,
  Warning as WarnIcon,
  Error as ErrIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';

const MB = 1024 * 1024;
const fmt = (b) => (Number(b || 0) / MB).toFixed(2) + ' MB';

// Corporate light-blue theme
const C = {
  primary:  '#1565C0',
  mid:      '#1976D2',
  bg:       '#E3F2FD',
  bgSoft:   '#F0F7FF',
  border:   '#BBDEFB',
  header:   'linear-gradient(135deg,#1565C0 0%,#1976D2 60%,#42A5F5 100%)',
};

export default function AdminRefreshTokens() {
  const [storage, setStorage]       = useState(null);
  const [logs, setLogs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [cleaning, setCleaning]     = useState(false);
  const [msg, setMsg]               = useState({ text: '', type: 'success' });

  // ── Record this page-load as a refresh log ──────────────────────────────────
  const recordRefresh = useCallback(async () => {
    try {
      await api.post('/admin/storage/cleanup', {
        log_refresh: true,
        expired_refresh_tokens: false,
        old_session_logs_days: 0,
        old_ai_error_logs_days: 0,
        orphan_chat_files: false
      });
    } catch (_) { /* silent — logging failure should not block UI */ }
  }, []);

  // ── Load storage overview ───────────────────────────────────────────────────
  const loadStorage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/storage/overview');
      if (res.data?.success) setStorage(res.data.data);
    } catch (e) {
      setMsg({ text: e.response?.data?.error?.message || 'Failed to load storage', type: 'error' });
    } finally { setLoading(false); }
  }, []);

  // ── Load refresh logs from audit_logs ───────────────────────────────────────
  const loadLogs = useCallback(async () => {
    try {
      const res = await api.get('/logs/audit?limit=50');
      if (res.data?.success) setLogs(res.data.data || []);
    } catch (_) { /* logs are optional */ }
  }, []);

  useEffect(() => {
    recordRefresh();
    loadStorage();
    loadLogs();
  }, [recordRefresh, loadStorage, loadLogs]);

  // ── Clean Storage ───────────────────────────────────────────────────────────
  const handleClean = async () => {
    setCleaning(true); setMsg({ text: '', type: 'success' });
    try {
      const res = await api.post('/admin/storage/cleanup', {
        expired_refresh_tokens: true,
        old_session_logs_days: 60,
        old_ai_error_logs_days: 60,
        orphan_chat_files: true
      });
      if (res.data?.success) {
        const freed = Number(res.data.data?.bytes_freed || 0);
        setMsg({ text: `Storage cleaned successfully. Freed ${fmt(freed)}.`, type: 'success' });
        await loadStorage();
      }
    } catch (e) {
      setMsg({ text: e.response?.data?.error?.message || 'Cleanup failed', type: 'error' });
    } finally { setCleaning(false); }
  };

  const pct     = Math.min(Number(storage?.storage?.percent_used || 0), 100);
  const isHigh  = pct >= 89 && pct < 100;
  const isFull  = pct >= 100;
  const barColor = isFull ? '#C62828' : isHigh ? '#E65100' : C.primary;

  return (
    <Layout title="Admin Refresh Logs & Storage">
      <Box sx={{ bgcolor: '#F5F9FF', minHeight: '100vh' }}>

        {/* ── Header ── */}
        <Box sx={{ background: C.header, borderRadius: '16px', p: '28px 32px', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(21,101,192,0.25)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: '14px', bgcolor: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StorageIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1.35rem' }}>Admin Refresh Logs &amp; Storage</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>
                Every admin panel refresh is logged automatically. Clean storage when needed.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button onClick={() => { loadStorage(); loadLogs(); }} startIcon={<RefreshIcon />}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
              Refresh
            </Button>
            <Button variant="contained" onClick={handleClean} disabled={cleaning}
              startIcon={cleaning ? <CircularProgress size={18} sx={{ color: C.primary }} /> : <CleanIcon />}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: '#fff', color: C.primary, '&:hover': { bgcolor: '#E3F2FD' } }}>
              {cleaning ? 'Cleaning...' : 'Clean Storage'}
            </Button>
          </Box>
        </Box>

        {msg.text && <Alert severity={msg.type} sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setMsg({ text: '', type: 'success' })}>{msg.text}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: C.primary }} />
          </Box>
        ) : (
          <>
            {/* ── Storage Overview ── */}
            <Paper elevation={0} sx={{ borderRadius: '16px', border: `1.5px solid ${C.border}`, p: 3, mb: 3, bgcolor: '#fff' }}>
              <Typography sx={{ fontWeight: 700, color: C.primary, fontSize: '1rem', mb: 2 }}>Storage Overview</Typography>

              {/* Summary bar */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>Used: {fmt(storage?.storage?.used_bytes)}</Typography>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>Free: {fmt(storage?.storage?.free_bytes)}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: barColor }}>{pct}% used</Typography>
              </Box>
              <LinearProgress variant="determinate" value={pct} sx={{ height: 12, borderRadius: '8px', bgcolor: C.border, mb: 2, '& .MuiLinearProgress-bar': { bgcolor: barColor, borderRadius: '8px' } }} />

              {isFull  && <Alert severity="error"   sx={{ mb: 2, borderRadius: '8px' }}>Storage is full. Click "Clean Storage" to free space.</Alert>}
              {isHigh  && <Alert severity="warning" sx={{ mb: 2, borderRadius: '8px' }}>Storage above 89%. Consider cleaning soon.</Alert>}
              {!isFull && !isHigh && <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }} icon={<OkIcon />}>Storage is healthy.</Alert>}

              {/* Module breakdown */}
              <Grid container spacing={2}>
                {(storage?.modules || []).map(mod => {
                  const modPct = Math.min(Number(mod.percent_used || 0), 100);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={mod.key}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: C.bgSoft, border: `1px solid ${C.border}` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#1A237E' }}>{mod.label}</Typography>
                          <Chip label={`${modPct}%`} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: modPct >= 89 ? '#FFEBEE' : C.bg, color: modPct >= 89 ? '#C62828' : C.primary }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#546E7A', display: 'block' }}>Rows/Files: {mod.rows}</Typography>
                        <Typography variant="caption" sx={{ color: '#546E7A', display: 'block' }}>Used: {fmt(mod.used_bytes)}</Typography>
                        <LinearProgress variant="determinate" value={modPct} sx={{ mt: 1, height: 5, borderRadius: '4px', bgcolor: C.border, '& .MuiLinearProgress-bar': { bgcolor: modPct >= 89 ? '#C62828' : C.primary, borderRadius: '4px' } }} />
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>

            {/* ── Refresh Logs ── */}
            <Paper elevation={0} sx={{ borderRadius: '16px', border: `1.5px solid ${C.border}`, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: C.bgSoft, borderBottom: `1.5px solid ${C.border}`, px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 700, color: C.primary, fontSize: '1rem' }}>Admin Panel Refresh Logs</Typography>
                <Chip label={`${logs.length} entries`} size="small" sx={{ bgcolor: C.bg, color: C.primary, fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>
              {logs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography sx={{ color: '#90A4AE' }}>No refresh logs yet. Logs appear here on every admin panel visit.</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: C.bgSoft }}>
                        {['#', 'Action', 'Admin', 'IP Address', 'Time'].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 700, color: C.primary, fontSize: '0.78rem', borderBottom: `2px solid ${C.border}`, textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5 }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logs.map((log, i) => (
                        <TableRow key={log.id || i} hover sx={{ bgcolor: i % 2 === 0 ? '#fff' : C.bgSoft, '& td': { fontSize: '0.8rem', borderBottom: `1px solid ${C.border}` }, '&:hover': { bgcolor: C.bg } }}>
                          <TableCell sx={{ color: '#90A4AE', fontWeight: 600 }}>{i + 1}</TableCell>
                          <TableCell>
                            <Chip label={log.action || 'refresh'} size="small" sx={{ bgcolor: C.bg, color: C.primary, fontWeight: 600, fontSize: '0.7rem' }} />
                          </TableCell>
                          <TableCell sx={{ color: '#1A237E', fontWeight: 600 }}>{log.user_name || log.admin_email || '—'}</TableCell>
                          <TableCell sx={{ color: '#546E7A' }}>{log.ip_address || '—'}</TableCell>
                          <TableCell sx={{ color: '#546E7A' }}>{log.created_at ? new Date(log.created_at).toLocaleString() : '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </>
        )}
      </Box>
    </Layout>
  );
}
