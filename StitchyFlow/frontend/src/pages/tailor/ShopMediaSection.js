/**
 * Tailor dashboard — Shop Media (images + captions per business).
 * Persisted in MySQL table `business_shop_media` via GET|POST|PUT|DELETE /api/v1/business/shop-media.
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

const G = '#2563eb';
const GL = '#3b82f6';
const GLD = '#1e40af';

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
    Promise.all([apiFetch('/business/shops/enriched'), apiFetch('/business/shop-media')])
      .then(([rShops, rMedia]) => {
        setShops(Array.isArray(rShops.data) ? rShops.data : []);
        setList(Array.isArray(rMedia.data) ? rMedia.data : []);
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
    const mine = list.filter((row) => row.shop_id != null && shopIds.has(Number(row.shop_id)));
    if (filterShop === 'all') return mine;
    return mine.filter((row) => String(row.shop_id) === String(filterShop));
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
    setForm({
      shop_id: row.shop_id != null ? String(row.shop_id) : '',
      title: row.title || '',
      caption: row.caption || '',
      imageUrl: row.image_url || '',
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
    setSaving(true);
    setError('');
    try {
      if (edit) {
        await apiFetch(`/business/shop-media/${edit.media_id}`, {
          method: 'PUT',
          body: JSON.stringify({
            shop_id: Number(form.shop_id),
            title: form.title.trim(),
            caption: (form.caption || '').trim(),
            image_url: form.imageUrl.trim(),
          }),
        });
      } else {
        await apiFetch('/business/shop-media', {
          method: 'POST',
          body: JSON.stringify({
            shop_id: Number(form.shop_id),
            title: form.title.trim(),
            caption: (form.caption || '').trim(),
            image_url: form.imageUrl.trim(),
            sort_order: 0,
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
      await apiFetch(`/business/shop-media/${row.media_id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  if (!isApproved) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 14 }}>
        <Box sx={{ width: 68, height: 68, borderRadius: '50%', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 32, color: '#3b82f6' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#1e40af', fontSize: '1.05rem', mb: 0.5 }}>Section Locked</Typography>
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
          <Typography sx={{ fontWeight: 800, color: '#1e40af', fontSize: '1.2rem' }}>Shop Media</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.84rem', mt: 0.35, maxWidth: 640 }}>
            Showcase photos and short text for each business — saved in the database and shown on your public shop page.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            select
            size="small"
            label="Filter"
            value={filterShop}
            onChange={(e) => setFilterShop(e.target.value)}
            sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#eff6ff' } }}
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
          <CircularProgress size={36} sx={{ color: '#3b82f6' }} />
        </Box>
      ) : !shops.length ? (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #bfdbfe', textAlign: 'center', bgcolor: '#eff6ff' }}>
          <Typography sx={{ fontWeight: 700, color: '#1e40af', mb: 1 }}>No businesses yet</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.88rem' }}>Create a shop under My Businesses, then add images and text here.</Typography>
        </Paper>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: '16px', border: '1px dashed #93c5fd', textAlign: 'center', bgcolor: '#dbeafe' }}>
          <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 52, color: '#60a5fa', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#1e40af', mb: 0.5 }}>No media for this filter</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.86rem', mb: 2 }}>Add your first image and caption to build a simple gallery.</Typography>
          <Button variant="contained" onClick={openAdd} sx={{ bgcolor: G, textTransform: 'none', fontWeight: 700, borderRadius: '12px', '&:hover': { bgcolor: GL } }}>
            Add media
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((row) => {
            const src = resolvePublicBusinessImageUrl(row.image_url);
            return (
              <Grid item xs={12} sm={6} md={4} key={row.media_id}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '16px',
                    border: '1px solid #bfdbfe',
                    overflow: 'hidden',
                    bgcolor: '#eff6ff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'box-shadow 0.15s',
                    '&:hover': { boxShadow: '0 8px 28px rgba(37, 99, 235, 0.15)' },
                  }}
                >
                  <Box
                    component="img"
                    src={src || undefined}
                    alt=""
                    sx={{ width: '100%', height: 200, objectFit: 'cover', bgcolor: '#dbeafe', display: 'block' }}
                  />
                  <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                      {shopName(row.shop_id)}
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: '#1e40af', fontSize: '1rem', mb: 1 }}>{row.title || 'Untitled'}</Typography>
                    <Typography sx={{ color: '#475569', fontSize: '0.84rem', lineHeight: 1.55, flex: 1 }}>{row.caption || '—'}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5, pt: 1.5, borderTop: '1px solid #bfdbfe' }}>
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

      <Dialog open={open} onClose={() => !saving && setOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px', boxShadow: '0 12px 32px rgba(37, 99, 235, 0.15)' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: GLD }}>{edit ? 'Edit Media Item' : 'Add New Media'}</Typography>
          <IconButton size="medium" onClick={() => !saving && setOpen(false)} aria-label="Close" sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          {error && (
            <Box sx={{ bgcolor: '#fee2e2', color: '#dc2626', p: 2, borderRadius: '12px', mb: 2.5, border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{error}</Typography>
            </Box>
          )}
          <TextField
            select
            fullWidth
            size="medium"
            label="Select Business"
            value={form.shop_id}
            onChange={(e) => setForm({ ...form, shop_id: e.target.value })}
            sx={{ mt: 1, mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9' } } }}
          >
            {shops.map((s) => (
              <MenuItem key={s.shop_id} value={String(s.shop_id)}>
                {s.shop_name || `Shop ${s.shop_id}`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            size="medium"
            label="Media Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter a descriptive title for this media"
            sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9' } } }}
          />
          <TextField
            fullWidth
            size="medium"
            label="Caption / Description"
            multiline
            minRows={4}
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            placeholder="Describe this image, promotion, or portfolio piece…"
            sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9' } } }}
          />
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" component="label" disabled={uploading} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '12px', borderColor: GL, color: G, px: 3, py: 1.2, fontSize: '0.95rem', '&:hover': { borderColor: GLD, color: GLD, bgcolor: '#eff6ff' } }}>
              {uploading ? 'Uploading…' : form.imageUrl ? 'Replace image' : 'Upload image'}
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onPickFile} />
            </Button>
          </Box>
          {form.imageUrl ? (
            <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid #bfdbfe', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)' }}>
              <Box
                component="img"
                src={resolvePublicBusinessImageUrl(form.imageUrl)}
                alt=""
                sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }}
              />
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', p: 1.5, fontSize: '0.85rem' }}>
                Image uploaded successfully
              </Box>
            </Box>
          ) : (
            <Box sx={{ border: '2px dashed #bfdbfe', borderRadius: '16px', p: 6, textAlign: 'center', bgcolor: '#f8fafc' }}>
              <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 48, color: '#93c5fd', mb: 1.5 }} />
              <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>No image selected</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5 }}>
          <Button onClick={() => setOpen(false)} disabled={saving} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b', fontSize: '0.95rem', px: 3, py: 1.2, borderRadius: '12px', '&:hover': { bgcolor: '#f1f5f9' } }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saving || uploading} sx={{ bgcolor: G, textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 4, py: 1.2, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', '&:hover': { bgcolor: GL }, '&:disabled': { bgcolor: '#93c5fd' } }}>
            {saving ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
