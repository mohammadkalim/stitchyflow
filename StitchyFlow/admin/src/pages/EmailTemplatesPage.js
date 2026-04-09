import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, FormControlLabel, Grid, IconButton, Paper, Switch,
  TextField, Tooltip, Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';

const pageCardSx = {
  borderRadius: '20px',
  border: '1px solid #c5dcf5',
  boxShadow: '0 16px 48px rgba(13, 71, 161, 0.08)',
  background: 'linear-gradient(165deg, #ffffff 0%, #f4f9ff 55%, #ffffff 100%)',
  overflow: 'hidden'
};

const dialogPaperSx = {
  width: '100%',
  maxWidth: { xs: '100%', sm: 'min(92vw, 900px)' },
  borderRadius: { xs: '16px 16px 0 0', sm: '24px' },
  border: '1px solid #b8d4f0',
  boxShadow: '0 32px 88px rgba(13, 71, 161, 0.2)',
  m: { xs: 0, sm: 2 },
  maxHeight: { xs: '100%', sm: 'calc(100vh - 48px)' }
};

const initialForm = {
  slug: '',
  name: '',
  description: '',
  subject: '',
  body_html: '',
  is_active: true
};

/** Try in order: admin mount (most stable), ca-sub, top-level. */
const EMAIL_TEMPLATE_PATHS = ['/admin/email-templates', '/ca-sub/email-templates', '/email-templates'];

async function emailTemplatesRequest(requestForBase) {
  let lastErr;
  for (const base of EMAIL_TEMPLATE_PATHS) {
    try {
      return await requestForBase(base);
    } catch (e) {
      if (e.response?.status === 404) {
        lastErr = e;
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

/** create = new row, view = read-only, edit = update form */
function EmailTemplatesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const closeDialog = () => {
    setOpen(false);
    setDialogMode('create');
    setEditingId(null);
    setForm(initialForm);
  };

  const loadRows = async () => {
    setLoading(true);
    try {
      const res = await emailTemplatesRequest((base) => api.get(base));
      setRows(res.data?.data || []);
    } catch (error) {
      const status = error.response?.status;
      const serverMsg = error.response?.data?.error?.message;
      let text = serverMsg;
      if (status === 404) {
        text =
          'Email templates API was not found at /admin, /ca-sub, or /email-templates. Restart the StitchyFlow backend (./stop.StitchyFlow.sh then ./start.StitchyFlow.sh from the Webapp folder), then refresh.';
      } else if (!serverMsg && error.message === 'Network Error') {
        text =
          'Cannot reach the API. Start the backend (default port 5000) or set REACT_APP_API_URL to your API base URL.';
      } else {
        text = serverMsg || error.message || 'Failed to load email templates';
      }
      setMessage(text);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setDialogMode('create');
    setForm(initialForm);
    setOpen(true);
  };

  const openView = (row) => {
    setEditingId(row.id);
    setDialogMode('view');
    setForm({
      slug: row.slug,
      name: row.name,
      description: row.description || '',
      subject: row.subject,
      body_html: row.body_html,
      is_active: !!row.is_active
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setDialogMode('edit');
    setForm({
      slug: row.slug,
      name: row.name,
      description: row.description || '',
      subject: row.subject,
      body_html: row.body_html,
      is_active: !!row.is_active
    });
    setOpen(true);
  };

  const goEditFromView = () => setDialogMode('edit');

  const handleSave = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.body_html.trim()) {
      setMessage('Name, subject, and HTML body are required');
      setMessageType('error');
      return;
    }
    if (!editingId && !form.slug.trim()) {
      setMessage('Slug is required for new templates');
      setMessageType('error');
      return;
    }
    setSaving(true);
    try {
      await emailTemplatesRequest((base) =>
        editingId ? api.put(`${base}/${editingId}`, form) : api.post(base, form)
      );
      setMessage(
        editingId
          ? 'Email template updated. Outgoing emails will use this content.'
          : 'Email template created.'
      );
      setMessageType('success');
      closeDialog();
      loadRows();
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to save');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, { closeAfter = false } = {}) => {
    if (!window.confirm('Delete this template? System emails for this slug will fall back to built-in defaults until you add a template again.')) return;
    try {
      await emailTemplatesRequest((base) => api.delete(`${base}/${id}`));
      setMessage('Template deleted.');
      setMessageType('success');
      if (closeAfter) closeDialog();
      loadRows();
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to delete');
      setMessageType('error');
    }
  };

  const crudChips = (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
      <Chip size="small" label="Create" sx={{ fontWeight: 700, bgcolor: dialogMode === 'create' ? '#e3f2fd' : '#f5f5f5', color: '#1565c0' }} />
      <Chip size="small" label="Read" sx={{ fontWeight: 700, bgcolor: dialogMode === 'view' ? '#e8f5e9' : '#f5f5f5', color: '#2e7d32' }} />
      <Chip size="small" label="Update" sx={{ fontWeight: 700, bgcolor: dialogMode === 'edit' ? '#fff3e0' : '#f5f5f5', color: '#ef6c00' }} />
      <Chip size="small" label="Delete" sx={{ fontWeight: 700, bgcolor: '#f5f5f5', color: '#c62828' }} />
    </Box>
  );

  if (loading) {
    return (
      <Layout title="Email Templates">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
          <CircularProgress sx={{ color: '#1976d2' }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Email Templates">
      <Card elevation={0} sx={pageCardSx}>
        <Box sx={{ height: 4, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 45%, #64b5f6 100%)' }} />
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'flex-start' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
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
                <ArticleIcon sx={{ fontSize: 30, color: '#1565c0' }} />
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: '#546e7a', letterSpacing: '0.12em', fontWeight: 700 }}>
                  System email
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0d2137', letterSpacing: '-0.02em' }}>
                  Email Templates
                </Typography>
                <Typography variant="body2" sx={{ color: '#607d8b', mt: 0.5, maxWidth: 640 }}>
                  CRUD: <strong>Create</strong> with Add template · <strong>Read</strong> with the eye icon · <strong>Update</strong> with the pencil · <strong>Delete</strong> with the trash. Placeholders:{' '}
                  {`{{firstName}}`}, {`{{code}}`}, {`{{loginUrl}}`}, etc.
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAdd}
              sx={{
                textTransform: 'none',
                borderRadius: '12px',
                px: 2.75,
                py: 1.15,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                boxShadow: '0 8px 24px rgba(21, 101, 192, 0.35)',
                '&:hover': { background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)' }
              }}
            >
              Add template
            </Button>
          </Box>

          {message && (
            <Alert severity={messageType} sx={{ mb: 2.5, borderRadius: '12px' }} onClose={() => setMessage('')}>
              {message}
            </Alert>
          )}

          <Grid container spacing={2}>
            {rows.map((row) => (
              <Grid item xs={12} sm={6} md={4} key={row.id}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    minHeight: 260,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    border: '1px solid #cfe2fc',
                    background: 'linear-gradient(180deg, #fafcff 0%, #f0f7ff 100%)',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(25, 118, 210, 0.12)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      aspectRatio: '1 / 0.35',
                      minHeight: 72,
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: '1px solid #90caf9'
                    }}
                  >
                    <ArticleIcon sx={{ fontSize: 40, color: '#0d47a1', opacity: 0.9 }} />
                  </Box>
                  <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: 700, letterSpacing: '0.06em' }}>
                      {row.slug}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0d2137', mt: 0.5, lineHeight: 1.3 }}>
                      {row.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#546e7a', mt: 1, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {row.subject}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 1.5, borderTop: '1px solid #e3f2fd' }}>
                      <Chip
                        size="small"
                        label={row.is_active ? 'Active' : 'Off'}
                        sx={{
                          fontWeight: 700,
                          bgcolor: row.is_active ? '#e8f5e9' : '#eceff1',
                          color: row.is_active ? '#2e7d32' : '#546e7a'
                        }}
                      />
                      <Box>
                        <Tooltip title="View (read)">
                          <IconButton size="small" sx={{ color: '#2e7d32' }} onClick={() => openView(row)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit (update)">
                          <IconButton size="small" sx={{ color: '#1565c0' }} onClick={() => openEdit(row)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {rows.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '14px', border: '1px dashed #90caf9', bgcolor: '#fafcff' }}>
              <Typography sx={{ fontWeight: 700, color: '#0d2137' }}>No templates yet</Typography>
              <Typography variant="body2" sx={{ color: '#78909c', mt: 1 }}>
                Defaults are created when the API runs. Click &quot;Add template&quot; or refresh after backend seed.
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth={false} scroll="paper" PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle
          sx={{
            pb: 1,
            pt: 3,
            px: { xs: 2, sm: 4 },
            borderBottom: '1px solid #e3f2fd',
            background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)'
          }}
        >
          <Typography variant="overline" sx={{ color: '#1565c0', fontWeight: 800, letterSpacing: '0.12em' }}>
            Email template · CRUD
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0d2137', mt: 0.5 }}>
            {dialogMode === 'create' && 'Create (new template)'}
            {dialogMode === 'view' && 'Read (view only)'}
            {dialogMode === 'edit' && 'Update (edit template)'}
          </Typography>
          {crudChips}
          <Typography variant="body2" sx={{ color: '#607d8b', mt: 1.5, maxWidth: 720 }}>
            {dialogMode === 'view'
              ? 'Review subject and HTML below. Use Edit to change (Update) or Delete to remove this template.'
              : 'Slug identifies which system email uses this template (e.g. registration_verification). HTML supports {{placeholder}} tokens.'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#e3f2fd', px: { xs: 2, sm: 4 }, py: 3, bgcolor: '#fafcff' }}>
          {dialogMode === 'view' ? (
            <Box>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: '12px', bgcolor: '#fff', borderColor: '#b8d4f0' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  Slug · ID #{editingId}
                </Typography>
                <Typography sx={{ fontWeight: 800, color: '#0d2137', fontFamily: 'ui-monospace, monospace' }}>{form.slug}</Typography>
              </Paper>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>
                Display name
              </Typography>
              <Typography sx={{ mb: 2, fontWeight: 700 }}>{form.name}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>
                Description / hints
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: '#455a64', whiteSpace: 'pre-wrap' }}>
                {form.description || '—'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>
                Email subject
              </Typography>
              <Typography sx={{ mb: 2, fontWeight: 600 }}>{form.subject}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                  HTML preview
                </Typography>
                <Chip size="small" label={form.is_active ? 'Active' : 'Inactive'} color={form.is_active ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
              </Box>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  borderColor: '#90caf9',
                  maxHeight: { xs: 280, sm: 360 },
                  bgcolor: '#fff'
                }}
              >
                <Box
                  component="iframe"
                  title="Email HTML preview"
                  sandbox="allow-same-origin"
                  srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:12px;font-size:14px;}</style></head><body>${form.body_html || ''}</body></html>`}
                  sx={{ width: '100%', height: { xs: 260, sm: 340 }, border: 'none', display: 'block' }}
                />
              </Paper>
              <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#78909c' }}>
                Raw HTML is shown inside a sandboxed preview. Edit the template to change markup (Update).
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {!editingId && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Slug"
                    placeholder="my_template_key"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    helperText="Lowercase letters, numbers, underscore (3–64 chars)"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }}
                  />
                </Grid>
              )}
              {!!editingId && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Slug"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Display name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description / placeholder hints"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Email subject"
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  minRows={14}
                  label="HTML body"
                  value={form.body_html}
                  onChange={(e) => setForm((p) => ({ ...p, body_html: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff', fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.is_active}
                      onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1976d2' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1976d2' } }}
                    />
                  }
                  label={<Typography sx={{ fontWeight: 600, color: '#37474f' }}>Active (inactive = not used for sending)</Typography>}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2, sm: 4 },
            py: 2.5,
            borderTop: '1px solid #e3f2fd',
            bgcolor: '#f5f9ff',
            justifyContent: 'flex-end',
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
          {dialogMode === 'view' ? (
            <>
              <Button onClick={closeDialog} sx={{ textTransform: 'none', fontWeight: 600, color: '#546e7a' }}>
                Close
              </Button>
              <Button
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => editingId && handleDelete(editingId, { closeAfter: true })}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '12px' }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={goEditFromView}
                sx={{
                  textTransform: 'none',
                  borderRadius: '12px',
                  px: 3,
                  py: 1.1,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ef6c00 0%, #e65100 100%)'
                }}
              >
                Edit (update)
              </Button>
            </>
          ) : (
            <>
              <Button onClick={closeDialog} sx={{ textTransform: 'none', fontWeight: 600, color: '#546e7a' }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={saving}
                onClick={handleSave}
                sx={{
                  textTransform: 'none',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.25,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                }}
              >
                {saving ? 'Saving…' : dialogMode === 'create' ? 'Create template' : 'Save changes'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default EmailTemplatesPage;
