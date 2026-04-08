/**
 * Active Sessions - Live Database with Real Users
 * Developer: Muhammad Kalim | +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com | www.logixinventor.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar,
  CircularProgress, TextField, InputAdornment, IconButton,
  Tooltip, TablePagination, Button, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Search, Refresh, CheckCircle, Block, Visibility,
  Computer, PhoneAndroid, TabletMac
} from '@mui/icons-material';
import Layout from '../../components/Layout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const ROLE_COLORS = {
  admin:          { bg: '#fef3c7', color: '#d97706', label: 'Admin' },
  customer:       { bg: '#dbeafe', color: '#1d4ed8', label: 'Customer' },
  tailor:         { bg: '#dcfce7', color: '#15803d', label: 'Tailor' },
  business_owner: { bg: '#ede9fe', color: '#6d28d9', label: 'Business' },
};

const DeviceIcon = ({ type }) => {
  if (type === 'mobile')  return <PhoneAndroid sx={{ fontSize: 16, color: '#64748b' }} />;
  if (type === 'tablet')  return <TabletMac    sx={{ fontSize: 16, color: '#64748b' }} />;
  return <Computer sx={{ fontSize: 16, color: '#64748b' }} />;
};

export default function ActiveSessions() {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(0);
  const [rpp, setRpp]           = useState(10);
  const [snack, setSnack]       = useState({ open: false, msg: '', sev: 'success' });
  const [confirmId, setConfirmId] = useState(null);
  const [terminating, setTerminating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setRows([]);
        setSnack({ open: true, msg: 'Please login again to view active sessions.', sev: 'warning' });
        setTimeout(() => { window.location.href = '/login'; }, 900);
        return;
      }

      const qs = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${API}/sessions/active${qs}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('adminToken');
        setRows([]);
        setSnack({ open: true, msg: data?.error?.message || 'Session expired. Please login again.', sev: 'warning' });
        setTimeout(() => { window.location.href = '/login'; }, 1200);
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || 'Unable to fetch active sessions');
      }

      setRows(data.data || []);
    } catch (e) {
      setSnack({ open: true, msg: e.message || 'Failed to load sessions', sev: 'error' });
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const terminate = async () => {
    if (!confirmId) return;
    setTerminating(true);
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API}/sessions/${confirmId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnack({ open: true, msg: 'Session terminated successfully', sev: 'success' });
      setConfirmId(null);
      load();
    } catch (e) {
      setSnack({ open: true, msg: 'Failed to terminate session', sev: 'error' });
    } finally { setTerminating(false); }
  };

  const paginated = rows.slice(page * rpp, page * rpp + rpp);

  return (
    <Layout title="Active Sessions">
      <Box sx={{ pb: 4 }}>

        {/* ── Header ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg,#16a34a,#15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}>
              <CheckCircle sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>Active Sessions</Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Real-time view of all currently logged-in users — live from database
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={`${rows.length} active users`}
              size="small"
              sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: '0.78rem', height: 28, border: '1px solid #bbf7d0' }}
            />
            <Tooltip title="Refresh">
              <IconButton onClick={load} sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f0fdf4', borderColor: '#16a34a' } }}>
                <Refresh sx={{ fontSize: 18, color: '#64748b' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* ── Search ── */}
        <TextField
          size="small"
          placeholder="Search by name, email, IP, browser, location..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>
          }}
          sx={{
            mb: 2.5, width: { xs: '100%', sm: 400 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px', bgcolor: '#fff',
              '& fieldset': { borderColor: '#e2e8f0' },
              '&:hover fieldset': { borderColor: '#16a34a' },
              '&.Mui-focused fieldset': { borderColor: '#16a34a' }
            }
          }}
        />

        {/* ── Table ── */}
        <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
              <CircularProgress size={36} sx={{ color: '#16a34a' }} />
              <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Loading active sessions from database...</Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 580 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {['#', 'User', 'Role', 'IP Address', 'Device', 'Browser', 'OS', 'Location', 'Status', 'Last Active', 'Expires At', 'Action'].map(h => (
                        <TableCell key={h} sx={{
                          fontWeight: 700, color: '#475569', fontSize: '0.72rem',
                          py: 1.5, px: 2, bgcolor: '#f8fafc',
                          borderBottom: '2px solid #e2e8f0',
                          textTransform: 'uppercase', letterSpacing: '0.04em',
                          whiteSpace: 'nowrap'
                        }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} align="center" sx={{ py: 8 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <CheckCircle sx={{ fontSize: 48, color: '#d1fae5' }} />
                            <Typography sx={{ color: '#64748b', fontWeight: 600 }}>No active sessions found</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                              {search ? 'Try adjusting your search' : 'No users are currently logged in'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : paginated.map((row, i) => {
                      const role = ROLE_COLORS[row.user_role] || ROLE_COLORS.customer;
                      return (
                        <TableRow key={row.session_id} hover sx={{ '&:hover': { bgcolor: '#f0fdf4' }, transition: 'background 0.15s' }}>
                          {/* # */}
                          <TableCell sx={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, px: 2 }}>
                            {page * rpp + i + 1}
                          </TableCell>

                          {/* User */}
                          <TableCell sx={{ px: 2, minWidth: 200 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{
                                width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                                background: 'linear-gradient(135deg,#16a34a,#15803d)',
                                boxShadow: '0 2px 6px rgba(22,163,74,0.3)'
                              }}>
                                {(row.user_name || 'U')[0].toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                                  {row.user_name || '—'}
                                </Typography>
                                <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
                                  {row.user_email || ''}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          {/* Role */}
                          <TableCell sx={{ px: 2 }}>
                            <Chip
                              label={role.label}
                              size="small"
                              sx={{ bgcolor: role.bg, color: role.color, fontWeight: 700, fontSize: '0.68rem', height: 22, border: `1px solid ${role.color}30` }}
                            />
                          </TableCell>

                          {/* IP */}
                          <TableCell sx={{ px: 2 }}>
                            <Box sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', px: 1, py: 0.3, display: 'inline-block' }}>
                              <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#16a34a', fontWeight: 600 }}>
                                {row.ip_address || '—'}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Device */}
                          <TableCell sx={{ px: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <DeviceIcon type={row.device_type} />
                              <Typography sx={{ fontSize: '0.8rem', color: '#475569', textTransform: 'capitalize' }}>
                                {row.device_type || '—'}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Browser */}
                          <TableCell sx={{ px: 2 }}>
                            <Typography sx={{ fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap' }}>
                              {row.browser || '—'}
                            </Typography>
                          </TableCell>

                          {/* OS */}
                          <TableCell sx={{ px: 2 }}>
                            <Typography sx={{ fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap' }}>
                              {row.os || '—'}
                            </Typography>
                          </TableCell>

                          {/* Location */}
                          <TableCell sx={{ px: 2 }}>
                            <Typography sx={{ fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap' }}>
                              📍 {row.location || '—'}
                            </Typography>
                          </TableCell>

                          {/* Status */}
                          <TableCell sx={{ px: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#16a34a', boxShadow: '0 0 0 2px #dcfce7' }} />
                              <Chip label="Active" size="small" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
                            </Box>
                          </TableCell>

                          {/* Last Active */}
                          <TableCell sx={{ px: 2 }}>
                            <Box>
                              <Typography sx={{ fontSize: '0.78rem', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                {row.last_activity ? new Date(row.last_activity).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                {row.last_activity ? new Date(row.last_activity).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : ''}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Expires At */}
                          <TableCell sx={{ px: 2 }}>
                            <Box>
                              <Typography sx={{ fontSize: '0.78rem', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                {row.expires_at ? new Date(row.expires_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                {row.expires_at ? new Date(row.expires_at).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : ''}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Action */}
                          <TableCell sx={{ px: 2 }}>
                            <Tooltip title="Terminate Session">
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Block sx={{ fontSize: 14 }} />}
                                onClick={() => setConfirmId(row.session_id)}
                                sx={{
                                  fontSize: '0.72rem', py: 0.4, px: 1.2,
                                  borderColor: '#fecaca', color: '#dc2626',
                                  borderRadius: '8px', textTransform: 'none', fontWeight: 600,
                                  '&:hover': { bgcolor: '#fee2e2', borderColor: '#dc2626' }
                                }}
                              >
                                Terminate
                              </Button>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ borderTop: '1px solid #f1f5f9' }}>
                <TablePagination
                  component="div"
                  count={rows.length}
                  page={page}
                  onPageChange={(_, p) => setPage(p)}
                  rowsPerPage={rpp}
                  onRowsPerPageChange={e => { setRpp(parseInt(e.target.value)); setPage(0); }}
                  rowsPerPageOptions={[10, 25, 50]}
                  sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.8rem', color: '#64748b' } }}
                />
              </Box>
            </>
          )}
        </Paper>

        {/* ── Confirm Terminate Dialog ── */}
        <Dialog open={Boolean(confirmId)} onClose={() => setConfirmId(null)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 700, color: '#0f172a' }}>Terminate Session?</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#64748b' }}>
              Are you sure you want to terminate session <strong>#{confirmId}</strong>?
              The user will be logged out immediately.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button onClick={() => setConfirmId(null)} sx={{ borderRadius: '8px', textTransform: 'none', color: '#64748b' }}>
              Cancel
            </Button>
            <Button
              onClick={terminate}
              disabled={terminating}
              variant="contained"
              sx={{ borderRadius: '8px', textTransform: 'none', bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, fontWeight: 600 }}
            >
              {terminating ? 'Terminating...' : 'Yes, Terminate'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Snackbar ── */}
        <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '10px', fontWeight: 500 }}>
            {snack.msg}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}
