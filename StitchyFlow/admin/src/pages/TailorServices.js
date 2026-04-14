/**
 * Tailor Services Management Page — live DB CRUD, icon upload, light-blue theme
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, Card, CardContent,
  IconButton, Tooltip, Switch, FormControlLabel, Divider, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
  Chip, Avatar, Stack,
} from '@mui/material';
import {
  ContentCut as TailorsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import { uploadAdImage } from '../utils/adsApi';

function apiOrigin() {
  const raw = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1').trim().replace(/\/$/, '');
  return raw.replace(/\/api\/v\d+$/i, '') || 'http://localhost:5000';
}

/** Uploaded ads + DB paths /images/... are served from the API (see server.js static /images, /uploads). */
function resolveMediaUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const root = apiOrigin();
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${root}${path}`;
}

const emptyForm = () => ({
  service_name: '',
  service_description: '',
  category: '',
  link_path: '/marketplace/custom-dresses',
  base_price: '0',
  accent_color: '#2196F3',
  image_url: '',
  is_active: true,
  is_popular: false,
});

function TailorServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  /** Hide broken image URLs (missing files under backend/public/images/...) */
  const [brokenImages, setBrokenImages] = useState(() => new Set());

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/tailor-services');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const normalized = res.data.data.map((row) => {
          const imageUrl = typeof row.image_url === 'string' ? row.image_url.trim() : '';
          const hideBrokenServiceImage =
            !imageUrl ||
            /^\/images\/services\//i.test(imageUrl) ||
            /^images\/services\//i.test(imageUrl);

          return {
            ...row,
            image_url: hideBrokenServiceImage ? '' : imageUrl,
          };
        });

        setServices(normalized);
        setBrokenImages(new Set());
      }
    } catch (error) {
      const msg = error.response?.data?.error?.message || error.message || 'Failed to load services';
      setSnack({ open: true, msg, sev: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.service_id);
    setForm({
      service_name: row.service_name || '',
      service_description: row.service_description || '',
      category: row.category || '',
      link_path: row.link_path || '/marketplace/custom-dresses',
      base_price: row.base_price != null ? String(row.base_price) : '0',
      accent_color: row.accent_color || '#2196F3',
      image_url: row.image_url || '',
      is_active: !!row.is_active,
      is_popular: !!row.is_popular,
    });
    setDialogOpen(true);
  };

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAdImage(file);
      const payload = res.data?.data;
      const stored = payload?.path || payload?.url;
      if (stored) {
        setForm((f) => ({ ...f, image_url: stored }));
        setSnack({ open: true, msg: 'Image uploaded', sev: 'success' });
      } else {
        throw new Error('Upload completed but no image path was returned');
      }
    } catch (err) {
      const status = err.response?.status;
      const apiMessage = err.response?.data?.error?.message;
      const friendlyMessage =
        status === 401
          ? 'Your session has expired. Please log in again and retry the upload.'
          : status === 403
            ? 'You do not have permission to upload this image. Please use an admin account with a valid session.'
            : apiMessage || err.message || 'Upload failed';

      setSnack({ open: true, msg: friendlyMessage, sev: 'error' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const submitForm = async () => {
    if (!form.service_name.trim() || !form.category.trim()) {
      setSnack({ open: true, msg: 'Name and type (category) are required', sev: 'warning' });
      return;
    }
    const base = parseFloat(form.base_price);
    if (Number.isNaN(base)) {
      setSnack({ open: true, msg: 'Base price must be a number', sev: 'warning' });
      return;
    }
    setSaving(true);
    const body = {
      service_name: form.service_name.trim(),
      service_description: form.service_description.trim() || null,
      category: form.category.trim(),
      link_path: form.link_path.trim() || null,
      base_price: base,
      accent_color: form.accent_color.trim() || null,
      image_url: form.image_url.trim() || null,
      is_active: form.is_active,
      is_popular: form.is_popular,
    };
    try {
      if (editingId) {
        await api.put(`/tailor-services/${editingId}`, body);
        setSnack({ open: true, msg: 'Service updated', sev: 'success' });
      } else {
        await api.post('/tailor-services', body);
        setSnack({ open: true, msg: 'Service created', sev: 'success' });
      }
      setDialogOpen(false);
      loadServices();
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'Save failed';
      setSnack({ open: true, msg, sev: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/tailor-services/${deleteTarget.service_id}`);
      setSnack({ open: true, msg: 'Service deleted', sev: 'success' });
      setDeleteTarget(null);
      loadServices();
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'Delete failed';
      setSnack({ open: true, msg, sev: 'error' });
    }
  };

  const toggleActive = async (row) => {
    try {
      await api.patch(`/tailor-services/${row.service_id}/toggle-active`);
      loadServices();
    } catch (error) {
      setSnack({ open: true, msg: error.response?.data?.error?.message || 'Update failed', sev: 'error' });
    }
  };

  const lightBlue = {
    pageBg: '#f0f7ff',
    headerGradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 45%, #90caf9 100%)',
    border: '#b3d9ff',
    paperTint: '#fafdff',
  };

  return (
    <Layout title="Tailor Services Management">
      <Box sx={{ bgcolor: lightBlue.pageBg, minHeight: '100%', mx: -2, mt: -2, p: 2, borderRadius: 0 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, mb: 3,
          p: { xs: 2, sm: 2.5 }, borderRadius: '12px',
          background: lightBlue.headerGradient,
          border: `1px solid ${lightBlue.border}`,
          boxShadow: '0 4px 18px rgba(33,150,243,0.15)',
          flexWrap: 'wrap',
        }}>
          <Box sx={{
            width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: '12px',
            bgcolor: 'rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${lightBlue.border}`,
          }}>
            <TailorsIcon sx={{ color: '#1565c0', fontSize: { xs: 22, sm: 26 } }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0d47a1', lineHeight: 1.2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Tailor Services
            </Typography>
            <Typography variant="caption" sx={{ color: '#1565c0', display: { xs: 'none', sm: 'block' } }}>
              Live data from MySQL — add, edit, delete, enable/disable; icons appear on the main site menu
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAdd}
              sx={{
                bgcolor: '#2196f3',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(33,150,243,0.35)',
                '&:hover': { bgcolor: '#1976d2' },
              }}
            >
              Add service
            </Button>
            <Tooltip title="Reload from database">
              <IconButton onClick={loadServices} sx={{ color: '#1565c0', bgcolor: 'rgba(255,255,255,0.7)', border: `1px solid ${lightBlue.border}` }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Paper sx={{
          borderRadius: '12px',
          border: `1px solid ${lightBlue.border}`,
          bgcolor: lightBlue.paperTint,
          boxShadow: '0 2px 12px rgba(33,150,243,0.08)',
          overflow: 'hidden',
        }}>
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#e8f4fc', borderBottom: `1px solid ${lightBlue.border}` }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0d47a1', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Services ({services.length})
            </Typography>
            <Typography variant="body2" sx={{ color: '#1565c0', mt: 0.5 }}>
              Toggle active to show or hide in the public Tailor Services menu. Set link path for navigation (e.g. /marketplace/alterations).
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#2196f3' }} />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {services.map((row) => (
                  <Grid item xs={12} md={6} key={row.service_id}>
                    <Card sx={{
                      borderRadius: '10px',
                      border: `1px solid ${lightBlue.border}`,
                      bgcolor: row.is_active ? '#fff' : '#f5f9ff',
                      opacity: row.is_active ? 1 : 0.92,
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: '0 4px 14px rgba(33,150,243,0.12)' },
                    }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar
                            variant="rounded"
                            src={
                              row.image_url && !brokenImages.has(row.service_id)
                                ? resolveMediaUrl(row.image_url) || undefined
                                : undefined
                            }
                            imgProps={{
                              onError: () => {
                                setBrokenImages((prev) => new Set(prev).add(row.service_id));
                              },
                            }}
                            sx={{
                              width: 52, height: 52,
                              bgcolor: (row.accent_color || '#2196f3') + '22',
                              color: row.accent_color || '#2196f3',
                              fontWeight: 700,
                            }}
                          >
                            {!row.image_url || brokenImages.has(row.service_id)
                              ? (row.service_name || '?')[0]
                              : null}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0d47a1', fontSize: '0.95rem' }}>
                                {row.service_name}
                              </Typography>
                              <Chip label={row.category} size="small" sx={{ height: 22, fontSize: '0.7rem', bgcolor: '#e3f2fd', color: '#1565c0' }} />
                              {!row.is_active && (
                                <Chip label="Disabled" size="small" sx={{ height: 22, fontSize: '0.65rem', bgcolor: '#ffebee', color: '#c62828' }} />
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ color: '#455a64', fontSize: '0.8rem', mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {row.service_description || '—'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#78909c', display: 'block' }}>
                              Link: {row.link_path || '—'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <FormControlLabel
                              control={(
                                <Switch
                                  checked={!!row.is_active}
                                  onChange={() => toggleActive(row)}
                                  size="small"
                                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2196f3' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#90caf9' } }}
                                />
                              )}
                              label={<Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#546e7a' }}>Active</Typography>}
                              sx={{ mr: 0 }}
                            />
                            <IconButton size="small" onClick={() => openEdit(row)} sx={{ color: '#1976d2' }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => setDeleteTarget(row)} sx={{ color: '#e53935' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {services.length === 0 && !loading && (
                  <Grid item xs={12}>
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                      No services yet. Click &quot;Add service&quot; or run the database seed script.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>

          <Divider sx={{ borderColor: lightBlue.border }} />
          <Box sx={{ p: 2, bgcolor: '#e8f4fc', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<SaveIcon />}
              onClick={loadServices}
              sx={{ color: '#1565c0', textTransform: 'none', fontWeight: 600 }}
            >
              Refresh from database
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            border: '1px solid rgba(20, 52, 102, 0.10)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.18)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2.5,
            background: 'linear-gradient(135deg, #eef6ff 0%, #e4f0ff 55%, #d7e9ff 100%)',
            borderBottom: '1px solid rgba(20, 52, 102, 0.10)',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '16px',
                bgcolor: '#ffffff',
                border: '1px solid rgba(33, 150, 243, 0.18)',
                boxShadow: '0 10px 25px rgba(33, 150, 243, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1565c0',
              }}
            >
              <TailorsIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.45rem', fontWeight: 800, color: '#123a72', lineHeight: 1.15 }}>
                {editingId ? 'Edit service' : 'Add service'}
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: '0.92rem', color: '#4f6b95' }}>
                Create a polished service profile with clear business details, pricing, branding, and visibility settings.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: 3, bgcolor: 'transparent' }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: '18px',
                bgcolor: '#ffffff',
                border: '1px solid rgba(20, 52, 102, 0.08)',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#123a72', mb: 0.5 }}>
                Basic information
              </Typography>
              <Typography sx={{ fontSize: '0.87rem', color: '#6b7a90', mb: 2.5 }}>
                Enter the core service details customers and admins will recognize instantly.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Service name"
                    value={form.service_name}
                    onChange={(e) => setForm((f) => ({ ...f, service_name: e.target.value }))}
                    fullWidth
                    size="medium"
                    required
                    placeholder="e.g. Premium Suit Stitching"
                    helperText="Use a clear, professional service title."
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Type (category)"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    fullWidth
                    size="medium"
                    required
                    placeholder="e.g. Men's Wear"
                    helperText="Assign the business category for quick filtering."
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={form.service_description}
                    onChange={(e) => setForm((f) => ({ ...f, service_description: e.target.value }))}
                    fullWidth
                    size="medium"
                    multiline
                    rows={3}
                    placeholder="Describe the quality, fitting, style, or unique value of this service."
                    helperText="Keep it concise and client-friendly."
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '18px',
                    bgcolor: '#ffffff',
                    border: '1px solid rgba(20, 52, 102, 0.08)',
                    boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
                    height: '100%',
                  }}
                >
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#123a72', mb: 0.5 }}>
                    Pricing and navigation
                  </Typography>
                  <Typography sx={{ fontSize: '0.87rem', color: '#6b7a90', mb: 2.5 }}>
                    Define where this service leads and the base price shown in the system.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Link path"
                        value={form.link_path}
                        onChange={(e) => setForm((f) => ({ ...f, link_path: e.target.value }))}
                        fullWidth
                        size="medium"
                        placeholder="/marketplace/alterations"
                        helperText="Use the relative route for website navigation."
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Base price"
                        value={form.base_price}
                        onChange={(e) => setForm((f) => ({ ...f, base_price: e.target.value }))}
                        fullWidth
                        size="medium"
                        type="number"
                        inputProps={{ step: '0.01', min: 0 }}
                        helperText="Set the starting service price."
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Accent color (hex)"
                        value={form.accent_color}
                        onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))}
                        fullWidth
                        size="medium"
                        placeholder="#2196F3"
                        helperText="Used for visual branding and service identity."
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '18px',
                    bgcolor: '#ffffff',
                    border: '1px solid rgba(20, 52, 102, 0.08)',
                    boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#123a72', mb: 0.5 }}>
                    Brand preview
                  </Typography>
                  <Typography sx={{ fontSize: '0.87rem', color: '#6b7a90', mb: 2.5 }}>
                    Review the visual identity that will represent this service.
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '18px',
                      border: '1px solid rgba(33, 150, 243, 0.14)',
                      background: 'linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2.5,
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={
                        form.image_url && !/^https?:\/\/chrome-extension\//i.test(form.image_url)
                          ? resolveMediaUrl(form.image_url) || undefined
                          : undefined
                      }
                      imgProps={{
                        onError: (event) => {
                          event.currentTarget.style.display = 'none';
                        },
                      }}
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        bgcolor: `${form.accent_color || '#2196F3'}22`,
                        color: form.accent_color || '#2196F3',
                        fontWeight: 700,
                        border: '1px solid rgba(20, 52, 102, 0.08)',
                      }}
                    >
                      {(form.service_name || 'S')[0]}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, color: '#143663', fontSize: '0.98rem' }}>
                        {form.service_name || 'Service preview'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.82rem', color: '#6b7a90', mt: 0.25 }}>
                        {form.category || 'Category preview'}
                      </Typography>
                      <Chip
                        label={form.accent_color || '#2196F3'}
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor: `${form.accent_color || '#2196F3'}18`,
                          color: form.accent_color || '#2196F3',
                          fontWeight: 700,
                          borderRadius: '8px',
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '18px',
                      border: '1px dashed rgba(33, 150, 243, 0.35)',
                      bgcolor: '#fafdff',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#546e7a', display: 'block', mb: 1 }}>
                      Service icon (upload image)
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      disabled={uploading || saving}
                      sx={{
                        borderColor: '#90caf9',
                        color: '#1565c0',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '12px',
                        px: 2,
                        py: 1,
                      }}
                    >
                      {uploading ? 'Uploading…' : 'Choose image'}
                      <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={handleImagePick} />
                    </Button>
                    <Typography sx={{ mt: 1.25, fontSize: '0.78rem', color: '#6b7a90', lineHeight: 1.6 }}>
                      Upload a clean square icon or branded image for a more premium presentation.
                    </Typography>
                    {form.image_url && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, wordBreak: 'break-all', color: '#143663' }}>
                        {form.image_url}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                p: 2.5,
                borderRadius: '18px',
                bgcolor: '#ffffff',
                border: '1px solid rgba(20, 52, 102, 0.08)',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#123a72', mb: 0.5 }}>
                Visibility settings
              </Typography>
              <Typography sx={{ fontSize: '0.87rem', color: '#6b7a90', mb: 2 }}>
                Control whether this service is available on the website and whether it is marked as popular.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box
                  sx={{
                    flex: 1,
                    p: 1.75,
                    borderRadius: '16px',
                    border: '1px solid rgba(20, 52, 102, 0.08)',
                    bgcolor: '#f9fbff',
                  }}
                >
                  <FormControlLabel
                    control={(
                      <Switch
                        checked={form.is_active}
                        onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2196f3' } }}
                      />
                    )}
                    label="Active (show on website)"
                    sx={{ m: 0, alignItems: 'center' }}
                  />
                  <Typography sx={{ ml: 0.5, mt: 0.5, fontSize: '0.8rem', color: '#6b7a90' }}>
                    Enable this service to make it visible to customers on the website.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 1.75,
                    borderRadius: '16px',
                    border: '1px solid rgba(20, 52, 102, 0.08)',
                    bgcolor: '#f9fbff',
                  }}
                >
                  <FormControlLabel
                    control={(
                      <Switch
                        checked={form.is_popular}
                        onChange={(e) => setForm((f) => ({ ...f, is_popular: e.target.checked }))}
                      />
                    )}
                    label="Popular"
                    sx={{ m: 0, alignItems: 'center' }}
                  />
                  <Typography sx={{ ml: 0.5, mt: 0.5, fontSize: '0.8rem', color: '#6b7a90' }}>
                    Highlight this service as a featured offering inside the platform.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2.25,
            bgcolor: '#f7fbff',
            borderTop: '1px solid rgba(20, 52, 102, 0.10)',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '0.8rem', color: '#7a8aa3', display: { xs: 'none', sm: 'block' } }}>
            All changes are saved directly to the live services database.
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              onClick={() => setDialogOpen(false)}
              disabled={saving}
              sx={{
                color: '#546e7a',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '12px',
                px: 2.5,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={submitForm}
              disabled={saving}
              sx={{
                minWidth: 150,
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '12px',
                px: 3,
                boxShadow: '0 12px 24px rgba(33, 150, 243, 0.28)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
                },
              }}
            >
              {saving ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : (editingId ? 'Save changes' : 'Create service')}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete service?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This removes &quot;{deleteTarget?.service_name}&quot; from the database. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} sx={{ textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export default TailorServices;
