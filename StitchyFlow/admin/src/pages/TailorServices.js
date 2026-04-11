/**
 * Tailor Services Management Page
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, Card, CardContent,
  IconButton, Tooltip, Switch, FormControlLabel, Divider, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import {
  ContentCut as TailorsIcon,
  Checkroom as CustomDressesIcon,
  Straighten as SuitsIcon,
  AutoAwesome as TraditionalIcon,
  ContentCutOutlined as AlterationsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../utils/api';

const defaultServices = [
  {
    id: 1,
    key: 'custom-dresses',
    label: 'Custom Dresses',
    description: 'Tailored to your exact measurements',
    path: '/marketplace/custom-dresses',
    icon: 'CustomDresses',
    color: '#2563eb',
    is_active: true,
    sort_order: 1
  },
  {
    id: 2,
    key: 'suits-blazers',
    label: 'Suits & Blazers',
    description: 'Sharp formal & corporate wear',
    path: '/marketplace/suits-blazers',
    icon: 'Suits',
    color: '#7c3aed',
    is_active: true,
    sort_order: 2
  },
  {
    id: 3,
    key: 'traditional-wear',
    label: 'Traditional Wear',
    description: 'Authentic Pakistani heritage styles',
    path: '/marketplace/traditional-wear',
    icon: 'Traditional',
    color: '#f59e0b',
    is_active: true,
    sort_order: 3
  },
  {
    id: 4,
    key: 'alterations',
    label: 'Alterations',
    description: 'Perfect fit for existing clothes',
    path: '/marketplace/alterations',
    icon: 'Alterations',
    color: '#10b981',
    is_active: true,
    sort_order: 4
  }
];

const iconMap = {
  CustomDresses: <CustomDressesIcon />,
  Suits: <SuitsIcon />,
  Traditional: <TraditionalIcon />,
  Alterations: <AlterationsIcon />
};

function TailorServices() {
  const [services, setServices] = useState(defaultServices);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tailor-services');
      if (res.data?.data && res.data.data.length > 0) {
        setServices(res.data.data);
      }
    } catch (error) {
      // Use default services if API fails
      console.log('Using default services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/tailor-services', { services });
      setSnack({ open: true, msg: 'Tailor services saved successfully!', sev: 'success' });
    } catch (error) {
      setSnack({ open: true, msg: error.response?.data?.error?.message || 'Failed to save services', sev: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = (id) => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, is_active: !s.is_active } : s
    ));
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setEditForm({ ...service });
    setOpenDialog(true);
  };

  const handleSaveEdit = () => {
    setServices(prev => prev.map(s => 
      s.id === editingService.id ? { ...editForm } : s
    ));
    setOpenDialog(false);
    setEditingService(null);
    setSnack({ open: true, msg: 'Service updated! Click Save Changes to persist.', sev: 'success' });
  };

  const handleDelete = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setSnack({ open: true, msg: 'Service removed! Click Save Changes to persist.', sev: 'warning' });
  };

  return (
    <Layout title="Tailor Services Management">
      <Box>
        {/* Header Card */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, mb: 3,
          p: { xs: 2, sm: 2.5 }, borderRadius: '12px',
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
          boxShadow: '0 4px 20px rgba(26,35,126,0.3)',
          flexWrap: 'wrap',
        }}>
          <Box sx={{
            width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: '12px',
            bgcolor: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <TailorsIcon sx={{ color: '#fff', fontSize: { xs: 22, sm: 26 } }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Tailor Services
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: { xs: 'none', sm: 'block' } }}>
              Manage services displayed in the Tailor Services dropdown menu
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            <Tooltip title="Reload from database">
              <IconButton onClick={loadServices} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Services Grid */}
        <Paper sx={{
          borderRadius: '12px', border: '1px solid #e0e0e0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}>
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Manage Services
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Toggle visibility, edit details, or reorder services
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {services.map((service, index) => (
                  <Grid item xs={12} md={6} key={service.id}>
                    <Card sx={{
                      borderRadius: '10px',
                      border: '1px solid #e0e0e0',
                      bgcolor: service.is_active ? '#fff' : '#f5f5f5',
                      opacity: service.is_active ? 1 : 0.7,
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                    }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          {/* Icon */}
                          <Box sx={{
                            width: 48, height: 48, borderRadius: '10px',
                            bgcolor: service.color + '15',
                            color: service.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {iconMap[service.icon] || <TailorsIcon />}
                          </Box>

                          {/* Content */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle1" sx={{
                                fontWeight: 600, color: '#1a1a2e',
                                fontSize: '0.95rem'
                              }}>
                                {service.label}
                              </Typography>
                              {!service.is_active && (
                                <Typography variant="caption" sx={{
                                  px: 1, py: 0.2, bgcolor: '#ffebee', color: '#c62828',
                                  borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600
                                }}>
                                  INACTIVE
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem', mb: 1 }}>
                              {service.description}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                              Path: {service.path}
                            </Typography>
                          </Box>

                          {/* Actions */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={service.is_active}
                                  onChange={() => handleToggleActive(service.id)}
                                  size="small"
                                />
                              }
                              label=""
                              sx={{ mr: 0 }}
                            />
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEdit(service)} sx={{ color: '#1976d2' }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Divider />

          {/* Footer Actions */}
          <Box sx={{
            display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            p: { xs: 2, sm: 3 },
            bgcolor: '#fafafa'
          }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {services.filter(s => s.is_active).length} of {services.length} services active
            </Typography>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SaveIcon />}
              sx={{
                bgcolor: '#1a237e',
                color: '#fff',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                py: 1,
                boxShadow: '0 4px 14px rgba(26,35,126,0.3)',
                '&:hover': { bgcolor: '#0d1642' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1a237e', color: '#fff', fontWeight: 600 }}>
          Edit Service
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Service Name"
              value={editForm.label || ''}
              onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Description"
              value={editForm.description || ''}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="Path"
              value={editForm.path || ''}
              onChange={(e) => setEditForm(prev => ({ ...prev, path: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Color (hex)"
              value={editForm.color || ''}
              onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
              fullWidth
              size="small"
              placeholder="#2563eb"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#fafafa' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#666', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            sx={{
              bgcolor: '#1a237e',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#0d1642' }
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export default TailorServices;
