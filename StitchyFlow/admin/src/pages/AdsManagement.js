import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  LinearProgress,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Campaign as CampaignIcon,
  CloudUpload as CloudUploadIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  PlayArrow as PlayArrowIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import { adsRequest, uploadAdImage } from '../utils/adsApi';

const PAGE_OPTIONS = [
  { path: '/home', label: 'Home' },
  { path: '/marketplace/custom-dresses', label: 'Marketplace · Custom dresses' },
  { path: '/about', label: 'About' },
  { path: '/marketplace/fabric-selection', label: 'Marketplace · Fabric selection' },
  { path: '/tailor-dashboard', label: 'Tailor dashboard' },
  { path: '/customer-dashboard', label: 'Customer dashboard' }
];

const emptyForm = {
  title: '',
  image_url: '',
  image_urls: [],
  redirect_url: '',
  start_date: '',
  end_date: '',
  status: 'active',
  pages: []
};

function parsePages(p) {
  if (Array.isArray(p)) return p;
  if (typeof p === 'string') {
    try {
      return JSON.parse(p || '[]');
    } catch {
      return [];
    }
  }
  return [];
}

function parseImageUrls(value, fallbackImageUrl = '') {
  if (Array.isArray(value)) {
    return value.map((v) => String(v || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v || '').trim()).filter(Boolean);
    } catch {
      return value
        .split(/\r?\n|,/)
        .map((v) => v.trim())
        .filter(Boolean);
    }
  }
  if (fallbackImageUrl && String(fallbackImageUrl).trim()) return [String(fallbackImageUrl).trim()];
  return [];
}

/** datetime-local → MySQL DATETIME */
function toSqlDateTime(v) {
  if (v == null || String(v).trim() === '') return null;
  const s = String(v).trim();
  if (s.includes('T')) return s.replace('T', ' ').slice(0, 19);
  return s;
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'default';
    default:
      return 'warning';
  }
};

function AdsManagement() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [adsAnalytics, setAdsAnalytics] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const totalAds = ads.length;
  const activeAds = ads.filter((ad) => ad.status === 'active').length;
  const totalImpressions = adsAnalytics.reduce((sum, item) => sum + Number(item.impressions || 0), 0);
  const totalClicks = adsAnalytics.reduce((sum, item) => sum + Number(item.clicks || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const closeDialog = () => {
   setDialogOpen(false);
    setDialogError('');
    setForm(emptyForm);
    setEditingId(null);
    setUploading(false);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adsRequest((p) => api.get(`${p}/admin`));
      if (res.data?.success) setAds(res.data.data || []);
    } catch (e) {
      setMessage(
        e.response?.data?.error?.message ||
          (e.response?.status === 404
            ? 'Ads API not found. Restart the StitchyFlow backend from StitchyFlow/backend (npm start).'
            : 'Failed to load ads')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adsRequest((p) => api.get(`${p}/analytics`));
        if (!cancelled && res.data?.success) {
          setAdsAnalytics(res.data.data || []);
        }
      } catch {
        // ignore analytics errors in management view
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, pages: [] });
    setDialogError('');
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setDialogError('');
    const pages = parsePages(row.pages);
    setForm({
      title: row.title || '',
      image_url: row.image_url || '',
      image_urls: parseImageUrls(row.image_urls, row.image_url),
      redirect_url: row.redirect_url || '',
      start_date: row.start_date ? row.start_date.slice(0, 16) : '',
      end_date: row.end_date ? row.end_date.slice(0, 16) : '',
      status: row.status || 'active',
      pages
    });
    setDialogOpen(true);
  };

  const togglePage = (path) => {
    setForm((f) => {
      const set = new Set(f.pages || []);
      if (set.has(path)) set.delete(path);
      else set.add(path);
      return { ...f, pages: [...set] };
    });
  };

  const onImageFileSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setDialogError('');
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        // eslint-disable-next-line no-await-in-loop
        const res = await uploadAdImage(file);
        const url = res.data?.data?.url;
        if (!url) throw new Error('No image URL returned from server');
        uploadedUrls.push(url);
      }
      setForm((f) => {
        const merged = [...new Set([...(f.image_urls || []), ...uploadedUrls])];
        return { ...f, image_urls: merged, image_url: merged[0] || '' };
      });
    } catch (err) {
      setDialogError(
        err.response?.data?.error?.message || err.message || 'Image upload failed'
      );
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setDialogError('');
    const normalizedImageUrls = parseImageUrls(form.image_urls, form.image_url);
    if (!form.title.trim() || !normalizedImageUrls.length || !form.redirect_url.trim()) {
      setDialogError('Title, at least one image (URL or uploaded file), and redirect URL are required.');
      return;
    }
    if (normalizedImageUrls.some((u) => /^file:/i.test(String(u).trim()))) {
      setDialogError(
        'Local file paths (file://…) cannot be used. Click Upload image to send the file to the server, or paste a public https:// image URL.'
      );
      return;
    }
    if (!form.pages.length) {
      setDialogError('Select at least one page where this ad should appear.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        image_url: normalizedImageUrls[0],
        image_urls: normalizedImageUrls,
        redirect_url: form.redirect_url.trim(),
        start_date: toSqlDateTime(form.start_date),
        end_date: toSqlDateTime(form.end_date),
        status: form.status,
        pages: form.pages
      };
      await adsRequest((p) =>
        editingId ? api.put(`${p}/${editingId}`, payload) : api.post(p, payload)
      );
      closeDialog();
      setMessage('');
      await load();
    } catch (e) {
      const errMsg =
        e.response?.data?.error?.message ||
        (e.response?.status === 404
          ? 'Ads API not found (404). Restart the StitchyFlow backend from StitchyFlow/backend (npm start).'
          : null) ||
        (e.response?.status === 403
          ? 'Access denied. Your account must have role "admin" to save ads.'
          : e.message || 'Save failed');
      setDialogError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const start = async (id) => {
    if (!window.confirm('Start this splash ad?')) return;
    try {
      await adsRequest((p) => api.put(`${p}/${id}`, { status: 'active' }));
      await load();
    } catch (e) {
      setMessage(e.response?.data?.error?.message || 'Failed to start ad');
    }
  };

  const stop = async (id) => {
    if (!window.confirm('Stop this splash ad?')) return;
    try {
      await adsRequest((p) => api.put(`${p}/${id}`, { status: 'inactive' }));
      await load();
    } catch (e) {
      setMessage(e.response?.data?.error?.message || 'Failed to stop ad');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this splash ad?')) return;
    try {
      await adsRequest((p) => api.delete(`${p}/${id}`));
      await load();
    } catch (e) {
      setMessage(e.response?.data?.error?.message || 'Delete failed');
    }
  };

  const activeCount = ads.filter((a) => a.status === 'active').length;
  const filteredAds = ads.filter((ad) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || ad.title?.toLowerCase().includes(query) || ad.redirect_url?.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    const adType = ad.type || 'image';
    const matchesType = typeFilter === 'all' || adType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Layout title="Ads Management">
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: { xs: 1.5, md: 2 },
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          bgcolor: '#ffffff'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              Ads Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', maxWidth: 760, mt: 0.25 }}>
              Create, manage, and optimize your advertising campaigns
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '8px',
              px: 2.25,
              py: 0.75,
              minHeight: 36,
              background: 'linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)'
            }}
          >
            Create New Ad
          </Button>
        </Box>

        <Grid container spacing={1.25} sx={{ mt: 1.5 }}>
          <Grid item xs={12} sm={3}>
            <Paper elevation={0} sx={{ p: 1.5, minHeight: 92, borderRadius: 2, border: '1px solid #eef2f7', bgcolor: '#f8fafc' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <CampaignIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>Total Ads</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>{ads.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper elevation={0} sx={{ p: 1.5, minHeight: 92, borderRadius: 2, border: '1px solid #eef2f7', bgcolor: '#f8fafc' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <PlayArrowIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>Active Ads</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#166534' }}>{activeCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper elevation={0} sx={{ p: 1.5, minHeight: 92, borderRadius: 2, border: '1px solid #eef2f7', bgcolor: '#f8fafc' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>Total Impressions</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#334155' }}>{totalImpressions}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper elevation={0} sx={{ p: 1.5, minHeight: 92, borderRadius: 2, border: '1px solid #eef2f7', bgcolor: '#f8fafc' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>Avg CTR</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#334155' }}>{avgCtr}%</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: 1.5,
            borderRadius: 2.5,
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.25,
            alignItems: 'center'
          }}
        >
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ads by name..."
            size="small"
            sx={{ minWidth: 240, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Paused</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            sx={{ width: 140 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="image">Image</MenuItem>
          </TextField>
          <IconButton sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Box>

      {message && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5 }} onClose={() => setMessage('')}>{message}</Alert>
      )}

      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={6}>
            <CircularProgress />
          </Box>
        ) : (
          <>
          <Divider />
          <TableContainer sx={{ bgcolor: '#ffffff' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#6b7280', fontSize: 11, letterSpacing: '0.06em' }}>AD CAMPAIGN</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#6b7280', fontSize: 11, letterSpacing: '0.06em' }}>TYPE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#6b7280', fontSize: 11, letterSpacing: '0.06em' }}>STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#6b7280', fontSize: 11, letterSpacing: '0.06em' }}>PLACEMENTS</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#6b7280', fontSize: 11, letterSpacing: '0.06em' }}>IMPRESSIONS</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#6b7280', fontSize: 11, letterSpacing: '0.06em' }}>CLICKS</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#6b7280', fontSize: 11, letterSpacing: '0.06em' }}>CTR</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#6b7280', fontSize: 11, letterSpacing: '0.06em' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No ads yet. Click &quot;New ad&quot; to create one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAds.map((ad) => {
                    const placements = parsePages(ad.pages);
                    const adImages = parseImageUrls(ad.image_urls, ad.image_url);
                    const rowAnalytics = adsAnalytics.filter((x) => Number(x.ad_id) === Number(ad.id));
                    const impressions = rowAnalytics.reduce((sum, x) => sum + Number(x.impressions || 0), 0);
                    const clicks = rowAnalytics.reduce((sum, x) => sum + Number(x.clicks || 0), 0);
                    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
                    return (
                    <TableRow
                      key={ad.id}
                      hover
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                        '&:hover': { bgcolor: '#f8fbff' }
                      }}
                    >
                      <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                          <Box
                            component="img"
                            src={adImages[0] || ad.image_url}
                            alt=""
                            sx={{ width: 34, height: 34, borderRadius: 1.5, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <Box>
                            <Typography fontWeight={700} sx={{ color: '#0f172a' }}>{ad.title}</Typography>
                            <Typography variant="caption" color="text.secondary">ID {ad.id}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <ImageIcon sx={{ fontSize: 14, color: '#2563eb' }} />
                          <Typography variant="body2" sx={{ color: '#475569' }}>Image</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ad.status === 'active' ? 'Active' : 'Paused'}
                          size="small"
                          sx={{
                            bgcolor: ad.status === 'active' ? '#dcfce7' : '#fef3c7',
                            color: ad.status === 'active' ? '#166534' : '#92400e',
                            fontWeight: 700
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 220 }}>
                          {placements.slice(0, 2).map((p) => (
                            <Chip
                              key={p}
                              size="small"
                              label={p.replace('/', '')}
                              sx={{ bgcolor: '#f3e8ff', color: '#6b21a8', fontWeight: 700, fontSize: 11 }}
                            />
                          ))}
                          {placements.length > 2 && <Chip size="small" label={`+${placements.length - 2}`} />}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>{impressions}</Typography>
                        <Typography variant="caption" color="text.secondary">impressions</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>{clicks}</Typography>
                        <Typography variant="caption" color="text.secondary">clicks</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>{ctr}%</Typography>
                        <Typography variant="caption" color="text.secondary">click rate</Typography>
                      </TableCell>
                      <TableCell align="right">
                        {ad.status === 'active' ? (
                          <Tooltip title="Stop">
                            <IconButton size="small" color="warning" onClick={() => stop(ad.id)}>
                              <PauseCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Start">
                            <IconButton size="small" color="success" onClick={() => start(ad.id)}>
                              <PlayArrowIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Analytics">
                          <IconButton size="small" color="info" onClick={() => navigate('/ads-analytics')}>
                            <BarChartIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                          <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => openEdit(ad)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => remove(ad.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          </>
        )}
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '22px',
            bgcolor: '#f7fbff',
            boxShadow: '0 30px 70px rgba(15, 23, 42, 0.12)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 0, px: 4 }}>
          <Typography component="div" variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            {editingId ? 'Edit splash ad' : 'New splash ad'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#546e7a', mt: 1, maxWidth: 760 }}>
            Create a polished, corporate splash ad with a strong headline, branded image and targeted redirect. Preview your ad before saving.
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ px: 4, pt: 3, pb: 2, bgcolor: '#eef4ff' }}>
          {dialogError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDialogError('')}>
              {dialogError}
            </Alert>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 3, p: 3, borderRadius: 3, bgcolor: '#ffffff', boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.04)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1e3a8a' }}>
                  Core details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Image URLs"
                      value={(form.image_urls || []).join('\n')}
                      onChange={(e) => {
                        const image_urls = parseImageUrls(e.target.value, '');
                        setForm((f) => ({ ...f, image_urls, image_url: image_urls[0] || '' }));
                      }}
                      placeholder={'https://...\nhttps://...'}
                      helperText="Add one image URL per line, or upload files below (JPEG / PNG / GIF / WebP, max 5 MB each)."
                      required
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      multiple
                      hidden
                      onChange={onImageFileSelected}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5, flexWrap: 'wrap' }}>
                      <Button
                        type="button"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading || saving}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                      >
                        {uploading ? 'Uploading…' : 'Upload image(s)'}
                      </Button>
                      {(form.image_urls || []).length > 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                          {(form.image_urls || []).length} image(s) selected
                        </Typography>
                      )}
                    </Box>
                    {uploading && <LinearProgress sx={{ mt: 1 }} />}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Redirect URL (on click)"
                      value={form.redirect_url}
                      onChange={(e) => setForm((f) => ({ ...f, redirect_url: e.target.value }))}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ p: 3, borderRadius: 3, bgcolor: '#ffffff', boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.04)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1e3a8a' }}>
                  Scheduling & targeting
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Start (optional)"
                      InputLabelProps={{ shrink: true }}
                      value={form.start_date}
                      onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="End (optional)"
                      InputLabelProps={{ shrink: true }}
                      value={form.end_date}
                      onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Show on pages (main site)
                    </Typography>
                    <FormGroup>
                      {PAGE_OPTIONS.map((opt) => (
                        <FormControlLabel
                          key={opt.path}
                          control={
                            <Checkbox
                              checked={form.pages.includes(opt.path)}
                              onChange={() => togglePage(opt.path)}
                            />
                          }
                          label={`${opt.label} (${opt.path})`}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(14, 165, 233, 0.16)', bgcolor: '#ffffff', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                  Live preview
                </Typography>
                <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0', mb: 2, minHeight: 280, bgcolor: '#f8faff' }}>
                  {(form.image_urls || []).length > 0 ? (
                    <Box
                      component="img"
                      src={(form.image_urls || [])[0]}
                      alt="Ad preview"
                      sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#eef2ff', color: '#64748b' }}>
                      <Typography variant="body2">Upload an image for a richer preview</Typography>
                    </Box>
                  )}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                      {form.title || 'Your splash ad title'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {form.redirect_url || 'Redirect URL appears here when set'}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      disableElevation
                      sx={{ textTransform: 'none', fontWeight: 700 }}
                    >
                      {form.status === 'active' ? 'Active preview' : 'Inactive preview'}
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                  {(form.image_urls || []).length > 1 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {(form.image_urls || []).slice(0, 6).map((url) => (
                        <Box
                          key={url}
                          component="img"
                          src={url}
                          alt="ad gallery preview"
                          sx={{ width: 52, height: 52, borderRadius: 1.5, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        />
                      ))}
                    </Box>
                  )}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
                    Guidelines
                  </Typography>
                  <Box component="ul" sx={{ m: 0, p: '0 0 0 18px', color: '#475569', '& li': { mb: 1 } }}>
                    <li>Choose a clean, sharp headline and a strong image.</li>
                    <li>Set a precise landing URL for higher conversion.</li>
                    <li>Use schedule dates to control live publishing windows.</li>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {(form.image_urls || []).length > 0 && !uploading && (
            <Box sx={{ mt: 3, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#ffffff', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={(form.image_urls || [])[0]}
                alt="Ad preview"
                sx={{ width: 86, height: 86, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(15, 23, 42, 0.08)' }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Preview ready</Typography>
                <Typography variant="body2" color="text.secondary">
                  Save to publish this ad across the selected pages ({(form.image_urls || []).length} image(s)).
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, pt: 1 }}>
          <Button type="button" onClick={closeDialog} sx={{ textTransform: 'none', color: '#475569' }}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={save}
            disabled={saving || uploading}
            sx={{ textTransform: 'none', fontWeight: 700, minWidth: 120 }}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default AdsManagement;
