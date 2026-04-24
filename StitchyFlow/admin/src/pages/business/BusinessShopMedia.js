/**
 * Admin — Business Shop Media (live `business_shop_media` + links to public shop on main site)
 * Developer by: Muhammad Kalim · LogixInventor (PVT) Ltd.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, IconButton, Paper, Snackbar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Tooltip, CircularProgress, Link,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';

function apiOrigin() {
  const raw = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1').trim().replace(/\/$/, '');
  return raw.replace(/\/api\/v\d+$/i, '') || 'http://localhost:5000';
}

function mainSiteOrigin() {
  const u = (process.env.REACT_APP_MAIN_SITE_URL || 'http://localhost:3000').trim().replace(/\/$/, '');
  return u || 'http://localhost:3000';
}

function resolveMediaUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const root = apiOrigin();
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${root}${path}`;
}

export default function BusinessShopMedia() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [busyId, setBusyId] = useState(null);

  const toast = (message, severity = 'success') => setSnack({ open: true, message, severity });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/shop-media');
      setRows(Array.isArray(res.data?.data) ? res.data.data : []);
      if (res.data?.meta?.note) {
        toast(res.data.meta.note, 'info');
      }
    } catch (e) {
      toast(e.response?.data?.error?.message || 'Failed to load shop media', 'error');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (row) => {
    const currentlyActive = row.is_active === 1 || row.is_active === true;
    const next = !currentlyActive;
    setBusyId(row.media_id);
    try {
      await api.patch(`/admin/shop-media/${row.media_id}`, { is_active: next });
      toast(next ? 'Item is visible on the public shop page.' : 'Item hidden from the public shop page.');
      load();
    } catch (e) {
      toast(e.response?.data?.error?.message || 'Update failed', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete media “${row.title}”? This cannot be undone.`)) return;
    setBusyId(row.media_id);
    try {
      await api.delete(`/admin/shop-media/${row.media_id}`);
      toast('Deleted');
      load();
    } catch (e) {
      toast(e.response?.data?.error?.message || 'Delete failed', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const publicShopUrl = (shopId) => `${mainSiteOrigin()}/tailor-shops/view/${shopId}`;

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Business Shop Media
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, maxWidth: 720 }}>
              Gallery items tailors save under <strong>Shop Media</strong> on the main website. Data is read from the{' '}
              <code style={{ fontSize: '0.85em' }}>business_shop_media</code> table. Use <strong>Hide</strong> to remove an item from the public shop without deleting it.
            </Typography>
          </Box>
          <Button startIcon={<RefreshIcon />} variant="outlined" onClick={load} disabled={loading} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Refresh
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          Public gallery: items with status <strong>Active</strong> appear in the <strong>Shop gallery</strong> section on{' '}
          <Link href={`${mainSiteOrigin()}/tailor-shops`} target="_blank" rel="noopener noreferrer">Tailor Shops</Link>
          {' '}→ shop detail.
        </Alert>

        <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : rows.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No shop media rows yet. Tailors can add items from the main site → Business dashboard → Shop Media.</Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: '70vh' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Preview</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Shop</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Title / caption</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Owner (user)</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Updated</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r) => {
                    const active = r.is_active === 1 || r.is_active === true;
                    const img = resolveMediaUrl(r.image_url);
                    return (
                      <TableRow key={r.media_id} hover>
                        <TableCell sx={{ width: 100 }}>
                          <Box
                            component="img"
                            src={img}
                            alt=""
                            sx={{ width: 88, height: 56, objectFit: 'cover', borderRadius: 1, bgcolor: '#f1f5f9', display: 'block' }}
                            onError={(e) => { e.target.style.visibility = 'hidden'; }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 700 }}>{r.shop_name || `Shop #${r.shop_id}`}</Typography>
                          <Typography variant="caption" color="text.secondary">ID {r.shop_id}</Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Link href={publicShopUrl(r.shop_id)} target="_blank" rel="noopener noreferrer" sx={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                              View on website <OpenInNewIcon sx={{ fontSize: 14 }} />
                            </Link>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography sx={{ fontWeight: 600 }}>{r.title}</Typography>
                          {r.caption ? (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                              {r.caption}
                            </Typography>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{r.owner_display_name?.trim() || r.shop_owner_name || '—'}</Typography>
                          <Typography variant="caption" color="text.secondary">{r.owner_email || `user #${r.owner_user_id}`}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{r.updated_at ? new Date(r.updated_at).toLocaleString() : '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={active ? 'Active' : 'Hidden'} color={active ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={active ? 'Hide from public shop' : 'Show on public shop'}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => toggleActive(r)}
                                disabled={busyId === r.media_id}
                                aria-label="Toggle visibility"
                              >
                                {active ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete permanently">
                            <span>
                              <IconButton size="small" color="error" onClick={() => remove(r)} disabled={busyId === r.media_id} aria-label="Delete">
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
