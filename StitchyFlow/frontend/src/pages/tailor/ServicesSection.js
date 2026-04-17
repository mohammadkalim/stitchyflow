import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Grid, Chip, Divider,
  TextField, Dialog, DialogContent, DialogTitle, DialogActions, IconButton,
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
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { apiFetch } from '../../utils/api';

const BLUE = '#0ea5e9';
const BLUE_DARK = '#0284c7';
const BLUE_SOFT = '#f0f9ff';
const BLUE_BORDER = '#bae6fd';
const BLUE_MUTED = '#64748b';
const MAX_FREE_SERVICES = 4;

const CORPORATE_SELECT_MENU_PROPS = {
  PaperProps: {
    sx: {
      borderRadius: '12px',
      border: '1px solid #e0f2fe',
      boxShadow: '0 16px 48px rgba(14, 165, 233, 0.12)',
      maxHeight: 320,
      mt: 0.5,
      bgcolor: '#ffffff',
    },
  },
};

const CORPORATE_MENU_ITEM_SX = {
  fontSize: '0.875rem',
  color: '#334155',
  borderRadius: '8px',
  mx: 0.5,
  my: 0.1,
  '&:hover': { bgcolor: '#f0f9ff' },
  '&.Mui-selected': { bgcolor: '#e0f2fe', fontWeight: 600 },
  '&.Mui-selected:hover': { bgcolor: '#e0f2fe' },
};

const INPUT_SX = {
  '& .MuiInputLabel-root': { color: BLUE_MUTED, fontWeight: 600 },
  /* Stops “double” / ghosted label text on outlined Selects when value is empty */
  '& .MuiInputLabel-root.MuiInputLabel-shrink': {
    backgroundColor: '#fff',
    px: 0.5,
    borderRadius: '4px',
    zIndex: 1,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#fff',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#bae6fd' },
    '&.Mui-focused fieldset': { borderColor: BLUE, borderWidth: '1px' },
  },
};

const SELECT_INPUT_LABEL_PROPS = { shrink: true };
const TYPES = ['Custom Stitching','Alterations','Bridal Wear','Suits & Blazers','Traditional Wear','Fabric Selection','Embroidery','Kids Wear','Other'];
const TIMES = ['1-3 days','3-5 days','1 week','2 weeks','3-4 weeks','Custom'];
const EMPTY = { shop_id: '', garment_type: '', description: '', price_min: '', price_max: '', delivery_time: '', service_status: 'available' };

export default function ServicesSection({ isApproved }) {
  const [open, setOpen]       = useState(false);
  const [edit, setEdit]       = useState(null);
  const [list, setList]       = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [shops, setShops]     = useState([]);
  const [activeShopFilter, setActiveShopFilter] = useState('all');
  const [paymentOpen, setPaymentOpen] = useState(false);

  const shopIdInList = (id) => shops.some((s) => String(s.shop_id) === String(id));

  const load = () => {
    setLoading(true);
    apiFetch('/business/services')
      .then(r => setList(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isApproved) { setLoading(false); return; }
    load();
    apiFetch('/business/shops/enriched')
      .then((r) => {
        const ownShops = Array.isArray(r.data) ? r.data : [];
        setShops(ownShops);
      })
      .catch(() => setShops([]));
  }, [isApproved]);

  useEffect(() => {
    if (activeShopFilter === 'all') return;
    const ok = shops.some((s) => String(s.shop_id) === String(activeShopFilter));
    if (!ok) setActiveShopFilter('all');
  }, [shops, activeShopFilter]);

  useEffect(() => {
    if (!open) return;
    setForm((f) => {
      if (!shops.length) return { ...f, shop_id: '' };
      const ok = shops.some((s) => String(s.shop_id) === String(f.shop_id));
      if (ok) return f;
      return { ...f, shop_id: String(shops[0].shop_id) };
    });
  }, [open, shops]);

  const openAdd  = () => {
    if (list.length >= MAX_FREE_SERVICES) {
      setPaymentOpen(true);
      return;
    }
    const fromFilter = activeShopFilter !== 'all' && shopIdInList(activeShopFilter) ? activeShopFilter : '';
    const defaultShopId = fromFilter || (shops[0]?.shop_id ? String(shops[0].shop_id) : '');
    setForm({ ...EMPTY, shop_id: defaultShopId });
    setEdit(null);
    setError('');
    setOpen(true);
  };
  const openEdit = s => {
    setForm({
      shop_id: s.shop_id ? String(s.shop_id) : '',
      garment_type: s.garment_type || '',
      description: s.description || '',
      price_min: s.price_min || '',
      price_max: s.price_max || '',
      delivery_time: s.delivery_time || '',
      service_status: s.service_status || 'available',
    });
    setEdit(s); setError(''); setOpen(true);
  };

  const save = async () => {
    if (!form.garment_type) { setError('Service type is required.'); return; }
    if (!form.shop_id) { setError('Please select a business shop for this service.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        shop_id: Number(form.shop_id),
        garment_type: form.garment_type,
        description: form.description,
        price_min: form.price_min || 0,
        price_max: form.price_max || 0,
        delivery_time: form.delivery_time,
        service_status: form.service_status || 'available',
      };
      if (edit) await apiFetch(`/business/services/${edit.business_service_id}`, { method: 'PUT', body: JSON.stringify(payload) });
      else       await apiFetch('/business/services', { method: 'POST', body: JSON.stringify(payload) });
      setOpen(false); load();
    } catch (e) {
      const msg = String(e?.message || '');
      if (!edit && /free limit reached|pay first|SERVICE_LIMIT_REQUIRES_PAYMENT/i.test(msg)) {
        setOpen(false);
        setPaymentOpen(true);
        return;
      }
      setError(msg || 'Failed to save.');
    }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm('Delete this service?')) return;
    try { await apiFetch(`/business/services/${id}`, { method: 'DELETE' }); load(); }
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

  const filteredList = activeShopFilter === 'all'
    ? list
    : list.filter((s) => String(s.shop_id) === String(activeShopFilter));
  const avg = filteredList.length > 0 ? Math.round(filteredList.reduce((a, s) => a + Number(s.price_min || 0), 0) / filteredList.length) : 0;

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
      <Typography sx={{ color: '#64748b', fontSize: '0.76rem', mb: 2 }}>
        Free plan allows up to {MAX_FREE_SERVICES} services. For more, payment is required.
      </Typography>
      <Box sx={{ mb: 2.5, maxWidth: 360 }}>
        <TextField
          select
          label="Shop filter"
          fullWidth
          size="small"
          value={activeShopFilter === 'all' || shops.some((s) => String(s.shop_id) === String(activeShopFilter)) ? activeShopFilter : 'all'}
          onChange={(e) => setActiveShopFilter(e.target.value)}
          sx={INPUT_SX}
          SelectProps={{ MenuProps: CORPORATE_SELECT_MENU_PROPS }}
        >
          <MenuItem value="all" sx={CORPORATE_MENU_ITEM_SX}>All my shops</MenuItem>
          {shops.map((shop) => (
            <MenuItem key={shop.shop_id} value={String(shop.shop_id)} sx={CORPORATE_MENU_ITEM_SX}>
              {shop.shop_name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Services', value: filteredList.length, color: '#2563eb' },
          { label: 'Available', value: filteredList.filter(s => s.service_status !== 'unavailable').length, color: '#16a34a' },
          { label: 'Avg. Price (PKR)', value: avg.toLocaleString(), color: '#d97706' },
          { label: 'Unavailable', value: filteredList.filter(s => s.service_status === 'unavailable').length, color: '#7c3aed' },
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
      ) : filteredList.length === 0 ? (
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
          {filteredList.map(s => (
            <Grid item xs={12} sm={6} lg={6} xl={4} key={s.business_service_id}>
              <Paper elevation={0} sx={{ borderRadius: '16px', p: 2.5, border: '1px solid #dbeafe', bgcolor: '#fff', transition: 'all 0.15s', '&:hover': { boxShadow: '0 10px 26px rgba(37,99,235,0.16)', transform: 'translateY(-2px)', borderColor: BLUE_BORDER } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '13px', bgcolor: BLUE_SOFT, border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MiscellaneousServicesOutlinedIcon sx={{ fontSize: 24, color: BLUE }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.93rem' }}>{s.garment_type}</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.74rem' }}>{s.shop_name || 'My Shop'} • {s.delivery_time || 'Delivery TBD'}</Typography>
                    </Box>
                  </Box>
                  <Chip label={s.service_status === 'unavailable' ? 'Unavailable' : 'Available'} size="small"
                    sx={{ bgcolor: s.service_status === 'unavailable' ? '#fef2f2' : '#eff6ff', color: s.service_status === 'unavailable' ? '#dc2626' : '#2563eb', fontWeight: 700, fontSize: '0.68rem' }} />
                </Box>
                {s.description && <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mb: 1.25, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.description}</Typography>}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                    <AttachMoneyIcon sx={{ fontSize: 15, color: BLUE }} />
                    <Typography sx={{ fontWeight: 700, color: BLUE, fontSize: '0.88rem' }}>
                      PKR {s.price_min || 0}{s.price_max && s.price_max !== s.price_min ? ` – ${s.price_max}` : ''}
                    </Typography>
                  </Box>
                  {s.delivery_time && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}><AccessTimeIcon sx={{ fontSize: 13, color: '#94a3b8' }} /><Typography sx={{ fontSize: '0.73rem', color: '#94a3b8' }}>{s.delivery_time}</Typography></Box>}
                </Box>
                <Divider sx={{ my: 1.25 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />} onClick={() => openEdit(s)} sx={{ color: BLUE, bgcolor: BLUE_SOFT, border: '1px solid #dbeafe', textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: '9px', '&:hover': { bgcolor: '#dbeafe' } }}>Edit</Button>
                  <Button size="small" startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />} onClick={() => del(s.business_service_id)} sx={{ color: '#dc2626', bgcolor: '#fef2f2', border: '1px solid #fecaca', textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: '9px', '&:hover': { bgcolor: '#fee2e2' } }}>Delete</Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={open}
        onClose={() => !saving && setOpen(false)}
        maxWidth={false}
        fullWidth
        scroll="paper"
        disableRestoreFocus
        BackdropProps={{ sx: { backdropFilter: 'blur(6px)', bgcolor: 'rgba(15, 23, 42, 0.35)' } }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 'min(920px, 96vw)' },
            maxWidth: 920,
            maxHeight: 'min(92vh, 880px)',
            borderRadius: '20px',
            border: '1px solid #e0f2fe',
            boxShadow: '0 32px 64px rgba(14, 165, 233, 0.14), 0 0 0 1px rgba(255,255,255,0.8) inset',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#fafbfc',
          },
        }}
      >
        <Box
          sx={{
            height: 5,
            flexShrink: 0,
            background: 'linear-gradient(90deg, #7dd3fc 0%, #0ea5e9 45%, #38bdf8 100%)',
          }}
        />
        <DialogTitle
          sx={{
            flexShrink: 0,
            px: { xs: 2.5, sm: 3.5 },
            pt: 2.75,
            pb: 2,
            bgcolor: '#fff',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: BLUE, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.75 }}>
              Service catalog
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.35rem' }, color: '#0f172a', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
              {edit ? 'Edit service' : 'Add new service'}
            </Typography>
            <Typography sx={{ color: BLUE_MUTED, fontSize: '0.84rem', mt: 0.75, maxWidth: 520, lineHeight: 1.55 }}>
              Define pricing, delivery expectations, and availability. Each listing is tied to one of your verified shops.
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            disabled={saving}
            aria-label="Close"
            sx={{
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              flexShrink: 0,
              '&:hover': { bgcolor: '#f0f9ff', borderColor: '#bae6fd', color: BLUE_DARK },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: 0, flex: '1 1 auto', overflowY: 'auto', bgcolor: '#fafbfc' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 2.5, pb: 2 }}>
            {error && <Alert severity="error" sx={{ borderRadius: '12px', border: '1px solid #fecaca' }}>{error}</Alert>}
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2, borderLeft: `3px solid ${BLUE}`, pl: 1.5 }}>
                Shop & service
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    required
                    label="Business shop"
                    fullWidth
                    size="medium"
                    value={shopIdInList(form.shop_id) ? String(form.shop_id) : ''}
                    onChange={(e) => setForm({ ...form, shop_id: e.target.value })}
                    sx={INPUT_SX}
                    InputLabelProps={SELECT_INPUT_LABEL_PROPS}
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: CORPORATE_SELECT_MENU_PROPS,
                      renderValue: (v) => {
                        if (v && shopIdInList(v)) {
                          const shop = shops.find((s) => String(s.shop_id) === String(v));
                          return shop?.shop_name || v;
                        }
                        return (
                          <Box component="span" sx={{ color: '#94a3b8', fontWeight: 400 }}>
                            {shops.length ? 'Choose a shop…' : 'Loading shops…'}
                          </Box>
                        );
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ display: 'none' }} aria-hidden />
                    {shops.map((shop) => (
                      <MenuItem key={shop.shop_id} value={String(shop.shop_id)} sx={CORPORATE_MENU_ITEM_SX}>
                        {shop.shop_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    required
                    label="Service type"
                    fullWidth
                    size="medium"
                    value={form.garment_type || ''}
                    onChange={(e) => setForm({ ...form, garment_type: e.target.value })}
                    sx={INPUT_SX}
                    InputLabelProps={SELECT_INPUT_LABEL_PROPS}
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: CORPORATE_SELECT_MENU_PROPS,
                      renderValue: (v) =>
                        v ? (
                          String(v)
                        ) : (
                          <Box component="span" sx={{ color: '#94a3b8', fontWeight: 400 }}>
                            Choose service type…
                          </Box>
                        ),
                    }}
                  >
                    <MenuItem value="" sx={{ display: 'none' }} aria-hidden />
                    {form.garment_type && !TYPES.includes(form.garment_type) && (
                      <MenuItem value={form.garment_type} sx={CORPORATE_MENU_ITEM_SX}>{form.garment_type}</MenuItem>
                    )}
                    {TYPES.map((t) => (
                      <MenuItem key={t} value={t} sx={CORPORATE_MENU_ITEM_SX}>{t}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    size="medium"
                    multiline
                    minRows={3}
                    placeholder="Briefly describe what’s included, materials, or turnaround notes…"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    sx={INPUT_SX}
                  />
                </Grid>
              </Grid>
            </Paper>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2, borderLeft: `3px solid ${BLUE}`, pl: 1.5 }}>
                Pricing & delivery
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Min price (PKR)"
                    fullWidth
                    size="medium"
                    type="number"
                    value={form.price_min}
                    onChange={(e) => setForm({ ...form, price_min: e.target.value })}
                    sx={INPUT_SX}
                    InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: BLUE_MUTED }}>Rs</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Max price (PKR)"
                    fullWidth
                    size="medium"
                    type="number"
                    value={form.price_max}
                    onChange={(e) => setForm({ ...form, price_max: e.target.value })}
                    sx={INPUT_SX}
                    InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: BLUE_MUTED }}>Rs</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Delivery time"
                    fullWidth
                    size="medium"
                    value={form.delivery_time || ''}
                    onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
                    sx={INPUT_SX}
                    InputLabelProps={SELECT_INPUT_LABEL_PROPS}
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: CORPORATE_SELECT_MENU_PROPS,
                      renderValue: (v) =>
                        v ? (
                          String(v)
                        ) : (
                          <Box component="span" sx={{ color: '#94a3b8', fontWeight: 400 }}>
                            Optional — not set
                          </Box>
                        ),
                    }}
                  >
                    <MenuItem value="" sx={{ display: 'none' }} aria-hidden />
                    {form.delivery_time && !TIMES.includes(form.delivery_time) && (
                      <MenuItem value={form.delivery_time} sx={CORPORATE_MENU_ITEM_SX}>{form.delivery_time}</MenuItem>
                    )}
                    {TIMES.map((t) => (
                      <MenuItem key={t} value={t} sx={CORPORATE_MENU_ITEM_SX}>{t}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Availability"
                    fullWidth
                    size="medium"
                    value={form.service_status || 'available'}
                    onChange={(e) => setForm({ ...form, service_status: e.target.value })}
                    sx={INPUT_SX}
                    InputLabelProps={SELECT_INPUT_LABEL_PROPS}
                    SelectProps={{ MenuProps: CORPORATE_SELECT_MENU_PROPS }}
                  >
                    <MenuItem value="available" sx={CORPORATE_MENU_ITEM_SX}>Available</MenuItem>
                    <MenuItem value="unavailable" sx={CORPORATE_MENU_ITEM_SX}>Unavailable</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            flexShrink: 0,
            px: { xs: 2.5, sm: 3.5 },
            py: 2.25,
            bgcolor: '#fff',
            borderTop: '1px solid #f1f5f9',
            gap: 1.25,
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="outlined"
            disabled={saving}
            onClick={() => setOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '12px',
              px: 2.5,
              py: 1,
              borderColor: '#cbd5e1',
              color: '#475569',
              bgcolor: '#fff',
              '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={saving}
            onClick={save}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '12px',
              px: 3,
              py: 1,
              minWidth: 200,
              bgcolor: BLUE,
              color: '#fff',
              boxShadow: '0 10px 28px rgba(14, 165, 233, 0.35)',
              '&:hover': { bgcolor: BLUE_DARK },
            }}
          >
            {saving ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : edit ? 'Save changes' : 'Add service'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '1px solid #d1d5db',
            bgcolor: '#ffffff',
            boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
            overflow: 'hidden',
          },
        }}
        BackdropProps={{
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.42)',
            backgroundImage: `
              linear-gradient(rgba(148,163,184,0.2) 2px, transparent 2px),
              linear-gradient(90deg, rgba(148,163,184,0.2) 2px, transparent 2px)
            `,
            backgroundSize: '30px 30px',
            backgroundPosition: '15px 15px',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1, pt: 2.25, px: { xs: 2, sm: 3 }, bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCardOutlinedIcon sx={{ color: '#111827', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>
                Payment required
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', lineHeight: 1.25 }}>
                Add another service
              </Typography>
              <Typography sx={{ color: '#6b7280', fontSize: '0.8125rem', mt: 0.5, maxWidth: 520 }}>
                You already used your free {MAX_FREE_SERVICES} services. Please pay first to add more services.
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setPaymentOpen(false)} sx={{ color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '8px' }} aria-label="Close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 2.25, pb: 1, bgcolor: '#f3f4f6' }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '10px', border: '1px solid #e5e7eb', bgcolor: '#fafafa' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 600 }}>Current plan</Typography>
                <Typography sx={{ fontSize: '0.9375rem', color: '#111827', fontWeight: 800 }}>Free services</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 600 }}>Limit reached</Typography>
                <Typography sx={{ fontSize: '1.25rem', color: '#111827', fontWeight: 900 }}>{MAX_FREE_SERVICES}/{MAX_FREE_SERVICES}</Typography>
              </Box>
            </Box>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, mt: 1.5, borderRadius: '10px', border: '1px solid #e5e7eb', bgcolor: '#ffffff' }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.25 }}>
              Upgrade includes
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CheckRoundedIcon sx={{ fontSize: 18, color: '#111827' }} />
              <Typography sx={{ fontSize: '0.84rem', color: '#374151', fontWeight: 600 }}>Add more than {MAX_FREE_SERVICES} services</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CheckRoundedIcon sx={{ fontSize: 18, color: '#111827' }} />
              <Typography sx={{ fontSize: '0.84rem', color: '#374151', fontWeight: 600 }}>Keep all existing services active</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CheckRoundedIcon sx={{ fontSize: 18, color: '#111827' }} />
              <Typography sx={{ fontSize: '0.84rem', color: '#374151', fontWeight: 600 }}>Continue adding new service categories anytime</Typography>
            </Box>
          </Paper>
          <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mt: 1.75, lineHeight: 1.5 }}>
            Payment integration can be connected here. Right now, Pay now confirms the upgrade step.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb', gap: 1.25 }}>
          <Button
            onClick={() => setPaymentOpen(false)}
            variant="outlined"
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', borderColor: '#d1d5db', color: '#374151', bgcolor: '#fff' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setPaymentOpen(false)}
            sx={{ minWidth: 170, bgcolor: '#111827', color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: 'none', '&:hover': { bgcolor: '#000' } }}
          >
            Pay now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
