import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, TextField, Button, Switch, FormControlLabel,
  Grid, Alert, CircularProgress, Divider, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import {
  Email as EmailIcon, Save as SaveIcon, Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon, Delete as DeleteIcon, Edit as EditIcon,
  Add as AddIcon, Link as LinkIcon, LinkOff as LinkOffIcon, Star as StarIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

function SMTPSettings() {
  const [smtpList, setSmtpList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    server_address: '',
    username: '',
    password: '',
    port: 465,
    encryption: 'SSL',
    authentication_required: true,
    is_active: true,
    is_default: false
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    fetchSMTPSettings();
  }, []);

  const fetchSMTPSettings = async () => {
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
          const defaultSMTP = result.data.find((item) => item.is_default) || result.data[0];
          if (defaultSMTP) {
            setFormData({
              server_address: defaultSMTP.server_address || '',
              username: defaultSMTP.username || '',
              password: defaultSMTP.password || '',
              port: defaultSMTP.port || 465,
              encryption: defaultSMTP.encryption || 'SSL',
              authentication_required: defaultSMTP.authentication_required !== false,
              is_active: defaultSMTP.is_active !== false,
              is_default: defaultSMTP.is_default === true
            });
          }
        } else {
          setFormData({
            server_address: '',
            username: '',
            password: '',
            port: 465,
            encryption: 'SSL',
            authentication_required: true,
            is_active: true,
            is_default: false
          });
        }
      }
    } catch (error) {
      console.error('Error fetching SMTP settings:', error);
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
    if (e?.preventDefault) e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingId ? `${API_URL}/smtp/${editingId}` : `${API_URL}/smtp/new`;
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(result.message || (editingId ? 'SMTP settings updated successfully' : 'SMTP settings added successfully'));
        setMessageType('success');
        setTimeout(() => setMessage(null), 5000);
        setShowForm(false);
        setEditingId(null);
        resetForm();
        fetchSMTPSettings();
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
        // Auto-hide success message after 5 seconds
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

  const resetForm = () => {
    setFormData({
      server_address: '',
      username: '',
      password: '',
      port: 465,
      encryption: 'SSL',
      authentication_required: true,
      is_active: true,
      is_default: false
    });
  };

  const handleAddMore = () => {
    setEditingId(null);
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (smtp) => {
    setFormData({
      server_address: smtp.server_address || '',
      username: smtp.username || '',
      password: smtp.password || '',
      port: smtp.port || 465,
      encryption: smtp.encryption || 'SSL',
      authentication_required: smtp.authentication_required !== false,
      is_active: smtp.is_active !== false,
      is_default: smtp.is_default === true
    });
    setEditingId(smtp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this SMTP configuration? This action cannot be undone.')) return;
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
        fetchSMTPSettings();
      } else {
        setMessage(result.error?.message || 'Failed to delete SMTP');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error: Unable to delete SMTP');
      setMessageType('error');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/smtp/${id}/default`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setMessage('Default SMTP updated successfully');
        setMessageType('success');
        fetchSMTPSettings();
      } else {
        setMessage(result.error?.message || 'Failed to set default SMTP');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error: Unable to set default SMTP');
      setMessageType('error');
    }
  };

  const handleToggleStatus = async (id) => {
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
        setMessage(result.message || 'SMTP status updated');
        setMessageType('success');
        fetchSMTPSettings();
      } else {
        setMessage(result.error?.message || 'Failed to update SMTP status');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error: Unable to update SMTP status');
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <Layout title="Administration - SMTP Settings">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={50} sx={{ color: '#2196F3' }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Administration - SMTP Settings">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <CardContent sx={{ p: 4 }}>
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
                    SMTP Settings
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Configure email server settings for notifications
                  </Typography>
                </Box>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleAddMore}
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)'
                  }}
                >
                  Add More SMTP
                </Button>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {message && (
                <Alert 
                  severity={messageType} 
                  sx={{ mb: 3, borderRadius: '12px' }}
                  onClose={() => setMessage(null)}
                >
                  {message}
                </Alert>
              )}

              <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Server</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Port</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Encryption</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Default</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {smtpList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" sx={{ color: '#666' }}>
                            No SMTP configurations found. Use "Add More SMTP" to create one.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : smtpList.map((smtp) => (
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
                          />
                        </TableCell>
                        <TableCell>
                          {smtp.is_default ? (
                            <Chip size="small" icon={<StarIcon />} label="Default" color="primary" />
                          ) : (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handleSetDefault(smtp.id)}
                            >
                              Set Default
                            </Button>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleToggleStatus(smtp.id)}
                            sx={{ color: smtp.is_active ? '#FF9800' : '#4CAF50' }}
                            title={smtp.is_active ? 'Disconnect' : 'Connect'}
                          >
                            {smtp.is_active ? <LinkOffIcon /> : <LinkIcon />}
                          </IconButton>
                          <IconButton onClick={() => handleEdit(smtp)} sx={{ color: '#2196F3' }} title="Edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(smtp.id)} sx={{ color: '#F44336' }} title="Delete">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a1a2e' }}>
              Configuration Guide
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#2196F3' }}>
                Gmail SMTP Settings
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                Server: smtp.gmail.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                Port (SSL): 465
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                Port (TLS): 587
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#2196F3' }}>
                Important Notes
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                • Use App Password for Gmail accounts with 2FA enabled
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                • Enable "Less secure apps" for accounts without 2FA
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                • Test connection before saving to verify settings
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ 
            p: 3, 
            mt: 2,
            borderRadius: '16px', 
            background: '#e8f5e9',
            border: '1px solid rgba(76, 175, 80, 0.2)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CheckCircleIcon sx={{ color: '#4CAF50' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                Current Status
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Default SMTP is used automatically for all outgoing emails.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingId(null);
          resetForm();
        }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '760px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1a1a2e' }}>
          {editingId ? 'Edit SMTP Configuration' : 'Add More SMTP'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="SMTP Server Address" name="server_address" value={formData.server_address} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Username / Email" name="username" type="email" value={formData.username} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Password / App Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Port" name="port" type="number" value={formData.port} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth select SelectProps={{ native: true }} label="Encryption" name="encryption" value={formData.encryption} onChange={handleChange} required>
                <option value="SSL">SSL</option>
                <option value="TLS">TLS</option>
                <option value="None">None</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <FormControlLabel control={<Switch checked={formData.authentication_required} onChange={handleChange} name="authentication_required" />} label="Authentication Required" />
                <FormControlLabel control={<Switch checked={formData.is_active} onChange={handleChange} name="is_active" color="success" />} label="Active" />
                <FormControlLabel control={<Switch checked={formData.is_default} onChange={handleChange} name="is_default" color="primary" />} label="Set As Default" />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => {
            setShowForm(false);
            setEditingId(null);
            resetForm();
          }} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleTestConnection} variant="outlined" disabled={testing || saving} startIcon={testing ? <CircularProgress size={20} /> : <RefreshIcon />} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            {testing ? 'Testing...' : 'Test'}
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            {saving ? 'Saving...' : (editingId ? 'Update SMTP' : 'Add SMTP')}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default SMTPSettings;
