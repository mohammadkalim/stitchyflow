import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box, Typography, Paper, Button, Grid, Chip, Divider,
  TextField, Dialog, DialogContent, DialogTitle, DialogActions, IconButton,
  MenuItem, CircularProgress, Alert, Stack,
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
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import { apiFetch, getApiBase, getToken, notifyPublicShopsChanged, resolvePublicBusinessImageUrl } from '../../utils/api';
import { BusinessPlanPaymentHeader, BusinessPlanComparisonBody, BusinessPlanPaymentFooter } from './BusinessPlanComparison';

const G = '#1b4332';
const GL = '#2d6a4f';
const BLUE = '#2563eb';
const BLUE_SOFT = '#f8fafc';
const BLUE_BORDER = '#bfdbfe';
const INPUT_SX = {
  '& .MuiInputLabel-root': { color: '#334155', fontWeight: 600 },
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: '#fff',
    '& fieldset': { borderColor: '#dbe3ee' },
    '&:hover fieldset': { borderColor: '#b8c6d9' },
    '&.Mui-focused fieldset': { borderColor: '#64748b' },
  },
};

/** Corporate white dropdown panel for selects inside the modal */
const CORPORATE_SELECT_MENU_PROPS = {
  PaperProps: {
    sx: {
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 12px 40px rgba(15, 23, 42, 0.12)',
      maxHeight: 320,
      mt: 0.5,
      bgcolor: '#ffffff',
    },
  },
};

const CORPORATE_MENU_ITEM_SX = {
  fontSize: '0.875rem',
  color: '#334155',
  borderRadius: '6px',
  mx: 0.5,
  my: 0.15,
  '&:hover': { bgcolor: '#f1f5f9' },
  '&.Mui-selected': { bgcolor: '#e2e8f0', fontWeight: 600 },
  '&.Mui-selected:hover': { bgcolor: '#e2e8f0' },
};
const EMPTY = {
  shop_name: '',
  owner_name: '',
  business_type_id: '',
  address: '',
  city: '',
  country: '',
  contact_number: '',
  whatsapp_number: '',
  shop_status: 'active',
  logo_image: '',
  cover_image: '',
  category_id: '',
  subcategory_id: '',
  available_from: '',
  available_to: '',
  not_available_note: '',
};

export default function MyBusinessesSection({ isApproved }) {
  const [open, setOpen]     = useState(false);
  const [list, setList]     = useState([]);
  const [edit, setEdit]     = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [dragOverTarget, setDragOverTarget] = useState('');
  const [error, setError]   = useState('');
  const [types, setTypes]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentTierIndex, setPaymentTierIndex] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [maxShops, setMaxShops] = useState(1);
  const mountedRef = useRef(true);
  const listRef = useRef([]);
  const userId = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : null;
      return u?.id || u?.user_id || u?.tailor_id || 'self';
    } catch {
      return 'self';
    }
  }, []);
  const cacheKey = useMemo(() => `stitchyflow:tailor-businesses:${userId}`, [userId]);

  useEffect(() => {
    listRef.current = list;
  }, [list]);

  const load = async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true);
    try {
      const r = await apiFetch('/business/shops/enriched', { cache: 'no-store' });
      if (!mountedRef.current) return;
      const nextList = Array.isArray(r.data) ? r.data : [];
      setList(nextList);
      const cap = r.meta?.maxShops;
      if (typeof cap === 'number' && cap >= 1) setMaxShops(cap);
      setError('');
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          list: nextList,
          maxShops: typeof cap === 'number' && cap >= 1 ? cap : maxShops,
          ts: Date.now(),
        }));
      } catch (_) { /* ignore cache failures */ }
    } catch (e) {
      if (!mountedRef.current) return;
      if (listRef.current.length === 0) {
        setError(e?.message || 'Unable to refresh businesses right now.');
      }
    } finally {
      if (mountedRef.current && showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (!isApproved) { setLoading(false); return; }
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (raw) {
        const cached = JSON.parse(raw);
        if (Array.isArray(cached?.list)) {
          setList(cached.list);
          if (typeof cached?.maxShops === 'number' && cached.maxShops >= 1) setMaxShops(cached.maxShops);
          setLoading(false);
        }
      }
    } catch (_) { /* ignore bad cache */ }

    void load({ showLoading: listRef.current.length === 0 });
    apiFetch('/business/options/business-types').then(r => setTypes(r.data || [])).catch(() => {});
    apiFetch('/catalog/categories').then(r => setCategories(r.data || [])).catch(() => {});

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      void load({ showLoading: false });
    };
    const onFocus = () => { void load({ showLoading: false }); };
    const iv = setInterval(() => { void load({ showLoading: false }); }, 60000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);

    return () => {
      mountedRef.current = false;
      clearInterval(iv);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onFocus);
    };
  }, [isApproved, cacheKey]);

  useEffect(() => {
    if (!form.category_id) { setSubcategories([]); return; }
    apiFetch(`/catalog/subcategories?category_id=${encodeURIComponent(form.category_id)}`)
      .then(r => setSubcategories(r.data || []))
      .catch(() => setSubcategories([]));
  }, [form.category_id]);

  useEffect(() => {
    if (paymentOpen) setPaymentTierIndex(1);
  }, [paymentOpen]);

  const openAdd = () => {
    if (list.length >= maxShops) {
      setPaymentOpen(true);
      return;
    }
    setForm(EMPTY);
    setEdit(null);
    setError('');
    setOpen(true);
  };
  const openEdit = b => {
    setForm({
      shop_name: b.shop_name || '',
      owner_name: b.owner_name || '',
      business_type_id: b.business_type_id || '',
      address: b.address || '',
      city: b.city || '',
      country: b.country || '',
      contact_number: b.contact_number || '',
      whatsapp_number: b.whatsapp_number || '',
      shop_status: b.shop_status || 'active',
      logo_image: b.logo_image || '',
      cover_image: b.cover_image || '',
      category_id: b.category_id || '',
      subcategory_id: b.subcategory_id || '',
      available_from: b.available_from || '',
      available_to: b.available_to || '',
      not_available_note: b.not_available_note || '',
    });
    setEdit(b); setError(''); setOpen(true);
  };

  const save = async () => {
    if (!form.shop_name || !form.owner_name) { setError('Shop name and owner name are required.'); return; }
       setSaving(true); setError('');
    const payload = {
      ...form,
      not_available_note: String(form.not_available_note || '').slice(0, 200),
    };
    ['business_type_id', 'specialization_id', 'category_id', 'subcategory_id'].forEach((k) => {
      const v = payload[k];
      if (v === '' || v === null || v === undefined) delete payload[k];
    });
    try {
      if (edit) await apiFetch(`/business/shops/${edit.shop_id}`, { method: 'PUT', body: JSON.stringify(payload) });
      else       await apiFetch('/business/shops', { method: 'POST', body: JSON.stringify(payload) });
      setOpen(false);
      load();
      notifyPublicShopsChanged();
    } catch (e) {
      const msg = e.message || '';
      if (!edit && /one business|only one business|up to \d+ business account/i.test(msg)) {
        setOpen(false);
        setPaymentOpen(true);
        return;
      }
      setError(msg || 'Failed to save.');
    }
    finally { setSaving(false); }
  };

  const handlePaymentConfirm = () => {
    setPaymentSubmitting(true);
    setTimeout(() => {
      setPaymentSubmitting(false);
      setPaymentOpen(false);
    }, 900);
  };

  const uploadBusinessImage = async (file, target) => {
    if (!file) return;
    const token = getToken();
    const fd = new FormData();
    fd.append('image', file);
    const base = getApiBase();
    const endpoint = `${base}/business/shops/upload-image`;

    const setter = target === 'logo' ? setUploadingLogo : setUploadingCover;
    setter(true);
    setError('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error?.message || 'Image upload failed');
      }
      const uploaded = data?.data?.imageUrl || '';
      if (target === 'logo') setForm((prev) => ({ ...prev, logo_image: uploaded }));
      else setForm((prev) => ({ ...prev, cover_image: uploaded }));
      if (edit?.shop_id && uploaded) {
        await apiFetch(`/business/shops/${edit.shop_id}`, {
          method: 'PUT',
          body: JSON.stringify(target === 'logo' ? { logo_image: uploaded } : { cover_image: uploaded }),
        });
        notifyPublicShopsChanged();
        load();
      }
    } catch (e) {
      setError(e.message || 'Image upload failed.');
    } finally {
      setter(false);
    }
  };

  const handleImageDragOver = (e, target) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverTarget !== target) setDragOverTarget(target);
  };

  const handleImageDragLeave = (e, target) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverTarget === target) setDragOverTarget('');
  };

  const handleImageDrop = (e, target) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget('');
    const files = e.dataTransfer?.files;
    const file = files && files.length > 0 ? files[0] : null;
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      setError('Please drop a valid image file.');
      return;
    }
    uploadBusinessImage(file, target);
  };

  const requestDelete = (b) => {
    setDeleteError('');
    setDeleteTarget({ shop_id: b.shop_id, shop_name: b.shop_name || 'this business' });
  };

  const closeDeleteDialog = () => {
    if (deleteSubmitting) return;
    setDeleteTarget(null);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    setDeleteError('');
    try {
      await apiFetch(`/business/shops/${deleteTarget.shop_id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      load();
      notifyPublicShopsChanged();
    } catch (e) {
      setDeleteError(e.message || 'Could not remove this business. Please try again.');
    } finally {
      setDeleteSubmitting(false);
    }
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
    <Box sx={{ width: '100%' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        p: { xs: 2, md: 2.5 },
        borderRadius: '16px',
        border: '1px solid #dbeafe',
        bgcolor: '#f8fbff',
      }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>My Businesses</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.25 }}>Manage your registered tailor shops</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openAdd}
          sx={{ bgcolor: BLUE, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 2.5, boxShadow: '0 8px 18px rgba(37,99,235,0.25)', '&:hover': { bgcolor: '#1d4ed8' } }}>
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
            <Paper elevation={0} sx={{ borderRadius: '14px', p: 2.25, border: '1px solid #dbeafe', bgcolor: BLUE_SOFT, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, mt: 0.5 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={32} sx={{ color: G }} /></Box>
      ) : list.length === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: '16px', p: 8, border: '1px dashed #bfdbfe', bgcolor: '#f8fbff', textAlign: 'center' }}>
          <StorefrontOutlinedIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.5 }}>No businesses yet</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.84rem', mb: 2.5 }}>Register your first tailor shop to start receiving orders.</Typography>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openAdd}
            sx={{ bgcolor: BLUE, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 3, boxShadow: '0 8px 18px rgba(37,99,235,0.25)', '&:hover': { bgcolor: '#1d4ed8' } }}>
            Register Business
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {list.map(b => {
            const s = badge(b.shop_status);
            return (
              <Grid item xs={12} sm={6} lg={4} key={b.shop_id}>
                <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #dbeafe', bgcolor: '#fff', overflow: 'hidden', transition: 'all 0.18s', '&:hover': { boxShadow: '0 10px 26px rgba(37,99,235,0.16)', transform: 'translateY(-2px)', borderColor: BLUE_BORDER } }}>
                  <Box sx={{ position: 'relative', height: 132, bgcolor: '#e8e7ff', overflow: 'hidden' }}>
                    {b.logo_image ? (
                      <Box
                        component="img"
                        src={resolvePublicBusinessImageUrl(b.logo_image, b)}
                        alt={b.shop_name || 'Shop logo'}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(19, 16, 202, 0.14)' }}>
                        <Typography sx={{ fontSize: '3.2rem', fontWeight: 800, color: '#1310ca', lineHeight: 1 }}>
                          {String(b.shop_name || b.owner_name || '?').trim().charAt(0).toUpperCase() || '?'}
                        </Typography>
                      </Box>
                    )}
                    <Chip label={s.label} size="small" sx={{ position: 'absolute', top: 10, right: 10, bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.68rem' }} />
                  </Box>
                  <Box sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.75 }}>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.93rem', lineHeight: 1.35, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{b.shop_name}</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.74rem', mt: 0.25, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{b.business_type_name || b.owner_name || '—'}</Typography>
                      </Box>
                    </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, mb: 1.75 }}>
                    {b.address && <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}><LocationOnOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8', mt: 0.2, flexShrink: 0 }} /><Typography sx={{ fontSize: '0.78rem', color: '#64748b', minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{b.address}{b.city ? `, ${b.city}` : ''}</Typography></Box>}
                    {b.contact_number && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}><PhoneOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} /><Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>{b.contact_number}</Typography></Box>}
                    {b.specialization_name && <Chip label={b.specialization_name} size="small" sx={{ alignSelf: 'flex-start', bgcolor: '#f0fdf4', color: G, fontSize: '0.68rem', fontWeight: 600 }} />}
                    {(b.available_from || b.available_to) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <ScheduleOutlinedIcon sx={{ fontSize: 14, color: '#15803d' }} />
                        <Typography sx={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
                          {(b.available_from || '—')} – {(b.available_to || '—')}
                        </Typography>
                      </Box>
                    )}
                    {b.not_available_note && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                        <EventBusyOutlinedIcon sx={{ fontSize: 14, color: '#b91c1c', mt: 0.1, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.76rem', color: '#991b1b', lineHeight: 1.35, minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{b.not_available_note}</Typography>
                      </Box>
                    )}
                  </Box>
                  <Divider sx={{ my: 1.25 }} />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button size="small" startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />} onClick={() => openEdit(b)} sx={{ color: BLUE, bgcolor: BLUE_SOFT, border: '1px solid #dbeafe', textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: '9px', '&:hover': { bgcolor: '#dbeafe' } }}>Edit</Button>
                    <Button size="small" startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />} onClick={() => requestDelete(b)} sx={{ color: '#dc2626', bgcolor: '#fef2f2', border: '1px solid #fecaca', textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: '9px', '&:hover': { bgcolor: '#fee2e2' } }}>Delete</Button>
                    <Box sx={{ flex: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <VerifiedOutlinedIcon sx={{ fontSize: 14, color: b.shop_status === 'active' ? '#16a34a' : '#94a3b8' }} />
                      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>Verified</Typography>
                    </Box>
                  </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
        BackdropProps={{ sx: { backdropFilter: 'blur(3px)', bgcolor: 'rgba(15, 23, 42, 0.35)' } }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 24px 48px rgba(15, 23, 42, 0.16)',
          },
        }}
      >
        <Box sx={{ height: 4, background: 'linear-gradient(90deg, #dc2626, #b91c1c)' }} />
        <DialogTitle sx={{ px: { xs: 2.5, sm: 3 }, pt: 2.5, pb: 1.5, bgcolor: '#fafafa' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                bgcolor: '#fef2f2',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 28, color: '#dc2626' }} />
            </Box>
            <Box sx={{ minWidth: 0, pt: 0.25 }}>
              <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', lineHeight: 1.25 }}>
                Remove business
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.5, lineHeight: 1.45 }}>
                You are about to permanently delete this listing from your account. Marketplace history tied to this shop may be affected.
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, pt: 0, pb: 2, bgcolor: '#fff' }}>
          {deleteTarget && (
            <Paper
              elevation={0}
              sx={{
                mt: 0.5,
                p: 1.75,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                bgcolor: '#f8fafc',
              }}
            >
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                Business
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                {deleteTarget.shop_name}
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.78rem', mt: 1 }}>
                This action cannot be undone.
              </Typography>
            </Paper>
          )}
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2.5, sm: 3 }, py: 2, bgcolor: '#fafafa', borderTop: '1px solid #e2e8f0', gap: 1 }}>
          <Button
            onClick={closeDeleteDialog}
            disabled={deleteSubmitting}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              color: '#475569',
              borderRadius: '10px',
              px: 2,
              border: '1px solid #cbd5e1',
              bgcolor: '#fff',
              '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            disabled={deleteSubmitting}
            startIcon={deleteSubmitting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <DeleteOutlineIcon sx={{ fontSize: 18, color: 'inherit' }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '10px',
              px: 2.25,
              color: '#fff',
              bgcolor: '#dc2626',
              boxShadow: '0 8px 20px rgba(220, 38, 38, 0.28)',
              '&:hover': { bgcolor: '#b91c1c', color: '#fff' },
              '& .MuiButton-startIcon': { color: 'inherit' },
            }}
          >
            {deleteSubmitting ? 'Removing…' : 'Remove business'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        BackdropProps={{ sx: { backdropFilter: 'blur(2px)', bgcolor: 'rgba(15, 23, 42, 0.2)' } }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '1px solid #d1d5db',
            maxHeight: '92vh',
            width: { xs: '100%', sm: '96%' },
            bgcolor: '#ffffff',
            boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle sx={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1.5, pt: 2.5, px: { xs: 2.5, sm: 3.75 }, bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <Box>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.75 }}>
              Business registration
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
              {edit ? 'Edit Business' : 'Register New Business'}
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.8125rem', mt: 0.5, lineHeight: 1.5, maxWidth: 520 }}>
              Complete your business profile. All fields marked with * are required.
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#64748b', border: '1px solid #d1d5db', borderRadius: '8px', '&:hover': { bgcolor: '#f3f4f6' } }} aria-label="Close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2.5, sm: 3.75 }, py: 0, bgcolor: '#f5f5f5', flex: '1 1 auto', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5, pb: 2.5 }}>
            {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '10px', border: '1px solid #d1d5db', bgcolor: '#ffffff' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800, mb: 1.5, letterSpacing: '0.06em', borderLeft: '3px solid #0f172a', pl: 1.25 }}>BUSINESS INFORMATION</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={6}>
                  <TextField sx={INPUT_SX} label="Business Name *" fullWidth size="small" value={form.shop_name} onChange={e => setForm({ ...form, shop_name: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField sx={INPUT_SX} label="Business Owner Name *" fullWidth size="small" value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  {types.length > 0 && (
                    <TextField sx={INPUT_SX} select label="Business Type" fullWidth size="small" value={form.business_type_id} onChange={e => setForm({ ...form, business_type_id: e.target.value })} SelectProps={{ MenuProps: CORPORATE_SELECT_MENU_PROPS }}>
                      {types.map(t => <MenuItem key={t.id} value={t.id} sx={CORPORATE_MENU_ITEM_SX}>{t.name}</MenuItem>)}
                    </TextField>
                  )}
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: '10px', border: '1px solid #d1d5db', bgcolor: '#ffffff' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800, mb: 1.5, letterSpacing: '0.06em', borderLeft: '3px solid #0f172a', pl: 1.25 }}>CONTACT & LOCATION</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={8}>
                  <TextField sx={INPUT_SX} label="Address" fullWidth size="small" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField sx={INPUT_SX} label="City" fullWidth size="small" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField sx={INPUT_SX} label="Country" fullWidth size="small" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField sx={INPUT_SX} label="Contact Number" fullWidth size="small" value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField sx={INPUT_SX} label="WhatsApp Number" fullWidth size="small" value={form.whatsapp_number} onChange={e => setForm({ ...form, whatsapp_number: e.target.value })} />
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: '10px', border: '1px solid #bae6fd', background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 48%)', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'rgba(37, 150, 190, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ScheduleOutlinedIcon sx={{ fontSize: 20, color: '#2596be' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800, letterSpacing: '0.06em' }}>AVAILABLE TIME</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>When customers can visit or reach you</Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={1.5}>
                    <Grid item xs={6}>
                      <TextField
                        sx={INPUT_SX}
                        label="Opens"
                        type="time"
                        fullWidth
                        size="small"
                        value={form.available_from}
                        onChange={(e) => setForm({ ...form, available_from: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={INPUT_SX}
                        label="Closes"
                        type="time"
                        fullWidth
                        size="small"
                        value={form.available_to}
                        onChange={(e) => setForm({ ...form, available_to: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: '10px', border: '1px solid #fecaca', background: 'linear-gradient(180deg, #fef2f2 0%, #ffffff 48%)', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'rgba(185, 28, 28, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <EventBusyOutlinedIcon sx={{ fontSize: 20, color: '#b91c1c' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800, letterSpacing: '0.06em' }}>NOT AVAILABLE</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>Closed days, breaks, or exceptions</Typography>
                    </Box>
                  </Box>
                  <TextField
                    sx={INPUT_SX}
                    label="Note (e.g. Sundays, public holidays)"
                    fullWidth
                    size="small"
                    multiline
                    minRows={3}
                    value={form.not_available_note}
                    onChange={(e) => setForm({ ...form, not_available_note: e.target.value.slice(0, 200) })}
                    placeholder="e.g. Closed Sundays and public holidays. Lunch break 1–2 PM."
                    helperText={`${(form.not_available_note || '').length}/200`}
                  />
                </Paper>
              </Grid>
            </Grid>

            <Paper elevation={0} sx={{ p: 2, borderRadius: '10px', border: '1px solid #d1d5db', bgcolor: '#ffffff' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800, mb: 1.5, letterSpacing: '0.06em', borderLeft: '3px solid #0f172a', pl: 1.25 }}>CATEGORY & STATUS</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={6}>
                  <TextField sx={INPUT_SX} select label="Category" fullWidth size="small" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value, subcategory_id: '' })} SelectProps={{ MenuProps: CORPORATE_SELECT_MENU_PROPS }}>
                    {categories.map(c => <MenuItem key={c.id} value={c.id} sx={CORPORATE_MENU_ITEM_SX}>{c.name}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField sx={INPUT_SX} select label="Subcategory" fullWidth size="small" value={form.subcategory_id} onChange={e => setForm({ ...form, subcategory_id: e.target.value })} SelectProps={{ MenuProps: CORPORATE_SELECT_MENU_PROPS }}>
                    {subcategories.map(s => <MenuItem key={s.id} value={s.id} sx={CORPORATE_MENU_ITEM_SX}>{s.name}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField sx={INPUT_SX} select label="Status" fullWidth size="small" value={form.shop_status} onChange={e => setForm({ ...form, shop_status: e.target.value })} SelectProps={{ MenuProps: CORPORATE_SELECT_MENU_PROPS }}>
                    {['active', 'inactive', 'suspended'].map(s => <MenuItem key={s} value={s} sx={{ ...CORPORATE_MENU_ITEM_SX, textTransform: 'capitalize' }}>{s}</MenuItem>)}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: '10px', border: '1px solid #d1d5db', bgcolor: '#ffffff' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800, mb: 1.5, letterSpacing: '0.06em', borderLeft: '3px solid #0f172a', pl: 1.25 }}>BRAND MEDIA</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    onDragOver={(e) => handleImageDragOver(e, 'logo')}
                    onDragEnter={(e) => handleImageDragOver(e, 'logo')}
                    onDragLeave={(e) => handleImageDragLeave(e, 'logo')}
                    onDrop={(e) => handleImageDrop(e, 'logo')}
                    sx={{
                      p: 1.25,
                      borderRadius: '12px',
                      border: dragOverTarget === 'logo' ? '1px dashed #2563eb' : '1px dashed #cbd5e1',
                      bgcolor: dragOverTarget === 'logo' ? '#eff6ff' : '#fff',
                      transition: 'border-color 0.15s ease, background-color 0.15s ease',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Logo</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {form.logo_image
                            ? (edit ? 'Uploaded — saved; shows on Tailor Shops' : 'Uploaded — click Save business to publish')
                            : 'Upload logo image or drag and drop'}
                        </Typography>
                        {form.logo_image ? (
                          <Box
                            component="img"
                            src={resolvePublicBusinessImageUrl(form.logo_image, edit || undefined)}
                            alt=""
                            sx={{ mt: 1, maxHeight: 72, maxWidth: '100%', objectFit: 'contain', borderRadius: 1, bgcolor: '#f1f5f9' }}
                          />
                        ) : null}
                      </Box>
                      <Button component="label" size="small" startIcon={<UploadFileOutlinedIcon />} disabled={uploadingLogo}
                        sx={{ bgcolor: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', textTransform: 'none', fontWeight: 700, flexShrink: 0 }}>
                        {uploadingLogo ? 'Uploading...' : 'Upload'}
                        <input hidden type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => uploadBusinessImage(e.target.files?.[0], 'logo')} />
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    onDragOver={(e) => handleImageDragOver(e, 'cover')}
                    onDragEnter={(e) => handleImageDragOver(e, 'cover')}
                    onDragLeave={(e) => handleImageDragLeave(e, 'cover')}
                    onDrop={(e) => handleImageDrop(e, 'cover')}
                    sx={{
                      p: 1.25,
                      borderRadius: '12px',
                      border: dragOverTarget === 'cover' ? '1px dashed #2563eb' : '1px dashed #cbd5e1',
                      bgcolor: dragOverTarget === 'cover' ? '#eff6ff' : '#fff',
                      transition: 'border-color 0.15s ease, background-color 0.15s ease',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Cover Image</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {form.cover_image
                            ? (edit ? 'Uploaded — saved; shop detail banner' : 'Uploaded — click Save business to publish')
                            : 'Upload cover image or drag and drop'}
                        </Typography>
                        {form.cover_image ? (
                          <Box
                            component="img"
                            src={resolvePublicBusinessImageUrl(form.cover_image, edit || undefined)}
                            alt=""
                            sx={{ mt: 1, maxHeight: 72, maxWidth: '100%', objectFit: 'cover', borderRadius: 1, bgcolor: '#f1f5f9' }}
                          />
                        ) : null}
                      </Box>
                      <Button component="label" size="small" startIcon={<UploadFileOutlinedIcon />} disabled={uploadingCover}
                        sx={{ bgcolor: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', textTransform: 'none', fontWeight: 700, flexShrink: 0 }}>
                        {uploadingCover ? 'Uploading...' : 'Upload'}
                        <input hidden type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => uploadBusinessImage(e.target.files?.[0], 'cover')} />
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexShrink: 0, px: { xs: 2.5, sm: 3.75 }, py: 2, bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb', gap: 1.25 }}>
          <Button variant="outlined" onClick={() => setOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', borderColor: '#d1d5db', color: '#374151', px: 2.25, bgcolor: '#fff', '&:hover': { bgcolor: '#f9fafb', borderColor: '#9ca3af' } }}>
            Cancel
          </Button>
          <Button variant="contained" disabled={saving} onClick={save}
            sx={{ minWidth: 220, bgcolor: '#111827', color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '8px', py: 1.05, px: 2.5, boxShadow: 'none', '&:hover': { bgcolor: '#000000' } }}>
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : edit ? 'Save changes' : 'Register business'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={paymentOpen}
        onClose={() => !paymentSubmitting && setPaymentOpen(false)}
        maxWidth="lg"
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
        <DialogTitle sx={{ p: 0, bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <BusinessPlanPaymentHeader onClose={() => !paymentSubmitting && setPaymentOpen(false)} />
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <BusinessPlanComparisonBody
            tierIndex={paymentTierIndex}
            onTierChange={setPaymentTierIndex}
            disabled={paymentSubmitting}
          />
        </DialogContent>
        <DialogActions sx={{ p: 0, display: 'block' }}>
          <BusinessPlanPaymentFooter
            tierIndex={paymentTierIndex}
            onCancel={() => !paymentSubmitting && setPaymentOpen(false)}
            onPay={handlePaymentConfirm}
            submitting={paymentSubmitting}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
