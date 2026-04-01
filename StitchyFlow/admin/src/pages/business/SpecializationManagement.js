/**
 * Specialization Management — Professional CRUD Page
 * Business Type dropdown loaded live from DB
 * Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
 * Phone/WhatsApp: +92 333 3836851 | info@logixinventor.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogContent,
  FormControl, Grid, IconButton, InputLabel, MenuItem,
  Paper, Select, Snackbar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import {
  Add, Delete, Edit, Close as CloseIcon,
  Category as CatIcon, Business as BizIcon,
  CheckCircle, Cancel
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { api, authHeaders } from '../../utils/api';

const EMPTY = { specialization_name: '', specialization_code: '', business_type_id: '', description: '', is_active: 1 };

export default function SpecializationManagement() {
  const [rows, setRows]               = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [open, setOpen]               = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(EMPTY);
  const [snackbar, setSnackbar]       = useState({ open: false, message: '', severity: 'success' });

  const toast = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const set   = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch specializations with joined business type name
      const [specRes, btRes] = await Promise.all([
        api.get('/business/specializations', { headers: authHeaders() }),
        api.get('/business/options/business-types', { headers: authHeaders() })
      ]);
      setRows(specRes.data.data || []);
      setBusinessTypes(btRes.data.data || []);
    } catch (e) { toast('Failed to load data', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit   = (row) => {
    setEditing(row);
    setForm({
      specialization_name: row.specialization_name || '',
      specialization_code: row.specialization_code || '',
      business_type_id: row.business_type_id || '',
      description: row.description || '',
      is_active: row.is_active ?? 1
    });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.specialization_name.trim()) { toast('Specialization Name is required', 'error'); return; }
    try {
      const payload = { ...form };
      if (!payload.business_type_id) delete payload.business_type_id;
      if (editing) {
        await api.put(`/business/specializations/${editing.specialization_id}`, payload, { headers: authHeaders() });
        toast('Specialization updated');
      } else {
        await api.post('/business/specializations', payload, { headers: authHeaders() });
        toast('Specialization added');
      }
      setOpen(false); fetchRows();
    } catch (e) { toast(e.response?.data?.error?.message || 'Operation failed', 'error'); }
  };

  const remove = async (row) => {
    try {
      await api.delete(`/business/specializations/${row.specialization_id}`, { headers: authHeaders() });
      toast('Deleted successfully'); fetchRows();
    } catch (e) { toast('Delete failed', 'error'); }
  };

  // Helper: get type name by id
  const getTypeName = (id) => businessTypes.find(bt => bt.id === id)?.name || null;

  return (
    <Layout title="Specialization Management">
      <Paper sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Header */}
        <Box sx={{ px: 3, py: 2.5, background: 'linear-gradient(135deg,#1E293B,#334155)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CatIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Specialization Management</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{rows.length} specialization{rows.length !== 1 ? 's' : ''} configured</Typography>
            </Box>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}
            sx={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', borderRadius: '10px', fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 12px rgba(124,58,237,0.4)', '&:hover': { background: 'linear-gradient(135deg,#6D28D9,#5B21B6)' } }}>
            + ADD NEW
          </Button>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['ID', 'Specialization Name', 'Code', 'Business Type', 'Description', 'Status', 'Created At', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 800, bgcolor: '#F8FAFC', color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: '2px solid #E2E8F0', whiteSpace: 'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={28} /></TableCell></TableRow>}
              {!loading && rows.length === 0 && (
                <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <CatIcon sx={{ fontSize: 40, color: '#CBD5E1' }} />
                    <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No specializations yet</Typography>
                    <Typography sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>Click "+ ADD NEW" to create your first specialization</Typography>
                  </Box>
                </TableCell></TableRow>
              )}
              {rows.map(row => {
                const typeName = getTypeName(row.business_type_id);
                return (
                  <TableRow key={row.specialization_id} hover sx={{ '&:hover': { bgcolor: '#F8FAFC' }, transition: 'background 0.15s' }}>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#CBD5E1', fontFamily: 'monospace', fontWeight: 700 }}>#{row.specialization_id}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.875rem' }}>{row.specialization_name}</TableCell>
                    <TableCell>
                      {row.specialization_code
                        ? <Chip label={row.specialization_code} size="small" sx={{ bgcolor: '#F5F3FF', color: '#7C3AED', fontWeight: 700, fontSize: '0.72rem', fontFamily: 'monospace', border: '1px solid #DDD6FE' }} />
                        : <Typography sx={{ fontSize: '0.75rem', color: '#CBD5E1' }}>—</Typography>}
                    </TableCell>
                    <TableCell>
                      {typeName
                        ? <Chip label={typeName} size="small" icon={<BizIcon sx={{ fontSize: '13px !important' }} />} sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #BFDBFE' }} />
                        : <Typography sx={{ fontSize: '0.75rem', color: '#CBD5E1' }}>—</Typography>}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#64748B' }}>{row.description || '—'}</Typography>
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' } }}>
        <Box sx={{ background: 'linear-gradient(135deg,#1E293B,#334155)', px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: '12px', background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CatIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{editing ? 'Edit Specialization' : 'Add Specialization'}</Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>This will appear as a dropdown option in Tailor Shops</Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#64748B', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}><CloseIcon fontSize="small" /></IconButton>
        </Box>

        <DialogContent sx={{ p: 3, bgcolor: '#FAFAFA' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Specialization Name *" value={form.specialization_name} onChange={e => set('specialization_name', e.target.value)}
                placeholder="e.g. Bridal Wear, Men's Suits, Alterations"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Code" value={form.specialization_code} onChange={e => set('specialization_code', e.target.value)}
                placeholder="e.g. BRIDAL, MENS_SUITS"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={12}>
              {/* Business Type — live dropdown */}
              <FormControl fullWidth>
                <InputLabel>Business Type (Optional)</InputLabel>
                <Select value={form.business_type_id} label="Business Type (Optional)" onChange={e => set('business_type_id', e.target.value)}
                  sx={{ borderRadius: '12px', bgcolor: '#fff' }}>
                  <MenuItem value=""><em>— Not linked to a type —</em></MenuItem>
                  {businessTypes.length === 0 && (
                    <MenuItem disabled sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      No types found — add from Business Type Management first
                    </MenuItem>
                  )}
                  {businessTypes.map(bt => (
                    <MenuItem key={bt.id} value={bt.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BizIcon sx={{ fontSize: 16, color: '#2563EB' }} />
                        {bt.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" value={form.description} onChange={e => set('description', e.target.value)}
                multiline rows={3} placeholder="Brief description of this specialization..."
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
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 3, background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', boxShadow: '0 4px 12px rgba(124,58,237,0.35)', '&:hover': { background: 'linear-gradient(135deg,#6D28D9,#5B21B6)' } }}>
            {editing ? 'Update' : '+ Add Specialization'}
          </Button>
        </Box>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Layout>
  );
}
