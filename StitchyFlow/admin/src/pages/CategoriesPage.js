import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, FormControlLabel, Grid, IconButton, InputAdornment,
  Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TextField, Tooltip, Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Category as CategoryIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
  Edit as EditIcon,
  PostAdd as PostAddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import {
  dialogCancelButtonSx,
  dialogFieldSx,
  dialogPaperSx,
  dialogSaveButtonSx,
  inputSx,
  pageCardSx,
  primaryButtonSx,
  switchSx,
  tableBodyCellSx,
  tableHeadCellSx
} from './caSub/caSubPageStyles';

const initialForm = { name: '', description: '', is_active: true };

const ROWS_PER_PAGE = 20;

function CategoriesPage() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [removingAll, setRemovingAll] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const filteredRows = useMemo(() => rows.filter((r) =>
    (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.description || '').toLowerCase().includes(search.toLowerCase())
  ), [rows, search]);

  const paginatedRows = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return filteredRows.slice(start, start + ROWS_PER_PAGE);
  }, [filteredRows, page]);

  const activeCount = useMemo(() => rows.filter((r) => !!r.is_active).length, [rows]);
  const inactiveCount = rows.length - activeCount;

  const loadRows = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ca-sub/categories');
      setRows(res.data?.data || []);
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to load categories');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRows(); }, []);

  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / ROWS_PER_PAGE) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [filteredRows.length, page]);

  const handleSeedDemo = async () => {
    if (!window.confirm(
      'Add demo data?\n\nThis inserts 90 sample categories and 90 subcategories (StitchyDemoCat001–090 / StitchyDemoSub001–090). Rows that already exist are skipped.'
    )) return;
    setSeeding(true);
    try {
      const res = await api.post('/ca-sub/seed-demo');
      setMessage(res.data?.message || 'Demo data added.');
      setMessageType('success');
      loadRows();
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to add demo data');
      setMessageType('error');
    } finally {
      setSeeding(false);
    }
  };

  const handleRemoveAllCategories = async () => {
    if (!window.confirm(
      'Remove ALL categories?\n\nThis deletes every category and subcategory, and clears category links on tailor shops. This cannot be undone.'
    )) return;
    setRemovingAll(true);
    try {
      const res = await api.post('/ca-sub/categories/delete-all');
      setMessage(res.data?.message || 'All categories removed.');
      setMessageType('success');
      loadRows();
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to remove categories');
      setMessageType('error');
    } finally {
      setRemovingAll(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMessage('Category name is required');
      setMessageType('error');
      return;
    }
    setSaving(true);
    const wasEditing = Boolean(editingId);
    try {
      if (editingId) {
        await api.put(`/ca-sub/categories/${editingId}`, form);
      } else {
        await api.post('/ca-sub/categories', form);
      }
      setOpen(false);
      setForm(initialForm);
      setEditingId(null);
      setMessage(wasEditing ? 'Category updated successfully' : 'Category created successfully');
      setMessageType('success');
      loadRows();
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to save category');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/ca-sub/categories/${id}`);
      setMessage('Category deleted successfully');
      setMessageType('success');
      loadRows();
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to delete category');
      setMessageType('error');
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setOpen(true);
  };

  if (loading) {
    return (
      <Layout title="CA/SUB - Category">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
          <CircularProgress sx={{ color: '#1976d2' }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="CA/SUB - Category">
      <Card elevation={0} sx={pageCardSx}>
        <Box
          sx={{
            height: 4,
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 45%, #64b5f6 100%)'
          }}
        />
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { sm: 'flex-start' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  border: '1px solid #90caf9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <CategoryIcon sx={{ fontSize: 30, color: '#1565c0' }} />
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: '#546e7a', letterSpacing: '0.12em', fontWeight: 700 }}>
                  CA / SUB
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0d2137', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Categories
                </Typography>
                <Typography variant="body2" sx={{ color: '#607d8b', mt: 0.5, maxWidth: 520 }}>
                  Define top-level categories for your catalogue. Changes sync to the database immediately.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center',
                justifyContent: { xs: 'stretch', sm: 'flex-end' }
              }}
            >
              <Tooltip title="Inserts 90 demo categories + 90 subcategories (skips existing StitchyDemo* rows)." arrow>
                <span>
                  <Button
                    variant="outlined"
                    startIcon={<PostAddIcon />}
                    onClick={handleSeedDemo}
                    disabled={seeding || removingAll}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '12px',
                      borderColor: '#90caf9',
                      color: '#1565c0',
                      px: 2,
                      '&:hover': { borderColor: '#42a5f5', bgcolor: 'rgba(25, 118, 210, 0.06)' }
                    }}
                  >
                    {seeding ? 'Adding…' : 'Add demo data'}
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Deletes every category and subcategory, and clears shop category links." arrow>
                <span>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteSweepIcon />}
                    onClick={handleRemoveAllCategories}
                    disabled={removingAll || seeding || rows.length === 0}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '12px',
                      px: 2
                    }}
                  >
                    {removingAll ? 'Removing…' : 'Remove all categories'}
                  </Button>
                </span>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAdd}
                disabled={removingAll}
                sx={primaryButtonSx}
              >
                Add category
              </Button>
            </Box>
          </Box>

          {message && (
            <Alert severity={messageType} sx={{ mb: 2.5, borderRadius: '12px' }} onClose={() => setMessage('')}>
              {message}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total', value: rows.length, bg: '#e3f2fd', border: '#90caf9', color: '#0d47a1' },
              { label: 'Active', value: activeCount, bg: '#e8f5e9', border: '#a5d6a7', color: '#1b5e20' },
              { label: 'Inactive', value: inactiveCount, bg: '#eceff1', border: '#cfd8dc', color: '#37474f' }
            ].map((k) => (
              <Grid item xs={12} sm={4} key={k.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    border: `1px solid ${k.border}`,
                    background: k.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#546e7a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {k.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: k.color }}>
                    {k.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search by name or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#90a4ae' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  minHeight: 56,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: '1px solid #90caf9',
                  background: 'linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" sx={{ color: '#1565c0', fontWeight: 700 }}>
                  Matching
                </Typography>
                <Typography variant="h6" sx={{ color: '#0d47a1', fontWeight: 800 }}>
                  {filteredRows.length}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2, borderColor: '#e3f2fd' }} />

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: '14px', border: '1px solid #e3f2fd', overflow: 'hidden' }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(180deg, #f5faff 0%, #eef6fc 100%)' }}>
                  <TableCell sx={tableHeadCellSx}>Name</TableCell>
                  <TableCell sx={tableHeadCellSx}>Description</TableCell>
                  <TableCell sx={tableHeadCellSx}>Status</TableCell>
                  <TableCell align="right" sx={tableHeadCellSx}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6, border: 'none' }}>
                      <Typography sx={{ fontWeight: 700, color: '#0d2137' }}>No categories match your search</Typography>
                      <Typography variant="body2" sx={{ color: '#78909c', mt: 0.5 }}>
                        Adjust filters or add a new category to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedRows.map((r) => (
                  <TableRow key={r.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ ...tableBodyCellSx, fontWeight: 600, color: '#0d2137' }}>{r.name}</TableCell>
                    <TableCell sx={{ ...tableBodyCellSx, color: '#546e7a', maxWidth: 360 }}>{r.description || '—'}</TableCell>
                    <TableCell sx={tableBodyCellSx}>
                      <Chip
                        size="small"
                        label={r.is_active ? 'Active' : 'Inactive'}
                        sx={{
                          fontWeight: 700,
                          bgcolor: r.is_active ? '#e8f5e9' : '#eceff1',
                          color: r.is_active ? '#2e7d32' : '#546e7a',
                          border: '1px solid',
                          borderColor: r.is_active ? '#c8e6c9' : '#cfd8dc'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={tableBodyCellSx}>
                      <IconButton
                        size="small"
                        sx={{ color: '#1565c0', '&:hover': { bgcolor: 'rgba(21,101,192,0.08)' } }}
                        onClick={() => {
                          setEditingId(r.id);
                          setForm({ name: r.name, description: r.description || '', is_active: !!r.is_active });
                          setOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(r.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredRows.length > 0 && (
              <TablePagination
                component="div"
                rowsPerPageOptions={[ROWS_PER_PAGE]}
                count={filteredRows.length}
                rowsPerPage={ROWS_PER_PAGE}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={() => {}}
                labelRowsPerPage="Rows per page"
              />
            )}
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={false}
        scroll="paper"
        PaperProps={{ sx: dialogPaperSx }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            pt: 3.5,
            px: { xs: 2.5, sm: 4 },
            borderBottom: '1px solid #e3f2fd',
            background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)'
          }}
        >
          <Typography variant="overline" sx={{ color: '#1565c0', fontWeight: 800, letterSpacing: '0.14em', display: 'block', mb: 0.75 }}>
            Category
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0d2137', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            {editingId ? 'Edit category' : 'New category'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#607d8b', mt: 1.25, fontWeight: 400, maxWidth: 640, lineHeight: 1.55 }}>
            {editingId
              ? 'Review and update the fields below. Changes apply as soon as you save.'
              : 'Add a clear, unique name. Use the description for internal notes or customer-facing copy.'}
          </Typography>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            borderColor: '#e3f2fd',
            px: { xs: 2.5, sm: 4 },
            py: { xs: 3, sm: 3.5 },
            bgcolor: '#fafcff'
          }}
        >
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                sx={dialogFieldSx}
                fullWidth
                label="Category name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={dialogFieldSx}
                fullWidth
                multiline
                rows={5}
                label="Description"
                placeholder="Optional — e.g. what this category covers for your team or customers."
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  borderRadius: '14px',
                  border: '1px solid #cfe2fc',
                  bgcolor: '#f5f9ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#0d2137', fontSize: '0.95rem' }}>Visibility</Typography>
                  <Typography variant="body2" sx={{ color: '#78909c', mt: 0.35, maxWidth: 420 }}>
                    Inactive categories stay in the database but can be hidden from selection lists.
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.is_active}
                      onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                      sx={switchSx}
                    />
                  }
                  label={<Typography sx={{ fontWeight: 700, color: '#37474f', fontSize: '1rem' }}>Active</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: 2.75,
            gap: 2,
            borderTop: '1px solid #e3f2fd',
            bgcolor: '#f5f9ff',
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}
        >
          <Button onClick={() => setOpen(false)} sx={dialogCancelButtonSx}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="contained"
            size="large"
            sx={dialogSaveButtonSx}
          >
            {saving ? 'Saving…' : 'Save category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default CategoriesPage;
