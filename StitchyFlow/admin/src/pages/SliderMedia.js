/**
 * Slider Media Management Page
 * Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Paper, Grid, Button, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Alert, Dialog,
  DialogContent, DialogActions, IconButton, Tooltip, Tabs, Tab, LinearProgress
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon, Image as ImageIcon, Refresh as RefreshIcon,
  Slideshow as SlideshowIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';

const WEBSITE_PAGES = [
  { path: '/about',      label: 'About' },
  { path: '/promotions', label: 'Promotions' },
  { path: '/insights',   label: 'Insights' },
];

const emptyForm = {
  page: '', page_label: '', title: '', description: '',
  image_url: '', image_path: '', bg_color: '#ffffff',
  text_color: '#000000', animation: 'fade', sort_order: 0, status: 'active'
};

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1')
  .replace(/\/api\/v\d+\/?$/i, '');

const C = {
  primary:    '#1565C0',
  primaryMid: '#1976D2',
  bg:         '#E3F2FD',
  bgSoft:     '#F0F7FF',
  border:     '#BBDEFB',
  header:     'linear-gradient(135deg,#1565C0 0%,#1976D2 60%,#42A5F5 100%)',
};

export default function SliderMedia() {
  const [sliders, setSliders]           = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [activeTab, setActiveTab]       = useState(0);
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [editItem, setEditItem]         = useState(null);
  const [form, setForm]                 = useState(emptyForm);
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl]     = useState('');
  const [dragOver, setDragOver]         = useState(false);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('adminToken');

  const fetchSliders = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/slider-media');
      setSliders(res.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.error?.message || 'Failed to load slider media');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSliders(); }, [fetchSliders]);

  const grouped = WEBSITE_PAGES.map(p => ({ ...p, items: sliders.filter(s => s.page === p.path) }));
  const currentPage = WEBSITE_PAGES[activeTab];
  const currentItems = grouped[activeTab]?.items || [];

  const handleOpenAdd = () => {
    setEditItem(null);
    setForm({ ...emptyForm, page: currentPage.path, page_label: currentPage.label });
    setPreviewUrl(''); setDialogOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setForm({ page: item.page, page_label: item.page_label, title: item.title || '',
      description: item.description || '', image_url: item.image_url, image_path: item.image_path,
      bg_color: item.bg_color || '#ffffff', text_color: item.text_color || '#000000',
      animation: item.animation || 'fade', sort_order: item.sort_order || 0, status: item.status });
    setPreviewUrl(item.image_url); setDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true); setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
      };
      const result = await new Promise((resolve, reject) => {
        xhr.onload = () => { try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error('Invalid response')); } };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.open('POST', `${API_BASE}/api/v1/slider-media/upload-image`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
      if (result.success) {
        const updatedForm = { ...form, image_url: result.data.url, image_path: result.data.path };
        setForm(updatedForm); setPreviewUrl(result.data.url);
        if (!editItem) {
          try {
            await api.post('/slider-media', updatedForm);
            setSuccess(`Slider added to "${currentPage?.label}" successfully`);
            setDialogOpen(false); fetchSliders();
          } catch (saveErr) { setError(saveErr.response?.data?.error?.message || 'Save failed'); }
        }
      } else { setError(result.error?.message || 'Upload failed'); }
    } catch (err) { setError(err.message || 'Upload failed'); }
    finally { setUploading(false); setUploadProgress(0); }
  };

  const handleSave = async () => {
    if (!form.image_url) { setError('Please upload an image first'); return; }
    setLoading(true); setError('');
    try {
      if (editItem) { await api.put(`/slider-media/${editItem.id}`, form); setSuccess('Slider updated'); }
      else { await api.post('/slider-media', form); setSuccess('Slider added'); }
      setDialogOpen(false); fetchSliders();
    } catch (e) { setError(e.response?.data?.error?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteDialog.item) return;
    setLoading(true);
    try {
      await api.delete(`/slider-media/${deleteDialog.item.id}`);
      setSuccess('Deleted'); setDeleteDialog({ open: false, item: null }); fetchSliders();
    } catch (e) { setError(e.response?.data?.error?.message || 'Delete failed'); }
    finally { setLoading(false); }
  };

  const handleToggleStatus = async (item) => {
    try {
      await api.put(`/slider-media/${item.id}`, { ...item, status: item.status === 'active' ? 'inactive' : 'active' });
      fetchSliders();
    } catch (e) { setError('Status update failed'); }
  };

  return (
    <Layout title="Slider Media">
      <Box sx={{ bgcolor: '#F5F9FF', minHeight: '100vh' }}>

        {/* Header */}
        <Box sx={{ background: C.header, borderRadius: '16px', p: '28px 32px', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(21,101,192,0.25)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: '14px', bgcolor: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SlideshowIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1.35rem' }}>Slider Media</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>Manage slider images for About &amp; Promotions pages</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchSliders} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: '#fff', color: C.primary, '&:hover': { bgcolor: '#E3F2FD' } }}>
              Add Slider
            </Button>
          </Box>
        </Box>

        {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total Sliders', value: sliders.length,                                      icon: '🖼️', color: C.primary,   bg: C.bg },
            { label: 'Active',        value: sliders.filter(s => s.status === 'active').length,   icon: '✅', color: '#2E7D32',   bg: '#E8F5E9' },
            { label: 'Inactive',      value: sliders.filter(s => s.status === 'inactive').length, icon: '⏸️', color: '#E65100',   bg: '#FFF3E0' },
            { label: 'Pages',         value: new Set(sliders.map(s => s.page)).size,              icon: '📄', color: '#0288D1',   bg: '#E1F5FE' },
          ].map(stat => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper elevation={0} sx={{ p: '18px 20px', borderRadius: '14px', bgcolor: stat.bg, border: `1.5px solid ${stat.color}22`, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '1.8rem', lineHeight: 1 }}>{stat.icon}</Typography>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: stat.color, fontSize: '1.6rem', lineHeight: 1 }}>{stat.value}</Typography>
                  <Typography sx={{ color: '#555', fontSize: '0.75rem', fontWeight: 500 }}>{stat.label}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tabs + Table */}
        <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', border: `1.5px solid ${C.border}`, boxShadow: '0 2px 12px rgba(21,101,192,0.07)' }}>
          <Box sx={{ bgcolor: C.bgSoft, borderBottom: `1.5px solid ${C.border}` }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{
              px: 2,
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', minHeight: 52, color: '#546E7A', '&.Mui-selected': { color: C.primary } },
              '& .MuiTabs-indicator': { bgcolor: C.primary, height: 3, borderRadius: '3px 3px 0 0' }
            }}>
              {WEBSITE_PAGES.map((p, i) => (
                <Tab key={p.path} label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {p.label}
                    {grouped[i]?.items.length > 0 && (
                      <Chip label={grouped[i].items.length} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: C.primary, color: '#fff' }} />
                    )}
                  </Box>
                } />
              ))}
            </Tabs>
          </Box>

          {loading && <LinearProgress sx={{ '& .MuiLinearProgress-bar': { bgcolor: C.primary } }} />}

          <Box sx={{ p: 2.5 }}>
            {currentItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 7 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <ImageIcon sx={{ fontSize: 40, color: C.primaryMid }} />
                </Box>
                <Typography sx={{ color: '#546E7A', fontWeight: 600, mb: 0.5 }}>No sliders for {currentPage?.label} yet</Typography>
                <Typography variant="caption" sx={{ color: '#90A4AE' }}>Upload your first slider image to get started</Typography>
                <Box sx={{ mt: 2.5 }}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: C.primary }}>
                    Add First Slider
                  </Button>
                </Box>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: C.bgSoft }}>
                      {['Preview','Title','Animation','Colors','Order','Status','Created','Actions'].map(h => (
                        <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'} sx={{ fontWeight: 700, color: C.primary, fontSize: '0.78rem', borderBottom: `2px solid ${C.border}`, py: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((item, idx) => (
                      <TableRow key={item.id} hover sx={{ bgcolor: idx % 2 === 0 ? '#fff' : C.bgSoft, '& td': { fontSize: '0.8125rem', borderBottom: `1px solid ${C.border}` }, '&:hover': { bgcolor: C.bg } }}>
                        <TableCell>
                          <Box component="img" src={item.image_url} alt={item.title || 'slider'}
                            sx={{ width: 90, height: 56, objectFit: 'cover', borderRadius: '8px', border: `1.5px solid ${C.border}` }}
                            onError={e => { e.target.src = 'https://via.placeholder.com/90x56?text=IMG'; }} />
                        </TableCell>
                        <TableCell><Typography sx={{ fontWeight: 600, color: '#1A237E', fontSize: '0.8125rem' }}>{item.title || '—'}</Typography></TableCell>
                        <TableCell><Chip label={item.animation} size="small" sx={{ bgcolor: C.bg, color: C.primary, fontWeight: 700, fontSize: '0.7rem', border: `1px solid ${C.border}` }} /></TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title={`BG: ${item.bg_color}`}><Box sx={{ width: 22, height: 22, borderRadius: '5px', bgcolor: item.bg_color, border: `1.5px solid ${C.border}` }} /></Tooltip>
                            <Tooltip title={`Text: ${item.text_color}`}><Box sx={{ width: 22, height: 22, borderRadius: '5px', bgcolor: item.text_color, border: `1.5px solid ${C.border}` }} /></Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell><Chip label={item.sort_order} size="small" sx={{ bgcolor: '#EEF2FF', color: '#3949AB', fontWeight: 700, fontSize: '0.7rem' }} /></TableCell>
                        <TableCell>
                          <Chip label={item.status} size="small" sx={{ bgcolor: item.status === 'active' ? '#E8F5E9' : '#FFF3E0', color: item.status === 'active' ? '#1B5E20' : '#E65100', fontWeight: 700, fontSize: '0.7rem', textTransform: 'capitalize' }} />
                        </TableCell>
                        <TableCell sx={{ color: '#546E7A', fontSize: '0.78rem' }}>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title={item.status === 'active' ? 'Deactivate' : 'Activate'}>
                              <IconButton size="small" onClick={() => handleToggleStatus(item)} sx={{ bgcolor: item.status === 'active' ? '#E8F5E9' : '#FFF3E0', color: item.status === 'active' ? '#2E7D32' : '#E65100', borderRadius: '7px' }}>
                                {item.status === 'active' ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenEdit(item)} sx={{ bgcolor: C.bg, color: C.primary, borderRadius: '7px' }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => setDeleteDialog({ open: true, item })} sx={{ bgcolor: '#FFEBEE', color: '#C62828', borderRadius: '7px' }}>
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

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px', overflow: 'hidden' } }}>
          <Box sx={{ background: C.header, px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SlideshowIcon sx={{ color: '#fff', fontSize: 24 }} />
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
              {editItem ? `Edit Slider — ${currentPage?.label}` : `Add Slider to "${currentPage?.label}"`}
            </Typography>
          </Box>
          <DialogContent sx={{ pt: 3, pb: 1, bgcolor: C.bgSoft }}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }} onClose={() => setError('')}>{error}</Alert>}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            <Box
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragOver(true); }}
              onDragEnter={(e) => { e.preventDefault(); if (!uploading) setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              sx={{
                border: `2px dashed ${dragOver ? C.primary : C.primaryMid}`,
                borderRadius: '14px', p: 4,
                textAlign: 'center', cursor: uploading ? 'default' : 'pointer',
                transition: 'all 0.2s', minHeight: 230, bgcolor: dragOver ? C.bg : '#fff',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transform: dragOver ? 'scale(1.01)' : 'scale(1)',
                boxShadow: dragOver ? `0 0 0 4px ${C.border}` : 'none',
              }}
            >
              {uploading ? (
                <Box sx={{ width: '100%' }}>
                  <CircularProgress size={52} sx={{ color: C.primary, mb: 2 }} />
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 4, height: 8, bgcolor: C.border, '& .MuiLinearProgress-bar': { bgcolor: C.primary } }} />
                  <Typography sx={{ color: C.primary, mt: 1.5, fontWeight: 600 }}>Uploading... {uploadProgress}%</Typography>
                </Box>
              ) : previewUrl ? (
                <Box sx={{ width: '100%' }}>
                  <Box component="img" src={previewUrl} alt="preview" sx={{ maxHeight: 200, maxWidth: '100%', borderRadius: '10px', mb: 1.5, objectFit: 'contain', border: `1.5px solid ${C.border}` }} />
                  <Typography variant="caption" sx={{ color: C.primaryMid, fontWeight: 600 }}>Click to change image</Typography>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: dragOver ? C.border : C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, transition: 'all 0.2s' }}>
                    <CloudUploadIcon sx={{ fontSize: 36, color: C.primary }} />
                  </Box>
                  <Typography sx={{ color: '#1A237E', fontWeight: 700, fontSize: '1rem', mb: 0.5 }}>
                    {dragOver ? 'Drop image here' : 'Click or drag & drop to upload'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#90A4AE' }}>JPEG, PNG, GIF, WebP — max 5MB</Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2.5, bgcolor: C.bgSoft, borderTop: `1px solid ${C.border}`, gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: '9px', textTransform: 'none', fontWeight: 600, color: '#546E7A', border: '1px solid #CFD8DC' }}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={loading || uploading || !form.image_url} sx={{ borderRadius: '9px', textTransform: 'none', fontWeight: 700, bgcolor: C.primary, minWidth: 130, '&:hover': { bgcolor: C.primaryMid } }}>
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : editItem ? 'Update Slider' : 'Add to Slider'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null })} PaperProps={{ sx: { borderRadius: '16px', maxWidth: 420 } }}>
          <Box sx={{ background: 'linear-gradient(135deg,#B71C1C,#E53935)', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon sx={{ color: '#fff' }} />
            <Typography sx={{ fontWeight: 700, color: '#fff' }}>Delete Slider</Typography>
          </Box>
          <DialogContent sx={{ pt: 2.5 }}>
            <Typography sx={{ color: '#37474F' }}>Are you sure you want to delete this slider image? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setDeleteDialog({ open: false, item: null })} sx={{ borderRadius: '9px', textTransform: 'none', fontWeight: 600, color: '#546E7A', border: '1px solid #CFD8DC' }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={loading} sx={{ borderRadius: '9px', textTransform: 'none', fontWeight: 700, minWidth: 100 }}>
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Layout>
  );
}
