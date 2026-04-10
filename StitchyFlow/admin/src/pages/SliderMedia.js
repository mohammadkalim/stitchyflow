/**
 * Slider Media Management Page
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Paper, Grid, Button, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton,
  Tooltip, Tabs, Tab, Divider, LinearProgress, Select, FormControl, InputLabel,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon, Image as ImageIcon, Refresh as RefreshIcon,
  Slideshow as SlideshowIcon, Palette as PaletteIcon, Animation as AnimationIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';

// All main website pages (excluding Home as per requirement)
const WEBSITE_PAGES = [
  { path: '/about',                        label: 'About' },
  { path: '/how-it-works',                 label: 'How It Works' },
  { path: '/careers',                      label: 'Careers' },
  { path: '/press-media',                  label: 'Press & Media' },
  { path: '/blog',                         label: 'Blog' },
  { path: '/promotions',                   label: 'Promotions' },
  { path: '/login',                        label: 'Login' },
  { path: '/register',                     label: 'Register' },
  { path: '/marketplace/custom-dresses',   label: 'Marketplace · Custom Dresses' },
  { path: '/marketplace/suits-blazers',    label: 'Marketplace · Suits & Blazers' },
  { path: '/marketplace/bridal-wear',      label: 'Marketplace · Bridal Wear' },
  { path: '/marketplace/traditional-wear', label: 'Marketplace · Traditional Wear' },
  { path: '/marketplace/alterations',      label: 'Marketplace · Alterations' },
  { path: '/marketplace/fabric-selection', label: 'Marketplace · Fabric Selection' },
  { path: '/customer-dashboard',           label: 'Customer Dashboard' },
  { path: '/tailor-dashboard',             label: 'Tailor Dashboard' },
];

const ANIMATIONS = ['fade', 'slide', 'zoom', 'bounce', 'flip', 'rotate'];

const emptyForm = {
  page: '', page_label: '', title: '', description: '',
  image_url: '', image_path: '', bg_color: '#ffffff',
  text_color: '#000000', animation: 'fade', sort_order: 0, status: 'active'
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function SliderMedia() {
  const [sliders, setSliders]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [activeTab, setActiveTab]   = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [uploading, setUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const token = localStorage.getItem('adminToken');

  const fetchSliders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/v1/slider-media');
      setSliders(res.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.error?.message || 'Failed to load slider media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSliders(); }, [fetchSliders]);

  // Group sliders by page for tab view
  const grouped = WEBSITE_PAGES.map(p => ({
    ...p,
    items: sliders.filter(s => s.page === p.path)
  }));

  const currentPage = WEBSITE_PAGES[activeTab];

  const handleOpenAdd = () => {
    setEditItem(null);
    setForm({ ...emptyForm, page: currentPage.path, page_label: currentPage.label });
    setPreviewUrl('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setForm({
      page: item.page, page_label: item.page_label, title: item.title || '',
      description: item.description || '', image_url: item.image_url,
      image_path: item.image_path, bg_color: item.bg_color || '#ffffff',
      text_color: item.text_color || '#000000', animation: item.animation || 'fade',
      sort_order: item.sort_order || 0, status: item.status
    });
    setPreviewUrl(item.image_url);
    setDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
      };
      const result = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error('Invalid response')); }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.open('POST', `${API_BASE}/api/v1/slider-media/upload-image`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
      if (result.success) {
        setForm(f => ({ ...f, image_url: result.data.url, image_path: result.data.path }));
        setPreviewUrl(result.data.url);
      } else {
        setError(result.error?.message || 'Upload failed');
      }
    } catch (e) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSave = async () => {
    if (!form.image_url) { setError('Please upload an image first'); return; }
    setLoading(true);
    setError('');
    try {
      if (editItem) {
        await api.put(`/api/v1/slider-media/${editItem.id}`, form);
        setSuccess('Slider updated successfully');
      } else {
        await api.post('/api/v1/slider-media', form);
        setSuccess('Slider added successfully');
      }
      setDialogOpen(false);
      fetchSliders();
    } catch (e) {
      setError(e.response?.data?.error?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.item) return;
    setLoading(true);
    try {
      await api.delete(`/api/v1/slider-media/${deleteDialog.item.id}`);
      setSuccess('Deleted successfully');
      setDeleteDialog({ open: false, item: null });
      fetchSliders();
    } catch (e) {
      setError(e.response?.data?.error?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      await api.put(`/api/v1/slider-media/${item.id}`, {
        ...item, status: item.status === 'active' ? 'inactive' : 'active'
      });
      fetchSliders();
    } catch (e) {
      setError('Status update failed');
    }
  };

  const currentItems = grouped[activeTab]?.items || [];

  return (
    <Layout title="Slider Media">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SlideshowIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.25rem' }}>
                Slider Media
              </Typography>
              <Typography variant="caption" sx={{ color: '#999' }}>
                Manage slider images for each page of the main website
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchSliders} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#667eea,#764ba2)' }}
            >
              Add Slider
            </Button>
          </Box>
        </Box>

        {/* Alerts */}
        {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: '8px' }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }} onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Stats row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total Sliders', value: sliders.length, color: '#667eea' },
            { label: 'Active',        value: sliders.filter(s => s.status === 'active').length,   color: '#4CAF50' },
            { label: 'Inactive',      value: sliders.filter(s => s.status === 'inactive').length, color: '#FF9800' },
            { label: 'Pages Covered', value: new Set(sliders.map(s => s.page)).size,              color: '#2196F3' },
          ].map(stat => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center', border: `2px solid ${stat.color}20` }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Page Tabs */}
        <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.8rem', minHeight: 48 } }}
            >
              {WEBSITE_PAGES.map((p, i) => (
                <Tab
                  key={p.path}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {p.label}
                      {grouped[i]?.items.length > 0 && (
                        <Chip label={grouped[i].items.length} size="small"
                          sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#667eea', color: '#fff' }} />
                      )}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {loading && <LinearProgress />}

          <Box sx={{ p: 2 }}>
            {currentItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <ImageIcon sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
                <Typography color="text.secondary">No sliders for {currentPage?.label} yet.</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ mt: 2, borderRadius: '8px', textTransform: 'none' }}>
                  Add First Slider
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 700, color: '#555', fontSize: '0.8rem', bgcolor: '#f9f9f9' } }}>
                      <TableCell>Preview</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Animation</TableCell>
                      <TableCell>Colors</TableCell>
                      <TableCell>Order</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map(item => (
                      <TableRow key={item.id} hover sx={{ '& td': { fontSize: '0.8125rem' } }}>
                        <TableCell>
                          <Box
                            component="img"
                            src={item.image_url}
                            alt={item.title || 'slider'}
                            sx={{ width: 80, height: 50, objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }}
                            onError={e => { e.target.src = 'https://via.placeholder.com/80x50?text=IMG'; }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>{item.title || '—'}</Typography>
                          {item.description && (
                            <Typography variant="caption" sx={{ color: '#999', display: 'block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip label={item.animation} size="small" sx={{ bgcolor: '#f3e8ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.7rem' }} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            <Tooltip title={`BG: ${item.bg_color}`}>
                              <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: item.bg_color, border: '1px solid #ddd' }} />
                            </Tooltip>
                            <Tooltip title={`Text: ${item.text_color}`}>
                              <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: item.text_color, border: '1px solid #ddd' }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>{item.sort_order}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.status}
                            size="small"
                            sx={{
                              bgcolor: item.status === 'active' ? '#e8f5e9' : '#fff3e0',
                              color:   item.status === 'active' ? '#2e7d32' : '#e65100',
                              fontWeight: 600, fontSize: '0.7rem'
                            }}
                          />
                        </TableCell>
                        <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title={item.status === 'active' ? 'Deactivate' : 'Activate'}>
                              <IconButton size="small" onClick={() => handleToggleStatus(item)}
                                sx={{ color: item.status === 'active' ? '#4CAF50' : '#FF9800' }}>
                                {item.status === 'active' ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenEdit(item)} sx={{ color: '#1976d2' }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => setDeleteDialog({ open: true, item })} sx={{ color: '#f44336' }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>

        {/* ── Add / Edit Dialog ── */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth
          PaperProps={{ sx: { borderRadius: '16px' } }}>
          <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee', pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SlideshowIcon sx={{ color: '#667eea' }} />
              {editItem ? 'Edit Slider' : 'Add New Slider'}
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              {/* Page selector */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Page</InputLabel>
                  <Select
                    value={form.page}
                    label="Page"
                    onChange={e => {
                      const pg = WEBSITE_PAGES.find(p => p.path === e.target.value);
                      setForm(f => ({ ...f, page: e.target.value, page_label: pg?.label || e.target.value }));
                    }}
                  >
                    {WEBSITE_PAGES.map(p => (
                      <MenuItem key={p.path} value={p.path}>{p.label}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Which page this slider appears on</FormHelperText>
                </FormControl>
              </Grid>

              {/* Animation */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select fullWidth size="small" label="Animation"
                  value={form.animation}
                  onChange={e => setForm(f => ({ ...f, animation: e.target.value }))}
                  InputProps={{ startAdornment: <AnimationIcon sx={{ mr: 1, color: '#999', fontSize: 18 }} /> }}
                >
                  {ANIMATIONS.map(a => <MenuItem key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</MenuItem>)}
                </TextField>
              </Grid>

              {/* Title */}
              <Grid item xs={12} sm={8}>
                <TextField fullWidth size="small" label="Title (optional)"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </Grid>

              {/* Sort order */}
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Sort Order" type="number"
                  value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField fullWidth size="small" label="Description (optional)" multiline rows={2}
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </Grid>

              {/* Colors */}
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#666', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <PaletteIcon sx={{ fontSize: 14 }} /> Background Color
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input type="color" value={form.bg_color}
                      onChange={e => setForm(f => ({ ...f, bg_color: e.target.value }))}
                      style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                    <TextField size="small" value={form.bg_color}
                      onChange={e => setForm(f => ({ ...f, bg_color: e.target.value }))}
                      sx={{ flex: 1 }} inputProps={{ maxLength: 7 }} />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#666', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <PaletteIcon sx={{ fontSize: 14 }} /> Text Color
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input type="color" value={form.text_color}
                      onChange={e => setForm(f => ({ ...f, text_color: e.target.value }))}
                      style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                    <TextField size="small" value={form.text_color}
                      onChange={e => setForm(f => ({ ...f, text_color: e.target.value }))}
                      sx={{ flex: 1 }} inputProps={{ maxLength: 7 }} />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={form.status} label="Status"
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}>
                  Slider Image
                </Typography>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    border: '2px dashed #667eea', borderRadius: '12px', p: 3, textAlign: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#f3e8ff', borderColor: '#764ba2' }
                  }}
                >
                  {uploading ? (
                    <Box>
                      <CircularProgress size={32} sx={{ color: '#667eea', mb: 1 }} />
                      <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 4, mt: 1 }} />
                      <Typography variant="caption" sx={{ color: '#666', mt: 0.5, display: 'block' }}>
                        Uploading... {uploadProgress}%
                      </Typography>
                    </Box>
                  ) : previewUrl ? (
                    <Box>
                      <Box component="img" src={previewUrl} alt="preview"
                        sx={{ maxHeight: 160, maxWidth: '100%', borderRadius: '8px', mb: 1, objectFit: 'contain' }} />
                      <Typography variant="caption" sx={{ color: '#667eea', display: 'block' }}>
                        Click to change image
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
                      <Typography sx={{ color: '#667eea', fontWeight: 600 }}>Click to upload image</Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>JPEG, PNG, GIF, WebP — max 5MB</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={loading || uploading}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : editItem ? 'Update Slider' : 'Add Slider'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Delete Confirm Dialog ── */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null })}
          PaperProps={{ sx: { borderRadius: '16px', maxWidth: 400 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Delete Slider</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this slider image? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setDeleteDialog({ open: false, item: null })} sx={{ borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
