import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, Paper, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, InputAdornment,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { apiFetch } from '../../utils/api';

const G = '#1b4332';
const GL = '#2d6a4f';

const STATUS_META = {
  pending:     { label: 'Pending',     bg: '#fef9c3', color: '#ca8a04' },
  in_progress: { label: 'In Progress', bg: '#eff6ff', color: '#2563eb' },
  completed:   { label: 'Completed',   bg: '#f0fdf4', color: '#16a34a' },
  cancelled:   { label: 'Cancelled',   bg: '#fef2f2', color: '#dc2626' },
};

function StatusChip({ status }) {
  const m = STATUS_META[status] || { label: status, bg: '#f1f5f9', color: '#64748b' };
  return <Chip label={m.label} size="small" sx={{ bgcolor: m.bg, color: m.color, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />;
}

function LockScreen() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 14 }}>
      <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <LockOutlinedIcon sx={{ fontSize: 36, color: '#94a3b8' }} />
      </Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', mb: 0.75 }}>Section Locked</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: 340 }}>
        This section is available after your tailor account is approved by an administrator.
      </Typography>
    </Box>
  );
}

export default function OrdersSection({ isApproved }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewOrder, setViewOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/orders');
      setOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (isApproved) load(); }, [isApproved, load]);

  if (!isApproved) return <LockScreen />;

  const totalRevenue = orders.reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0);

  const stats = [
    { label: 'Total', value: orders.length, color: G, key: 'all' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending' || o.order_status === 'pending').length, color: '#ca8a04', key: 'pending' },
    { label: 'In Progress', value: orders.filter(o => (o.status || o.order_status) === 'in_progress').length, color: '#2563eb', key: 'in_progress' },
    { label: 'Completed', value: orders.filter(o => (o.status || o.order_status) === 'completed').length, color: '#16a34a', key: 'completed' },
  ];

  const filtered = orders.filter(o => {
    const st = o.status || o.order_status || '';
    const matchFilter = filter === 'all' || st === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || (o.order_number || '').toLowerCase().includes(q) || (o.customer_name || '').toLowerCase().includes(q) || (o.garment_type || '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(true);
    try {
      await apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      setViewOrder(v => v ? { ...v, status: newStatus, order_status: newStatus } : v);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>Orders</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.3 }}>Manage customer orders</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip icon={<AttachMoneyIcon sx={{ fontSize: '16px !important' }} />} label={`Rs ${totalRevenue.toLocaleString()}`}
            sx={{ bgcolor: '#f0fdf4', color: GL, fontWeight: 700, fontSize: '0.82rem', height: 32 }} />
          <IconButton onClick={load} sx={{ border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', '&:hover': { bgcolor: '#f8fafc' } }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper elevation={0} onClick={() => setFilter(s.key)} sx={{
              borderRadius: '16px', border: `1px solid ${filter === s.key ? s.color : '#e2e8f0'}`,
              p: 2.5, bgcolor: filter === s.key ? `${s.color}0d` : '#fff', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
              '&:hover': { borderColor: s.color, bgcolor: `${s.color}08` },
            }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.8rem', color: s.color }}>{s.value}</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.3 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }}
          sx={{ width: { xs: '100%', sm: 320 }, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: G }} /></Box>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 6, textAlign: 'center', bgcolor: '#fff' }}>
          <InboxOutlinedIcon sx={{ fontSize: 56, color: '#cbd5e1', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', mb: 0.5 }}>No orders found</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.83rem' }}>Orders from customers will appear here.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {['Order #', 'Customer', 'Garment', 'Amount', 'Due Date', 'Status', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((o) => {
                const id = o.id || o.order_id;
                const st = o.status || o.order_status || 'pending';
                return (
                  <TableRow key={id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', py: 1.5 }}>{o.order_number || `#${id}`}</TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#475569', py: 1.5 }}>{o.customer_name || 'N/A'}</TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#475569', py: 1.5 }}>{o.garment_type || 'N/A'}</TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600, py: 1.5 }}>
                      {o.total_amount ? `Rs ${parseFloat(o.total_amount).toLocaleString()}` : '—'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#475569', py: 1.5 }}>{o.due_date ? new Date(o.due_date).toLocaleDateString() : '—'}</TableCell>
                    <TableCell sx={{ py: 1.5 }}><StatusChip status={st} /></TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <IconButton size="small" onClick={() => setViewOrder(o)}
                        sx={{ color: GL, border: `1px solid ${GL}40`, borderRadius: '8px', '&:hover': { bgcolor: `${GL}10` } }}>
                        <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewOrder} onClose={() => setViewOrder(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}>
        {viewOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1 }}>
              Order Details — {viewOrder.order_number || `#${viewOrder.id || viewOrder.order_id}`}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                {[
                  ['Customer', viewOrder.customer_name],
                  ['Garment', viewOrder.garment_type],
                  ['Amount', viewOrder.total_amount ? `Rs ${parseFloat(viewOrder.total_amount).toLocaleString()}` : '—'],
                  ['Due Date', viewOrder.due_date ? new Date(viewOrder.due_date).toLocaleDateString() : '—'],
                  ['Status', null],
                ].map(([label, val]) => (
                  <Grid item xs={6} key={label}>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600, mb: 0.3 }}>{label}</Typography>
                    {label === 'Status'
                      ? <StatusChip status={viewOrder.status || viewOrder.order_status || 'pending'} />
                      : <Typography sx={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: 600 }}>{val || '—'}</Typography>
                    }
                  </Grid>
                ))}
              </Grid>

              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', mb: 1.5 }}>Update Status</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['pending', 'in_progress', 'completed', 'cancelled'].map(s => {
                  const m = STATUS_META[s];
                  const current = (viewOrder.status || viewOrder.order_status) === s;
                  return (
                    <Button key={s} disabled={updating || current} onClick={() => handleStatusUpdate(viewOrder.id || viewOrder.order_id, s)}
                      size="small" variant={current ? 'contained' : 'outlined'}
                      sx={{
                        borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem',
                        ...(current ? { bgcolor: m.color, color: '#fff', '&:hover': { bgcolor: m.color } } : { borderColor: m.color, color: m.color, '&:hover': { bgcolor: `${m.color}10` } }),
                      }}>
                      {m.label}
                    </Button>
                  );
                })}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setViewOrder(null)} sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none', borderRadius: '12px' }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
