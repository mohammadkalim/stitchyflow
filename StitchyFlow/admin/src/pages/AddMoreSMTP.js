import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, TextField, Button, Switch, FormControlLabel,
  Grid, Alert, CircularProgress, Divider, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import {
  Email as EmailIcon, Save as SaveIcon, Delete as DeleteIcon, Edit as EditIcon,
  Add as AddIcon, CheckCircle as CheckCircleIcon, Refresh as RefreshIcon,
  Link as LinkIcon, LinkOff as LinkOffIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

function AddMoreSMTP() {
  const [smtpList, setSmtpList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'disconnect'
  });

  const [formData, setFormData] = useState({
    server_address: '',
    username: '',
    password: '',
    port: 465,
    encryption: 'SSL',
    authentication_required: true,
    is_active: true
  });

  useEffect(() => {
    fetchSMTPList();
  }, []);

  const fetchSMTPList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/smtp/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSmtpList(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching SMTP list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingId ? `${API_URL}/smtp/${editingId}` : `${API_URL}/smtp/new`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(editingId ? 'SMTP settings updated successfully' : 'New SMTP configuration added successfully');
        setMessageType('success');
        setTimeout(() => setMessage(null), 5000);
        setShowForm(false);
        setEditingId(null);
        resetForm();
        fetchSMTPList();
      } else {
        setMessage(result.error?.message || 'Failed to save SMTP settings');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error saving SMTP settings:', error);
      setMessage('Network error: Unable to save settings');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/smtp/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(result.message || 'SMTP connection test successful');
        setMessageType('success');
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage(result.error?.message || 'SMTP connection test failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error testing SMTP connection:', error);
      setMessage('Network error: Unable to test connection');
      setMessageType('error');
    } finally {
      setTesting(false);
    }
  };

  const handleEdit = (smtp) => {
    setFormData({
      server_address: smtp.server_address,
      username: smtp.username,
      password: smtp.password,
      port: smtp.port,
      encryption: smtp.encryption,
      authentication_required: smtp.authentication_required !== false,
      is_active: smtp.is_active !== false
    });
    setEditingId(smtp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setConfirmDialog({
      open: true,
      title: 'Delete SMTP Configuration',
      message: 'Are you sure you want to delete this SMTP configuration? This action cannot be undone.',
      type: 'delete',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        try {
          const token = localStorage.getItem('adminToken');
          const response = await fetch(`${API_URL}/smtp/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const result = await response.json();

          if (response.ok && result.success) {
            setMessage('SMTP configuration deleted successfully');
            setMessageType('success');
            setTimeout(() => setMessage(null), 5000);
            fetchSMTPList();
          } else {
            setMessage(result.error?.message || 'Failed to delete SMTP configuration');
            setMessageType('error');
          }
        } catch (error) {
          console.error('Error deleting SMTP:', error);
          setMessage('Network error: Unable to delete');
          setMessageType('error');
        }
      }
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'disconnect' : 'connect';
    const actionTitle = currentStatus ? 'Disconnect SMTP' : 'Connect SMTP';
    const actionMessage = currentStatus 
      ? 'Are you sure you want to disconnect this SMTP configuration? This will prevent emails from being sent using this server.'
      : 'Are you sure you want to connect this SMTP configuration? This will enable email notifications through this server.';
    
    setConfirmDialog({
      open: true,
      title: actionTitle,
      message: actionMessage,
      type: currentStatus ? 'disconnect' : 'connect',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        try {
          const token = localStorage.getItem('adminToken');
          const response = await fetch(`${API_URL}/smtp/${id}/toggle`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const result = await response.json();

          if (response.ok && result.success) {
            setMessage(result.message || `SMTP ${action}ed successfully`);
            setMessageType('success');
            setTimeout(() => setMessage(null), 5000);
            fetchSMTPList();
          } else {
            setMessage(result.error?.message || `Failed to ${action} SMTP`);
            setMessageType('error');
          }
        } catch (error) {
          console.error(`Error ${action}ing SMTP:`, error);
          setMessage(`Network error: Unable to ${action}`);
          setMessageType('error');
        }
      }
    });
  };

  const handleCloseDialog = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  const resetForm = () => {
    setFormData({
      server_address: '',
      username: '',
      password: '',
      port: 465,
      encryption: 'SSL',
      authentication_required: true,
      is_active: true
    });
  };

  const handleAddNew = () => {
    setEditingId(null);
    resetForm();
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  if (loading) {
    return (
      <Layout title="Administration - Add More SMTP">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={50} sx={{ color: '#2196F3' }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Administration - Add More SMTP">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <EmailIcon sx={{ fontSize: 32, color: '#fff' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700 }}>
                      Add More SMTP
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Manage multiple SMTP configurations
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleAddNew}
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                  }}
                >
                  Add New SMTP
                </Button>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Alert Message */}
              {message && (
                <Alert 
                  severity={messageType} 
                  sx={{ mb: 3, borderRadius: '12px' }}
                  onClose={() => setMessage(null)}
                >
                  {message}
                </Alert>
              )}

              {/* Form Section */}
              {showForm && (
                <Paper sx={{ p: 3, mb: 4, borderRadius: '12px', bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1a1a2e' }}>
                    {editingId ? 'Edit SMTP Configuration' : 'Add New SMTP Configuration'}
                  </Typography>
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="SMTP Server Address"
                          name="server_address"
                          value={formData.server_address}
                          onChange={handleChange}
                          required
                          placeholder="smtp.gmail.com"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Username / Email"
                          name="username"
                          type="email"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          placeholder="your-email@gmail.com"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Password / App Password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Enter your password"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Port"
                          name="port"
                          type="number"
                          value={formData.port}
                          onChange={handleChange}
                          required
                          placeholder="465"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Encryption Method"
                          name="encryption"
                          value={formData.encryption}
                          onChange={handleChange}
                          required
                          select
                          SelectProps={{ native: true }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#fff'
                            }
                          }}
                        >
                          <option value="SSL">SSL</option>
                          <option value="TLS">TLS</option>
                          <option value="None">None</option>
                        </TextField>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.authentication_required}
                                onChange={handleChange}
                                name="authentication_required"
                                color="primary"
                              />
                            }
                            label="Authentication Required"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.is_active}
                                onChange={handleChange}
                                name="is_active"
                                color="success"
                              />
                            }
                            label="Active"
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{
                          borderRadius: '12px',
                          px: 3,
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleTestConnection}
                        disabled={testing || saving}
                        startIcon={testing ? <CircularProgress size={20} /> : <RefreshIcon />}
                        sx={{
                          borderRadius: '12px',
                          px: 3,
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 600,
                          borderColor: '#2196F3',
                          color: '#2196F3'
                        }}
                      >
                        {testing ? 'Testing...' : 'Test Connection'}
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        sx={{
                          borderRadius: '12px',
                          px: 4,
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                        }}
                      >
                        {saving ? 'Saving...' : (editingId ? 'Update' : 'Add SMTP')}
                      </Button>
                    </Box>
                  </form>
                </Paper>
              )}

              {/* SMTP List Table */}
              <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Server</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Port</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Encryption</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {smtpList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" sx={{ color: '#666' }}>
                            No SMTP configurations found. Click "Add New SMTP" to create one.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      smtpList.map((smtp) => (
                        <TableRow key={smtp.id} hover>
                          <TableCell>{smtp.server_address}</TableCell>
                          <TableCell>{smtp.username}</TableCell>
                          <TableCell>{smtp.port}</TableCell>
                          <TableCell>{smtp.encryption}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={smtp.is_active ? 'Active' : 'Inactive'}
                              color={smtp.is_active ? 'success' : 'default'}
                              icon={smtp.is_active ? <CheckCircleIcon /> : null}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() => handleToggleStatus(smtp.id, smtp.is_active)}
                              sx={{ color: smtp.is_active ? '#FF9800' : '#4CAF50' }}
                              title={smtp.is_active ? 'Disconnect' : 'Connect'}
                            >
                              {smtp.is_active ? <LinkOffIcon /> : <LinkIcon />}
                            </IconButton>
                            <IconButton
                              onClick={() => handleEdit(smtp)}
                              sx={{ color: '#2196F3' }}
                              title="Edit"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(smtp.id)}
                              sx={{ color: '#F44336' }}
                              title="Delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Professional Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            minWidth: '400px',
            background: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          pt: 3, 
          px: 3,
          fontWeight: 700, 
          fontSize: '1.25rem',
          color: '#1a1a2e'
        }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent sx={{ pb: 3, px: 3 }}>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
            {confirmDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3, gap: 1.5 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#e0e0e0',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (confirmDialog.onConfirm) {
                confirmDialog.onConfirm();
              }
            }}
            variant="contained"
            sx={{
              borderRadius: '10px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              background: confirmDialog.type === 'delete'
                ? 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)'
                : 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
              boxShadow: confirmDialog.type === 'delete'
                ? '0 4px 12px rgba(244, 67, 54, 0.3)'
                : '0 4px 12px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                background: confirmDialog.type === 'delete'
                  ? 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)'
                  : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
              }
            }}
          >
            {confirmDialog.type === 'delete' ? 'Delete' : (confirmDialog.type === 'disconnect' ? 'Disconnect' : 'Connect')}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default AddMoreSMTP;
