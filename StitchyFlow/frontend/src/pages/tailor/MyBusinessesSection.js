import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Grid, Chip, Divider,
  TextField, Dialog, DialogContent, DialogTitle, IconButton,
  MenuItem, CircularProgress, Alert,
} from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { apiFetch } from '../../utils/api';

const G = '#1b4332';
const GL = '#2d6a4f';
const EMPTY = { shop_name: '', owner_name: '', address: '', city: '', contact_number: '', shop_status: 'active', business_type_id: '' };

export default function MyBusinessesSection({ isApproved }) {
  const [open, setOpen]     = useState(false);
  const [list, setList]     = useState([]);
  const [edit, setEdit]     = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const [types, setTypes]   = useState([]);

  const load = () => {
    setLoading(true);
    apiFetch('/business/shops/enriched').then(r => setList(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isApproved) { setLoading(false); return; }
    load();
    apiFetch('/business/options/business-types').then(r => setTypes(r.data || [])).catch(() => {});
  }, [isApproved]);

  const openAdd  = () => { setForm(EMPTY); setEdit(null); setError(''); setOpen(true); };
  const openEdit = b => {
    setForm({ shop_name: b.shop_name || '', owner_name: b.owner_name || '', address: b.address || '', city: b.city || '', contact_number: b.contact_number || '', shop_status: b.shop_status || 'active', business_type_id: b.business_type_id || '' });
    setEdit(b); setError(''); setOpen(true);
  };

  const save = async () => {
    if (!form.shop_name || !form.owner_name) { setError('Shop name and owner name are required.'); return; }
    setSaving(true); setError('');
    try {
      if (edit) await apiFetch(`/business/shops/${edit.shop_id}`, { method: 'PUT', body: JSON.stringify(form) });
      else       await apiFetch('/business/shops', { method: 'POST', body: JSON.stringify(form) });
      setOpen(false); load();
    } catch (e) { setError(e.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm('Delete this business?')) return;
    try { await apiFetch(`/business/shops/${id}`, { method: 'DELETE' }); load(); }
    catch (e) { alert(e.message); }
  };

  const badge = s => s === 'active'
    ? { bg: '#f0fdf4', color: '#16a34a', label: 'Active' }
    : s === 'suspended'
    ? { bg: '#fef2f2', color: '#dc2626', label: 'Suspended' }
    : { bg: '#f1f5f9', color: '#64748b', label: 'Inactive' };

  if (!isApproved) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 14 }}>
      <Box sx={{ width: 68, height: 68, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <LockOutlinedIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
      </Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.5 }}>Section Locked</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.84rem', textAlign: 'center', maxWidth: 340 }}>Available once your tailor account is approved by admin.</Typography>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>My Businesses</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.25 }}>Manage your registered tailor shops</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openAdd}
          sx={{ bgcolor: G, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 2.5, boxShadow: 'none', '&:hover': { bgcolor: GL } }}>
          Add Business
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total',     value: list.length,                                          color: '#2563eb' },
          { label: 'Active',    value: list.filter(b => b.shop_status === 'active').length,   color: '#16a34a' },
          { label: 'Inactive',  value: list.filter(b => b.shop_status === 'inactive').length, color: '#64748b' },
          { label: 'Suspended', value: list.filter(b => b.shop_status === 'suspended').length,color: '#dc2626' },
        ].map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper elevation={0} sx={{ borderRadius: '14px', p: 2.25, border: '1px solid #e2e8f0', bgcolor: '#fff', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, mt: 0.5 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={32} sx={{ color: G }} /></Box>
      ) : list.length === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: '16px', p: 8, border: '1px solid #e8ecf1', bgcolor: '#fff', textAlign: 'center' }}>
          <StorefrontOutlinedIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.5 }}>No businesses yet</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.84rem', mb: 2.5 }}>Register your first tailor shop to start receiving orders.</Typography>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openAdd}
            sx={{ bgcolor: G, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 3, boxShadow: 'none', '&:hover': { bgcolor: GL } }}>
            Register Business
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {list.map(b => {
            const s = badge(b.shop_status);
            return (
              <Grid item xs={12} sm={6} lg={4} key={b.shop_id}>
                <Paper elevation={0} sx={{ borderRadius: '16px', p: 2.5, border: '1px solid #e8ecf1', bgcolor: '#fff', transition: 'all 0.15s', '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.09)', transform: 'translateY(-1px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: '13px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <StorefrontOutlinedIcon sx={{ fontSize: 24, color: '#475569' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.93rem' }}>{b.shop_name}</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.74rem' }}>{b.business_type_name || b.owner_name || '—'}</Typography>
                      </Box>
                    </Box>
                    <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.68rem' }} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, mb: 1.75 }}>
                    {b.address && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}><LocationOnOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} /><Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>{b.address}{b.city ? `, ${b.city}` : ''}</Typography></Box>}
                    {b.contact_number && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}><PhoneOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} /><Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>{b.contact_number}</Typography></Box>}
                    {b.specialization_name && <Chip label={b.specialization_name} size="small" sx={{ alignSelf: 'flex-start', bgcolor: '#f0fdf4', color: G, fontSize: '0.68rem', fontWeight: 600 }} />}
                  </Box>
                  <Divider sx={{ my: 1.25 }} />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button size="small" startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />} onClick={() => openEdit(b)} sx={{ color: '#2563eb', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>Edit</Button>
                    <Button size="small" startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />} onClick={() => del(b.shop_id)} sx={{ color: '#dc2626', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>Delete</Button>
                    <Box sx={{ flex: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <VerifiedOutlinedIcon sx={{ fontSize: 14, color: b.shop_status === 'active' ? '#16a34a' : '#94a3b8' }} />
                      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>Verified</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
        <Box sx={{ height: 4, bgcolor: G }} />
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>{edit ? 'Edit Business' : 'Register New Business'}</Typography>
          <IconButton size="small" onClick={() => setOpen(false)}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}
            <TextField label="Shop Name *" fullWidth size="small" value={form.shop_name} onChange={e => setForm({ ...form, shop_name: e.target.value })} />
            <TextField label="Owner Name *" fullWidth size="small" value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} />
            {types.length > 0 && (
              <TextField select label="Business Type" fullWidth size="small" value={form.business_type_id} onChange={e => setForm({ ...form, business_type_id: e.target.value })}>
                {types.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
              </TextField>
            )}
            <Grid container spacing={1.5}>
              <Grid item xs={8}><TextField label="Address" fullWidth size="small" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></Grid>
              <Grid item xs={4}><TextField label="City" fullWidth size="small" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></Grid>
            </Grid>
            <TextField label="Contact Number" fullWidth size="small" value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} />
            <TextField select label="Status" fullWidth size="small" value={form.shop_status} onChange={e => setForm({ ...form, shop_status: e.target.value })}>
              {['active', 'inactive'].map(s => <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>)}
            </TextField>
            <Button variant="contained" fullWidth disabled={saving} onClick={save}
              sx={{ bgcolor: G, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', py: 1.3, boxShadow: 'none', '&:hover': { bgcolor: GL } }}>
              {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : edit ? 'Save Changes' : 'Register Business'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
