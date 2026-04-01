/**
 * Tailors Shops Management
 * Business Type & Specialization dropdowns loaded live from DB
 * Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel,
  MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography, CircularProgress
} from '@mui/material';
import {
  Add, Delete, Edit, Store as StoreIcon, Close as CloseIcon,
  Business as BizIcon, Category as CatIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { api, authHeaders } from '../../utils/api';

const EMPTY_FORM = {
  shop_name: '', owner_name: '', contact_number: '',
  city: '', address: '',
  business_type_id: '', specialization_id: '',
  shop_status: 'active'
};

const STATUS_COLOR = { active: '#16A34A', inactive: '#94A3B8', suspended: '#EF4444' };
const STATUS_BG    = { active: '#F0FDF4', inactive: '#F8FAFC', suspended: '#FEF2F2' };

export default function TailorsShops() {
  const [rows, setRows]                   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [open, setOpen]                   = useState(false);
  const [editingRow, setEditingRow]       = useState(null);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filteredSpecs, setFilteredSpecs] = useState([]);
  const [snackbar, setSnackbar]           = useState({ open: false, message: '', severity: 'success' });

  const toast = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // ── Fetch shops (enriched with type/spec names) ────────────────────────────
  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/business/shops/enriched', { headers: authHeaders() });
      setRows(res.data.data || []);
    } catch (e) {
      toast(e.response?.data?.error?.message || 'Failed to load shops', 'error');
    } finally { setLoading(false); }
  }, []);

  // ── Fetch dropdown options ─────────────────────────────────────────────────
  const fetchOptions = useCallback(async () => {
    try {
      const [btRes, spRes] = await Promise.all([
        api.get('/business/options/business-types', { headers: authHeaders() }),
        api.get('/business/options/specializations', { headers: authHeaders() })
      ]);
      setBusinessTypes(btRes.data.data || []);
      setSpecializations(spRes.data.data || []);
      setFilteredSpecs(spRes.data.data || []);
    } catch (_) {}
  }, []);

  useEffect(() => { fetchRows(); fetchOptions(); }, [fetchRows, fetchOptions]);

  // ── When Business Type changes, filter specializations ────────────────────
  const handleTypeChange = (typeId) => {
    setForm(prev => ({ ...prev, business_type_id: typeId, specialization_id: '' }));
    if (typeId) {
      setFilteredSpecs(specializations.filter(s => !s.business_type_id || s.business_type_id === typeId));
    } else {
      setFilteredSpecs(specializations);
    }
  };

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // ── Open dialogs ───────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingRow(null);
    setForm(EMPTY_FORM);
    setFilteredSpecs(specializations);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setForm({
      shop_name: row.shop_name || '', owner_name: row.owner_name || '',
      contact_number: row.contact_number || '', city: row.city || '',
      address: row.address || '',
      business_type_id: row.business_type_id || '',
      specialization_id: row.specialization_id || '',
      shop_status: row.shop_status || 'active'
    });
    if (row.business_type_id) {
      setFilteredSpecs(specializations.filter(s => !s.business_type_id || s.business_type_id === row.business_type_id));
    } else {
      setFilteredSpecs(specializations);
    }
    setOpen(true);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const submit = async () => {
    if (!form.shop_name || !form.owner_name) {
      toast('Shop Name and Owner Name are required', 'error'); return;
    }
    try {
      const payload = { ...form };
      if (!payload.business_type_id) delete payload.business_type_id;
      if (!payload.specialization_id) delete payload.specialization_id;

      if (editingRow) {
        await api.put(`/business/shops/${editingRow.shop_id}`, payload, { headers: authHeaders() });
        toast('Shop updated successfully');
      } else {
        await api.post('/business/shops', payload, { headers: authHeaders() });
        toast('Shop added successfully');
      }
      setOpen(false);
      fetchRows();
    } catch (e) { toast(e.response?.data?.error?.message || 'Operation failed', 'error'); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const remove = async (row) => {
    try {
      await api.delete(`/business/shops/${row.shop_id}`, { headers: authHeaders() });
      toast('Shop deleted'); fetchRows();
    } catch (e) { toast('Delete failed', 'error'); }
  };

  return (
    <Layout title="Tailors Shops">
      <Paper sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Header */}
        <Box sx={{ px: 3, py: 2.5, background: 'linear-gradient(135deg,#1E293B,#334155)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StoreIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Tailors Shops</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{rows.length} shop{rows.length !== 1 ? 's' : ''} registered</Typography>
            </Box>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}
            sx={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', borderRadius: '10px', fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 12px rgba(59,130,246,0.4)', '&:hover': { background: 'linear-gradient(135deg,#2563EB,#1E40AF)' } }}>
            Add New Shop
          </Button>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['ID','Shop Name','Owner','Contact','City','Business Type','Specialization','Status','Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 800, bgcolor: '#F8FAFC', color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: '2px solid #E2E8F0', whiteSpace: 'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={28} /></TableCell></TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow><TableCell colSpan={9} sx={{ textAlign: 'center', py: 6, color: '#94A3B8', fontWeight: 600 }}>No shops found. Add your first shop.</TableCell></TableRow>
              )}
              {rows.map(row => (
                <TableRow key={row.shop_id} hover sx={{ '&:hover': { bgcolor: '#F8FAFC' }, transition: 'background 0.15s' }}>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#CBD5E1', fontFamily: 'monospace', fontWeight: 700 }}>#{row.shop_id}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.875rem' }}>{row.shop_name}</TableCell>
                  <TableCell sx={{ color: '#475569', fontSize: '0.85rem' }}>{row.owner_name}</TableCell>
                  <TableCell sx={{ color: '#64748B', fontSize: '0.82rem' }}>{row.contact_number || '—'}</TableCell>
                  <TableCell sx={{ color: '#64748B', fontSize: '0.82rem' }}>{row.city || '—'}</TableCell>
                  <TableCell>
                    {row.business_type_name
                      ? <Chip label={row.business_type_name} size="small" icon={<BizIcon sx={{ fontSize: '13px !important' }} />} sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #BFDBFE' }} />
                      : <Typography sx={{ fontSize: '0.75rem', color: '#CBD5E1' }}>—</Typography>}
                  </TableCell>
                  <TableCell>
                    {row.specialization_name
                      ? <Chip label={row.specialization_name} size="small" icon={<CatIcon sx={{ fontSize: '13px !important' }} />} sx={{ bgcolor: '#F5F3FF', color: '#7C3AED', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #DDD6FE' }} />
                      : <Typography sx={{ fontSize: '0.75rem', color: '#CBD5E1' }}>—</Typography>}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.4, borderRadius: '20px', bgcolor: STATUS_BG[row.shop_status] || '#F8FAFC', color: STATUS_COLOR[row.shop_status] || '#64748B', fontWeight: 700, fontSize: '0.72rem', textTransform: 'capitalize' }}>
                      {row.shop_status}
                    </Box>
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

      {/* ── Add / Edit Dialog ──────────────────────────────────────────────── */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' } }}>

        {/* Dialog Header */}
        <Box sx={{ background: 'linear-gradient(135deg,#1E293B,#334155)', px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(59,130,246,0.4)' }}>
            <StoreIcon sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', lineHeight: 1.2 }}>
              {editingRow ? 'Edit Tailor Shop' : 'Add New Tailor Shop'}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.2 }}>
              Fill in the details to {editingRow ? 'update the' : 'register a new'} tailor shop
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#64748B', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3, bgcolor: '#FAFAFA' }}>

          {/* Basic Info */}
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StoreIcon sx={{ fontSize: 14 }} /> Shop Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Shop Name *" value={form.shop_name} onChange={e => set('shop_name', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Owner Name *" value={form.owner_name} onChange={e => set('owner_name', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contact Number" value={form.contact_number} onChange={e => set('contact_number', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="City" value={form.city} onChange={e => set('city', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" value={form.address} onChange={e => set('address', e.target.value)} multiline rows={2}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Business Details */}
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BizIcon sx={{ fontSize: 14 }} /> Business Details
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            {/* Business Type Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Business Type</InputLabel>
                <Select value={form.business_type_id} label="Business Type" onChange={e => handleTypeChange(e.target.value)}
                  sx={{ borderRadius: '12px', bgcolor: '#fff' }}>
                  <MenuItem value=""><em>— Select Business Type —</em></MenuItem>
                  {businessTypes.length === 0 && (
                    <MenuItem disabled sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      No types found — add from Business Type Management
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

            {/* Specialization Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Specialization</InputLabel>
                <Select value={form.specialization_id} label="Specialization" onChange={e => set('specialization_id', e.target.value)}
                  sx={{ borderRadius: '12px', bgcolor: '#fff' }}>
                  <MenuItem value=""><em>— Select Specialization —</em></MenuItem>
                  {filteredSpecs.length === 0 && (
                    <MenuItem disabled sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      No specializations found — add from Specialization Management
                    </MenuItem>
                  )}
                  {filteredSpecs.map(sp => (
                    <MenuItem key={sp.id} value={sp.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CatIcon sx={{ fontSize: 16, color: '#7C3AED' }} />
                        {sp.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.shop_status} label="Status" onChange={e => set('shop_status', e.target.value)}
                  sx={{ borderRadius: '12px', bgcolor: '#fff' }}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Helper note */}
          {(businessTypes.length === 0 || specializations.length === 0) && (
            <Box sx={{ p: 2, bgcolor: '#FFFBEB', borderRadius: '12px', border: '1px solid #FEF08A', display: 'flex', gap: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#92400E' }}>
                💡 To populate the dropdowns, first add records in
                <strong> Business Type Management</strong> and <strong>Specialization Management</strong> pages.
              </Typography>
            </Box>
          )}
        </DialogContent>

        {/* Dialog Footer */}
        <Box sx={{ px: 3, py: 2, bgcolor: '#fff', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={() => setOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B', bgcolor: '#F1F5F9', borderRadius: '10px', px: 3, '&:hover': { bgcolor: '#E2E8F0' } }}>
            Cancel
          </Button>
          <Button onClick={submit} variant="contained"
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 3, background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', boxShadow: '0 4px 12px rgba(59,130,246,0.35)', '&:hover': { background: 'linear-gradient(135deg,#2563EB,#1E40AF)' } }}>
            {editingRow ? 'Update Shop' : '+ Add Shop'}
          </Button>
        </Box>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3500}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Layout>
  );
}
