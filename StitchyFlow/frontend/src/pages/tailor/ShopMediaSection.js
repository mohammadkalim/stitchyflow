/**
 * Tailor dashboard — Shop Media (images + captions per business).
 * Persists as business_settings rows (setting_group: shop_media).
 * Developer by: Muhammad Kalim · Product of LogixInventor (PVT) Ltd.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { apiFetch, getApiBase, getToken, resolvePublicBusinessImageUrl } from '../../utils/api';

const G = '#1b4332';
const GL = '#2d6a4f';
const GROUP = 'shop_media';

const EMPTY_FORM = { shop_id: '', title: '', caption: '', imageUrl: '' };

async function uploadBusinessImageFile(file) {
  const token = getToken();
  const fd = new FormData();
  fd.append('image', file);
  const base = getApiBase();
  const endpoint = `${base}/business/shops/upload-image`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: fd,
  });
  const data = await res.json();
  if (!res.ok || !data?.success) {
    throw new Error(data?.error?.message || 'Image upload failed');
  }
  return data?.data?.imageUrl || '';
}

function parseRow(settingValue) {
  try {
    const v = JSON.parse(settingValue);
    return {
      shop_id: v.shop_id != null ? Number(v.shop_id) : null,
      title: v.title || '',
      caption: v.caption || '',
      imageUrl: v.imageUrl || '',
    };
  } catch {
    return { shop_id: null, title: '', caption: '', imageUrl: '' };
  }
}

export default function ShopMediaSection({ isApproved }) {
  const [shops, setShops] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterShop, setFilterShop] = useState('all');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiFetch('/business/shops/enriched'), apiFetch('/business/settings')])
      .then(([rShops, rSet]) => {
        setShops(Array.isArray(rShops.data) ? rShops.data : []);
        const rows = Array.isArray(rSet.data) ? rSet.data : [];
        setList(rows.filter((s) => s.setting_group === GROUP));
      })
      .catch(() => {
        setShops([]);
        setList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isApproved) load();
    else setLoading(false);
  }, [isApproved, load]);

  const shopIds = useMemo(() => new Set(shops.map((s) => Number(s.shop_id))), [shops]);

  const filtered = useMemo(() => {
    const mine = list.filter((row) => {
      const { shop_id: sid } = parseRow(row.setting_value);
      return sid != null && shopIds.has(sid);
    });
    if (filterShop === 'all') return mine;
    return mine.filter((row) => String(parseRow(row.setting_value).shop_id) === String(filterShop));
  }, [list, filterShop, shopIds]);

  const shopName = (id) => shops.find((s) => String(s.shop_id) === String(id))?.shop_name || `Shop ${id}`;

  const openAdd = () => {
    setForm({
      ...EMPTY_FORM,
      shop_id: shops[0] ? String(shops[0].shop_id) : '',
    });
    setEdit(null);
    setError('');
    setOpen(true);
  };

  const openEdit = (row) => {
    const v = parseRow(row.setting_value);
    setForm({
      shop_id: v.shop_id != null ? String(v.shop_id) : '',
      title: v.title,
      caption: v.caption,
      imageUrl: v.imageUrl,
    });
    setEdit(row);
    setError('');
    setOpen(true);
  };

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type?.startsWith('image/')) {
      setError('Choose a PNG, JPG, or WEBP image.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const url = await uploadBusinessImageFile(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.shop_id) {
      setError('Select a business.');
      return;
    }
    if (!form.title.trim()) {
      setError('Add a short title.');
      return;
    }
    if (!form.imageUrl.trim()) {
      setError('Upload an image.');
      return;
    }
    const val = JSON.stringify({
      shop_id: Number(form.shop_id),
      title: form.title.trim(),
      caption: (form.caption || '').trim(),
      imageUrl: form.imageUrl.trim(),
    });
    setSaving(true);
    setError('');
    try {
      if (edit) {
        await apiFetch(`/business/settings/${edit.setting_id}`, {
          method: 'PUT',
          body: JSON.stringify({ setting_value: val, is_active: 1 }),
        });
      } else {
        const key = `shop_media_${form.shop_id}_${Date.now()}`;
        await apiFetch('/business/settings', {
          method: 'POST',
          body: JSON.stringify({
            setting_key: key,
            setting_value: val,
            setting_group: GROUP,
            is_active: 1,
          }),
        });
      }
      setOpen(false);
      load();
    } catch (e) {
      setError(e.message || 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  const del = async (row) => {
    if (!window.confirm('Remove this media item?')) return;
    try {
      await apiFetch(`/business/settings/${row.setting_id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  if (!isApproved) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 14 }}>
        <Box sx={{ width: 68, height: 68, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.5 }}>Section Locked</Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.84rem', textAlign: 'center', maxWidth: 340 }}>
          Available once your tailor account is approved by admin.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>Shop Media</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.84rem', mt: 0.35, maxWidth: 640 }}>
            Showcase photos and short text for each business — great for work samples, offers, or storefront highlights.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            select
            size="small"
            label="Filter"
            value={filterShop}
            onChange={(e) => setFilterShop(e.target.value)}
            sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff' } }}
          >
            <MenuItem value="all">All businesses</MenuItem>
            {shops.map((s) => (
              <MenuItem key={s.shop_id} value={String(s.shop_id)}>
                {s.shop_name || `Shop ${s.shop_id}`}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            onClick={openAdd}
            disabled={!shops.length}
            sx={{ bgcolor: G, textTransform: 'none', fontWeight: 700, borderRadius: '12px', boxShadow: 'none', '&:hover': { bgcolor: GL } }}
          >
            Add media
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={36} sx={{ color: G }} />
        </Box>
      ) : !shops.length ? (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e8ecf1', textAlign: 'center', bgcolor: '#fff' }}>
          <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>No businesses yet</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.88rem' }}>Create a shop under My Businesses, then add images and text here.</Typography>
        </Paper>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: '16px', border: '1px dashed #cbd5e1', textAlign: 'center', bgcolor: '#fafafa' }}>
          <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 52, color: '#cbd5e1', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>No media for this filter</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.86rem', mb: 2 }}>Add your first image and caption to build a simple gallery.</Typography>
          <Button variant="contained" onClick={openAdd} sx={{ bgcolor: G, textTransform: 'none', fontWeight: 700, borderRadius: '12px', '&:hover': { bgcolor: GL } }}>
            Add media
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((row) => {
            const v = parseRow(row.setting_value);
            const src = resolvePublicBusinessImageUrl(v.imageUrl);
            return (
              <Grid item xs={12} sm={6} md={4} key={row.setting_id}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '16px',
                    border: '1px solid #e8ecf1',
                    overflow: 'hidden',
                    bgcolor: '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'box-shadow 0.15s',
                    '&:hover': { boxShadow: '0 8px 28px rgba(15, 23, 42, 0.08)' },
                  }}
                >
                  <Box
                    component="img"
                    src={src || undefined}
                    alt=""
                    sx={{ width: '100%', height: 200, objectFit: 'cover', bgcolor: '#f1f5f9', display: 'block' }}
                  />
                  <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                      {shopName(v.shop_id)}
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', mb: 1 }}>{v.title || 'Untitled'}</Typography>
                    <Typography sx={{ color: '#475569', fontSize: '0.84rem', lineHeight: 1.55, flex: 1 }}>{v.caption || '—'}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                      <Button size="small" startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />} onClick={() => openEdit(row)} sx={{ textTransform: 'none', fontWeight: 600, color: '#2563eb' }}>
                        Edit
                      </Button>
                      <Button size="small" startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />} onClick={() => del(row)} sx={{ textTransform: 'none', fontWeight: 600, color: '#dc2626' }}>
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={open} onClose={() => !saving && setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>{edit ? 'Edit media' : 'Add media'}</Typography>
          <IconButton size="small" onClick={() => !saving && setOpen(false)} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Typography sx={{ color: '#dc2626', fontSize: '0.84rem', mb: 2 }}>{error}</Typography>
          )}
          <TextField
            select
            fullWidth
            size="small"
            label="Business"
            value={form.shop_id}
            onChange={(e) => setForm({ ...form, shop_id: e.target.value })}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          >
            {shops.map((s) => (
              <MenuItem key={s.shop_id} value={String(s.shop_id)}>
                {s.shop_name || `Shop ${s.shop_id}`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            size="small"
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            size="small"
            label="Caption / text"
            multiline
            minRows={3}
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            placeholder="Describe this image, promotion, or portfolio piece…"
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <Box sx={{ mb: 1 }}>
            <Button variant="outlined" component="label" disabled={uploading} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>
              {uploading ? 'Uploading…' : form.imageUrl ? 'Replace image' : 'Upload image'}
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onPickFile} />
            </Button>
          </Box>
          {form.imageUrl ? (
            <Box
              component="img"
              src={resolvePublicBusinessImageUrl(form.imageUrl)}
              alt=""
              sx={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }}
            />
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setOpen(false)} disabled={saving} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saving || uploading} sx={{ bgcolor: G, textTransform: 'none', fontWeight: 700, borderRadius: '10px', '&:hover': { bgcolor: GL } }}>
            {saving ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
