import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Grid, Chip, Divider,
  TextField, Dialog, DialogContent, DialogTitle, IconButton,
  MenuItem, CircularProgress, Alert, Switch, FormControlLabel,
} from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PercentIcon from '@mui/icons-material/Percent';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { apiFetch } from '../../utils/api';

const G  = '#1b4332';
const GL = '#2d6a4f';
const DTYPES = ['Percentage (%)','Fixed Amount (PKR)','Free Delivery','Buy 1 Get 1'];
const EMPTY  = { title: '', discountType: '', discountValue: '', promoCode: '', startDate: '', endDate: '', description: '', is_active: true };

export default function PromotionsSection({ isApproved }) {
  const [open, setOpen]       = useState(false);
  const [edit, setEdit]       = useState(null);
  const [list, setList]       = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState('');

  const load = () => {
    setLoading(true);
    apiFetch('/business/settings')
      .then(r => setList((r.data || []).filter(s => s.setting_group === 'promotions')))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (isApproved) load(); else setLoading(false); }, [isApproved]);

  const openAdd  = () => { setForm(EMPTY); setEdit(null); setError(''); setOpen(true); };
  const openEdit = p => {
    let v = {}; try { v = JSON.parse(p.setting_value); } catch {}
    setForm({ title: v.title || p.setting_key, discountType: v.discountType || '', discountValue: v.discountValue || '', promoCode: v.promoCode || '', startDate: v.startDate || '', endDate: v.endDate || '', description: v.description || '', is_active: !!p.is_active });
    setEdit(p); setError(''); setOpen(true);
  };

  const save = async () => {
    if (!form.title) { setError('Promotion title is required.'); return; }
    setSaving(true); setError('');
    const val = JSON.stringify({ title: form.title, discountType: form.discountType, discountValue: form.discountValue, promoCode: form.promoCode, startDate: form.startDate, endDate: form.endDate, description: form.description });
    try {
      if (edit) {
        await apiFetch(`/business/settings/${edit.setting_id}`, { method: 'PUT', body: JSON.stringify({ setting_value: val, is_active: form.is_active ? 1 : 0 }) });
      } else {
        await apiFetch('/business/settings', { method: 'POST', body: JSON.stringify({ setting_key: form.title.replace(/\s+/g,'_').toLowerCase() + '_' + Date.now(), setting_value: val, setting_group: 'promotions', is_active: form.is_active ? 1 : 0 }) });
      }
      setOpen(false); load();
    } catch (e) { setError(e.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const del  = async id => { if (!window.confirm('Delete this promotion?')) return; try { await apiFetch(`/business/settings/${id}`, { method: 'DELETE' }); load(); } catch (e) { alert(e.message); } };
  const copy = code => { navigator.clipboard.writeText(code).then(() => { setCopied(code); setTimeout(() => setCopied(''), 2000); }); };
  const pv   = v => { try { return JSON.parse(v); } catch { return {}; } };
  const expired = d => d && new Date(d) < new Date();

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
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>Promotions</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.25 }}>Create discount offers and promo codes to attract customers</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openAdd}
          sx={{ bgcolor: G, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 2.5, boxShadow: 'none', '&:hover': { bgcolor: GL } }}>
          Create Promotion
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Promos', value: list.length, color: '#2563eb' },
          { label: 'Active', value: list.filter(p => p.is_active).length, color: '#16a34a' },
          { label: 'Inactive', value: list.filter(p => !p.is_active).length, color: '#64748b' },
          { label: 'Expired', value: list.filter(p => { const v = pv(p.setting_value); return expired(v.endDate); }).length, color: '#dc2626' },
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
          <LocalOfferOutlinedIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.5 }}>No promotions yet</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.84rem', mb: 2.5 }}>Create your first promotion to boost sales.</Typography>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openAdd}
            sx={{ bgcolor: G, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 3, boxShadow: 'none', '&:hover': { bgcolor: GL } }}>
            Create Promotion
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {list.map(p => {
            const v = pv(p.setting_value);
            const exp = expired(v.endDate);
            return (
              <Grid item xs={12} sm={6} lg={4} key={p.setting_id}>
                <Paper elevation={0} sx={{ borderRadius: '16px', p: 2.5, border: '1px solid #e8ecf1', bgcolor: '#fff', transition: 'all 0.15s', '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.09)', transform: 'translateY(-1px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: '13px', bgcolor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PercentIcon sx={{ fontSize: 24, color: '#d97706' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.93rem' }}>{v.title || p.setting_key}</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.74rem' }}>{v.discountType || 'Discount'}</Typography>
                      </Box>
                    </Box>
                    <Chip label={exp ? 'Expired' : p.is_active ? 'Active' : 'Inactive'} size="small"
                      sx={{ bgcolor: exp ? '#fef2f2' : p.is_active ? '#f0fdf4' : '#f1f5f9', color: exp ? '#dc2626' : p.is_active ? '#16a34a' : '#64748b', fontWeight: 700, fontSize: '0.68rem' }} />
                  </Box>
                  {v.discountValue && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}><PercentIcon sx={{ fontSize: 14, color: '#d97706' }} /><Typography sx={{ fontWeight: 700, color: '#d97706', fontSize: '0.88rem' }}>{v.discountValue} {v.discountType?.includes('%') ? '%' : 'PKR'} off</Typography></Box>}
                  {v.promoCode && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1, p: 1, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0' }}>
                      <Typography sx={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 800, flex: 1, letterSpacing: '0.06em' }}>{v.promoCode}</Typography>
                      <IconButton size="small" onClick={() => copy(v.promoCode)} sx={{ p: 0.25 }}>
                        {copied === v.promoCode ? <CheckIcon sx={{ fontSize: 14, color: '#16a34a' }} /> : <ContentCopyIcon sx={{ fontSize: 14, color: '#94a3b8' }} />}
                      </IconButton>
                    </Box>
                  )}
                  {(v.startDate || v.endDate) && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}><CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: '#94a3b8' }} /><Typography sx={{ fontSize: '0.73rem', color: '#94a3b8' }}>{v.startDate || '—'} → {v.endDate || '—'}</Typography></Box>}
                  {v.description && <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mb: 1.25, lineHeight: 1.55 }}>{v.description}</Typography>}
                  <Divider sx={{ my: 1.25 }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />} onClick={() => openEdit(p)} sx={{ color: '#2563eb', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>Edit</Button>
                    <Button size="small" startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />} onClick={() => del(p.setting_id)} sx={{ color: '#dc2626', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>Delete</Button>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
        <Box sx={{ height: 4, bgcolor: '#d97706' }} />
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>{edit ? 'Edit Promotion' : 'Create Promotion'}</Typography>
          <IconButton size="small" onClick={() => setOpen(false)}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}
            <TextField label="Promotion Title *" fullWidth size="small" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <TextField select label="Discount Type" fullWidth size="small" value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
              {DTYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField label="Discount Value" fullWidth size="small" type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} />
            <TextField label="Promo Code (optional)" fullWidth size="small" value={form.promoCode} onChange={e => setForm({ ...form, promoCode: e.target.value.toUpperCase() })} />
            <Grid container spacing={1.5}>
              <Grid item xs={6}><TextField label="Start Date" fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></Grid>
              <Grid item xs={6}><TextField label="End Date" fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></Grid>
            </Grid>
            <TextField label="Description" fullWidth size="small" multiline rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <FormControlLabel control={<Switch checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} size="small" />} label={<Typography sx={{ fontSize: '0.85rem' }}>Active</Typography>} />
            <Button variant="contained" fullWidth disabled={saving} onClick={save}
              sx={{ bgcolor: G, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', py: 1.3, boxShadow: 'none', '&:hover': { bgcolor: GL } }}>
              {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : edit ? 'Save Changes' : 'Create Promotion'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
