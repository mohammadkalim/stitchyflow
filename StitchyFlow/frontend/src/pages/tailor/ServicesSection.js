import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Grid, Chip, Divider,
  TextField, Dialog, DialogContent, DialogTitle, IconButton,
  MenuItem, CircularProgress, Alert, InputAdornment,
} from '@mui/material';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { apiFetch } from '../../utils/api';

const BLUE = '#2563eb';
const BLUE_DARK = '#1d4ed8';
const BLUE_SOFT = '#f5f9ff';
const BLUE_BORDER = '#dbeafe';
const TYPES = ['Custom Stitching','Alterations','Bridal Wear','Suits & Blazers','Traditional Wear','Fabric Selection','Embroidery','Kids Wear','Other'];
const TIMES = ['1-3 days','3-5 days','1 week','2 weeks','3-4 weeks','Custom'];
const EMPTY = { garment_type: '', description: '', price_min: '', price_max: '', delivery_time: '', order_status: 'pending' };

export default function ServicesSection({ isApproved }) {
  const [open, setOpen]       = useState(false);
  const [edit, setEdit]       = useState(null);
  const [list, setList]       = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const load = () => {
    setLoading(true);
    apiFetch('/business/orders')
      .then(r => setList(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (isApproved) load(); else setLoading(false); }, [isApproved]);

  const openAdd  = () => { setForm(EMPTY); setEdit(null); setError(''); setOpen(true); };
  const openEdit = s => {
    setForm({ garment_type: s.garment_type || '', description: s.description || '', price_min: s.price_min || s.total_amount || '', price_max: s.price_max || '', delivery_time: s.delivery_time || '', order_status: s.order_status || 'pending' });
    setEdit(s); setError(''); setOpen(true);
  };

  const save = async () => {
    if (!form.garment_type) { setError('Service type is required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        garment_type: form.garment_type,
        description: form.description,
        total_amount: form.price_min || 0,
        price_min: form.price_min || 0,
        price_max: form.price_max || 0,
        delivery_time: form.delivery_time,
        order_status: 'pending',
        tailor_name: 'Service Listing',
        order_number: edit?.order_number || `SVC-${Date.now()}`,
        customer_name: 'Service Listing',
      };
      if (edit) await apiFetch(`/business/orders/${edit.business_order_id}`, { method: 'PUT', body: JSON.stringify(payload) });
      else       await apiFetch('/business/orders', { method: 'POST', body: JSON.stringify(payload) });
      setOpen(false); load();
    } catch (e) { setError(e.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm('Delete this service?')) return;
    try { await apiFetch(`/business/orders/${id}`, { method: 'DELETE' }); load(); }
    catch (e) { alert(e.message); }
  };

  if (!isApproved) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 14 }}>
      <Box sx={{ width: 68, height: 68, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <LockOutlinedIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
      </Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.5 }}>Section Locked</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.84rem', textAlign: 'center', maxWidth: 340 }}>Available once your tailor account is approved by admin.</Typography>
    </Box>
  );

  const avg = list.length > 0 ? Math.round(list.reduce((a, s) => a + Number(s.total_amount || 0), 0) / list.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>Services</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.25 }}>Manage the tailoring services your shop offers</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openAdd}
          sx={{ bgcolor: BLUE, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 2.5, boxShadow: '0 8px 18px rgba(37,99,235,0.24)', '&:hover': { bgcolor: BLUE_DARK } }}>
          Add Service
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Services', value: list.length, color: '#2563eb' },
          { label: 'Available', value: list.filter(s => s.order_status !== 'cancelled').length, color: '#16a34a' },
          { label: 'Avg. Price (PKR)', value: avg.toLocaleString(), color: '#d97706' },
          { label: 'Completed', value: list.filter(s => s.order_status === 'completed').length, color: '#7c3aed' },
        ].map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper elevation={0} sx={{ borderRadius: '14px', p: 2.25, border: '1px solid #e2e8f0', bgcolor: BLUE_SOFT, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, mt: 0.5 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={32} sx={{ color: BLUE }} /></Box>
      ) : list.length === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: '16px', p: 8, border: '1px solid #dbeafe', bgcolor: BLUE_SOFT, textAlign: 'center' }}>
          <MiscellaneousServicesOutlinedIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.5 }}>No services added yet</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.84rem', mb: 2.5 }}>Add your tailoring services to attract customers.</Typography>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openAdd}
            sx={{ bgcolor: BLUE, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 3, boxShadow: '0 8px 18px rgba(37,99,235,0.24)', '&:hover': { bgcolor: BLUE_DARK } }}>
            Add First Service
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.25}>
          {list.map(s => (
            <Grid item xs={12} sm={6} lg={6} xl={4} key={s.business_order_id}>
              <Paper elevation={0} sx={{ borderRadius: '16px', p: 2.5, border: '1px solid #dbeafe', bgcolor: '#fff', transition: 'all 0.15s', '&:hover': { boxShadow: '0 10px 26px rgba(37,99,235,0.16)', transform: 'translateY(-2px)', borderColor: BLUE_BORDER } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '13px', bgcolor: BLUE_SOFT, border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MiscellaneousServicesOutlinedIcon sx={{ fontSize: 24, color: BLUE }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.93rem' }}>{s.garment_type}</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.74rem' }}>{s.delivery_time || 'Delivery TBD'}</Typography>
                    </Box>
                  </Box>
                  <Chip label={s.order_status === 'cancelled' ? 'Unavailable' : 'Available'} size="small"
                    sx={{ bgcolor: s.order_status === 'cancelled' ? '#fef2f2' : '#eff6ff', color: s.order_status === 'cancelled' ? '#dc2626' : '#2563eb', fontWeight: 700, fontSize: '0.68rem' }} />
                </Box>
                {s.description && <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mb: 1.25, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.description}</Typography>}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                    <AttachMoneyIcon sx={{ fontSize: 15, color: BLUE }} />
                    <Typography sx={{ fontWeight: 700, color: BLUE, fontSize: '0.88rem' }}>
                      PKR {s.price_min || s.total_amount || 0}{s.price_max && s.price_max !== s.price_min ? ` – ${s.price_max}` : ''}
                    </Typography>
                  </Box>
                  {s.delivery_time && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}><AccessTimeIcon sx={{ fontSize: 13, color: '#94a3b8' }} /><Typography sx={{ fontSize: '0.73rem', color: '#94a3b8' }}>{s.delivery_time}</Typography></Box>}
                </Box>
                <Divider sx={{ my: 1.25 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />} onClick={() => openEdit(s)} sx={{ color: BLUE, bgcolor: BLUE_SOFT, border: '1px solid #dbeafe', textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: '9px', '&:hover': { bgcolor: '#dbeafe' } }}>Edit</Button>
                  <Button size="small" startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />} onClick={() => del(s.business_order_id)} sx={{ color: '#dc2626', bgcolor: '#fef2f2', border: '1px solid #fecaca', textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: '9px', '&:hover': { bgcolor: '#fee2e2' } }}>Delete</Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', border: '1px solid #dbeafe', boxShadow: '0 20px 40px rgba(15,23,42,0.12)' } }}>
        <Box sx={{ height: 4, bgcolor: BLUE }} />
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>{edit ? 'Edit Service' : 'Add New Service'}</Typography>
          <IconButton size="small" onClick={() => setOpen(false)}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}
            <TextField select label="Service Type *" fullWidth size="small" value={form.garment_type} onChange={e => setForm({ ...form, garment_type: e.target.value })}>
              {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField label="Description" fullWidth size="small" multiline rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <Grid container spacing={1.5}>
              <Grid item xs={6}><TextField label="Min Price (PKR)" fullWidth size="small" type="number" value={form.price_min} onChange={e => setForm({ ...form, price_min: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start">Rs</InputAdornment> }} /></Grid>
              <Grid item xs={6}><TextField label="Max Price (PKR)" fullWidth size="small" type="number" value={form.price_max} onChange={e => setForm({ ...form, price_max: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start">Rs</InputAdornment> }} /></Grid>
            </Grid>
            <TextField select label="Delivery Time" fullWidth size="small" value={form.delivery_time} onChange={e => setForm({ ...form, delivery_time: e.target.value })}>
              {TIMES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <Button variant="contained" fullWidth disabled={saving} onClick={save}
              sx={{ bgcolor: BLUE, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', py: 1.3, boxShadow: '0 8px 18px rgba(37,99,235,0.24)', '&:hover': { bgcolor: BLUE_DARK } }}>
              {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : edit ? 'Save Changes' : 'Add Service'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
