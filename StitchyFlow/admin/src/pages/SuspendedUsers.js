/**
 * Suspended Users Page - Live Database
 * Developer: Muhammad Kalim | +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com | www.logixinventor.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Avatar, CircularProgress, TextField,
  InputAdornment, IconButton, Tooltip, TablePagination, Button,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Search, Refresh, Block, CheckCircle, Person } from '@mui/icons-material';
import Layout from '../components/Layout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const ROLE_COLORS = {
  admin:          { bg: '#fef3c7', color: '#d97706' },
  customer:       { bg: '#dbeafe', color: '#1d4ed8' },
  tailor:         { bg: '#dcfce7', color: '#15803d' },
  business_owner: { bg: '#ede9fe', color: '#6d28d9' },
};

export default function SuspendedUsers() {
  const [rows, setRows]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(0);
  const [rpp, setRpp]             = useState(10);
  const [activateId, setActivateId] = useState(null);
  const [activating, setActivating] = useState(false);
  const [snack, setSnack]         = useState({ open: false, msg: '', sev: 'success' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/admin/users/suspended/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setRows(data.data || []);
    } catch (e) {
      setSnack({ open: true, msg: 'Failed to load suspended users', sev: 'error' });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter(r =>
    !search ||
    r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.role?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(page * rpp, page * rpp + rpp);

  const doActivate = async () => {
    if (!activateId) return;
    setActivating(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/admin/users/${activateId}/activate`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSnack({ open: true, msg: 'User account activated successfully!', sev: 'success' });
        setActivateId(null);
        load();
      } else {
        setSnack({ open: true, msg: data.error?.message || 'Failed', sev: 'error' });
      }
    } catch (e) {
      setSnack({ open: true, msg: 'Action failed', sev: 'error' });
    } finally { setActivating(false); }
  };

  return (
    <Layout title="Suspended Users">
      <Box sx={{ pb: 4 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(220,38,38,0.35)' }}>
              <Block sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>Suspended Users</Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Users whose accounts have been suspended — live from database</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip label={`${rows.length} suspended`} size="small" sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 700, height: 28, border: '1px solid #fecaca' }} />
            <Tooltip title="Refresh">
              <IconButton onClick={load} sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#fef2f2', borderColor: '#dc2626' } }}>
                <Refresh sx={{ fontSize: 18, color: '#64748b' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Search */}
        <TextField size="small" placeholder="Search by name, email, role..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }}
          sx={{ mb: 2.5, width: { xs: '100%', sm: 380 }, '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#dc2626' }, '&.Mui-focused fieldset': { borderColor: '#dc2626' } } }}
        />

        {/* Table */}
        <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
              <CircularProgress size={36} sx={{ color: '#dc2626' }} />
              <Typography sx={{ color: '#64748b' }}>Loading suspended users from database...</Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 560 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {['#', 'User', 'Email', 'Role', 'Phone', 'Status', 'Suspended At', 'Action'].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700, color: '#475569', fontSize: '0.72rem', py: 1.5, px: 2, bgcolor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Block sx={{ fontSize: 48, color: '#fecaca' }} />
                            <Typography sx={{ color: '#64748b', fontWeight: 600 }}>No suspended users found</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>{search ? 'Try adjusting your search' : 'All users are currently active'}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : paginated.map((row, i) => {
                      const rc = ROLE_COLORS[row.role] || ROLE_COLORS.customer;
                      return (
                        <TableRow key={row.user_id} hover sx={{ '&:hover': { bgcolor: '#fef2f2' }, transition: 'background 0.15s' }}>
                          <TableCell sx={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, px: 2 }}>{page * rpp + i + 1}</TableCell>
                          <TableCell sx={{ px: 2, minWidth: 180 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700, background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                                {(row.full_name || 'U')[0].toUpperCase()}
                              </Avatar>
                              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{row.full_name || '—'}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ px: 2 }}><Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.email || '—'}</Typography></TableCell>
                          <TableCell sx={{ px: 2 }}><Chip label={row.role || '—'} size="small" sx={{ bgcolor: rc.bg, color: rc.color, fontWeight: 700, fontSize: '0.68rem', height: 22, textTransform: 'capitalize' }} /></TableCell>
                          <TableCell sx={{ px: 2 }}><Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.phone_number || '—'}</Typography></TableCell>
                          <TableCell sx={{ px: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#dc2626' }} />
                              <Chip label="Suspended" size="small" sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ px: 2 }}>
                            <Box>
                              <Typography sx={{ fontSize: '0.78rem', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                {row.updated_at ? new Date(row.updated_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                {row.updated_at ? new Date(row.updated_at).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : ''}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ px: 2 }}>
                            <Tooltip title="Activate Account">
                              <Button size="small" variant="contained" startIcon={<CheckCircle sx={{ fontSize: 14 }} />}
                                onClick={() => setActivateId(row.user_id)}
                                sx={{ fontSize: '0.72rem', py: 0.5, px: 1.5, borderRadius: '8px', textTransform: 'none', fontWeight: 600, bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, boxShadow: 'none' }}>
                                Activate
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
                <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rpp} onRowsPerPageChange={e => { setRpp(parseInt(e.target.value)); setPage(0); }} rowsPerPageOptions={[10, 25, 50]} sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.8rem', color: '#64748b' } }} />
              </Box>
            </>
          )}
        </Paper>

        {/* Activate Confirm Dialog */}
        <Dialog open={Boolean(activateId)} onClose={() => setActivateId(null)} PaperProps={{ sx: { borderRadius: '20px', p: 1, maxWidth: 420 } }}>
          <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle sx={{ color: '#16a34a', fontSize: 22 }} />
              </Box>
              Activate Account?
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#64748b', lineHeight: 1.6 }}>
              Are you sure you want to activate user <strong>#{activateId}</strong>? Their account will be restored and they can log in again.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button onClick={() => setActivateId(null)} sx={{ borderRadius: '10px', textTransform: 'none', color: '#64748b', fontWeight: 600 }}>Cancel</Button>
            <Button onClick={doActivate} disabled={activating} variant="contained"
              sx={{ borderRadius: '10px', textTransform: 'none', bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, fontWeight: 700, px: 3, boxShadow: 'none' }}>
              {activating ? 'Activating...' : 'Yes, Activate'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '10px', fontWeight: 500 }}>{snack.msg}</Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}
