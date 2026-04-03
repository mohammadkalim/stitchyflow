/**
 * Tailer Verifications — Admin Panel
 * Developer: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, Dialog, DialogContent, DialogActions,
  TextField, CircularProgress, Avatar, IconButton, Tooltip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Layout from '../../components/Layout';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

function TailerVerifications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, type: '', userId: '', name: '' });
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', type: 'success' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API}/tailor-approval/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setRows(res.data.data);
    } catch (e) {
      console.error('Fetch verifications error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openDialog = (type, userId, name) => {
    setDialog({ open: true, type, userId, name });
    setNote('');
  };

  const handleAction = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = dialog.type === 'approve'
        ? `${API}/tailor-approval/approve/${dialog.userId}`
        : `${API}/tailor-approval/reject/${dialog.userId}`;
      await axios.post(endpoint, { note }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnack({ open: true, msg: dialog.type === 'approve' ? 'Tailor approved & email sent.' : 'Tailor rejected & email sent.', type: dialog.type === 'approve' ? 'success' : 'error' });
      setDialog({ open: false, type: '', userId: '', name: '' });
      fetchData();
    } catch (e) {
      setSnack({ open: true, msg: e.response?.data?.error?.message || 'Action failed.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const statusChip = (status) => {
    const map = {
      pending:  { label: 'Pending',  color: '#92400e', bg: '#fffbeb', border: '#fde68a', icon: <HourglassEmptyIcon sx={{ fontSize: 13 }} /> },
      approved: { label: 'Approved', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', icon: <CheckCircleOutlineIcon sx={{ fontSize: 13 }} /> },
      rejected: { label: 'Rejected', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: <CancelOutlinedIcon sx={{ fontSize: 13 }} /> },
    };
    const s = map[status] || map.pending;
    return (
      <Chip
        icon={s.icon}
        label={s.label}
        size="small"
        sx={{ bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}`, fontWeight: 700, fontSize: '0.72rem' }}
      />
    );
  };

  return (
    <Layout title="Tailer Verifications">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>Tailer Verifications</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.3 }}>
              Review and approve Tailor Shop registration requests
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchData} sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'Total',    value: rows.length,                                          color: '#2563eb', bg: '#eff6ff' },
            { label: 'Pending',  value: rows.filter(r => r.verification_status === 'pending').length,  color: '#d97706', bg: '#fffbeb' },
            { label: 'Approved', value: rows.filter(r => r.verification_status === 'approved').length, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Rejected', value: rows.filter(r => r.verification_status === 'rejected').length, color: '#dc2626', bg: '#fef2f2' },
          ].map(s => (
            <Paper key={s.label} elevation={0} sx={{ px: 3, py: 1.5, borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontWeight: 800, color: s.color, fontSize: '1rem' }}>{s.value}</Typography>
              </Box>
              <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.82rem' }}>{s.label}</Typography>
            </Paper>
          ))}
        </Box>

        {/* Table */}
        <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    {['Tailor', 'Shop Name', 'Email', 'Phone', 'Registered', 'Status', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#94a3b8' }}>
                        No verification requests found
                      </TableCell>
                    </TableRow>
                  ) : rows.map((row) => (
                    <TableRow key={row.verification_id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, bgcolor: '#2563eb', fontSize: '0.85rem', fontWeight: 700 }}>
                            {row.tailor_name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
                            {row.tailor_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#334155', fontSize: '0.85rem' }}>{row.shop_name}</TableCell>
                      <TableCell sx={{ color: '#334155', fontSize: '0.85rem' }}>{row.email || '—'}</TableCell>
                      <TableCell sx={{ color: '#334155', fontSize: '0.85rem' }}>{row.contact_number || '—'}</TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.82rem' }}>
                        {row.created_at ? new Date(row.created_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </TableCell>
                      <TableCell>{statusChip(row.verification_status)}</TableCell>
                      <TableCell>
                        {row.verification_status === 'pending' && row.user_id ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 15 }} />}
                              onClick={() => openDialog('approve', row.user_id, row.tailor_name)}
                              sx={{
                                bgcolor: '#16a34a', textTransform: 'none', fontWeight: 700,
                                fontSize: '0.78rem', borderRadius: '8px', px: 1.5, py: 0.6,
                                boxShadow: 'none', '&:hover': { bgcolor: '#15803d' },
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<CancelOutlinedIcon sx={{ fontSize: 15 }} />}
                              onClick={() => openDialog('reject', row.user_id, row.tailor_name)}
                              sx={{
                                borderColor: '#fecaca', color: '#dc2626', textTransform: 'none',
                                fontWeight: 700, fontSize: '0.78rem', borderRadius: '8px', px: 1.5, py: 0.6,
                                '&:hover': { bgcolor: '#fef2f2', borderColor: '#ef4444' },
                              }}
                            >
                              Reject
                            </Button>
                          </Box>
                        ) : (
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                            {row.verification_status === 'approved' ? '✅ Done' : row.verification_status === 'rejected' ? '❌ Done' : '—'}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Approve / Reject Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog(d => ({ ...d, open: false }))} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}>
        <Box sx={{ height: 4, bgcolor: dialog.type === 'approve' ? '#16a34a' : '#ef4444' }} />
        <DialogContent sx={{ px: 3.5, pt: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{
              width: 42, height: 42, borderRadius: '12px',
              bgcolor: dialog.type === 'approve' ? '#f0fdf4' : '#fef2f2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {dialog.type === 'approve'
                ? <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 24 }} />
                : <CancelOutlinedIcon sx={{ color: '#ef4444', fontSize: 24 }} />}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                {dialog.type === 'approve' ? 'Approve Tailor' : 'Reject Tailor'}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>{dialog.name}</Typography>
            </Box>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={dialog.type === 'approve' ? 'Optional note to tailor...' : 'Reason for rejection (optional)...'}
            value={note}
            onChange={e => setNote(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '0.88rem' } }}
          />
          <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', mt: 1 }}>
            An email notification will be sent to the tailor automatically.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3.5, pb: 3, gap: 1 }}>
          <Button onClick={() => setDialog(d => ({ ...d, open: false }))}
            sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAction}
            disabled={submitting}
            sx={{
              bgcolor: dialog.type === 'approve' ? '#16a34a' : '#ef4444',
              textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 3,
              boxShadow: 'none',
              '&:hover': { bgcolor: dialog.type === 'approve' ? '#15803d' : '#dc2626' },
            }}
          >
            {submitting ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : (dialog.type === 'approve' ? 'Approve & Notify' : 'Reject & Notify')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snack.open && (
        <Box sx={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          bgcolor: snack.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${snack.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '12px', px: 3, py: 1.5,
          display: 'flex', alignItems: 'center', gap: 1.5,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}>
          {snack.type === 'success'
            ? <CheckCircleOutlineIcon sx={{ color: '#16a34a' }} />
            : <CancelOutlinedIcon sx={{ color: '#ef4444' }} />}
          <Typography sx={{ fontWeight: 600, color: snack.type === 'success' ? '#15803d' : '#dc2626', fontSize: '0.88rem' }}>
            {snack.msg}
          </Typography>
          <Button size="small" onClick={() => setSnack(s => ({ ...s, open: false }))}
            sx={{ color: '#94a3b8', minWidth: 0, p: 0.5, ml: 1 }}>✕</Button>
        </Box>
      )}
    </Layout>
  );
}

export default TailerVerifications;
