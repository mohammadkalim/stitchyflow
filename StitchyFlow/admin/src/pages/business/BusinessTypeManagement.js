/**
 * Business Type Management — Professional CRUD Page
 * Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
 * Phone/WhatsApp: +92 333 3836851 | info@logixinventor.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogContent,
  Divider, FormControl, Grid, IconButton, InputLabel, MenuItem,
  Paper, Select, Snackbar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import {
  Add, Delete, Edit, Close as CloseIcon,
  Business as BizIcon, CheckCircle, Cancel
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { api, authHeaders } from '../../utils/api';

const EMPTY = { type_name: '', type_code: '', description: '', is_active: 1 };

export default function BusinessTypeManagement() {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const toast = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const set   = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/business/businessTypes', { headers: authHeaders() });
      setRows(res.data.data || []);
    } catch (e) { toast('Failed to load data', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit   = (row) => {
    setEditing(row);
    setForm({ type_name: row.type_name || '', type_code: row.type_code || '', description: row.description || '', is_active: row.is_active ?? 1 });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.type_name.trim()) { toast('Type Name is required', 'error'); return; }
    try {
      if (editing) {
        await api.put(`/business/businessTypes/${editing.type_id}`, form, { headers: authHeaders() });
        toast('Business type updated');
      } else {
        await api.post('/business/businessTypes', form, { headers: authHeaders() });
        toast('Business type added');
      }
      setOpen(false); fetchRows();
    } catch (e) { toast(e.response?.data?.error?.message || 'Operation failed', 'error'); }
  };

  const remove = async (row) => {
    try {
      await api.delete(`/business/businessTypes/${row.type_id}`, { headers: authHeaders() });
      toast('Deleted successfully'); fetchRows();
    } catch (e) { toast('Delete failed', 'error'); }
  };

  return (
    <Layout title="Business Type Management">
      <Paper sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Header */}
        <Box sx={{ px: 3, py: 2.5, background: 'linear-gradient(135deg,#1E293B,#334155)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BizIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Business Type Management</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{rows.length} type{rows.length !== 1 ? 's' : ''} configured</Typography>
            </Box>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}
            sx={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', borderRadius: '10px', fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 12px rgba(37,99,235,0.4)', '&:hover': { background: 'linear-gradient(135deg,#1D4ED8,#1E40AF)' } }}>
            + ADD NEW
          </Button>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['ID', 'Type Name', 'Type Code', 'Description', 'Status', 'Created At', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 800, bgcolor: '#F8FAFC', color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: '2px solid #E2E8F0', whiteSpace: 'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={28} /></TableCell></TableRow>}
              {!loading && rows.length === 0 && (
                <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <BizIcon sx={{ fontSize: 40, color: '#CBD5E1' }} />
                    <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No business types yet</Typography>
                    <Typography sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>Click "+ ADD NEW" to create your first business type</Typography>
                  </Box>
                </TableCell></TableRow>
              )}
              {rows.map(row => (
                <TableRow key={row.type_id} hover sx={{ '&:hover': { bgcolor: '#F8FAFC' }, transition: 'background 0.15s' }}>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#CBD5E1', fontFamily: 'monospace', fontWeight: 700 }}>#{row.type_id}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.875rem' }}>{row.type_name}</TableCell>
                  <TableCell>
                    {row.type_code
                      ? <Chip label={row.type_code} size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.72rem', fontFamily: 'monospace', border: '1px solid #BFDBFE' }} />
                      : <Typography sx={{ fontSize: '0.75rem', color: '#CBD5E1' }}>—</Typography>}
                  </TableCell>
                  <TableCell sx={{ color: '#64748B', fontSize: '0.82rem', maxWidth: 220 }}>
                    <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{row.description || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    {row.is_active
                      ? <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.4, borderRadius: '20px', bgcolor: '#F0FDF4', color: '#16A34A', fontWeight: 700, fontSize: '0.72rem' }}><CheckCircle sx={{ fontSize: 13 }} />Active</Box>
                      : <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.4, borderRadius: '20px', bgcolor: '#FEF2F2', color: '#EF4444', fontWeight: 700, fontSize: '0.72rem' }}><Cancel sx={{ fontSize: 13 }} />Inactive</Box>}
                  </TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => openEdit(row)} sx={{ width: 28, height: 28, bgcolor: '#EFF6FF', color: '#2563EB', borderRadius: '8px', '&:hover': { bgcolor: '#DBEAFE' } }}><Edit sx={{ fontSize: 14 }} /></IconButton>
                      <IconButton size="small" onClick={() => remove(row)} sx={{ width: 28, height: 28, bgcolor: '#FEF2F2', color: '#EF4444', borderRadius: '8px', '&:hover': { bgcolor: '#FEE2E2' } }}><Delete sx={{ fontSize: 14 }} /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' } }}>
        <Box sx={{ background: 'linear-gradient(135deg,#1E293B,#334155)', px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: '12px', background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BizIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{editing ? 'Edit Business Type' : 'Add Business Type'}</Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>This will appear as a dropdown option in Tailor Shops</Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#64748B', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}><CloseIcon fontSize="small" /></IconButton>
        </Box>

        <DialogContent sx={{ p: 3, bgcolor: '#FAFAFA' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Type Name *" value={form.type_name} onChange={e => set('type_name', e.target.value)}
                placeholder="e.g. Boutique, Tailor Shop, Alterations"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Type Code" value={form.type_code} onChange={e => set('type_code', e.target.value)}
                placeholder="e.g. BOUTIQUE, TAILOR_SHOP"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" value={form.description} onChange={e => set('description', e.target.value)}
                multiline rows={3} placeholder="Brief description of this business type..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.is_active} label="Status" onChange={e => set('is_active', e.target.value)}
                  sx={{ borderRadius: '12px', bgcolor: '#fff' }}>
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <Box sx={{ px: 3, py: 2, bgcolor: '#fff', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B', bgcolor: '#F1F5F9', borderRadius: '10px', px: 3, '&:hover': { bgcolor: '#E2E8F0' } }}>Cancel</Button>
          <Button onClick={submit} variant="contained"
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 3, background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow: '0 4px 12px rgba(37,99,235,0.35)', '&:hover': { background: 'linear-gradient(135deg,#1D4ED8,#1E40AF)' } }}>
            {editing ? 'Update Type' : '+ Add Type'}
          </Button>
        </Box>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Layout>
  );
}
