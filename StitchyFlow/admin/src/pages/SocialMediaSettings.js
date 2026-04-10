/**
 * Social Media Settings Page
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, Switch, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Tooltip, CircularProgress, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, Snackbar, FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Pinterest as PinterestIcon,
  Language as LanguageIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DragIndicator as DragIcon,
  Web as WebIcon,
} from '@mui/icons-material';
import { api } from '../utils/api';

// ── Platform icon/color map ───────────────────────────────────────────────────
const PLATFORM_MAP = {
  facebook:  { icon: <FacebookIcon />,  color: '#1877F2', label: 'Facebook' },
  instagram: { icon: <InstagramIcon />, color: '#E4405F', label: 'Instagram' },
  twitter:   { icon: <TwitterIcon />,   color: '#1DA1F2', label: 'Twitter/X' },
  youtube:   { icon: <YouTubeIcon />,   color: '#FF0000', label: 'YouTube' },
  linkedin:  { icon: <LinkedInIcon />,  color: '#0A66C2', label: 'LinkedIn' },
  pinterest: { icon: <PinterestIcon />, color: '#E60023', label: 'Pinterest' },
  tiktok:    { icon: <ShareIcon />,     color: '#010101', label: 'TikTok' },
  snapchat:  { icon: <ShareIcon />,     color: '#FFFC00', label: 'Snapchat' },
  whatsapp:  { icon: <ShareIcon />,     color: '#25D366', label: 'WhatsApp' },
  other:     { icon: <LanguageIcon />,  color: '#6b7280', label: 'Other' },
};

const PLATFORMS = Object.keys(PLATFORM_MAP);

function getPlatformIcon(platform, color) {
  const entry = PLATFORM_MAP[platform?.toLowerCase()] || PLATFORM_MAP.other;
  return React.cloneElement(entry.icon, { sx: { color: color || entry.color, fontSize: 22 } });
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: '#fff',
    '&.Mui-focused fieldset': { borderColor: '#2196F3' },
  },
};

const EMPTY_FORM = {
  platform: 'facebook',
  label: '',
  url: '',
  icon: 'facebook',
  color: '#1877F2',
  show_header: false,
  show_footer: true,
  footer_position: 'left',
  is_active: true,
  sort_order: 0,
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function SocialMediaSettings() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const showSnack = (msg, severity = 'success') =>
    setSnack({ open: true, msg, severity });

  // ── Fetch all links ─────────────────────────────────────────────────────────
  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/social-media');
      setLinks(res.data.data || []);
    } catch (err) {
      showSnack('Failed to load social media links', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  // ── Open Add dialog ─────────────────────────────────────────────────────────
  const handleAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  // ── Open Edit dialog ────────────────────────────────────────────────────────
  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      platform: row.platform || 'other',
      label: row.label || '',
      url: row.url || '',
      icon: row.icon || row.platform || 'other',
      color: row.color || '#1976d2',
      show_header: !!row.show_header,
      show_footer: !!row.show_footer,
      footer_position: row.footer_position || 'left',
      is_active: !!row.is_active,
      sort_order: row.sort_order || 0,
    });
    setDialogOpen(true);
  };

  // ── Save (create or update) ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.platform || !form.label || !form.url) {
      showSnack('Platform, label and URL are required', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/social-media/${editingId}`, form);
        showSnack('Social media link updated successfully');
      } else {
        await api.post('/social-media', form);
        showSnack('Social media link added successfully');
      }
      setDialogOpen(false);
      fetchLinks();
    } catch (err) {
      showSnack(err.response?.data?.error?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/social-media/${deletingId}`);
      showSnack('Deleted successfully');
      setDeleteDialogOpen(false);
      fetchLinks();
    } catch (err) {
      showSnack('Delete failed', 'error');
    }
  };

  // ── Toggle active ───────────────────────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      await api.patch(`/social-media/${id}/toggle`);
      fetchLinks();
    } catch (err) {
      showSnack('Toggle failed', 'error');
    }
  };

  // ── Platform change auto-fills color & icon ─────────────────────────────────
  const handlePlatformChange = (platform) => {
    const entry = PLATFORM_MAP[platform] || PLATFORM_MAP.other;
    setForm(prev => ({
      ...prev,
      platform,
      icon: platform,
      color: entry.color,
      label: prev.label || entry.label,
    }));
  };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const activeCount  = links.filter(l => l.is_active).length;
  const headerCount  = links.filter(l => l.show_header && l.is_active).length;
  const footerCount  = links.filter(l => l.show_footer && l.is_active).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
            Social Media Links
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.3 }}>
            Manage social media icons and links shown in website header &amp; footer
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            bgcolor: '#2196F3', textTransform: 'none', fontWeight: 600,
            borderRadius: '8px', '&:hover': { bgcolor: '#1976d2' }
          }}
        >
          Add Social Link
        </Button>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Links',    value: links.length,  color: '#2196F3', bg: '#eff6ff' },
          { label: 'Active',         value: activeCount,   color: '#10b981', bg: '#f0fdf4' },
          { label: 'In Header',      value: headerCount,   color: '#f59e0b', bg: '#fffbeb' },
          { label: 'In Footer',      value: footerCount,   color: '#8b5cf6', bg: '#f5f3ff' },
        ].map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper sx={{ p: 2, borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: 'none', bgcolor: s.bg }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <Paper sx={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: 'none', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} sx={{ color: '#2196F3' }} />
          </Box>
        ) : links.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <ShareIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 1 }} />
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              No social media links yet. Click "Add Social Link" to get started.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  {['Platform', 'Label', 'URL', 'Header', 'Footer', 'Position', 'Order', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {links.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    {/* Platform icon + name */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          width: 34, height: 34, borderRadius: '8px',
                          bgcolor: (row.color || '#1976d2') + '18',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {getPlatformIcon(row.platform, row.color)}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e', textTransform: 'capitalize' }}>
                          {row.platform}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Label */}
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#374151' }}>{row.label}</Typography>
                    </TableCell>

                    {/* URL */}
                    <TableCell>
                      <Box
                        component="a"
                        href={row.url}
                        target="_blank"
                        rel="noreferrer"
                        sx={{ color: '#2196F3', fontSize: '0.8rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      >
                        {row.url.length > 35 ? row.url.slice(0, 35) + '…' : row.url}
                      </Box>
                    </TableCell>

                    {/* Show in Header */}
                    <TableCell>
                      <Chip
                        label={row.show_header ? 'Yes' : 'No'}
                        size="small"
                        sx={{
                          bgcolor: row.show_header ? '#f0fdf4' : '#f9fafb',
                          color: row.show_header ? '#10b981' : '#9ca3af',
                          fontWeight: 600, fontSize: '0.7rem', height: 22,
                        }}
                      />
                    </TableCell>

                    {/* Show in Footer */}
                    <TableCell>
                      <Chip
                        label={row.show_footer ? 'Yes' : 'No'}
                        size="small"
                        sx={{
                          bgcolor: row.show_footer ? '#f0fdf4' : '#f9fafb',
                          color: row.show_footer ? '#10b981' : '#9ca3af',
                          fontWeight: 600, fontSize: '0.7rem', height: 22,
                        }}
                      />
                    </TableCell>

                    {/* Footer Position */}
                    <TableCell>
                      <Chip
                        label={row.footer_position || 'left'}
                        size="small"
                        sx={{ bgcolor: '#eff6ff', color: '#2196F3', fontWeight: 600, fontSize: '0.7rem', height: 22, textTransform: 'capitalize' }}
                      />
                    </TableCell>

                    {/* Sort Order */}
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontFamily: 'monospace' }}>
                        {row.sort_order}
                      </Typography>
                    </TableCell>

                    {/* Active toggle */}
                    <TableCell>
                      <Switch
                        checked={!!row.is_active}
                        onChange={() => handleToggle(row.id)}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#10b981' },
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(row)}
                            sx={{ color: '#2196F3', '&:hover': { bgcolor: '#eff6ff' } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small"
                            onClick={() => { setDeletingId(row.id); setDeleteDialogOpen(true); }}
                            sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}>
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
      </Paper>

      {/* ── Add / Edit Dialog ─────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1a1a2e', pb: 1 }}>
          {editingId ? 'Edit Social Media Link' : 'Add Social Media Link'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>

            {/* Platform */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Platform</InputLabel>
                <Select
                  value={form.platform}
                  label="Platform"
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  sx={{ borderRadius: '8px' }}
                >
                  {PLATFORMS.map(p => (
                    <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getPlatformIcon(p, PLATFORM_MAP[p]?.color)}
                        {PLATFORM_MAP[p]?.label || p}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Label */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Display Label"
                value={form.label}
                onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))}
                sx={inputSx}
              />
            </Grid>

            {/* URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth size="small" label="Profile URL"
                placeholder="https://facebook.com/yourpage"
                value={form.url}
                onChange={(e) => setForm(p => ({ ...p, url: e.target.value }))}
                sx={inputSx}
              />
            </Grid>

            {/* Color */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
                Icon Color
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  component="input"
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm(p => ({ ...p, color: e.target.value }))}
                  style={{ width: 40, height: 36, border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', padding: 2 }}
                />
                <TextField
                  size="small" value={form.color}
                  onChange={(e) => setForm(p => ({ ...p, color: e.target.value }))}
                  sx={{ ...inputSx, width: 120 }}
                />
                <Box sx={{
                  width: 36, height: 36, borderRadius: '8px',
                  bgcolor: form.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {getPlatformIcon(form.platform, form.color)}
                </Box>
              </Box>
            </Grid>

            {/* Sort Order */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Sort Order" type="number"
                value={form.sort_order}
                onChange={(e) => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                sx={inputSx}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Show in Header */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: 'none' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.show_header}
                      onChange={(e) => setForm(p => ({ ...p, show_header: e.target.checked }))}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#2196F3' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2196F3' },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>Show in Header</Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>Display in website top header</Typography>
                    </Box>
                  }
                />
              </Paper>
            </Grid>

            {/* Show in Footer */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: 'none' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.show_footer}
                      onChange={(e) => setForm(p => ({ ...p, show_footer: e.target.checked }))}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#2196F3' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2196F3' },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>Show in Footer</Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>Display in website footer</Typography>
                    </Box>
                  }
                />
              </Paper>
            </Grid>

            {/* Footer Position */}
            {form.show_footer && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Footer Position</InputLabel>
                  <Select
                    value={form.footer_position}
                    label="Footer Position"
                    onChange={(e) => setForm(p => ({ ...p, footer_position: e.target.value }))}
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="left">Left Side</MenuItem>
                    <MenuItem value="right">Right Side</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Active */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: 'none' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.is_active}
                      onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#10b981' },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>Active</Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>Visible on website</Typography>
                    </Box>
                  }
                />
              </Paper>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{ bgcolor: '#2196F3', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#1976d2' } }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : (editingId ? 'Update' : 'Add Link')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1a1a2e' }}>Delete Social Media Link</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Are you sure you want to delete this social media link? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{ bgcolor: '#ef4444', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#dc2626' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ──────────────────────────────────────────────────────── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}
          sx={{ borderRadius: '10px', fontWeight: 500 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
